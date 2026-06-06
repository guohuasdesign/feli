import { useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ChevronRight, GraduationCap, Leaf, Minus, Plus, ShieldCheck, TrendingUp } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { FUNDS, useProgressStore } from '@/lib/store';
import {
  blendedEsg,
  blendedReturn,
  coachingTotal,
  contributed,
  formatEur,
  investedAfterFee,
  projectFutureValue,
} from '@/lib/finance';
import { useToast } from '@/components/ui/toast';

const RISK_COLOR: Record<string, string> = {
  Low: 'bg-emerald-500',
  Medium: 'bg-amber-500',
  High: 'bg-orange-500',
};

export default function InvestScreen() {
  const monthly = useProgressStore((s) => s.monthlyAmount);
  const setMonthly = useProgressStore((s) => s.setMonthlyAmount);
  const coachingFee = useProgressStore((s) => s.coachingFee);
  const setCoachingFee = useProgressStore((s) => s.setCoachingFee);
  const allocation = useProgressStore((s) => s.allocation);
  const { toast } = useToast();

  const [years, setYears] = useState(20);

  const annual = useMemo(() => blendedReturn(allocation), [allocation]);
  const esg = useMemo(() => blendedEsg(allocation), [allocation]);
  const invested = investedAfterFee(monthly, coachingFee);
  const future = useMemo(
    () => projectFutureValue(invested, annual, years),
    [invested, annual, years],
  );
  const paid = contributed(invested, years);
  const growth = Math.max(0, future - paid);
  const coachingBudget = coachingTotal(coachingFee, years);

  const totalPct = allocation.reduce((s, a) => s + a.percent, 0);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView contentContainerClassName="px-5 pb-10" showsVerticalScrollIndicator={false}>
        <View className="pt-3 pb-1">
          <Text size="3xl" weight="bold">
            Invest with intention
          </Text>
          <Text variant="muted" size="sm" className="mt-1">
            See what steady, values-led investing can grow into.
          </Text>
        </View>

        {/* Projection card */}
        <Animated.View entering={FadeInDown.duration(400)}>
          <Card className="mt-4 bg-primary p-5">
            <Text size="xs" weight="semibold" className="text-primary-foreground opacity-80">
              PROJECTED IN {years} YEARS
            </Text>
            <Text size="3xl" weight="bold" className="mt-1 text-primary-foreground">
              {formatEur(future)}
            </Text>
            <View className="mt-3 flex-row gap-4">
              <View>
                <Text size="xs" className="text-primary-foreground opacity-70">
                  You put in
                </Text>
                <Text weight="semibold" className="text-primary-foreground">
                  {formatEur(paid)}
                </Text>
              </View>
              <View>
                <Text size="xs" className="text-primary-foreground opacity-70">
                  Growth
                </Text>
                <Text weight="semibold" className="text-primary-foreground">
                  +{formatEur(growth)}
                </Text>
              </View>
            </View>
            <Text size="xs" className="mt-3 text-primary-foreground opacity-60">
              {coachingFee > 0
                ? `Investing ${formatEur(invested)}/mo at ${annual.toFixed(1)}% after your ${formatEur(coachingFee)} coaching fee. Not financial advice.`
                : `Estimate at ${annual.toFixed(1)}% blended return. Not financial advice.`}
            </Text>
          </Card>
        </Animated.View>

        {/* Monthly amount stepper */}
        <Card className="mt-4 p-4">
          <Text weight="semibold">Monthly contribution</Text>
          <View className="mt-3 flex-row items-center justify-between">
            <Button
              variant="outline"
              size="icon"
              accessibilityLabel="Decrease amount"
              onPress={() => setMonthly(monthly - 25)}>
              <Minus color="hsl(162, 72%, 34%)" size={20} />
            </Button>
            <Text size="3xl" weight="bold">
              {formatEur(monthly)}
            </Text>
            <Button
              variant="outline"
              size="icon"
              accessibilityLabel="Increase amount"
              onPress={() => setMonthly(monthly + 25)}>
              <Plus color="hsl(162, 72%, 34%)" size={20} />
            </Button>
          </View>
          <View className="mt-4 flex-row gap-2">
            {[10, 20, 30].map((y) => (
              <Pressable
                key={y}
                accessibilityRole="button"
                onPress={() => setYears(y)}
                className={`flex-1 items-center rounded-xl border py-2 ${
                  years === y ? 'border-primary bg-secondary' : 'border-border'
                }`}>
                <Text weight={years === y ? 'semibold' : 'regular'}>{y} yrs</Text>
              </Pressable>
            ))}
          </View>
        </Card>

        {/* Personal coaching fee */}
        <Card className="mt-4 p-4">
          <View className="flex-row items-center gap-2">
            <View className="h-9 w-9 items-center justify-center rounded-xl bg-secondary">
              <GraduationCap color="hsl(162, 72%, 34%)" size={18} />
            </View>
            <View className="flex-1">
              <Text weight="semibold">Your coaching fee</Text>
              <Text variant="muted" size="xs" className="mt-0.5 leading-4">
                Set aside a monthly amount as your own coaching budget — your investment in learning.
              </Text>
            </View>
          </View>
          <View className="mt-4 flex-row items-center justify-between">
            <Button
              variant="outline"
              size="icon"
              accessibilityLabel="Decrease coaching fee"
              onPress={() => setCoachingFee(coachingFee - 5)}>
              <Minus color="hsl(162, 72%, 34%)" size={20} />
            </Button>
            <View className="items-center">
              <Text size="3xl" weight="bold">
                {formatEur(coachingFee)}
              </Text>
              <Text variant="muted" size="xs">
                per month
              </Text>
            </View>
            <Button
              variant="outline"
              size="icon"
              accessibilityLabel="Increase coaching fee"
              onPress={() => setCoachingFee(coachingFee + 5)}>
              <Plus color="hsl(162, 72%, 34%)" size={20} />
            </Button>
          </View>
          {coachingFee > 0 && (
            <View className="mt-3 rounded-xl bg-secondary p-3">
              <Text size="xs" className="text-secondary-foreground leading-4">
                Over {years} years that&apos;s {formatEur(coachingBudget)} invested in your own
                growth — and {formatEur(invested)}/mo still goes into your portfolio.
              </Text>
            </View>
          )}
          {coachingFee >= monthly && monthly > 0 && (
            <Text variant="destructive" size="xs" className="mt-2">
              Your coaching fee is your whole contribution — lower it to keep investing too.
            </Text>
          )}
        </Card>

        {/* Portfolio summary */}
        <View className="mt-6 flex-row items-center justify-between">
          <Text size="lg" weight="bold">
            Your portfolio
          </Text>
          <View className="flex-row items-center gap-1.5">
            <Leaf color="hsl(160, 60%, 45%)" size={16} />
            <Text variant="muted" size="sm">
              ESG {esg}/100
            </Text>
          </View>
        </View>
        {totalPct !== 100 && (
          <Text variant="destructive" size="xs" className="mt-1">
            Allocation totals {totalPct}% — adjust funds to reach 100%.
          </Text>
        )}

        <View className="mt-3 gap-3">
          {allocation.map((a, i) => {
            const fund = FUNDS.find((f) => f.id === a.fundId);
            if (!fund) return null;
            return (
              <Animated.View key={a.fundId} entering={FadeInDown.delay(i * 60).duration(400)}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Open ${fund.name}`}
                  onPress={() => router.push(`/fund/${fund.id}`)}>
                  <Card className="p-4">
                    <View className="flex-row items-center justify-between">
                      <View className="flex-1 pr-2">
                        <Text weight="semibold" numberOfLines={1}>
                          {fund.name}
                        </Text>
                        <View className="mt-1 flex-row items-center gap-2">
                          <Badge variant="secondary" textClassName="text-xs">
                            {fund.category}
                          </Badge>
                          <View className="flex-row items-center gap-1">
                            <View className={`h-2 w-2 rounded-full ${RISK_COLOR[fund.risk]}`} />
                            <Text variant="muted" size="xs">
                              {fund.risk} risk
                            </Text>
                          </View>
                        </View>
                      </View>
                      <View className="items-end">
                        <Text size="lg" weight="bold">
                          {a.percent}%
                        </Text>
                        <ChevronRight color="hsl(165, 12%, 65%)" size={18} />
                      </View>
                    </View>
                    <Progress value={a.percent} className="mt-3 h-1.5" />
                  </Card>
                </Pressable>
              </Animated.View>
            );
          })}
        </View>

        {/* Explore more funds */}
        <Text size="lg" weight="bold" className="mt-7">
          Explore funds
        </Text>
        <View className="mt-3 gap-3">
          {FUNDS.filter((f) => !allocation.some((a) => a.fundId === f.id)).map((fund) => (
            <Pressable
              key={fund.id}
              accessibilityRole="button"
              onPress={() => router.push(`/fund/${fund.id}`)}>
              <Card className="flex-row items-center gap-3 p-4">
                <View className="h-10 w-10 items-center justify-center rounded-xl bg-secondary">
                  <TrendingUp color="hsl(162, 72%, 34%)" size={20} />
                </View>
                <View className="flex-1">
                  <Text weight="semibold" numberOfLines={1}>
                    {fund.name}
                  </Text>
                  <Text variant="muted" size="xs">
                    {fund.return5y}% / yr · {fund.category}
                  </Text>
                </View>
                <ChevronRight color="hsl(165, 12%, 65%)" size={18} />
              </Card>
            </Pressable>
          ))}
          {FUNDS.every((f) => allocation.some((a) => a.fundId === f.id)) && (
            <Card className="flex-row items-center gap-3 p-4">
              <ShieldCheck color="hsl(160, 60%, 45%)" size={20} />
              <Text variant="muted" size="sm" className="flex-1">
                You&apos;re holding every fund we offer. Nicely diversified.
              </Text>
            </Card>
          )}
        </View>

        <Button
          className="mt-6"
          onPress={() =>
            toast({
              variant: 'success',
              title: 'Plan saved',
              description:
                coachingFee > 0
                  ? `${formatEur(invested)}/mo invested + ${formatEur(coachingFee)} coaching — you've got this.`
                  : `${formatEur(monthly)}/mo — you've got this.`,
            })
          }>
          <Text>Save my plan</Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}
