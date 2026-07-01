import { describe, it, expect, afterEach } from 'vitest';
import '../src/cards/overview-card';
import type { InvestmentOverviewCard } from '../src/cards/overview-card';
import { entity, mockHass, mount, shadow, text } from './helpers/dom';

const fullStates = {
  'sensor.trading212_total_value': entity('5823.40'),
  'sensor.trading212_invested': entity('4750.00'),
  'sensor.trading212_unrealized_pnl': entity('1073.40'),
  'sensor.trading212_result_percent': entity('22.60'),
  'sensor.trading212_daily_gain_loss': entity('-87.30'),
  'sensor.trading212_daily_gain_loss_percent': entity('-1.52'),
  'sensor.trading212_cash_available': entity('200.00'),
  'sensor.trading212_total_dividends': entity('42.18'),
  'sensor.trading212_top_daily_mover': entity('Apple', { change_value: 62.5, change_pct: 3.7 }),
  'sensor.trading212_bottom_daily_mover': entity('WisdomTree', { change_value: -12.8, change_pct: -2.1 }),
};

let mounted: InvestmentOverviewCard[] = [];

afterEach(() => {
  mounted.forEach((el) => el.remove());
  mounted = [];
});

async function renderCard(states: Record<string, ReturnType<typeof entity>>, config: Record<string, unknown> = {}) {
  const el = await mount<InvestmentOverviewCard>('investment-overview-card', {
    hass: mockHass(states),
    config,
  });
  mounted.push(el);
  return shadow(el);
}

describe('investment-overview-card', () => {
  it('renders all 8 account stat chips with formatted values', async () => {
    const root = await renderCard(fullStates);
    const labels = Array.from(root.querySelectorAll('.stat-label')).map((n) => text(n));
    expect(labels).toEqual([
      'Total Value', 'Invested', 'Unrealised P&L', 'Return %',
      "Today's P&L", 'Today %', 'Cash', 'Dividends',
    ]);
    const values = Array.from(root.querySelectorAll('.stat-value')).map((n) => text(n));
    expect(values[0]).toBe('5,823.4');
  });

  it('colors signed chips by the sign of their value, and leaves unsigned chips uncolored', async () => {
    const root = await renderCard(fullStates);
    const values = root.querySelectorAll('.stat-value');
    // Total Value is unsigned.
    expect(values[0].classList.contains('positive')).toBe(false);
    expect(values[0].classList.contains('negative')).toBe(false);
    // Unrealised P&L is signed and positive here.
    expect(values[2].classList.contains('positive')).toBe(true);
    // Today's P&L is signed and negative here.
    expect(values[4].classList.contains('negative')).toBe(true);
  });

  it('shows "—" for a chip whose sensor exists but is unavailable', async () => {
    const states = { ...fullStates, 'sensor.trading212_cash_available': entity('unavailable') };
    const root = await renderCard(states);
    const values = Array.from(root.querySelectorAll('.stat-value')).map((n) => text(n));
    expect(values[6]).toBe('—');
  });

  it('renders the mover change line when mover attributes are present', async () => {
    const root = await renderCard(fullStates);
    const changes = Array.from(root.querySelectorAll('.mover-change')).map((n) => text(n));
    expect(changes[0]).toBe('+62.50 (3.70%)');
    expect(changes[1]).toBe('-12.80 (-2.10%)');
  });

  it('shows mover chip labels with a "—" name but omits the change line when mover entities do not exist', async () => {
    const {
      'sensor.trading212_top_daily_mover': _t,
      'sensor.trading212_bottom_daily_mover': _b,
      ...rest
    } = fullStates as Record<string, ReturnType<typeof entity>>;
    const root = await renderCard(rest);
    expect(root.querySelectorAll('.mover-change').length).toBe(0);
    const names = Array.from(root.querySelectorAll('.mover-name')).map((n) => text(n));
    expect(names).toEqual(['—', '—']);
    // The chip itself (label) still renders — account-level movers are
    // never individually user-deselectable, so there's nothing to hide.
    const labels = Array.from(root.querySelectorAll('.mover-label')).map((n) => text(n));
    expect(labels).toEqual(['Top Mover', 'Bottom Mover']);
  });

  it('omits every stat chip in manual-mapping mode with no currency_sensor configured', async () => {
    // account resolves to {} when using explicit positions/pies mapping
    // without a currency_sensor override.
    const root = await renderCard({}, { positions: [] });
    expect(root.querySelectorAll('.stat-chip').length).toBe(0);
  });
});
