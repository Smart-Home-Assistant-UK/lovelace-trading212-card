import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { sharedStyles } from '../styles/shared';
import type { HomeAssistant, ResolvedPie } from '../config/types';

function fmt(hass: HomeAssistant, entityId: string | undefined): string {
  if (!entityId) return '—';
  const s = hass.states[entityId]?.state;
  if (!s || s === 'unavailable' || s === 'unknown') return '—';
  const n = parseFloat(s);
  return isNaN(n) ? s : n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function pnlCls(hass: HomeAssistant, entityId: string | undefined): string {
  if (!entityId) return '';
  const n = parseFloat(hass.states[entityId]?.state ?? '');
  if (isNaN(n)) return '';
  return n >= 0 ? 'positive' : 'negative';
}

function progress(hass: HomeAssistant, entityId: string | undefined): number {
  if (!entityId) return 0;
  return Math.min(100, Math.max(0, parseFloat(hass.states[entityId]?.state ?? '0') || 0));
}

@customElement('investment-pie-row')
export class InvestmentPieRow extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) pie!: ResolvedPie;
  @property({ type: Boolean }) expanded = false;

  static styles = [sharedStyles];

  private _toggle() {
    this.dispatchEvent(new CustomEvent('toggle-expand', { bubbles: true, composed: true }));
  }

  render() {
    const { pie: p, hass } = this;
    const pct = progress(hass, p.progress);
    return html`
      <div class="list-item" @click=${this._toggle}>
        <div class="item-main">
          <div class="item-name">${p.name}</div>
          ${p.progress !== undefined
            ? html`
            <div class="progress-bar-track">
              <div class="progress-bar-fill" style="width:${pct}%"></div>
            </div>`
            : nothing}
        </div>
        ${p.value !== undefined
          ? html`<div class="item-value">${fmt(hass, p.value)}</div>`
          : nothing}
        ${p.pnl_percent !== undefined
          ? html`
            <div class="item-pnl ${pnlCls(hass, p.pnl_percent)}">${
              fmt(hass, p.pnl_percent) === '—' ? '—' : `${fmt(hass, p.pnl_percent)}%`
            }</div>`
          : nothing}
      </div>
      ${this.expanded
        ? html`
        <div class="expand-panel">
          ${p.invested !== undefined
            ? html`
            <div class="expand-stat">
              <span class="expand-label">Invested</span>
              <span class="expand-value">${fmt(hass, p.invested)}</span>
            </div>`
            : nothing}
          ${p.cash !== undefined
            ? html`
            <div class="expand-stat">
              <span class="expand-label">Cash</span>
              <span class="expand-value">${fmt(hass, p.cash)}</span>
            </div>`
            : nothing}
          ${p.goal !== undefined
            ? html`
            <div class="expand-stat">
              <span class="expand-label">Goal</span>
              <span class="expand-value">${fmt(hass, p.goal)}</span>
            </div>`
            : nothing}
          ${p.progress !== undefined
            ? html`
            <div class="expand-stat">
              <span class="expand-label">Progress</span>
              <span class="expand-value">${pct.toFixed(1)}%</span>
            </div>`
            : nothing}
          ${p.dividends_gained !== undefined
            ? html`
            <div class="expand-stat">
              <span class="expand-label">Dividends Gained</span>
              <span class="expand-value">${fmt(hass, p.dividends_gained)}</span>
            </div>`
            : nothing}
          ${p.dividends_reinvested !== undefined
            ? html`
            <div class="expand-stat">
              <span class="expand-label">Dividends Reinvested</span>
              <span class="expand-value">${fmt(hass, p.dividends_reinvested)}</span>
            </div>`
            : nothing}
          ${p.dividends_in_cash !== undefined
            ? html`
            <div class="expand-stat">
              <span class="expand-label">Dividends in Cash</span>
              <span class="expand-value">${fmt(hass, p.dividends_in_cash)}</span>
            </div>`
            : nothing}
        </div>`
        : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'investment-pie-row': InvestmentPieRow;
  }
}
