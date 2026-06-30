import { describe, it, expect } from 'vitest';
import { resolveConfig } from '../src/data/sensor-resolver';
import type { HassEntity } from '../src/config/types';

const e = (state = '0'): HassEntity => ({ entity_id: '', state, attributes: {} });

const T212: Record<string, HassEntity> = {
  'sensor.trading212_total_value': e('5000'),
  'sensor.trading212_invested': e('4500'),
  'sensor.trading212_unrealized_pnl': e('500'),
  'sensor.trading212_result_percent': e('11.1'),
  'sensor.trading212_daily_gain_loss': e('50'),
  'sensor.trading212_daily_gain_loss_percent': e('1.0'),
  'sensor.trading212_cash_available': e('200'),
  'sensor.trading212_total_dividends': e('30'),
  'sensor.trading212_top_daily_mover': e('Apple'),
  'sensor.trading212_bottom_daily_mover': e('Microsoft'),
  // position — full attribute set
  'sensor.trading212_aapl_us_eq_value': e('1750'),
  'sensor.trading212_aapl_us_eq_pnl': e('250'),
  'sensor.trading212_aapl_us_eq_pnl_percent': e('16.7'),
  'sensor.trading212_aapl_us_eq_quantity': e('10'),
  'sensor.trading212_aapl_us_eq_avg_price': e('150'),
  'sensor.trading212_aapl_us_eq_current_price': e('175'),
  // pie — full attribute set
  'sensor.trading212_growth_pie_value': e('2000'),
  'sensor.trading212_growth_pie_pnl': e('200'),
  'sensor.trading212_growth_pie_pnl_percent': e('10'),
  'sensor.trading212_growth_pie_invested': e('1800'),
  'sensor.trading212_growth_pie_cash': e('50'),
  'sensor.trading212_growth_pie_progress': e('40'),
  'sensor.trading212_growth_pie_goal': e('5000'),
  'sensor.trading212_growth_pie_dividends_gained': e('20'),
  'sensor.trading212_growth_pie_dividends_in_cash': e('10'),
  'sensor.trading212_growth_pie_dividends_reinvested': e('10'),
};

describe('auto-detect (no config)', () => {
  it('resolves account sensors to Trading212 prefix', () => {
    const r = resolveConfig(undefined, T212);
    expect(r.account.total_value).toBe('sensor.trading212_total_value');
    expect(r.account.unrealized_pnl).toBe('sensor.trading212_unrealized_pnl');
    expect(r.account.top_daily_mover).toBe('sensor.trading212_top_daily_mover');
  });

  it('discovers one position with a full attribute set', () => {
    const r = resolveConfig(undefined, T212);
    expect(r.positions).toHaveLength(1);
    expect(r.positions[0].id).toBe('aapl_us_eq');
    expect(r.positions[0].value).toBe('sensor.trading212_aapl_us_eq_value');
    expect(r.positions[0].pnl).toBe('sensor.trading212_aapl_us_eq_pnl');
    expect(r.positions[0].pnl_percent).toBe('sensor.trading212_aapl_us_eq_pnl_percent');
    expect(r.positions[0].avg_price).toBe('sensor.trading212_aapl_us_eq_avg_price');
    expect(r.positions[0].history_entity).toBe('sensor.trading212_aapl_us_eq_value');
  });

  it('discovers one pie with a full attribute set', () => {
    const r = resolveConfig(undefined, T212);
    expect(r.pies).toHaveLength(1);
    expect(r.pies[0].id).toBe('growth_pie');
    expect(r.pies[0].value).toBe('sensor.trading212_growth_pie_value');
    expect(r.pies[0].invested).toBe('sensor.trading212_growth_pie_invested');
    expect(r.pies[0].dividends_gained).toBe('sensor.trading212_growth_pie_dividends_gained');
  });

  it('returns defaults for maxHeight and visibility', () => {
    const r = resolveConfig(undefined, T212);
    expect(r.maxHeight).toBe('400px');
    expect(r.showOverview).toBe(true);
    expect(r.showPositions).toBe(true);
    expect(r.showPies).toBe(true);
  });

  it('returns empty arrays with empty states', () => {
    const r = resolveConfig(undefined, {});
    expect(r.positions).toHaveLength(0);
    expect(r.pies).toHaveLength(0);
  });
});

