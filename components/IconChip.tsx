import { View, type ViewProps } from 'react-native';

import { cn } from '@/lib/utils';

type IconChipSize = 'sm' | 'md' | 'lg';
type IconChipTone = 'primary' | 'accent' | 'muted' | 'destructive';

const SIZE_MAP: Record<IconChipSize, string> = {
  sm: 'h-9 w-9 rounded-xl',
  md: 'h-11 w-11 rounded-2xl',
  lg: 'h-14 w-14 rounded-2xl',
};

const TONE_MAP: Record<IconChipTone, string> = {
  primary: 'bg-primary/10',
  accent: 'bg-accent/15',
  muted: 'bg-secondary',
  destructive: 'bg-destructive/10',
};

export interface IconChipProps extends ViewProps {
  size?: IconChipSize;
  tone?: IconChipTone;
  className?: string;
}

/**
 * Consistent tinted, rounded container for a single icon. Use everywhere an
 * icon needs a surface so iconography reads uniformly across the app.
 */
export function IconChip({
  size = 'md',
  tone = 'primary',
  className,
  children,
  ...props
}: IconChipProps) {
  return (
    <View
      className={cn('items-center justify-center', SIZE_MAP[size], TONE_MAP[tone], className)}
      {...props}
    >
      {children}
    </View>
  );
}
