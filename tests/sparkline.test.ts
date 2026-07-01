import { describe, it, expect, afterEach } from 'vitest';
import '../src/components/sparkline';
import type { InvestmentSparkline } from '../src/components/sparkline';
import type { HomeAssistant } from '../src/config/types';

let mounted: InvestmentSparkline[] = [];

afterEach(() => {
  mounted.forEach((el) => el.remove());
  mounted = [];
});

function hassWithHistory(points: string[] | 'error'): HomeAssistant {
  return {
    states: {},
    callApi: (async () => {
      if (points === 'error') throw new Error('boom');
      return [points.map((state) => ({ state, last_changed: new Date().toISOString() }))];
    }) as HomeAssistant['callApi'],
  };
}

async function flush() {
  await new Promise((r) => setTimeout(r, 0));
}

async function renderSparkline(props: Record<string, unknown>) {
  const el = document.createElement('investment-sparkline') as InvestmentSparkline;
  Object.assign(el, props);
  document.body.appendChild(el);
  await el.updateComplete;
  await flush();
  await el.updateComplete;
  mounted.push(el);
  return el.shadowRoot!;
}

describe('investment-sparkline', () => {
  it('renders nothing when the history API returns fewer than 2 points', async () => {
    const root = await renderSparkline({
      hass: hassWithHistory(['100']),
      entityId: 'sensor.trading212_total_value',
    });
    expect(root.querySelector('svg')).toBeNull();
  });

  it('renders nothing when the entity id is empty (no fetch attempted)', async () => {
    const root = await renderSparkline({ hass: hassWithHistory(['100', '110']), entityId: '' });
    expect(root.querySelector('svg')).toBeNull();
  });

  it('renders nothing and does not throw when the history API errors', async () => {
    const root = await renderSparkline({
      hass: hassWithHistory('error'),
      entityId: 'sensor.trading212_total_value',
    });
    expect(root.querySelector('svg')).toBeNull();
  });

  it('renders an svg path when there are 2 or more valid points', async () => {
    const root = await renderSparkline({
      hass: hassWithHistory(['100', '105', '98', '110']),
      entityId: 'sensor.trading212_total_value',
    });
    const svg = root.querySelector('svg');
    expect(svg).not.toBeNull();
    const path = svg!.querySelector('path')!.getAttribute('d');
    expect(path).toMatch(/^M /);
  });

  it('ignores non-numeric points from the history payload', async () => {
    const root = await renderSparkline({
      hass: hassWithHistory(['100', 'unavailable', '105', 'unknown', '110']),
      entityId: 'sensor.trading212_total_value',
    });
    expect(root.querySelector('svg')).not.toBeNull();
  });

  it('uses green stroke when the series ends higher than it started', async () => {
    const root = await renderSparkline({
      hass: hassWithHistory(['100', '90', '120']),
      entityId: 'sensor.trading212_total_value',
    });
    const stroke = root.querySelector('path')!.getAttribute('stroke');
    expect(stroke).toContain('--success-color');
  });

  it('uses red stroke when the series ends lower than it started', async () => {
    const root = await renderSparkline({
      hass: hassWithHistory(['100', '110', '80']),
      entityId: 'sensor.trading212_total_value',
    });
    const stroke = root.querySelector('path')!.getAttribute('stroke');
    expect(stroke).toContain('--error-color');
  });

  it('defaults to a narrow 60x28 size when not wide and no explicit dimensions', async () => {
    const root = await renderSparkline({
      hass: hassWithHistory(['100', '110']),
      entityId: 'sensor.trading212_total_value',
    });
    const svg = root.querySelector('svg')!;
    expect(svg.getAttribute('width')).toBe('60');
    expect(svg.getAttribute('height')).toBe('28');
  });

  it('defaults to a wide 200x60 size when wide is set', async () => {
    const root = await renderSparkline({
      hass: hassWithHistory(['100', '110']),
      entityId: 'sensor.trading212_total_value',
      wide: true,
    });
    const svg = root.querySelector('svg')!;
    expect(svg.getAttribute('width')).toBe('200');
    expect(svg.getAttribute('height')).toBe('60');
  });

  it('honors explicit width/height props over the wide default', async () => {
    const root = await renderSparkline({
      hass: hassWithHistory(['100', '110']),
      entityId: 'sensor.trading212_total_value',
      width: 460,
      height: 72,
    });
    const svg = root.querySelector('svg')!;
    expect(svg.getAttribute('width')).toBe('460');
    expect(svg.getAttribute('height')).toBe('72');
  });
});
