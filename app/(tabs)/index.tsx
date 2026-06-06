import { useEffect, useMemo } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { CheckCircle2, Circle, Flame, Sparkles } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AFFIRMATIONS, MODULES } from '@/lib/content';
import { computeStreak, progressPercent, useProgressStore } from '@/lib/store';
import { cn } from '@/lib/utils';

export default function LearnScreen() {
  const completed = useProgressStore((s) => s.completedLessons);
  const activeDays = useProgressStore((s) => s.activeDays);
  const points = useProgressStore((s) => s.points);
  const displayName = useProgressStore((s) => s.displayName);
  const onboarded = useProgressStore((s) => s.onboarded);

  useEffect(() => {
    if (!onboarded) {
      const t = setTimeout(() => router.push('/onboarding'), 300);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [onboarded]);

  const streak = useMemo(() => computeStreak(activeDays), [activeDays]);
  const pct = progressPercent(completed.length);
  const affirmation = useMemo(
    () => AFFIRMATIONS[new Date().getDate() % AFFIRMATIONS.length],
    [],
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView contentContainerClassName="px-5 pb-10" showsVerticalScrollIndicator={false}>
        <View className="pt-3 pb-1">
          <Text variant="muted" size="sm">
            {displayName ? `Welcome back, ${displayName}` : 'Welcome to FELI'}
          </Text>
          <Text size="3xl" weight="bold" className="mt-1">
            Learn money on your terms
          </Text>
        </View>

        {/* Affirmation card */}
        <Animated.View entering={FadeInDown.duration(400)}>
          <Card className="mt-4 bg-primary p-5">
            <View className="flex-row items-center gap-2">
              <Sparkles color="hsl(150, 40%, 99%)" size={18} />
              <Text size="xs" weight="semibold" className="text-primary-foreground opacity-80">
                TODAY&apos;S REMINDER
              </Text>
            </View>
            <Text size="lg" weight="semibold" className="mt-2 text-primary-foreground">
              {affirmation}
            </Text>
          </Card>
        </Animated.View>

        {/* Stats row */}
        <View className="mt-4 flex-row gap-3">
          <Card className="flex-1 p-4">
            <View className="flex-row items-center gap-1.5">
              <Flame color="hsl(44, 92%, 52%)" size={18} />
              <Text size="2xl" weight="bold">
                {streak}
              </Text>
            </View>
            <Text variant="muted" size="xs" className="mt-1">
              day streak
            </Text>
          </Card>
          <Card className="flex-1 p-4">
            <Text size="2xl" weight="bold">
              {points}
            </Text>
            <Text variant="muted" size="xs" className="mt-1">
              confidence pts
            </Text>
          </Card>
          <Card className="flex-1 p-4">
            <Text size="2xl" weight="bold">
              {pct}%
            </Text>
            <Text variant="muted" size="xs" className="mt-1">
              course done
            </Text>
          </Card>
        </View>

        <View className="mt-3">
          <Progress value={pct} className="h-2" />
        </View>

        {/* Modules */}
        {MODULES.map((module, mi) => (
          <View key={module.id} className="mt-7">
            <View className="flex-row items-center gap-2">
              <Text size="xl">{module.emoji}</Text>
              <View className="flex-1">
                <Text size="lg" weight="bold">
                  {module.title}
                </Text>
                <Text variant="muted" size="xs">
                  {module.subtitle}
                </Text>
              </View>
            </View>

            <View className="mt-3 gap-3">
              {module.lessons.map((lesson, li) => {
                const done = completed.includes(lesson.id);
                return (
                  <Animated.View
                    key={lesson.id}
                    entering={FadeInDown.delay((mi * 3 + li) * 60).duration(400)}>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Lesson: ${lesson.title}`}
                      onPress={() => router.push(`/lesson/${lesson.id}`)}>
                      <Card
                        className={cn(
                          'flex-row items-center gap-3 p-4',
                          done && 'border-primary/40',
                        )}>
                        <View className="h-12 w-12 items-center justify-center rounded-2xl bg-secondary">
                          <Text size="xl">{lesson.emoji}</Text>
                        </View>
                        <View className="flex-1">
                          <Text weight="semibold" numberOfLines={1}>
                            {lesson.title}
                          </Text>
                          <Text variant="muted" size="xs" numberOfLines={2} className="mt-0.5">
                            {lesson.blurb}
                          </Text>
                          <View className="mt-2 flex-row items-center gap-2">
                            <Badge variant="secondary" textClassName="text-xs">
                              <Text>{`${lesson.minutes} min`}</Text>
                            </Badge>
                            <Text variant="muted" size="xs">
                              +{lesson.points} pts
                            </Text>
                          </View>
                        </View>
                        {done ? (
                          <CheckCircle2 color="hsl(162, 72%, 34%)" size={24} />
                        ) : (
                          <Circle color="hsl(165, 12%, 65%)" size={24} />
                        )}
                      </Card>
                    </Pressable>
                  </Animated.View>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
