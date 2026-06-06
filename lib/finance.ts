import { FUNDS, type Allocation } from './store';

/**
 * Project the future value of a monthly contribution invested at a blended
 * annual return derived from the user's allocation.
 */
export function blendedReturn(allocation: Allocation[]): number {
  const total = allocation.reduce((s, a) => s + a.percent, 0);
  if (total === 0) return 0;
  let weighted = 0;
  for (const a of allocation) {
    const fund = FUNDS.find((f) => f.id === a.fundId);
    if (fund) weighted += (a.percent / total) * fund.return5y;
  }
  return weighted;
}

export function blendedEsg(allocation: Allocation[]): number {
  const total = allocation.reduce((s, a) => s + a.percent, 0);
  if (total === 0) return 0;
  let weighted = 0;
  for (const a of allocation) {
    const fund = FUNDS.find((f) => f.id === a.fundId);
    if (fund) weighted += (a.percent / total) * fund.esgScore;
  }
  return Math.round(weighted);
}

/** Future value of a recurring monthly contribution with monthly compounding. */
export function projectFutureValue(monthly: number, annualReturnPct: number, years: number): number {
  const r = annualReturnPct / 100 / 12;
  const n = years * 12;
  if (r === 0) return monthly * n;
  return monthly * ((Math.pow(1 + r, n) - 1) / r);
}

export function contributed(monthly: number, years: number): number {
  return monthly * years * 12;
}

/**
 * Total personal coaching budget set aside over the period. The coaching fee is
 * a monthly EUR amount the user dedicates to their own financial coaching/learning.
 */
export function coachingTotal(fee: number, years: number): number {
  return Math.max(0, fee) * years * 12;
}

/**
 * Effective amount that actually compounds each month once the personal coaching
 * fee is set aside from the monthly contribution.
 */
export function investedAfterFee(monthly: number, fee: number): number {
  return Math.max(0, monthly - Math.max(0, fee));
}

export function formatEur(value: number): string {
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);
}
