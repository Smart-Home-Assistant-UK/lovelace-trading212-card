import { describe, it, expect, afterEach } from 'vitest';
import '../src/components/position-row';
import type { InvestmentPositionRow } from '../src/components/position-row';
import type { ResolvedPosition } from '../src/config/types';
import { entity, mockHass, mount, shadow, text } from './helpers/dom';

const basePosition: ResolvedPosition = {
  id: 'aapl_us_eq',
  name: 'Apple',
  ticker: 'AAPL_US_EQ',
  value: 'sensor.t212_aapl_value',
  pnl: 'sensor.t212_aapl_pnl',
  pnl_percent: 'sensor.t212_aapl_pnl_pct',
  quantity: 'sensor.t212_aapl_qty',
  avg_price: 'sensor.t212_aapl_avg',
  current_price: 'sensor.t212_aapl_price',
  daily_gain_loss: 'sensor.t212_aapl_daily',
  daily_gain_loss_percent: 'sensor.t212_aapl_daily_pct',
  history_entity: 'sensor.t212_aapl_value',
};

const fullStates = {
  'sensor.t212_aapl_value': entity('1750'),
  'sensor.t212_aapl_pnl': entity('250'),
  'sensor.t212_aapl_pnl_pct': entity('16.67'),
  'sensor.t212_aapl_qty': entity('10'),
  'sensor.t212_aapl_avg': entity('150'),
  'sensor.t212_aapl_price': entity('175'),
  'sensor.t212_aapl_daily': entity('12.5'),
  'sensor.t212_aapl_daily_pct': entity('0.8'),
};

let mounted: InvestmentPositionRow[] = [];

afterEach(() => {
  mounted.forEach((el) => el.remove());
  mounted = [];
});

async function renderRow(position: ResolvedPosition, states: typeof fullStates, expanded = false) {
  const el = await mount<InvestmentPositionRow>('investment-position-row', {
    hass: mockHass(states),
    position,
    expanded,
  });
  mounted.push(el);
  return shadow(el);
}

describe('investment-position-row — full data', () => {
  it('renders name, ticker, value, pnl, and a collapsed sparkline', async () => {
    const root = await renderRow(basePosition, fullStates);
    expect(text(root.querySelector('.item-name'))).toBe('Apple');
    expect(text(root.querySelector('.item-ticker'))).toBe('AAPL_US_EQ');
    expect(text(root.querySelector('.item-value'))).toBe('1,750');
    expect(root.querySelector('investment-sparkline')).not.toBeNull();
  });

  it('renders both pnl and pnl_percent with a line break between them', async () => {
    const root = await renderRow(basePosition, fullStates);
    const pnlEl = root.querySelector('.item-pnl');
    expect(pnlEl).not.toBeNull();
    expect(pnlEl!.innerHTML).toContain('<br>');
    expect(text(pnlEl)).toContain('250');
    expect(text(pnlEl)).toContain('16.67%');
    expect(pnlEl!.classList.contains('positive')).toBe(true);
  });

  it('does not render the expand panel when collapsed', async () => {
    const root = await renderRow(basePosition, fullStates, false);
    expect(root.querySelector('.expand-panel')).toBeNull();
  });

  it('renders every expand-panel tile, including the new daily P&L tiles, when expanded', async () => {
    const root = await renderRow(basePosition, fullStates, true);
    const panel = root.querySelector('.expand-panel');
    expect(panel).not.toBeNull();
    const labels = Array.from(panel!.querySelectorAll('.expand-label')).map((n) => text(n));
    expect(labels).toEqual([
      'Quantity',
      'Avg Price',
      'Current Price',
      "Today's P&L",
      "Today's P&L %",
    ]);
    // Wide sparkline in the expand panel
    expect(panel!.querySelector('investment-sparkline')).not.toBeNull();
  });

  it("colors the daily P&L tiles independently by their own sign", async () => {
    const states = { ...fullStates, 'sensor.t212_aapl_daily': entity('-4.2'), 'sensor.t212_aapl_daily_pct': entity('-0.3') };
    const root = await renderRow(basePosition, states, true);
    const values = root.querySelectorAll('.expand-panel .expand-value');
    // Quantity, Avg Price, Current Price, Today's P&L, Today's P&L %
    const todaysPnl = values[3];
    const todaysPnlPct = values[4];
    expect(todaysPnl.classList.contains('negative')).toBe(true);
    expect(todaysPnlPct.classList.contains('negative')).toBe(true);
  });

  it('dispatches a toggle-expand event when the row is clicked', async () => {
    const root = await renderRow(basePosition, fullStates);
    const el = mounted[mounted.length - 1];
    let fired = false;
    el.addEventListener('toggle-expand', () => { fired = true; });
    (root.querySelector('.list-item') as HTMLElement).click();
    expect(fired).toBe(true);
  });
});

