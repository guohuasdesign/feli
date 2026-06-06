import { useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated';
import { Bookmark, ChevronDown, Search } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { GLOSSARY, type GlossaryTerm } from '@/lib/content';
import { useProgressStore } from '@/lib/store';

const CATEGORIES: (GlossaryTerm['category'] | 'All')[] = [
  'All',
  'Basics',
  'Products',
  'Sustainable',
  'Risk',
];

export default function GlossaryScreen() {
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>('All');
  const [open, setOpen] = useState<string | null>(null);

  const saved = useProgressStore((s) => s.savedTerms);
  const toggleSaved = useProgressStore((s) => s.toggleSavedTerm);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return GLOSSARY.filter((t) => {
      const matchCat = cat === 'All' || t.category === cat;
      const matchQ =
        q.length === 0 ||
        t.term.toLowerCase().includes(q) ||
        t.short.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [query, cat]);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="px-5 pt-4">
        <Text size="3xl" weight="bold" className="leading-9">
          Plain-language glossary
        </Text>
        <Text variant="muted" size="sm" className="mt-1.5 leading-5">
          No jargon, no gatekeeping. Tap a word to learn more.
        </Text>

        <View className="mt-5">
          <Input
            value={query}
            onChangeText={setQuery}
            placeholder="Search terms"
            leftIcon={<Search color="hsl(165, 12%, 55%)" size={18} />}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-2 py-4">
          {CATEGORIES.map((c) => (
            <Pressable
              key={c}
              accessibilityRole="button"
              onPress={() => setCat(c)}
              className={`rounded-full border px-4 py-1.5 ${
                cat === c ? 'border-primary bg-primary' : 'border-border bg-card'
              }`}>
              <Text
                size="sm"
                weight="medium"
                className={cat === c ? 'text-primary-foreground' : 'text-foreground'}>
                {c}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerClassName="px-5 pb-12" showsVerticalScrollIndicator={false}>
        <View className="gap-3">
          {filtered.map((t, i) => {
            const isOpen = open === t.term;
            const isSaved = saved.includes(t.term);
            return (
              <Animated.View
                key={t.term}
                layout={LinearTransition.springify()}
                entering={FadeInDown.delay(i * 40).duration(350)}>
                <Card className="p-5">
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`${t.term} definition`}
                    onPress={() => setOpen(isOpen ? null : t.term)}>
                    <View className="flex-row items-center justify-between">
                      <View className="flex-1 pr-3">
                        <Text size="lg" weight="semibold">
                          {t.term}
                        </Text>
                        <Text variant="muted" size="sm" className="mt-1 leading-5">
                          {t.short}
                        </Text>
                      </View>
                      <Animated.View
                        style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }}>
                        <ChevronDown color="hsl(165, 12%, 55%)" size={20} />
                      </Animated.View>
                    </View>
                  </Pressable>

                  {isOpen && (
                    <Animated.View entering={FadeInDown.duration(250)} className="mt-4">
                      <Text size="sm" className="leading-6">
                        {t.full}
                      </Text>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={isSaved ? 'Remove bookmark' : 'Save term'}
                        onPress={() => toggleSaved(t.term)}
                        className="mt-4 min-h-[44px] flex-row items-center gap-2 self-start rounded-full bg-secondary px-4 py-2.5">
                        <Bookmark
                          color="hsl(162, 72%, 34%)"
                          size={16}
                          fill={isSaved ? 'hsl(162, 72%, 34%)' : 'transparent'}
                        />
                        <Text size="sm" weight="medium" className="text-secondary-foreground">
                          {isSaved ? 'Saved' : 'Save'}
                        </Text>
                      </Pressable>
                    </Animated.View>
                  )}
                </Card>
              </Animated.View>
            );
          })}
          {filtered.length === 0 && (
            <Card className="items-center p-8">
              <Text variant="muted">No terms match your search.</Text>
            </Card>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
