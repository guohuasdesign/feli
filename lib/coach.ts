// Scripted voice-coach knowledge base for FELI.
// FELI has no LLM backend in scope, so the coach maps a user's chosen topic to a
// warm, plain-language spoken reply. Replies are short so they sound natural via TTS.

export type CoachTopic = {
  id: string;
  /** Short label shown as a suggestion chip / question the user "asks". */
  prompt: string;
  emoji: string;
  /** What the coach says back (spoken via ElevenLabs). */
  reply: string;
};

export const COACH_GREETING =
  "Hi, I'm your FELI coach. Ask me anything about money — there's no silly question here. Pick something below to get started.";

export const COACH_TOPICS: CoachTopic[] = [
  {
    id: 'start',
    prompt: 'Where do I even start?',
    emoji: '🌱',
    reply:
      "Start small and start now — that beats waiting for the perfect moment. Pick one amount you won't miss each month, even five euros, and put it into a broad, low-cost fund. The habit matters far more than the size. You are already doing the hardest part by showing up.",
  },
  {
    id: 'scared',
    prompt: "I'm scared of losing money",
    emoji: '🫶',
    reply:
      "That fear is completely valid, and it's also why you'll likely be a great investor. The market goes up and down like weather, but over ten years and more it has always trended upward. The real risk is leaving money in cash where inflation quietly shrinks it. Slow and steady wins this.",
  },
  {
    id: 'compound',
    prompt: 'How does my money grow?',
    emoji: '✨',
    reply:
      "Through compounding — your money earns returns, and then those returns earn returns too. One hundred euros a month from age thirty could become around one hundred thousand by sixty, even though you only put in thirty-six thousand. Time does the heavy lifting, so the best day to begin is today.",
  },
  {
    id: 'esg',
    prompt: 'Can I invest in my values?',
    emoji: '🌍',
    reply:
      "Absolutely. Sustainable funds screen companies for their environment, social, and governance practices, so your money can back climate action and gender equality. Just read what's actually inside the fund, not only the label. Your portfolio becomes a vote for the world you want.",
  },
  {
    id: 'fee',
    prompt: "What's a coaching fee?",
    emoji: '🎓',
    reply:
      "Your coaching fee is a small amount you set aside each month to invest in your own learning and confidence. You choose the figure — there's no minimum and no judgement. Confidence is an asset too, and a little budget for books, courses, or calm thinking pays back for decades.",
  },
  {
    id: 'confidence',
    prompt: 'I feel behind everyone else',
    emoji: '👑',
    reply:
      "You are not behind — you're exactly on time, because the right time is whenever you choose to begin. Money was made to feel like a members-only club, but it belongs to you just as much. Every small step you take is power you're claiming back. I'm proud of you for being here.",
  },
];
