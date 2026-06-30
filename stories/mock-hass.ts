import type { HomeAssistant } from '../src/config/types';

const e = (state: string, attrs: Record<string, unknown> = {}) =>
  ({ entity_id: '', state, attributes: attrs });

// Deterministic per-entity PRNG so sparklines look the same across reloads
// instead of jittering on every render.
function seedFromString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Builds a plausible-looking 7-day history ending exactly at `currentValue`,
// in the shape HA's history/period API returns: an array of points per
// requested entity.
function syntheticHistory(entityId: string, currentValue: number) {
  const rand = mulberry32(seedFromString(entityId));
  const totalHours = 7 * 24;
  const stepHours = 4;
  const now = Date.now();
  const points: { state: string; last_changed: string }[] = [];
  let v = currentValue * (0.9 + rand() * 0.08);
  for (let h = 0; h <= totalHours; h += stepHours) {
    v += (rand() - 0.47) * Math.abs(currentValue || 1) * 0.012;
    points.push({
      state: v.toFixed(2),
      last_changed: new Date(now - (totalHours - h) * 3600000).toISOString(),
    });
  }
  points[points.length - 1].state = currentValue.toFixed(2);
  return points;
}

function makeCallApi(states: Record<string, ReturnType<typeof e>>) {
  return async (_method: 'GET' | 'POST', path: string) => {
    const match = /filter_entity_id=([^&]+)/.exec(path);
    if (!match) return [];
    const entityId = decodeURIComponent(match[1]);
    const current = parseFloat(states[entityId]?.state ?? '');
    if (isNaN(current)) return [];
    return [syntheticHistory(entityId, current)];
  };
}

const MOCK_STATES = {
  'sensor.trading212_total_value': e('5823.40'),
  'sensor.trading212_invested': e('4750.00'),
  'sensor.trading212_unrealized_pnl': e('1073.40'),
  'sensor.trading212_result_percent': e('22.60'),
  'sensor.trading212_daily_gain_loss': e('87.30'),
  'sensor.trading212_daily_gain_loss_percent': e('1.52'),
  'sensor.trading212_cash_available': e('200.00'),
  'sensor.trading212_total_dividends': e('42.18'),
  'sensor.trading212_top_daily_mover': e('Apple', { ticker: 'AAPL_US_EQ', change_value: 62.50, change_pct: 3.7 }),
  'sensor.trading212_bottom_daily_mover': e('WisdomTree Blockchain', { ticker: 'BKCNL_EQ', change_value: -12.80, change_pct: -2.1 }),
  'sensor.trading212_aapl_us_eq_value': e('1750.00'),
  'sensor.trading212_aapl_us_eq_pnl': e('250.00'),
  'sensor.trading212_aapl_us_eq_pnl_percent': e('16.67'),
  'sensor.trading212_aapl_us_eq_quantity': e('10'),
  'sensor.trading212_aapl_us_eq_avg_price': e('150.00'),
  'sensor.trading212_aapl_us_eq_current_price': e('175.00'),
  'sensor.trading212_msft_us_eq_value': e('1400.00'),
  'sensor.trading212_msft_us_eq_pnl': e('-100.00'),
  'sensor.trading212_msft_us_eq_pnl_percent': e('-6.67'),
  'sensor.trading212_msft_us_eq_quantity': e('5'),
  'sensor.trading212_msft_us_eq_avg_price': e('300.00'),
  'sensor.trading212_msft_us_eq_current_price': e('280.00'),
  'sensor.trading212_googl_us_eq_value': e('950.00'),
  'sensor.trading212_googl_us_eq_pnl': e('80.00'),
  'sensor.trading212_googl_us_eq_pnl_percent': e('9.20'),
  'sensor.trading212_googl_us_eq_quantity': e('3'),
  'sensor.trading212_googl_us_eq_avg_price': e('290.00'),
  'sensor.trading212_googl_us_eq_current_price': e('316.67'),
  'sensor.trading212_tsla_us_eq_value': e('620.00'),
  'sensor.trading212_tsla_us_eq_pnl': e('-45.00'),
  'sensor.trading212_tsla_us_eq_pnl_percent': e('-6.77'),
  'sensor.trading212_tsla_us_eq_quantity': e('2'),
  'sensor.trading212_tsla_us_eq_avg_price': e('332.50'),
  'sensor.trading212_tsla_us_eq_current_price': e('310.00'),
  'sensor.trading212_amzn_us_eq_value': e('480.00'),
  'sensor.trading212_amzn_us_eq_pnl': e('25.00'),
  'sensor.trading212_amzn_us_eq_pnl_percent': e('5.49'),
  'sensor.trading212_amzn_us_eq_quantity': e('4'),
  'sensor.trading212_amzn_us_eq_avg_price': e('113.75'),
  'sensor.trading212_amzn_us_eq_current_price': e('120.00'),
  'sensor.trading212_growth_pie_value': e('2000.00', { tickers: ['AAPL_US_EQ', 'GOOGL_US_EQ'] }),
  'sensor.trading212_growth_pie_pnl': e('200.00'),
  'sensor.trading212_growth_pie_pnl_percent': e('11.11'),
  'sensor.trading212_growth_pie_invested': e('1800.00'),
  'sensor.trading212_growth_pie_cash': e('50.00'),
  'sensor.trading212_growth_pie_progress': e('40'),
  'sensor.trading212_growth_pie_goal': e('5000.00'),
  'sensor.trading212_growth_pie_dividends_gained': e('20.00'),
  'sensor.trading212_growth_pie_dividends_in_cash': e('10.00'),
  'sensor.trading212_growth_pie_dividends_reinvested': e('10.00'),
  'sensor.trading212_income_pie_value': e('1200.00', { tickers: ['MSFT_US_EQ', 'TSLA_US_EQ'] }),
  'sensor.trading212_income_pie_pnl': e('60.00'),
  'sensor.trading212_income_pie_pnl_percent': e('5.26'),
  'sensor.trading212_income_pie_invested': e('1140.00'),
  'sensor.trading212_income_pie_cash': e('30.00'),
  'sensor.trading212_income_pie_progress': e('65'),
  'sensor.trading212_income_pie_goal': e('3000.00'),
  'sensor.trading212_income_pie_dividends_gained': e('45.00'),
  'sensor.trading212_income_pie_dividends_in_cash': e('20.00'),
  'sensor.trading212_income_pie_dividends_reinvested': e('25.00'),
};

