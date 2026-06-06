// Static learning content for FELI — Female Empowerment Longterm Investment.
// Written in plain, encouraging language — no gatekeeping jargon.

export type DialogueStep = {
  speaker: 'guide' | 'you';
  /** For 'guide' messages: the spoken line. */
  text?: string;
  /** For 'you' messages: choices the user can pick to reply. */
  choices?: { label: string; reply: string }[];
};

export type Lesson = {
  id: string;
  title: string;
  emoji: string;
  blurb: string;
  minutes: number;
  /** A short conversation that teaches the concept. */
  dialogue: DialogueStep[];
  /** One-line takeaway shown on completion. */
  takeaway: string;
  /** XP / confidence points earned. */
  points: number;
};

export type Module = {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  lessons: Lesson[];
};

export const MODULES: Module[] = [
  {
    id: 'mindset',
    title: 'Money & Mindset',
    subtitle: 'Unlearn the myths. Money is for you too.',
    emoji: '✨',
    lessons: [
      {
        id: 'why-invest',
        title: 'Why investing is yours to claim',
        emoji: '👑',
        blurb: 'The gender investing gap, and why closing it is power.',
        minutes: 4,
        points: 50,
        takeaway:
          'Investing is not "too risky for you" — it is one of the strongest ways to build long-term security on your own terms.',
        dialogue: [
          {
            speaker: 'guide',
            text: "Hey, glad you're here. Quick question to start — when you hear the word \"investing\", what comes up?",
          },
          {
            speaker: 'you',
            choices: [
              { label: 'It feels intimidating', reply: 'Honestly? It feels intimidating and a bit not-for-me.' },
              { label: 'Risky / could lose it all', reply: 'I worry I could just lose all my money.' },
              { label: 'Curious but unsure', reply: "I'm curious, I just don't know where to start." },
            ],
          },
          {
            speaker: 'guide',
            text: "That's so common — and it's not an accident. For decades finance was designed to feel like a members-only club. But here's the data: women who do invest tend to get similar or better returns than men, because they trade less and stay steady.",
          },
          {
            speaker: 'guide',
            text: 'The real risk isn\'t investing badly. It\'s the "confidence gap" — money sitting in cash, quietly losing value to inflation, because someone was told this wasn\'t their space.',
          },
          {
            speaker: 'you',
            choices: [
              { label: 'So staying in cash has a cost too?', reply: 'So even keeping it all in my account has a downside?' },
            ],
          },
          {
            speaker: 'guide',
            text: 'Exactly. If prices rise 3% a year and your savings earn 0.5%, your money buys less each year. Investing, done calmly and long-term, is how you keep up — and pull ahead. This is yours to claim.',
          },
        ],
      },
      {
        id: 'compound',
        title: 'The quiet magic of compounding',
        emoji: '🌱',
        blurb: 'How small, regular amounts grow into something powerful.',
        minutes: 5,
        points: 60,
        takeaway:
          'Starting small but starting early beats starting big but starting late. Time is the ingredient only you control.',
        dialogue: [
          {
            speaker: 'guide',
            text: 'Let me show you the one idea that changes everything: compounding. Your money earns returns — and then those returns earn returns too.',
          },
          {
            speaker: 'guide',
            text: 'Imagine you invest €100 a month from age 30. By 60, with ~6% average growth, that\'s roughly €100,000 — and you only put in €36,000. The rest? Compounding did the heavy lifting.',
          },
          {
            speaker: 'you',
            choices: [
              { label: 'What if I wait 10 years?', reply: 'What happens if I wait until 40 to start?' },
              { label: 'Is more-per-month better?', reply: 'Would investing more each month beat starting early?' },
            ],
          },
          {
            speaker: 'guide',
            text: 'Waiting a decade can roughly halve your final amount, even with the same monthly contribution. That\'s why "start now, even small" beats "wait until I have more". You don\'t need to be rich to begin — beginning is what builds the wealth.',
          },
        ],
      },
    ],
  },
  {
    id: 'basics',
    title: 'The Building Blocks',
    subtitle: 'Stocks, funds, ETFs — in plain words.',
    emoji: '🧱',
    lessons: [
      {
        id: 'etf',
        title: 'What is an ETF, really?',
        emoji: '🧺',
        blurb: 'The "basket" approach that spreads your risk automatically.',
        minutes: 4,
        points: 50,
        takeaway:
          'An ETF is a basket of many companies in one. You buy the whole basket, so no single company can sink you.',
        dialogue: [
          {
            speaker: 'guide',
            text: 'Picture a grocery basket. Instead of betting everything on one apple, you buy a basket with hundreds of fruits. If one goes bad, you\'re fine. That basket is an ETF.',
          },
          {
            speaker: 'guide',
            text: 'A single ETF can hold 500, 1,000, even 3,000 companies. One purchase = instant diversification. It\'s the calm, low-effort core most experts recommend for beginners.',
          },
          {
            speaker: 'you',
            choices: [
              { label: 'Why not just pick winners?', reply: "Wouldn't picking the best companies make more money?" },
            ],
          },
          {
            speaker: 'guide',
            text: 'It might — or it might not. Even professionals rarely beat the basket consistently. Owning the whole market means you never miss the winners, and you sleep at night. Boring, on purpose. And boring builds wealth.',
          },
        ],
      },
      {
        id: 'risk',
        title: 'Risk, without the fear',
        emoji: '🧘',
        blurb: 'Understanding ups and downs so they stop scaring you.',
        minutes: 5,
        points: 60,
        takeaway:
          'Volatility is the price of growth, not a sign something is broken. Time in the market calms the bumps.',
        dialogue: [
          {
            speaker: 'guide',
            text: 'The market goes up and down — that\'s called volatility. It feels scary, but it\'s normal, like weather. The trick is your time horizon.',
          },
          {
            speaker: 'you',
            choices: [
              { label: 'What\'s a time horizon?', reply: 'What do you mean by time horizon?' },
            ],
          },
          {
            speaker: 'guide',
            text: 'It\'s how long until you need the money. Money you need next year shouldn\'t be in stocks. Money for 10+ years from now? Short-term dips barely matter — historically the market has always recovered and grown over long stretches.',
          },
          {
            speaker: 'guide',
            text: 'So the move isn\'t to avoid risk entirely. It\'s to match your risk to your timeline, and then stay invested through the noise. Steady beats panicked, every time.',
          },
        ],
      },
    ],
  },
  {
    id: 'sustainable',
    title: 'Invest With Your Values',
    subtitle: 'Grow money and the world you want.',
    emoji: '🌍',
    lessons: [
      {
        id: 'esg',
        title: 'What "sustainable" actually means',
        emoji: '♻️',
        blurb: 'ESG, greenwashing, and how to invest with integrity.',
        minutes: 5,
        points: 70,
        takeaway:
          'Sustainable investing screens for environmental, social and governance quality — but always check what\'s really inside the fund.',
        dialogue: [
          {
            speaker: 'guide',
            text: 'Sustainable investing means putting money into companies scored on ESG — Environmental, Social, and Governance. Think: low emissions, fair treatment of workers, honest leadership.',
          },
          {
            speaker: 'you',
            choices: [
              { label: 'Does it earn less?', reply: 'Do I have to sacrifice returns to invest this way?' },
              { label: 'What\'s greenwashing?', reply: "I've heard the term greenwashing — what is that?" },
            ],
          },
          {
            speaker: 'guide',
            text: 'Greenwashing is when a fund markets itself as "green" but quietly holds things you\'d object to. So the skill is reading the holdings, not just the label. And no — long-term, sustainable funds have performed competitively. Values and returns aren\'t enemies.',
          },
          {
            speaker: 'guide',
            text: 'When you invest with your values, your money becomes a vote. That\'s real power — your portfolio shaping the world, while building your future.',
          },
        ],
      },
    ],
  },
  {
    id: 'coaching',
    title: 'Coach Yourself',
    subtitle: 'Invest in your own growth, on purpose.',
    emoji: '🎓',
    lessons: [
      {
        id: 'coaching-fee',
        title: 'Your personal coaching fee',
        emoji: '💪',
        blurb: 'Why paying yourself to learn is the smartest fee you\'ll ever set.',
        minutes: 4,
        points: 60,
        takeaway:
          'A coaching fee is money you deliberately set aside each month for your own financial learning. You choose the figure — even a small one compounds into real confidence.',
        dialogue: [
          {
            speaker: 'guide',
            text: 'In FELI you can set a personal coaching fee — a monthly amount you dedicate to your own financial growth. You decide the number. There\'s no minimum and no judgement.',
          },
          {
            speaker: 'you',
            choices: [
              { label: 'Why pay myself?', reply: 'Why would I set money aside instead of investing all of it?' },
              { label: 'How much is right?', reply: 'How do I know what coaching fee to choose?' },
            ],
          },
          {
            speaker: 'guide',
            text: 'Because confidence is an asset too. A small, intentional coaching budget — for a book, a course, or just a buffer to learn calmly — pays back in better decisions for decades. The right figure is one that feels sustainable to you, even if it\'s €5.',
          },
          {
            speaker: 'guide',
            text: 'Head to the Invest tab and set your own coaching fee. You\'ll see exactly how much goes to your growth and how much keeps compounding in your portfolio — both are wins.',
          },
        ],
      },
    ],
  },
];

