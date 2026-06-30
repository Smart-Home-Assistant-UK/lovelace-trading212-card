import { LitElement, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { sharedStyles } from '../styles/shared';
import { resolveConfig } from '../data/sensor-resolver';
import type { HomeAssistant, RawCardConfig } from '../config/types';
import '../components/pie-row';

@customElement('investment-pies-card')
export class InvestmentPiesCard extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) config: RawCardConfig = {};
  @state() private _expanded: string | null = null;

  static styles = [sharedStyles];

  setConfig(config: RawCardConfig) { this.config = config; }
  getCardSize() { return 4; }

  render() {
    if (!this.hass) return nothing;
    const { pies, maxHeight } = resolveConfig(this.config, this.hass.states);
    if (pies.length === 0) {
      return html`<ha-card><div class="warning">
        No pies found. Check your sensor prefix or mapping.
      </div></ha-card>`;
    }
    return html`
      <ha-card>
        <div class="list-container" style="max-height:${maxHeight}">
          ${pies.map((pie) => html`
            <investment-pie-row
              .hass=${this.hass}
              .pie=${pie}
              .expanded=${this._expanded === pie.id}
              @toggle-expand=${() => {
                this._expanded = this._expanded === pie.id ? null : pie.id;
              }}
            ></investment-pie-row>`)}
        </div>
      </ha-card>`;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'investment-pies-card': InvestmentPiesCard; }
}