export const mockHass: HomeAssistant = {
  states: MOCK_STATES,
  callApi: makeCallApi(MOCK_STATES) as HomeAssistant['callApi'],
};

export const unavailableHass: HomeAssistant = {
  states: Object.fromEntries(
    Object.keys(mockHass.states).map((key) => [key, e('unavailable')])
  ),
  callApi: async () => [] as any,
};

export const emptyHass: HomeAssistant = {
  states: {},
  callApi: async () => [] as any,
};

// Same as mockHass but without top/bottom daily mover sensors — exercises
// the conditional mover-row/mover-line rendering in Overview and Health.
const NO_MOVERS_STATES = Object.fromEntries(
  Object.entries(MOCK_STATES).filter(
    ([key]) => key !== 'sensor.trading212_top_daily_mover' && key !== 'sensor.trading212_bottom_daily_mover'
  )
);

export const noMoversHass: HomeAssistant = {
  states: NO_MOVERS_STATES,
  callApi: makeCallApi(NO_MOVERS_STATES) as HomeAssistant['callApi'],
};

const PARTIAL_SENSORS_STATES = {
  'sensor.trading212_total_value': e('5823.40'),
  'sensor.trading212_invested': e('4750.00'),
  'sensor.trading212_unrealized_pnl': e('1073.40'),
  'sensor.trading212_result_percent': e('22.60'),
  'sensor.trading212_cash_available': e('200.00'),
  'sensor.trading212_total_dividends': e('42.18'),
  // AAPL: only quantity + pnl_percent selected — no value, no pnl, no prices.
  'sensor.trading212_aapl_us_eq_quantity': e('10'),
  'sensor.trading212_aapl_us_eq_pnl_percent': e('16.67'),
  // MSFT: only daily change selected.
  'sensor.trading212_msft_us_eq_daily_gain_loss': e('-8.40'),
  'sensor.trading212_msft_us_eq_daily_gain_loss_percent': e('-0.60'),
  // Growth pie: only value + progress selected.
  'sensor.trading212_growth_pie_value': e('2000.00'),
  'sensor.trading212_growth_pie_progress': e('40'),
  // Income pie: only the shared `pnl` sensor selected, no pie-exclusive
  // sensor (invested/cash/progress/goal/dividends_*) — type can't be
  // determined, so this pie is intentionally omitted from discovery
  // entirely (not just missing fields). Exercises the ambiguous-slug path.
  'sensor.trading212_income_pie_pnl': e('30.00'),
};

export const partialSensorsHass: HomeAssistant = {
  states: PARTIAL_SENSORS_STATES,
  callApi: makeCallApi(PARTIAL_SENSORS_STATES) as HomeAssistant['callApi'],
};
