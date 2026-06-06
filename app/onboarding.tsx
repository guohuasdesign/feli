import { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Heart, Leaf, ShieldCheck, Sparkles } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useProgressStore } from '@/lib/store';

const VALUES = [
  { icon: <ShieldCheck color="hsl(280, 55%, 38%)" size={22} />, title: 'A safe space to learn', body: 'No jargon, no judgement — just clear, friendly guidance built for FLINTA investors.' },
  { icon: <Leaf color="hsl(160, 60%, 45%)" size={22} />, title: 'Invest in your values', body: 'Explore sustainable funds backing climate action and gender equality.' },
  { icon: <Heart color="hsl(12, 88%, 62%)" size={22} />, title: 'Confidence, your pace', body: 'Bite-sized conversations turn money anxiety into quiet, lasting power.' },
];

export default function Onboarding() {
  const [name, setName] = useState('');
  const setOnboarded = useProgressStore((s) => s.setOnboarded);

  const start = () => {
    setOnboarded(name);
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-6 pt-8">
        <Animated.View entering={FadeIn.duration(400)}>
          <View className="h-14 w-14 items-center justify-center rounded-2xl bg-primary">
            <Sparkles color="hsl(300, 30%, 99%)" size={28} />
          </View>
          <Text size="3xl" weight="bold" className="mt-4">
            Money, on your terms
          </Text>
          <Text variant="muted" size="base" className="mt-2 leading-6">
            Learn to invest sustainably and build real financial confidence — in language that
            actually makes sense.
          </Text>
        </Animated.View>

        <View className="mt-8 gap-4">
          {VALUES.map((v, i) => (
            <Animated.View
              key={v.title}
              entering={FadeInDown.delay(150 + i * 100).duration(400)}
              className="flex-row items-start gap-3">
              <View className="h-11 w-11 items-center justify-center rounded-xl bg-secondary">
                {v.icon}
              </View>
              <View className="flex-1">
                <Text weight="semibold">{v.title}</Text>
                <Text variant="muted" size="sm" className="mt-0.5 leading-5">
                  {v.body}
                </Text>
              </View>
            </Animated.View>
          ))}
        </View>

        <View className="mt-auto pb-6">
          <Input
            label="What should we call you?"
            value={name}
            onChangeText={setName}
            placeholder="Your name (optional)"
            returnKeyType="done"
            onSubmitEditing={start}
          />
          <Button className="mt-4" onPress={start}>
            <Text>Start my journey</Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
