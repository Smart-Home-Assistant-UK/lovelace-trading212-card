import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { mockHass, unavailableHass, emptyHass, partialSensorsHass } from './mock-hass';

const meta: Meta = { title: 'Cards/Positions' };
export default meta;

function render(hass: typeof mockHass) {
  return html`
    <investment-positions-card
      .hass=${hass}
      .config=${{}}
    ></investment-positions-card>`;
}

export const Default: StoryObj = { render: () => render(mockHass) };
export const AllUnavailable: StoryObj = { render: () => render(unavailableHass) };
export const NoPositions: StoryObj = { render: () => render(emptyHass) };
export const PartialSensors: StoryObj = { render: () => render(partialSensorsHass) };
