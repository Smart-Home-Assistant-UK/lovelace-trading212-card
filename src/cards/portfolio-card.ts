import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { sharedStyles } from '../styles/shared';
import { resolveConfig } from '../data/sensor-resolver';
import type { HomeAssistant, RawCardConfig } from '../config/types';
import './overview-card';
import './positions-card';
import './pies-card';

@customElement('investment-portfolio-card')
export class InvestmentPortfolioCard extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) config: RawCardConfig = {};

  static styles = [sharedStyles];

  setConfig(config: RawCardConfig) { this.config = config; }
  getCardSize() { return 12; }

  render() {
    if (!this.hass) return nothing;
    const { showOverview, showPositions, showPies } = resolveConfig(this.config, this.hass.states);
    return html`
      ${showOverview ? html`<investment-overview-card
        .hass=${this.hass} .config=${this.config}></investment-overview-card>` : nothing}
      ${showPositions ? html`<investment-positions-card
        .hass=${this.hass} .config=${this.config}></investment-positions-card>` : nothing}
      ${showPies ? html`<investment-pies-card
        .hass=${this.hass} .config=${this.config}></investment-pies-card>` : nothing}`;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'investment-portfolio-card': InvestmentPortfolioCard; }
}