describe('investment-position-row — disabled sensors are omitted, not dashed', () => {
  it('omits the value chip entirely when value is undefined', async () => {
    const position: ResolvedPosition = { ...basePosition, value: undefined, history_entity: undefined };
    const root = await renderRow(position, fullStates);
    expect(root.querySelector('.item-value')).toBeNull();
  });

  it('omits the pnl block entirely when both pnl and pnl_percent are undefined', async () => {
    const position: ResolvedPosition = { ...basePosition, pnl: undefined, pnl_percent: undefined };
    const root = await renderRow(position, fullStates);
    expect(root.querySelector('.item-pnl')).toBeNull();
  });

  it('renders only the pnl_percent line, with no stray <br>, when pnl is undefined', async () => {
    const position: ResolvedPosition = { ...basePosition, pnl: undefined };
    const root = await renderRow(position, fullStates);
    const pnlEl = root.querySelector('.item-pnl');
    expect(pnlEl).not.toBeNull();
    expect(pnlEl!.innerHTML).not.toContain('<br>');
    expect(text(pnlEl)).toBe('16.67%');
  });

  it('derives the pnl color from pnl_percent when pnl is undefined', async () => {
    const position: ResolvedPosition = { ...basePosition, pnl: undefined };
    const states = { ...fullStates, 'sensor.t212_aapl_pnl_pct': entity('-3.2') };
    const root = await renderRow(position, states);
    expect(root.querySelector('.item-pnl')!.classList.contains('negative')).toBe(true);
  });

  it('omits the sparkline entirely when history_entity is undefined', async () => {
    const position: ResolvedPosition = { ...basePosition, history_entity: undefined };
    const root = await renderRow(position, fullStates);
    expect(root.querySelector('investment-sparkline')).toBeNull();
  });

  it('omits the ticker line when ticker is undefined (manual-mapping mode)', async () => {
    const position: ResolvedPosition = { ...basePosition, ticker: undefined };
    const root = await renderRow(position, fullStates);
    expect(root.querySelector('.item-ticker')).toBeNull();
  });

  it('omits individual expand-panel tiles for each undefined field', async () => {
    const position: ResolvedPosition = {
      ...basePosition,
      quantity: undefined,
      current_price: undefined,
      daily_gain_loss: undefined,
      daily_gain_loss_percent: undefined,
    };
    const root = await renderRow(position, fullStates, true);
    const labels = Array.from(root.querySelectorAll('.expand-label')).map((n) => text(n));
    expect(labels).toEqual(['Avg Price']);
  });

  it('renders an empty expand panel (no tiles, no sparkline) when every optional field is undefined', async () => {
    const position: ResolvedPosition = {
      id: 'x', name: 'X', ticker: undefined,
      value: undefined, pnl: undefined, pnl_percent: undefined,
      quantity: undefined, avg_price: undefined, current_price: undefined,
      daily_gain_loss: undefined, daily_gain_loss_percent: undefined,
      history_entity: undefined,
    };
    const root = await renderRow(position, fullStates, true);
    const panel = root.querySelector('.expand-panel');
    expect(panel).not.toBeNull();
    expect(panel!.children.length).toBe(0);
  });
});

describe('investment-position-row — "—" is reserved for transient unavailability', () => {
  it('shows "—" (not omitted) when a selected sensor exists but is unavailable', async () => {
    const states = { ...fullStates, 'sensor.t212_aapl_value': entity('unavailable') };
    const root = await renderRow(basePosition, states);
    expect(root.querySelector('.item-value')).not.toBeNull();
    expect(text(root.querySelector('.item-value'))).toBe('—');
  });

  it('shows a plain "—" rather than "—%" when pnl_percent is unavailable', async () => {
    const states = { ...fullStates, 'sensor.t212_aapl_pnl_pct': entity('unavailable') };
    const root = await renderRow(basePosition, states);
    const pnlEl = root.querySelector('.item-pnl');
    expect(text(pnlEl)).not.toContain('—%');
    expect(text(pnlEl)).toContain('—');
  });
});
