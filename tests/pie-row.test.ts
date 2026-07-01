import { describe, it, expect, afterEach } from 'vitest';
import '../src/components/pie-row';
import type { InvestmentPieRow } from '../src/components/pie-row';
import type { ResolvedPie } from '../src/config/types';
import { entity, mockHass, mount, shadow, text } from './helpers/dom';

const basePie: ResolvedPie = {
  id: 'growth_pie',
  name: 'Growth Pie',
  value: 'sensor.t212_growth_value',
  pnl: 'sensor.t212_growth_pnl',
  pnl_percent: 'sensor.t212_growth_pnl_pct',
  invested: 'sensor.t212_growth_invested',
  cash: 'sensor.t212_growth_cash',
  progress: 'sensor.t212_growth_progress',
  goal: 'sensor.t212_growth_goal',
  dividends_gained: 'sensor.t212_growth_div_gained',
  dividends_in_cash: 'sensor.t212_growth_div_cash',
  dividends_reinvested: 'sensor.t212_growth_div_reinvested',
};

const fullStates = {
  'sensor.t212_growth_value': entity('2000'),
  'sensor.t212_growth_pnl': entity('200'),
  'sensor.t212_growth_pnl_pct': entity('11.11'),
  'sensor.t212_growth_invested': entity('1800'),
  'sensor.t212_growth_cash': entity('50'),
  'sensor.t212_growth_progress': entity('40'),
  'sensor.t212_growth_goal': entity('5000'),
  'sensor.t212_growth_div_gained': entity('20'),
  'sensor.t212_growth_div_cash': entity('10'),
  'sensor.t212_growth_div_reinvested': entity('10'),
};

let mounted: InvestmentPieRow[] = [];

afterEach(() => {
  mounted.forEach((el) => el.remove());
  mounted = [];
});

async function renderRow(pie: ResolvedPie, states: typeof fullStates, expanded = false) {
  const el = await mount<InvestmentPieRow>('investment-pie-row', {
    hass: mockHass(states),
    pie,
    expanded,
  });
  mounted.push(el);
  return shadow(el);
}

describe('investment-pie-row — full data', () => {
  it('renders name, progress bar, value, and pnl%', async () => {
    const root = await renderRow(basePie, fullStates);
    expect(text(root.querySelector('.item-name'))).toBe('Growth Pie');
    expect(root.querySelector('.progress-bar-track')).not.toBeNull();
    expect((root.querySelector('.progress-bar-fill') as HTMLElement).style.width).toBe('40%');
    expect(text(root.querySelector('.item-value'))).toBe('2,000');
    expect(text(root.querySelector('.item-pnl'))).toBe('11.11%');
  });

  it('renders all seven expand-panel tiles when expanded', async () => {
    const root = await renderRow(basePie, fullStates, true);
    const labels = Array.from(root.querySelectorAll('.expand-label')).map((n) => text(n));
    expect(labels).toEqual([
      'Invested', 'Cash', 'Goal', 'Progress',
      'Dividends Gained', 'Dividends Reinvested', 'Dividends in Cash',
    ]);
  });

  it('does not render the expand panel when collapsed', async () => {
    const root = await renderRow(basePie, fullStates, false);
    expect(root.querySelector('.expand-panel')).toBeNull();
  });
});

describe('investment-pie-row — disabled sensors are omitted, not dashed', () => {
  it('omits the progress bar entirely when progress is undefined', async () => {
    const pie: ResolvedPie = { ...basePie, progress: undefined };
    const root = await renderRow(pie, fullStates);
    expect(root.querySelector('.progress-bar-track')).toBeNull();
  });

  it('omits the value chip when value is undefined', async () => {
    const pie: ResolvedPie = { ...basePie, value: undefined };
    const root = await renderRow(pie, fullStates);
    expect(root.querySelector('.item-value')).toBeNull();
  });

  it('omits the pnl% chip when pnl_percent is undefined (does not fall back to pnl)', async () => {
    const pie: ResolvedPie = { ...basePie, pnl_percent: undefined };
    const root = await renderRow(pie, fullStates);
    expect(root.querySelector('.item-pnl')).toBeNull();
  });

  it('omits individual expand-panel tiles for each undefined field, including a no-longer-computed Progress row', async () => {
    const pie: ResolvedPie = {
      ...basePie,
      cash: undefined,
      goal: undefined,
      progress: undefined,
      dividends_in_cash: undefined,
    };
    const root = await renderRow(pie, fullStates, true);
    const labels = Array.from(root.querySelectorAll('.expand-label')).map((n) => text(n));
    expect(labels).toEqual(['Invested', 'Dividends Gained', 'Dividends Reinvested']);
  });
});

describe('investment-pie-row — "—" is reserved for transient unavailability', () => {
  it('shows a plain "—" rather than "—%" when pnl_percent is unavailable', async () => {
    const states = { ...fullStates, 'sensor.t212_growth_pnl_pct': entity('unavailable') };
    const root = await renderRow(basePie, states);
    expect(text(root.querySelector('.item-pnl'))).toBe('—');
  });

  it('shows "—" for an expand-panel tile whose sensor is unavailable', async () => {
    const states = { ...fullStates, 'sensor.t212_growth_invested': entity('unavailable') };
    const root = await renderRow(basePie, states, true);
    const values = root.querySelectorAll('.expand-value');
    expect(text(values[0])).toBe('—');
  });
});
