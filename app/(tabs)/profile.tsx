import { useEffect, useMemo } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Award, BookmarkCheck, Flame, Moon, RotateCcw, Sun, Target } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useColorScheme } from '@/hooks/useColorScheme';
import { GLOSSARY, MODULES } from '@/lib/content';
import { computeStreak, progressPercent, TOTAL_LESSONS, useProgressStore } from '@/lib/store';

type Milestone = { id: string; label: string; reached: boolean; emoji: string };

export default function ProfileScreen() {
  const { isDarkColorScheme, toggleColorScheme } = useColorScheme();

  const completed = useProgressStore((s) => s.completedLessons);
  const activeDays = useProgressStore((s) => s.activeDays);
  const points = useProgressStore((s) => s.points);
  const savedTerms = useProgressStore((s) => s.savedTerms);
  const displayName = useProgressStore((s) => s.displayName);
  const reset = useProgressStore((s) => s.reset);
  const markProgressTracked = useProgressStore((s) => s.markProgressTracked);

  // Track stage of the loop: viewing progress (after saving a plan) advances it.
  useEffect(() => {
    markProgressTracked();
  }, [markProgressTracked]);

  const streak = useMemo(() => computeStreak(activeDays), [activeDays]);
  const pct = progressPercent(completed.length);

  const milestones: Milestone[] = useMemo(
    () => [
      { id: 'first', label: 'First lesson done', reached: completed.length >= 1, emoji: '🌱' },
      { id: 'streak3', label: '3-day streak', reached: streak >= 3, emoji: '🔥' },
      { id: 'half', label: 'Halfway through', reached: pct >= 50, emoji: '⭐' },
      { id: 'saver', label: 'Saved 3 terms', reached: savedTerms.length >= 3, emoji: '📚' },
      { id: 'graduate', label: 'Course complete', reached: pct >= 100, emoji: '👑' },
    ],
    [completed.length, streak, pct, savedTerms.length],
  );

  const confirmReset = () => {
    Alert.alert('Reset progress?', 'This clears your streak, points and saved terms.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: reset },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView contentContainerClassName="px-5 pb-10" showsVerticalScrollIndicator={false}>
        <View className="items-center pt-6">
          <View className="h-20 w-20 items-center justify-center rounded-full bg-primary">
            <Text size="3xl" weight="bold" className="text-primary-foreground">
              {(displayName || 'Y').charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text size="2xl" weight="bold" className="mt-3">
            {displayName || 'Your journey'}
          </Text>
          <Text variant="muted" size="sm">
            Building money confidence, your way
          </Text>
        </View>

        {/* Stat grid */}
        <View className="mt-6 flex-row flex-wrap gap-3">
          <StatBox icon={<Flame color="hsl(44, 92%, 52%)" size={20} />} value={`${streak}`} label="day streak" />
          <StatBox icon={<Award color="hsl(162, 72%, 34%)" size={20} />} value={`${points}`} label="confidence pts" />
          <StatBox
            icon={<Target color="hsl(160, 60%, 45%)" size={20} />}
            value={`${completed.length}/${TOTAL_LESSONS}`}
            label="lessons"
          />
          <StatBox
            icon={<BookmarkCheck color="hsl(162, 72%, 34%)" size={20} />}
            value={`${savedTerms.length}/${GLOSSARY.length}`}
            label="terms saved"
          />
        </View>

        {/* Milestones */}
        <Text size="lg" weight="bold" className="mt-7">
          Milestones
        </Text>
        <View className="mt-3 gap-2.5">
          {milestones.map((m, i) => (
            <Animated.View key={m.id} entering={FadeInDown.delay(i * 50).duration(350)}>
              <Card className={`flex-row items-center gap-3 p-4 ${m.reached ? '' : 'opacity-50'}`}>
                <Text size="2xl">{m.emoji}</Text>
                <Text weight="medium" className="flex-1">
                  {m.label}
                </Text>
                {m.reached && (
                  <View className="rounded-full bg-secondary px-2.5 py-1">
                    <Text size="xs" weight="semibold" className="text-secondary-foreground">
                      Earned
                    </Text>
                  </View>
                )}
              </Card>
            </Animated.View>
          ))}
        </View>

        {/* Module breakdown */}
        <Text size="lg" weight="bold" className="mt-7">
          Module progress
        </Text>
        <Card className="mt-3 p-4">
          {MODULES.map((mod, i) => {
            const done = mod.lessons.filter((l) => completed.includes(l.id)).length;
            return (
              <View key={mod.id}>
                {i > 0 && <Separator className="my-3" />}
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2">
                    <Text>{mod.emoji}</Text>
                    <Text weight="medium">{mod.title}</Text>
                  </View>
                  <Text variant="muted" size="sm">
                    {done}/{mod.lessons.length}
                  </Text>
                </View>
              </View>
            );
          })}
        </Card>

        {/* Settings */}
        <Text size="lg" weight="bold" className="mt-7">
          Settings
        </Text>
        <Card className="mt-3 p-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              {isDarkColorScheme ? (
                <Moon color="hsl(158, 64%, 52%)" size={20} />
              ) : (
                <Sun color="hsl(162, 72%, 34%)" size={20} />
              )}
              <Text weight="medium">Dark mode</Text>
            </View>
            <Switch checked={isDarkColorScheme} onCheckedChange={toggleColorScheme} />
          </View>
        </Card>

        <Button variant="outline" className="mt-5" onPress={confirmReset}>
          <View className="flex-row items-center gap-2">
            <RotateCcw color="hsl(162, 72%, 34%)" size={18} />
            <Text weight="semibold">Reset progress</Text>
          </View>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatBox({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <Card className="min-w-[45%] flex-1 p-4">
      {icon}
      <Text size="2xl" weight="bold" className="mt-2">
        {value}
      </Text>
      <Text variant="muted" size="xs">
        {label}
      </Text>
    </Card>
  );
}
