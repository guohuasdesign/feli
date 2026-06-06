import { ActivityIndicator, Pressable, View } from 'react-native';
import { Pause, Volume2 } from 'lucide-react-native';

import { cn } from '@/lib/utils';

type Props = {
  /** Current state of THIS button's audio line. */
  state: 'idle' | 'loading' | 'playing';
  onPress: () => void;
  /** Tint color for the icon (hsl/hex). */
  color: string;
  accessibilityLabel?: string;
  className?: string;
};

/**
 * Compact circular "listen" control used on chat bubbles and coach replies.
 * Shows a spinner while TTS is fetching and a pause glyph while playing.
 */
export function PlayButton({
  state,
  onPress,
  color,
  accessibilityLabel = 'Listen',
  className,
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={state === 'playing' ? 'Stop voice' : accessibilityLabel}
      onPress={onPress}
      hitSlop={8}
      className={cn(
        'h-9 w-9 items-center justify-center rounded-full bg-background/70 active:opacity-70',
        className,
      )}>
      {state === 'loading' ? (
        <ActivityIndicator size="small" color={color} />
      ) : state === 'playing' ? (
        <Pause color={color} size={16} fill={color} />
      ) : (
        <View>
          <Volume2 color={color} size={18} />
        </View>
      )}
    </Pressable>
  );
}
