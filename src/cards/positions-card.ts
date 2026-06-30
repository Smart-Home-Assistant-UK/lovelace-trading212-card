import { LitElement, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { sharedStyles } from '../styles/shared';
import { resolveConfig } from '../data/sensor-resolver';
import type { HomeAssistant, RawCardConfig } from '../config/types';
import '../components/position-row';

@customElement('investment-positions-card')
export class InvestmentPositionsCard extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) config: RawCardConfig = {};
  @state() private _expanded: string | null = null;

  static styles = [sharedStyles];

  setConfig(config: RawCardConfig) { this.config = config; }
  getCardSize() { return 5; }

  render() {
    if (!this.hass) return nothing;
    const { positions, maxHeight } = resolveConfig(this.config, this.hass.states);
    if (positions.length === 0) {
      return html`<ha-card><div class="warning">
        No positions found. Check your sensor prefix or mapping.
      </div></ha-card>`;
    }
    return html`
      <ha-card>
        <div class="list-container" style="max-height:${maxHeight}">
          ${positions.map((pos) => html`
            <investment-position-row
              .hass=${this.hass}
              .position=${pos}
              .expanded=${this._expanded === pos.id}
              @toggle-expand=${() => {
                this._expanded = this._expanded === pos.id ? null : pos.id;
              }}
            ></investment-position-row>`)}
        </div>
      </ha-card>`;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'investment-positions-card': InvestmentPositionsCard; }
}
