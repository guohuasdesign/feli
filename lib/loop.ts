// Closed engagement loop: Learn -> Invest -> Track -> Coach -> (back to Learn).
// Pure functions that derive the user's current loop stage and next action
// from persisted store state. No hooks here — call from components with store values.

export type LoopStage = 'learn' | 'invest' | 'track' | 'coach';

export type LoopStageInfo = {
  id: LoopStage;
  label: string;
  emoji: string;
};

export const LOOP_STAGES: LoopStageInfo[] = [
  { id: 'learn', label: 'Learn', emoji: '📖' },
  { id: 'invest', label: 'Invest', emoji: '📈' },
  { id: 'track', label: 'Track', emoji: '🌟' },
  { id: 'coach', label: 'Coach', emoji: '🎧' },
];

export type LoopInput = {
  completedLessons: string[];
  savedPlan: boolean;
  /** Loop cycles fully closed (coach revisited after a plan was saved). */
  loopsClosed: number;
  /** Whether the user has visited/checked their progress since saving a plan. */
  trackedProgress: boolean;
  /** Coach topics the user has asked this cycle. */
  coachedThisCycle: boolean;
};

export type NextStep = {
  /** Which stage the user is currently at / should act on. */
  stage: LoopStage;
  /** Short headline for the card. */
  title: string;
  /** One-line plain-language nudge. */
  body: string;
  /** CTA button label. */
  cta: string;
  /** Route to navigate to on CTA press. */
  route: string;
  /** 0-based index into LOOP_STAGES for the progress dots. */
  stageIndex: number;
};

/**
 * Determine the user's current position in the closed loop and the single
 * most useful next action. The loop intentionally always points forward so
 * the user is never left on a dead end.
 */
export function nextStep(input: LoopInput): NextStep {
  const { completedLessons, savedPlan, trackedProgress, coachedThisCycle, loopsClosed } = input;
  const hasLearned = completedLessons.length > 0;

  // Stage 1 — Learn: no lessons completed yet.
  if (!hasLearned) {
    return {
      stage: 'learn',
      stageIndex: 0,
      title: loopsClosed > 0 ? 'Start a fresh lesson' : 'Start with one lesson',
      body: 'Learn one money idea in a few minutes — then put it to work.',
      cta: 'Open a lesson',
      route: '/(tabs)',
    };
  }

  // Stage 2 — Invest: learned something, but no saved plan yet.
  if (!savedPlan) {
    return {
      stage: 'invest',
      stageIndex: 1,
      title: 'Apply what you learned',
      body: 'Turn your new knowledge into a real plan in the portfolio builder.',
      cta: 'Build my plan',
      route: '/(tabs)/invest',
    };
  }

  // Stage 3 — Track: plan saved, but progress not reviewed yet.
  if (!trackedProgress) {
    return {
      stage: 'track',
      stageIndex: 2,
      title: 'See how far you have come',
      body: 'Check your streak, points and milestones on your progress page.',
      cta: 'Track my progress',
      route: '/(tabs)/profile',
    };
  }

  // Stage 4 — Coach: reinforce, then loop back to a new lesson.
  if (!coachedThisCycle) {
    return {
      stage: 'coach',
      stageIndex: 3,
      title: 'Lock it in with your coach',
      body: 'Ask your FELI coach a question to reinforce this cycle out loud.',
      cta: 'Talk to my coach',
      route: '/(tabs)/coach',
    };
  }

  // Loop closed — send the user back to Learn for the next cycle.
  return {
    stage: 'learn',
    stageIndex: 0,
    title: 'You closed the loop!',
    body: 'Learn → Invest → Track → Coach, done. Start your next cycle with a new lesson.',
    cta: 'Start next cycle',
    route: '/(tabs)',
  };
}

/** Stage the user has reached so far (the furthest completed step). */
export function reachedStageIndex(input: LoopInput): number {
  return nextStep(input).stageIndex;
}
