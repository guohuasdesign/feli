import { useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Check, Leaf, TrendingUp, X } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { FUNDS, useProgressStore } from '@/lib/store';
import { formatEur, projectFutureValue } from '@/lib/finance';
import { useToast } from '@/components/ui/toast';

const RISK_NOTE: Record<string, string> = {
  Low: 'Gentle swings — a steadying anchor.',
  Medium: 'Moderate ups and downs over time.',
  High: 'Bigger swings; best for long horizons.',
};

export default function FundScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const fund = useMemo(() => FUNDS.find((f) => f.id === id), [id]);

  const allocation = useProgressStore((s) => s.allocation);
  const setAllocation = useProgressStore((s) => s.setAllocation);
  const monthly = useProgressStore((s) => s.monthlyAmount);
  const { toast } = useToast();

  const inPortfolio = allocation.some((a) => a.fundId === id);
  const [adding, setAdding] = useState(false);

  if (!fund) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background">
        <Text>Fund not found.</Text>
        <Button variant="link" onPress={() => router.back()}>
          <Text>Go back</Text>
        </Button>
      </SafeAreaView>
    );
  }

  const sample = projectFutureValue(monthly, fund.return5y, 20);

  const togglePortfolio = () => {
    setAdding(true);
    if (inPortfolio) {
      const rest = allocation.filter((a) => a.fundId !== fund.id);
      // Re-distribute removed weight evenly.
      const removed = allocation.find((a) => a.fundId === fund.id)?.percent ?? 0;
      const bump = rest.length > 0 ? Math.round(removed / rest.length) : 0;
      const next = rest.map((a, i) => ({
        ...a,
        percent: a.percent + (i === 0 ? removed - bump * (rest.length - 1) : bump),
      }));
      setAllocation(next);
      toast({ title: 'Removed from portfolio', description: fund.name });
    } else {
      // Take 20% for the new fund, scale the rest down proportionally.
      const give = 20;
      const total = allocation.reduce((s, a) => s + a.percent, 0) || 100;
      const scaled = allocation.map((a) => ({
        ...a,
        percent: Math.round((a.percent / total) * (100 - give)),
      }));
      setAllocation([...scaled, { fundId: fund.id, percent: give }]);
      toast({ variant: 'success', title: 'Added to portfolio', description: fund.name });
    }
    setAdding(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center justify-between px-5 pt-2">
        <Badge variant="secondary" textClassName="text-xs">
          {fund.category}
        </Badge>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close"
          onPress={() => router.back()}
          className="h-11 w-11 items-center justify-center">
          <X color="hsl(165, 12%, 55%)" size={24} />
        </Pressable>
      </View>

      <ScrollView contentContainerClassName="px-5 pb-32" showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(400)}>
          <Text size="3xl" weight="bold" className="mt-2">
            {fund.name}
          </Text>
          <Text variant="muted" size="sm">
            {fund.ticker} · {fund.holdings.toLocaleString()} holdings
          </Text>

          <View className="mt-4 flex-row gap-3">
            <Card className="flex-1 p-4">
              <View className="flex-row items-center gap-1.5">
                <TrendingUp color="hsl(162, 72%, 34%)" size={16} />
                <Text size="2xl" weight="bold">
                  {fund.return5y}%
                </Text>
              </View>
              <Text variant="muted" size="xs" className="mt-1">
                avg / year (5y)
              </Text>
            </Card>
            <Card className="flex-1 p-4">
              <View className="flex-row items-center gap-1.5">
                <Leaf color="hsl(160, 60%, 45%)" size={16} />
                <Text size="2xl" weight="bold">
                  {fund.esgScore}
                </Text>
              </View>
              <Text variant="muted" size="xs" className="mt-1">
                ESG score / 100
              </Text>
            </Card>
          </View>

          <Card className="mt-3 p-4">
            <View className="flex-row items-center justify-between">
              <Text weight="semibold">Risk level</Text>
              <Text weight="bold" className="text-primary">
                {fund.risk}
              </Text>
            </View>
            <Progress
              value={fund.risk === 'Low' ? 33 : fund.risk === 'Medium' ? 66 : 100}
              className="mt-3 h-2"
            />
            <Text variant="muted" size="xs" className="mt-2">
              {RISK_NOTE[fund.risk]}
            </Text>
          </Card>

          <Text size="base" className="mt-5 leading-6">
            {fund.description}
          </Text>

          <Text size="lg" weight="bold" className="mt-6">
            What you&apos;re backing
          </Text>
          <View className="mt-3 gap-2">
            {fund.highlights.map((h) => (
              <View key={h} className="flex-row items-center gap-2">
                <View className="h-5 w-5 items-center justify-center rounded-full bg-secondary">
                  <Check color="hsl(162, 72%, 34%)" size={14} />
                </View>
                <Text size="sm" className="flex-1">
                  {h}
                </Text>
              </View>
            ))}
          </View>

          <Card className="mt-6 bg-secondary p-5">
            <Text size="xs" weight="semibold" className="text-secondary-foreground opacity-80">
              IF YOU INVESTED {formatEur(monthly)}/MO FOR 20 YEARS
            </Text>
            <Text size="3xl" weight="bold" className="mt-1 text-secondary-foreground">
              ~{formatEur(sample)}
            </Text>
            <Text size="xs" className="mt-2 text-secondary-foreground opacity-70">
              Illustrative estimate at this fund&apos;s historical rate. Past performance does not
              guarantee future results.
            </Text>
          </Card>
        </Animated.View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 border-t border-border bg-background px-5 pb-8 pt-4">
        <Button
          variant={inPortfolio ? 'outline' : 'default'}
          loading={adding}
          onPress={togglePortfolio}>
          {inPortfolio ? 'Remove from portfolio' : 'Add to my portfolio'}
        </Button>
      </View>
    </SafeAreaView>
  );
}
