import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { mockHass, emptyHass } from './mock-hass';

const meta: Meta = { title: 'Cards/Pies' };
export default meta;

function render(hass: typeof mockHass) {
  return html`
    <investment-pies-card
      .hass=${hass}
      .config=${{}}
    ></investment-pies-card>`;
}

export const Default: StoryObj = { render: () => render(mockHass) };
export const NoPies: StoryObj = { render: () => render(emptyHass) };
