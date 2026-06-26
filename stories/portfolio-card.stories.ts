import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { mockHass, emptyHass } from './mock-hass';
import type { RawCardConfig } from '../src/config/types';

const meta: Meta = { title: 'Cards/Portfolio' };
export default meta;

function render(hass: typeof mockHass, config: RawCardConfig = {}) {
  return html`
    <investment-portfolio-card
      .hass=${hass}
      .config=${config}
    ></investment-portfolio-card>`;
}

export const Default: StoryObj = { render: () => render(mockHass) };
export const OverviewOnly: StoryObj = {
  render: () => render(mockHass, { show_positions: false, show_pies: false }),
};
export const Empty: StoryObj = { render: () => render(emptyHass) };
