import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInRight, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { Check, Mic, Sparkles } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { Switch } from '@/components/ui/switch';
import { PlayButton } from '@/components/PlayButton';
import { useVoice } from '@/hooks/useVoice';
import { useProgressStore } from '@/lib/store';
import {
  COACH_GREETING,
  COACH_TOPICS,
  type CoachTopic,
} from '@/lib/coach';
import { VOICE_OPTIONS, hasElevenLabsKey } from '@/lib/elevenlabs';

type Turn =
  | { kind: 'coach'; id: string; text: string }
  | { kind: 'you'; id: string; text: string };

const COACH_TINT = 'hsl(162, 72%, 34%)';

export default function VoiceCoachScreen() {
  const { play: voicePlay, stop: voiceStop, status: voiceStatus, activeId: voiceActiveId, error: voiceError } = useVoice();
  const voiceId = useProgressStore((s) => s.voiceId);
  const setVoiceId = useProgressStore((s) => s.setVoiceId);
  const autoplay = useProgressStore((s) => s.voiceAutoplay);
  const setAutoplay = useProgressStore((s) => s.setVoiceAutoplay);
  const markCoached = useProgressStore((s) => s.markCoached);

  const keyMissing = !hasElevenLabsKey();
  const scrollRef = useRef<ScrollView>(null);
  const [turns, setTurns] = useState<Turn[]>([
    { kind: 'coach', id: 'greeting', text: COACH_GREETING },
  ]);
  const [asked, setAsked] = useState<string[]>([]);

  // Autoplay the latest coach line when enabled.
  const lastCoachId = useRef<string | null>(null);
  useEffect(() => {
    if (!autoplay || keyMissing) return;
    const last = [...turns].toReversed().find((t) => t.kind === 'coach');
    if (last && last.id !== lastCoachId.current) {
      lastCoachId.current = last.id;
      void voicePlay(`coach-${last.id}`, last.text, voiceId);
    }
  }, [turns, autoplay, keyMissing, voiceId, voicePlay]);

  const ask = (topic: CoachTopic) => {
    if (Platform.OS !== 'web') void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setAsked((a) => (a.includes(topic.id) ? a : [...a, topic.id]));
    markCoached();
    setTurns((t) => [
      ...t,
      { kind: 'you', id: `q-${topic.id}`, text: topic.prompt },
      { kind: 'coach', id: topic.id, text: topic.reply },
    ]);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 140);
  };

  const remaining = COACH_TOPICS.filter((t) => !asked.includes(t.id));

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pb-3 pt-4">
        <View className="flex-row items-center gap-3">
          <View className="h-11 w-11 items-center justify-center rounded-2xl bg-primary">
            <Mic color="hsl(150, 40%, 98%)" size={22} />
          </View>
          <View>
            <Text size="xl" weight="bold">
              Voice Coach
            </Text>
            <Text variant="muted" size="xs" className="mt-0.5">
              Talk it through, judgement-free
            </Text>
          </View>
        </View>
        <View className="flex-row items-center gap-2">
          <Sparkles color={COACH_TINT} size={16} />
          <Text size="xs" weight="medium" className="text-primary">
            Auto
          </Text>
          <Switch
            checked={autoplay}
            onCheckedChange={(v: boolean) => {
              setAutoplay(v);
              if (!v) voiceStop();
            }}
            accessibilityLabel="Auto-play coach voice"
          />
        </View>
      </View>

      {/* Voice picker */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="px-5 gap-2 pb-1">
        {VOICE_OPTIONS.map((v) => {
          const active = v.id === voiceId;
          return (
            <Pressable
              key={v.id}
              accessibilityRole="button"
              accessibilityLabel={`Use voice ${v.name}`}
              onPress={() => setVoiceId(v.id)}
              className={`flex-row items-center gap-1.5 rounded-full border px-3 py-1.5 ${
                active ? 'border-primary bg-secondary' : 'border-border'
              }`}>
              {active && <Check color={COACH_TINT} size={13} />}
              <Text size="xs" weight={active ? 'semibold' : 'regular'}>
                {v.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {keyMissing && (
        <View className="mx-5 mt-2 rounded-xl bg-destructive/10 px-3 py-2">
          <Text size="xs" className="text-destructive">
            Voice isn&apos;t configured yet. Add your ElevenLabs API key to hear the coach.
          </Text>
        </View>
      )}
      {voiceError && (
        <View className="mx-5 mt-2 rounded-xl bg-destructive/10 px-3 py-2">
          <Text size="xs" className="text-destructive">
            {voiceError}
          </Text>
        </View>
      )}

      {/* Conversation */}
      <ScrollView
        ref={scrollRef}
        contentContainerClassName="px-5 py-4 gap-3"
        showsVerticalScrollIndicator={false}>
        {turns.map((t) =>
          t.kind === 'coach' ? (
            <Animated.View
              key={t.id}
              entering={FadeInUp.duration(350)}
              className="max-w-[88%] flex-row items-end gap-2 self-start">
              <View className="flex-1 rounded-2xl rounded-tl-sm bg-secondary px-4 py-3">
                <Text className="leading-5 text-secondary-foreground">{t.text}</Text>
              </View>
              {!keyMissing && (
                <PlayButton
                  state={voiceActiveId === `coach-${t.id}` ? voiceStatus : 'idle'}
                  color={COACH_TINT}
                  accessibilityLabel="Listen to the coach"
                  onPress={() => voicePlay(`coach-${t.id}`, t.text, voiceId)}
                />
              )}
            </Animated.View>
          ) : (
            <Animated.View
              key={t.id}
              entering={FadeInRight.duration(300)}
              className="max-w-[85%] self-end rounded-2xl rounded-tr-sm bg-primary px-4 py-3">
              <Text className="leading-5 text-primary-foreground">{t.text}</Text>
            </Animated.View>
          ),
        )}

        {remaining.length === 0 && (
          <Animated.View entering={FadeIn} className="mt-2 items-center">
            <Text variant="muted" size="sm" className="text-center">
              That&apos;s everything for now. Replay any answer with the listen button, or head to
              Learn for full lessons.
            </Text>
          </Animated.View>
        )}
      </ScrollView>

      {/* Topic chips */}
      {remaining.length > 0 && (
        <View className="border-t border-border px-5 pb-4 pt-3">
          <Text variant="muted" size="xs" className="mb-2">
            Ask the coach
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {remaining.map((topic) => (
              <Pressable
                key={topic.id}
                accessibilityRole="button"
                accessibilityLabel={topic.prompt}
                onPress={() => ask(topic)}
                className="min-h-[44px] flex-row items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2.5 active:opacity-70">
                <Text size="sm">{topic.emoji}</Text>
                <Text size="sm" weight="medium">
                  {topic.prompt}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