export type Fund = {
  id: string;
  name: string;
  ticker: string;
  category: 'Climate' | 'Gender Equality' | 'Broad ESG' | 'Clean Energy';
  esgScore: number; // out of 100
  risk: 'Low' | 'Medium' | 'High';
  return5y: number; // annualised %
  description: string;
  holdings: number;
  highlights: string[];
};

export const FUNDS: Fund[] = [
  {
    id: 'world-esg',
    name: 'Global Sustainable Leaders',
    ticker: 'GSLD',
    category: 'Broad ESG',
    esgScore: 88,
    risk: 'Medium',
    return5y: 8.4,
    description:
      'A broad basket of ~1,200 companies worldwide that score highest on environmental, social and governance standards. A calm, diversified core for any long-term portfolio.',
    holdings: 1243,
    highlights: ['Excludes fossil fuels & weapons', 'Screened for fair labour', 'Low ongoing cost (0.20%)'],
  },
  {
    id: 'gender-equality',
    name: 'Gender Equality Advance',
    ticker: 'SHEX',
    category: 'Gender Equality',
    esgScore: 84,
    risk: 'Medium',
    return5y: 7.9,
    description:
      'Invests in companies leading on gender balance — women in leadership, equal pay policies, and family-friendly practices. Put your money where your values are.',
    holdings: 162,
    highlights: ['Women on boards & C-suite', 'Equal-pay commitments', 'Strong parental leave'],
  },
  {
    id: 'clean-energy',
    name: 'Clean Energy Future',
    ticker: 'CLEN',
    category: 'Clean Energy',
    esgScore: 91,
    risk: 'High',
    return5y: 11.2,
    description:
      'Higher growth, higher swings: solar, wind, storage and grid innovators powering the transition away from fossil fuels.',
    holdings: 98,
    highlights: ['Solar & wind leaders', 'Higher growth potential', 'More volatile — long horizon'],
  },
  {
    id: 'climate-bond',
    name: 'Climate Stability Bonds',
    ticker: 'GRNB',
    category: 'Climate',
    esgScore: 86,
    risk: 'Low',
    return5y: 3.6,
    description:
      'Green bonds financing climate projects. Lower returns, but steadier — a gentle anchor to balance the more adventurous parts of your portfolio.',
    holdings: 540,
    highlights: ['Funds climate projects', 'Lower volatility', 'Income-focused'],
  },
];

