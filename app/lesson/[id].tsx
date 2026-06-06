import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInUp, FadeInRight } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { CheckCircle2, Sparkles, Volume2, X } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PlayButton } from '@/components/PlayButton';
import { MODULES, type DialogueStep } from '@/lib/content';
import { useProgressStore } from '@/lib/store';
import { nextStep } from '@/lib/loop';
import { useVoice } from '@/hooks/useVoice';
import { hasElevenLabsKey } from '@/lib/elevenlabs';

type Bubble =
  | { kind: 'guide'; text: string }
  | { kind: 'you'; text: string };

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const completeLesson = useProgressStore((s) => s.completeLesson);
  const alreadyDone = useProgressStore((s) => s.completedLessons.includes(id ?? ''));
  const completedLessons = useProgressStore((s) => s.completedLessons);
  const savedPlan = useProgressStore((s) => s.savedPlan);
  const trackedProgress = useProgressStore((s) => s.trackedProgress);
  const coachedThisCycle = useProgressStore((s) => s.coachedThisCycle);
  const loopsClosed = useProgressStore((s) => s.loopsClosed);
  const voiceId = useProgressStore((s) => s.voiceId);
  const voiceAutoplay = useProgressStore((s) => s.voiceAutoplay);
  const setVoiceAutoplay = useProgressStore((s) => s.setVoiceAutoplay);
  const { play: voicePlay, stop: voiceStop, status: voiceStatus, activeId: voiceActiveId, error: voiceError } = useVoice();
  const voiceEnabled = hasElevenLabsKey();

  const lesson = useMemo(() => {
    for (const m of MODULES) {
      const found = m.lessons.find((l) => l.id === id);
      if (found) return found;
    }
    return undefined;
  }, [id]);

  const [stepIndex, setStepIndex] = useState(0);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [finished, setFinished] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  // Seed the first guide message(s) up to the first choice.
  useEffect(() => {
    if (!lesson) return;
    const initial: Bubble[] = [];
    let i = 0;
    for (; i < lesson.dialogue.length; i++) {
      const step = lesson.dialogue[i];
      if (step.speaker === 'guide' && step.text) {
        initial.push({ kind: 'guide', text: step.text });
      } else {
        break;
      }
    }
    setBubbles(initial);
    setStepIndex(i);
  }, [lesson]);

  // Autoplay the newest guide line when enabled.
  const lastSpokenRef = useRef(-1);
  useEffect(() => {
    if (!voiceEnabled || !voiceAutoplay) return;
    if (bubbles.length === 0) return;
    const lastIndex = bubbles.length - 1;
    const last = bubbles[lastIndex];
    if (last.kind === 'guide' && lastIndex !== lastSpokenRef.current) {
      lastSpokenRef.current = lastIndex;
      void voicePlay(`bubble-${lastIndex}`, last.text, voiceId);
    }
  }, [bubbles, voiceAutoplay, voiceEnabled, voiceId, voicePlay]);

  if (!lesson) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background">
        <Text>Lesson not found.</Text>
        <Button variant="link" onPress={() => router.back()}>
          <Text>Go back</Text>
        </Button>
      </SafeAreaView>
    );
  }

  const currentStep: DialogueStep | undefined = lesson.dialogue[stepIndex];

  const haptic = () => {
    if (Platform.OS !== 'web') void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const pickChoice = (reply: string) => {
    haptic();
    const next: Bubble[] = [...bubbles, { kind: 'you', text: reply }];
    // Advance past this choice step, then queue following guide messages.
    let i = stepIndex + 1;
    for (; i < lesson.dialogue.length; i++) {
      const step = lesson.dialogue[i];
      if (step.speaker === 'guide' && step.text) {
        next.push({ kind: 'guide', text: step.text });
      } else {
        break;
      }
    }
    setBubbles(next);
    setStepIndex(i);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 120);
  };

  const finish = () => {
    if (Platform.OS !== 'web') void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    completeLesson(lesson.id, lesson.points);
    setFinished(true);
  };

  const atEnd = stepIndex >= lesson.dialogue.length;

  if (finished) {
    const loopStep = nextStep({
      completedLessons: completedLessons.includes(lesson.id)
        ? completedLessons
        : [...completedLessons, lesson.id],
      savedPlan,
      trackedProgress,
      coachedThisCycle,
      loopsClosed,
    });
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center px-8">
          <Animated.View entering={FadeIn.duration(400)} className="items-center">
            <View className="h-24 w-24 items-center justify-center rounded-full bg-primary">
              <CheckCircle2 color="hsl(150, 40%, 99%)" size={48} />
            </View>
            <Text size="2xl" weight="bold" className="mt-5 text-center">
              {lesson.title}
            </Text>
            <Text size="sm" weight="semibold" className="mt-2 text-primary">
              +{lesson.points} confidence points
            </Text>
            <Card className="mt-5 bg-secondary p-5">
              <View className="flex-row items-center gap-2">
                <Sparkles color="hsl(162, 72%, 34%)" size={18} />
                <Text size="xs" weight="semibold" className="text-secondary-foreground opacity-80">
                  TAKEAWAY
                </Text>
              </View>
              <Text size="base" className="mt-2 text-secondary-foreground">
                {lesson.takeaway}
              </Text>
            </Card>

            {/* Closed-loop nudge: send the user to the next stage */}
            <View className="mt-6 w-full flex-row items-center gap-2 rounded-2xl bg-primary/10 p-3">
              <Text size="lg">{loopStep.stageIndex === 1 ? '📈' : loopStep.stageIndex === 2 ? '🌟' : loopStep.stageIndex === 3 ? '🎧' : '📖'}</Text>
              <Text size="sm" className="flex-1 text-foreground">
                Next in your loop: {loopStep.body}
              </Text>
            </View>
          </Animated.View>
        </View>
        <View className="gap-3 px-5 pb-8">
          <Button
            onPress={() => {
              router.back();
              setTimeout(() => router.push(loopStep.route as never), 60);
            }}>
            <Text>{loopStep.cta}</Text>
          </Button>
          <Button variant="outline" onPress={() => router.back()}>
            <Text>Back to lessons</Text>
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-2">
        <View className="flex-row items-center gap-2">
          <Text size="2xl">{lesson.emoji}</Text>
          <View>
            <Text weight="bold" numberOfLines={1} className="max-w-[240px]">
              {lesson.title}
            </Text>
            <Text variant="muted" size="xs">
              {lesson.minutes} min · +{lesson.points} pts
            </Text>
          </View>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close lesson"
          onPress={() => {
            voiceStop();
            router.back();
          }}
          className="h-11 w-11 items-center justify-center">
          <X color="hsl(165, 12%, 55%)" size={24} />
        </Pressable>
      </View>

      {voiceEnabled && (
        <View className="flex-row items-center justify-end px-5 pt-1">
          <Pressable
            accessibilityRole="switch"
            accessibilityState={{ checked: voiceAutoplay }}
            accessibilityLabel="Auto-play coach voice"
            onPress={() => {
              if (voiceAutoplay) voiceStop();
              setVoiceAutoplay(!voiceAutoplay);
            }}
            className={`flex-row items-center gap-1.5 rounded-full border px-3 py-1.5 ${
              voiceAutoplay ? 'border-primary bg-secondary' : 'border-border'
            }`}>
            <Volume2
              color={voiceAutoplay ? 'hsl(162, 72%, 34%)' : 'hsl(165, 12%, 55%)'}
              size={14}
            />
            <Text
              size="xs"
              weight="medium"
              className={voiceAutoplay ? 'text-primary' : 'text-muted-foreground'}>
              Auto voice {voiceAutoplay ? 'on' : 'off'}
            </Text>
          </Pressable>
        </View>
      )}

      <ScrollView
        ref={scrollRef}
        contentContainerClassName="px-5 py-4 gap-3"
        showsVerticalScrollIndicator={false}>
        {bubbles.map((b, i) =>
          b.kind === 'guide' ? (
            <Animated.View
              key={`${b.kind}-${b.text}`}
              entering={FadeInUp.duration(350)}
              className="max-w-[85%] flex-row items-end gap-2 self-start">
              <View className="flex-1 rounded-2xl rounded-tl-sm bg-secondary px-4 py-3">
                <Text className="text-secondary-foreground leading-5">{b.text}</Text>
              </View>
              {voiceEnabled && (
                <PlayButton
                  state={voiceActiveId === `bubble-${i}` ? voiceStatus : 'idle'}
                  color="hsl(162, 72%, 34%)"
                  accessibilityLabel="Listen to this message"
                  onPress={() => voicePlay(`bubble-${i}`, b.text, voiceId)}
                />
              )}
            </Animated.View>
          ) : (
            <Animated.View
              key={`${b.kind}-${b.text}`}
              entering={FadeInRight.duration(300)}
              className="max-w-[85%] self-end rounded-2xl rounded-tr-sm bg-primary px-4 py-3">
              <Text className="text-primary-foreground leading-5">{b.text}</Text>
            </Animated.View>
          ),
        )}
      </ScrollView>

      {voiceError && (
        <View className="mx-5 mb-2 rounded-xl bg-destructive/10 px-3 py-2">
          <Text size="xs" className="text-destructive">
            {voiceError}
          </Text>
        </View>
      )}

      {/* Footer: choices, or finish */}
      <View className="border-t border-border px-5 py-4">
        {currentStep?.speaker === 'you' && currentStep.choices ? (
          <View className="gap-2">
            <Text variant="muted" size="xs" className="mb-1">
              Your reply
            </Text>
            {currentStep.choices.map((c) => (
              <Button
                key={c.label}
                variant="outline"
                className="justify-start"
                onPress={() => pickChoice(c.reply)}>
                <Text weight="medium" className="text-foreground">
                  {c.label}
                </Text>
              </Button>
            ))}
          </View>
        ) : atEnd ? (
          <Button onPress={finish}>
            {alreadyDone ? 'Review complete' : 'Complete lesson'}
          </Button>
        ) : (
          <Text variant="muted" size="sm" className="text-center">
            …
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}