describe('partial sensor selection', () => {
  it('discovers a position via a single non-anchor sensor (pnl_percent only)', () => {
    const states: Record<string, HassEntity> = {
      'sensor.trading212_tsla_us_eq_pnl_percent': e('4.2'),
    };
    const r = resolveConfig(undefined, states);
    expect(r.positions).toHaveLength(1);
    expect(r.positions[0].id).toBe('tsla_us_eq');
    expect(r.positions[0].pnl_percent).toBe('sensor.trading212_tsla_us_eq_pnl_percent');
    expect(r.positions[0].value).toBeUndefined();
    expect(r.positions[0].quantity).toBeUndefined();
    expect(r.positions[0].history_entity).toBeUndefined();
  });

  it('discovers a pie via a single non-anchor sensor (pnl only)', () => {
    const states: Record<string, HassEntity> = {
      'sensor.trading212_income_pie_pnl': e('30'),
    };
    const r = resolveConfig(undefined, states);
    expect(r.pies).toHaveLength(1);
    expect(r.pies[0].id).toBe('income_pie');
    expect(r.pies[0].pnl).toBe('sensor.trading212_income_pie_pnl');
    expect(r.pies[0].invested).toBeUndefined();
    expect(r.pies[0].value).toBeUndefined();
  });

  it('resolves daily_gain_loss and daily_gain_loss_percent when present', () => {
    const states: Record<string, HassEntity> = {
      'sensor.trading212_aapl_us_eq_quantity': e('10'),
      'sensor.trading212_aapl_us_eq_daily_gain_loss': e('12.5'),
      'sensor.trading212_aapl_us_eq_daily_gain_loss_percent': e('0.8'),
    };
    const r = resolveConfig(undefined, states);
    expect(r.positions).toHaveLength(1);
    expect(r.positions[0].daily_gain_loss).toBe('sensor.trading212_aapl_us_eq_daily_gain_loss');
    expect(r.positions[0].daily_gain_loss_percent).toBe(
      'sensor.trading212_aapl_us_eq_daily_gain_loss_percent'
    );
  });

  it('omits fields whose sensor entity does not exist', () => {
    const states: Record<string, HassEntity> = {
      'sensor.trading212_aapl_us_eq_value': e('1750'),
      'sensor.trading212_aapl_us_eq_quantity': e('10'),
    };
    const r = resolveConfig(undefined, states);
    expect(r.positions[0].value).toBe('sensor.trading212_aapl_us_eq_value');
    expect(r.positions[0].quantity).toBe('sensor.trading212_aapl_us_eq_quantity');
    expect(r.positions[0].pnl).toBeUndefined();
    expect(r.positions[0].pnl_percent).toBeUndefined();
    expect(r.positions[0].avg_price).toBeUndefined();
    expect(r.positions[0].current_price).toBeUndefined();
    expect(r.positions[0].daily_gain_loss).toBeUndefined();
  });
});

describe('prefix mode', () => {
  const CUSTOM: Record<string, HassEntity> = {
    'sensor.broker_total_value': e('1000'),
    'sensor.broker_aapl_value': e('500'),
    'sensor.broker_aapl_pnl': e('50'),
    'sensor.broker_aapl_pnl_percent': e('10'),
    'sensor.broker_aapl_quantity': e('5'),
    'sensor.broker_aapl_avg_price': e('90'),
    'sensor.broker_aapl_current_price': e('100'),
  };

  it('uses provided prefix for account sensors', () => {
    const r = resolveConfig({ prefix: 'sensor.broker_' }, CUSTOM);
    expect(r.account.total_value).toBe('sensor.broker_total_value');
  });

  it('discovers positions with custom prefix', () => {
    const r = resolveConfig({ prefix: 'sensor.broker_' }, CUSTOM);
    expect(r.positions).toHaveLength(1);
    expect(r.positions[0].value).toBe('sensor.broker_aapl_value');
    expect(r.positions[0].history_entity).toBe('sensor.broker_aapl_value');
  });

  it('returns empty pies when no pie sensors exist', () => {
    const r = resolveConfig({ prefix: 'sensor.broker_' }, CUSTOM);
    expect(r.pies).toHaveLength(0);
  });
});

describe('explicit mapping', () => {
  it('passes positions through directly', () => {
    const r = resolveConfig(
      {
        positions: [
          {
            name: 'Apple',
            value: 'sensor.my_aapl_val',
            pnl: 'sensor.my_aapl_pnl',
            pnl_percent: 'sensor.my_aapl_pct',
          },
        ],
      },
      {}
    );
    expect(r.positions).toHaveLength(1);
    expect(r.positions[0].name).toBe('Apple');
    expect(r.positions[0].value).toBe('sensor.my_aapl_val');
    expect(r.positions[0].history_entity).toBe('sensor.my_aapl_val');
  });

  it('respects history_entity override', () => {
    const r = resolveConfig(
      {
        positions: [
          {
            name: 'Apple',
            value: 'sensor.my_aapl_val',
            pnl: 'sensor.my_aapl_pnl',
            pnl_percent: 'sensor.my_aapl_pct',
            history_entity: 'sensor.my_aapl_history',
          },
        ],
      },
      {}
    );
    expect(r.positions[0].history_entity).toBe('sensor.my_aapl_history');
  });

  it('passes pies through directly', () => {
    const r = resolveConfig(
      {
        pies: [{ name: 'Growth', value: 'sensor.growth_val', invested: 'sensor.growth_inv' }],
      },
      {}
    );
    expect(r.pies).toHaveLength(1);
    expect(r.pies[0].name).toBe('Growth');
    expect(r.pies[0].invested).toBe('sensor.growth_inv');
  });

  it('respects show_overview: false', () => {
    const r = resolveConfig({ show_overview: false, positions: [] }, {});
    expect(r.showOverview).toBe(false);
  });

  it('respects custom max_height', () => {
    const r = resolveConfig({ max_height: '600px', positions: [] }, {});
    expect(r.maxHeight).toBe('600px');
  });

  it('derives position id from value when provided', () => {
    const r = resolveConfig(
      {
        positions: [
          { name: 'Apple', value: 'sensor.my_aapl_val', pnl: 'p', pnl_percent: 'pp' },
        ],
      },
      {}
    );
    expect(r.positions[0].id).toBe('sensor.my_aapl_val');
  });

  it('derives pie id from name when value is absent', () => {
    const r = resolveConfig(
      { pies: [{ name: 'Growth', value: '' as unknown as string }] },
      {}
    );
    expect(r.pies[0].id).toBe('Growth');
  });
});