export type GlossaryTerm = {
  term: string;
  short: string;
  full: string;
  category: 'Basics' | 'Products' | 'Sustainable' | 'Risk';
};

export const GLOSSARY: GlossaryTerm[] = [
  {
    term: 'ETF',
    short: 'A ready-made basket of many investments in one.',
    full: 'An Exchange-Traded Fund bundles hundreds or thousands of companies into a single, tradeable package. Buying one gives you instant diversification at low cost — the beginner-friendly building block.',
    category: 'Products',
  },
  {
    term: 'Compounding',
    short: 'When your gains start earning gains of their own.',
    full: 'Returns get reinvested and then generate more returns. Over years, this snowball effect does far more of the work than your contributions. Time is the magic ingredient.',
    category: 'Basics',
  },
  {
    term: 'Diversification',
    short: 'Not putting all your eggs in one basket.',
    full: 'Spreading money across many companies, sectors and regions so no single bad event can wipe you out. It is the closest thing investing has to a free lunch.',
    category: 'Risk',
  },
  {
    term: 'Volatility',
    short: 'How much an investment’s value swings up and down.',
    full: 'High volatility means bigger ups and downs. It feels scary but is normal, especially short-term. Over long horizons the swings smooth out — which is why patience pays.',
    category: 'Risk',
  },
  {
    term: 'ESG',
    short: 'Scoring companies on Environment, Social & Governance.',
    full: 'A framework rating companies on their environmental impact, treatment of people, and quality of leadership. Sustainable funds use ESG to screen what they hold.',
    category: 'Sustainable',
  },
  {
    term: 'Greenwashing',
    short: 'Looking sustainable on the label, but not inside.',
    full: 'When a fund or company markets itself as eco-friendly while its actual holdings or practices tell a different story. Always read the holdings, not just the marketing.',
    category: 'Sustainable',
  },
  {
    term: 'Inflation',
    short: 'The slow rise in prices that shrinks idle cash.',
    full: 'As prices rise over time, money kept in cash buys less and less. Investing is one of the main ways to outpace inflation and protect your purchasing power.',
    category: 'Basics',
  },
  {
    term: 'Dividend',
    short: 'A share of company profits paid out to you.',
    full: 'Some companies share profits directly with investors as regular cash payments. Reinvesting dividends supercharges compounding.',
    category: 'Products',
  },
  {
    term: 'Time horizon',
    short: 'How long until you need the money.',
    full: 'Your timeline drives how much risk suits you. Money needed soon stays safe; money for 10+ years away can ride out the market’s ups and downs.',
    category: 'Risk',
  },
  {
    term: 'Bond',
    short: 'A loan to a company or government that pays interest.',
    full: 'You lend money and get regular interest plus your money back later. Bonds are generally steadier than stocks — a calming anchor in a portfolio.',
    category: 'Products',
  },
];

export type Affirmation = string;

export const AFFIRMATIONS: Affirmation[] = [
  'Money is a tool I am learning to use with confidence.',
  'I deserve financial security on my own terms.',
  'Small, steady steps build real, lasting power.',
  'Asking questions about money is a sign of strength.',
  'My portfolio can reflect both my future and my values.',
  'I am building wealth at my own pace, and that is enough.',
];
