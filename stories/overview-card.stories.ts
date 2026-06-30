import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { mockHass, unavailableHass, emptyHass, noMoversHass } from './mock-hass';

const meta: Meta = { title: 'Cards/Overview' };
export default meta;

function render(hass: typeof mockHass) {
  return html`
    <investment-overview-card
      .hass=${hass}
      .config=${{}}
    ></investment-overview-card>`;
}

export const Default: StoryObj = { render: () => render(mockHass) };
export const AllUnavailable: StoryObj = { render: () => render(unavailableHass) };
export const NoSensors: StoryObj = { render: () => render(emptyHass) };
export const NoMovers: StoryObj = { render: () => render(noMoversHass) };
