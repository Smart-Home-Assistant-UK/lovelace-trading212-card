import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { mockHass, emptyHass, partialSensorsHass } from './mock-hass';
import type { RawCardConfig } from '../src/config/types';

const meta: Meta = { title: 'Cards/Allocation' };
export default meta;

function render(hass: typeof mockHass, config: RawCardConfig = {}) {
  return html`
    <investment-allocation-card
      .hass=${hass}
      .config=${config}
    ></investment-allocation-card>`;
}

export const Positions: StoryObj = { render: () => render(mockHass) };
export const Pies: StoryObj = { render: () => render(mockHass, { mode: 'pies' } as RawCardConfig) };
export const PieFiltered: StoryObj = {
  render: () => render(mockHass, { mode: 'positions', pie: 'growth_pie' } as RawCardConfig),
};
export const Empty: StoryObj = { render: () => render(emptyHass) };
// Growth pie has a value sensor but no pnl_percent sensor selected — the
// cell should size correctly but show no P&L badge (not a misleading 0%).
export const PartialSensors: StoryObj = {
  render: () => render(partialSensorsHass, { mode: 'pies' } as RawCardConfig),
};
