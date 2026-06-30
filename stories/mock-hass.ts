import type { HomeAssistant } from '../src/config/types';

const e = (state: string, attrs: Record<string, unknown> = {}) =>
  ({ entity_id: '', state, attributes: attrs });

export const mockHass: HomeAssistant = {
  states: {
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
    'sensor.trading212_growth_pie_value': e('2000.00', { tickers: ['AAPL_US_EQ'] }),
    'sensor.trading212_growth_pie_pnl': e('200.00'),
    'sensor.trading212_growth_pie_pnl_percent': e('11.11'),
    'sensor.trading212_growth_pie_invested': e('1800.00'),
    'sensor.trading212_growth_pie_cash': e('50.00'),
    'sensor.trading212_growth_pie_progress': e('40'),
    'sensor.trading212_growth_pie_goal': e('5000.00'),
    'sensor.trading212_growth_pie_dividends_gained': e('20.00'),
    'sensor.trading212_growth_pie_dividends_in_cash': e('10.00'),
    'sensor.trading212_growth_pie_dividends_reinvested': e('10.00'),
  },
  callApi: async () => [] as any,
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
export const noMoversHass: HomeAssistant = {
  states: Object.fromEntries(
    Object.entries(mockHass.states).filter(
      ([key]) => key !== 'sensor.trading212_top_daily_mover' && key !== 'sensor.trading212_bottom_daily_mover'
    )
  ),
  callApi: async () => [] as any,
};

export const partialSensorsHass: HomeAssistant = {
  states: {
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
  },
  callApi: async () => [] as any,
};
