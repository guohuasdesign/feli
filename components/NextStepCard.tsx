import { useRouter } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import { View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Button, Card, Text } from '@/components/ui';
import { LOOP_STAGES, nextStep, type LoopInput } from '@/lib/loop';
import { cn } from '@/lib/utils';

type NextStepCardProps = {
  loop: LoopInput;
  /** Hide the CTA when the card is shown on the stage it points to. */
  hideCtaForStage?: string;
  className?: string;
};

/**
 * Reusable card that surfaces the user's current position in the closed
 * Learn -> Invest -> Track -> Coach loop and the single best next action.
 */
export function NextStepCard({ loop, hideCtaForStage, className }: NextStepCardProps) {
  const router = useRouter();
  const step = nextStep(loop);

  return (
    <Animated.View entering={FadeInDown.duration(300)}>
      <Card className={cn('gap-5 border-primary/30 bg-card p-5', className)}>
        {/* Loop stage dots */}
        <View className="flex-row items-center justify-between">
          {LOOP_STAGES.map((stage, i) => {
            const active = i === step.stageIndex;
            const done = i < step.stageIndex;
            return (
              <View key={stage.id} className="flex-1 flex-row items-center">
                <View className="items-center gap-1">
                  <View
                    className={cn(
                      'h-10 w-10 items-center justify-center rounded-full',
                      active && 'bg-primary',
                      done && 'bg-primary/40',
                      !active && !done && 'bg-secondary',
                    )}
                  >
                    <Text className="text-base">{stage.emoji}</Text>
                  </View>
                  <Text
                    size="xs"
                    weight={active ? 'semibold' : 'regular'}
                    className={cn(active ? 'text-primary' : 'text-muted-foreground')}
                  >
                    {stage.label}
                  </Text>
                </View>
                {i < LOOP_STAGES.length - 1 && (
                  <View
                    className={cn(
                      'mx-1 mb-4 h-0.5 flex-1 rounded-full',
                      i < step.stageIndex ? 'bg-primary/40' : 'bg-secondary',
                    )}
                  />
                )}
              </View>
            );
          })}
        </View>

        <View className="gap-1">
          <Text size="lg" weight="bold" className="text-foreground">
            {step.title}
          </Text>
          <Text size="sm" className="text-muted-foreground">
            {step.body}
          </Text>
        </View>

        {hideCtaForStage !== step.stage && (
          <Button
            onPress={() => router.push(step.route as never)}
            className="flex-row items-center justify-center gap-2"
          >
            <Text weight="semibold" className="text-primary-foreground">
              {step.cta}
            </Text>
            <ArrowRight size={18} color="#fff" />
          </Button>
        )}
      </Card>
    </Animated.View>
  );
}
