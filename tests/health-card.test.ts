import { describe, it, expect, afterEach } from 'vitest';
import '../src/cards/health-card';
import type { InvestmentHealthCard } from '../src/cards/health-card';
import { entity, mockHass, mount, shadow, text } from './helpers/dom';

const fullStates = {
  'sensor.trading212_total_value': entity('15690.00'),
  'sensor.trading212_invested': entity('14890.00'),
  'sensor.trading212_unrealized_pnl': entity('600.00'),
  'sensor.trading212_result_percent': entity('4.03'),
  'sensor.trading212_daily_gain_loss': entity('87.30'),
  'sensor.trading212_daily_gain_loss_percent': entity('1.52'),
  'sensor.trading212_cash_available': entity('200.00'),
  'sensor.trading212_total_dividends': entity('42.18'),
  'sensor.trading212_top_daily_mover': entity('Apple', { change_pct: 3.7 }),
  'sensor.trading212_bottom_daily_mover': entity('WisdomTree', { change_pct: -2.1 }),
};

let mounted: InvestmentHealthCard[] = [];

afterEach(() => {
  mounted.forEach((el) => el.remove());
  mounted = [];
});

async function renderCard(states: Record<string, ReturnType<typeof entity>>, config: Record<string, unknown> = {}) {
  const el = await mount<InvestmentHealthCard>('investment-health-card', {
    hass: mockHass(states),
    config,
  });
  mounted.push(el);
  return shadow(el);
}

describe('investment-health-card', () => {
  it('renders the hero value, all-time sub-line, today row, and footer stats', async () => {
    const root = await renderCard(fullStates);
    expect(text(root.querySelector('.hero-value'))).toBe('15,690');
    expect(text(root.querySelector('.hero-sub'))).toBe('+600 · +4.03% all time');
    expect(text(root.querySelector('.today-value'))).toBe('+87.3');
    expect(text(root.querySelector('.today-pct'))).toBe('+1.52%');
    const footerLabels = Array.from(root.querySelectorAll('.footer-label')).map((n) => text(n));
    expect(footerLabels).toEqual(['Invested', 'Cash', 'Dividends']);
  });

  it('renders a sparkline sourced from total_value', async () => {
    const root = await renderCard(fullStates);
    const spark = root.querySelector('investment-sparkline');
    expect(spark).not.toBeNull();
    expect((spark as unknown as { entityId: string }).entityId).toBe('sensor.trading212_total_value');
  });

  it('renders both mover lines when both mover entities are present', async () => {
    const root = await renderCard(fullStates);
    const lines = root.querySelectorAll('.mover-line');
    expect(lines.length).toBe(2);
    expect(text(lines[0])).toContain('Apple');
    expect(text(lines[0])).toContain('+3.70%');
    expect(text(lines[1])).toContain('WisdomTree');
    expect(text(lines[1])).toContain('-2.10%');
  });

  it('omits the entire movers block when neither mover entity exists', async () => {
    const {
      'sensor.trading212_top_daily_mover': _t,
      'sensor.trading212_bottom_daily_mover': _b,
      ...rest
    } = fullStates as Record<string, ReturnType<typeof entity>>;
    const root = await renderCard(rest);
    expect(root.querySelector('.movers')).toBeNull();
  });

  it('omits the all-time sub-line when unrealized_pnl is unavailable', async () => {
    const states = { ...fullStates, 'sensor.trading212_unrealized_pnl': entity('unavailable') };
    const root = await renderCard(states);
    expect(root.querySelector('.hero-sub')).toBeNull();
  });

  it('omits the sparkline in manual-mapping mode with no currency_sensor (no total_value entity)', async () => {
    const root = await renderCard({}, { positions: [] });
    expect(root.querySelector('investment-sparkline')).toBeNull();
    expect(text(root.querySelector('.hero-value'))).toBe('—');
  });
});
