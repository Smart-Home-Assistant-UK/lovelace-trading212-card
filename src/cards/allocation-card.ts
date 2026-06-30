import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { sharedStyles } from '../styles/shared';
import { resolveConfig } from '../data/sensor-resolver';
import type { HomeAssistant, RawCardConfig } from '../config/types';

// --- Squarified treemap ---

interface Rect { x: number; y: number; w: number; h: number; }

function worstRatio(row: number[], rowSum: number, short: number): number {
  let worst = 0;
  for (const v of row) {
    const r = Math.max(
      (short * short * v) / (rowSum * rowSum),
      (rowSum * rowSum) / (short * short * v),
    );
    if (r > worst) worst = r;
  }
  return worst;
}

function squarify(
  items: Array<{ value: number; idx: number }>,
  total: number,
  x: number, y: number, w: number, h: number,
  out: Rect[],
): void {
  if (!items.length || w <= 0 || h <= 0) return;
  if (items.length === 1) { out[items[0].idx] = { x, y, w, h }; return; }

  const short = Math.min(w, h);
  let row: number[] = [];
  let rowSum = 0;
  let cutAt = 0;

  for (let i = 0; i < items.length; i++) {
    const v = items[i].value;
    const newRow = [...row, v];
    const newSum = rowSum + v;
    if (row.length === 0 || worstRatio(newRow, newSum, short) <= worstRatio(row, rowSum, short)) {
      row = newRow; rowSum = newSum; cutAt = i + 1;
    } else break;
  }

  const isWide = w >= h;
  const long = isWide ? w : h;
  const stripLong = (rowSum / total) * long;

  if (isWide) {
    let cy = y;
    for (let i = 0; i < cutAt; i++) {
      out[items[i].idx] = { x, y: cy, w: stripLong, h: h * (items[i].value / rowSum) };
      cy += h * (items[i].value / rowSum);
    }
    squarify(items.slice(cutAt), total - rowSum, x + stripLong, y, w - stripLong, h, out);
  } else {
    let cx = x;
    for (let i = 0; i < cutAt; i++) {
      out[items[i].idx] = { x: cx, y, w: w * (items[i].value / rowSum), h: stripLong };
      cx += w * (items[i].value / rowSum);
    }
    squarify(items.slice(cutAt), total - rowSum, x, y + stripLong, w, h - stripLong, out);
  }
}

function computeTreemap(values: number[], w: number, h: number): Rect[] {
  if (!values.length || w <= 0 || h <= 0) return [];
  const total = values.reduce((s, v) => s + v, 0);
  if (total === 0) return values.map(() => ({ x: 0, y: 0, w: 0, h: 0 }));
  const area = w * h;
  const items = values
    .map((v, idx) => ({ idx, value: (v / total) * area }))
    .sort((a, b) => b.value - a.value);
  const out: Rect[] = new Array(values.length);
  squarify(items, area, 0, 0, w, h, out);
  return out;
}

// --- Helpers ---

function pnlBg(pct: number): string {
  const abs = Math.min(Math.abs(pct) / 10, 1);
  const alpha = (0.12 + abs * 0.22).toFixed(2);
  return pct >= 0 ? `rgba(76,175,80,${alpha})` : `rgba(244,67,54,${alpha})`;
}

function avatarColor(ticker: string): string {
  let h = 0;
  for (let i = 0; i < ticker.length; i++) h = (h * 31 + ticker.charCodeAt(i)) & 0xffff;
  return `hsl(${(h * 137) % 360},50%,38%)`;
}

function displayTicker(ticker: string): string {
  // Strip Trading212 exchange suffixes like _EQ, _US_EQ, _UK, _L
  return ticker.replace(/[_\s]+(US[_\s]*)?EQ$/i, '').replace(/[_\s]+L$/i, '');
}

// --- Card ---

@customElement('investment-allocation-card')
export class InvestmentAllocationCard extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) config: RawCardConfig = {};

  @state() private _containerW = 0;

  private _ro?: ResizeObserver;
  private _wrapEl?: HTMLElement;

  static styles = [
    sharedStyles,
    css`
      .alloc-header {
        padding: 16px 16px 4px;
      }
      .alloc-title {
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--secondary-text-color);
      }
      .alloc-subtitle {
        font-size: 0.8rem;
        color: var(--secondary-text-color);
        margin-top: 2px;
        line-height: 1.4;
        min-height: 2.8em;
      }
      .treemap-wrap {
        margin: 12px;
        border-radius: 12px;
        overflow: hidden;
        position: relative;
      }
      .treemap-cell {
        position: absolute;
        box-sizing: border-box;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        transition: filter 0.12s;
      }
      .treemap-cell:hover { filter: brightness(0.9); }
      .cell-avatar {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.8rem;
        font-weight: 700;
        color: white;
        flex-shrink: 0;
        margin-bottom: 2px;
      }
      .cell-ticker {
        font-weight: 600;
        font-size: 0.78rem;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 90%;
        color: var(--primary-text-color);
        line-height: 1.2;
      }
      .cell-pct {
        font-size: 0.68rem;
        font-weight: 500;
        margin-top: 1px;
        text-align: center;
        line-height: 1.2;
      }
      .cell-pct.positive { color: var(--success-color, #4caf50); }
      .cell-pct.negative { color: var(--error-color, #f44336); }
    `,
  ];

  setConfig(config: RawCardConfig) { this.config = config; }
  getCardSize() { return 5; }

  connectedCallback() {
    super.connectedCallback();
    this._ro = new ResizeObserver((entries) => {
      this._containerW = entries[0].contentRect.width;
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._ro?.disconnect();
    this._ro = undefined;
  }

  firstUpdated() {
    const el = this.shadowRoot?.querySelector('.treemap-wrap') as HTMLElement | null;
    if (el) {
      this._wrapEl = el;
      this._ro?.observe(el);
    }
  }

  updated() {
    // Read width directly after every render as a reliable fallback for ResizeObserver
    const el = this._wrapEl ?? (this.shadowRoot?.querySelector('.treemap-wrap') as HTMLElement | null);
    if (el) {
      const w = el.offsetWidth;
      if (w > 0 && w !== this._containerW) {
        this._containerW = w;
      }
    }
  }

  render() {
    if (!this.hass) return nothing;
    const cfg = this.config as Record<string, unknown>;
    const mode = (cfg.mode as string) ?? 'positions';
    const pieFilter = cfg.pie as string | undefined;
    const treemapHeight: number = (cfg.treemap_height as number) ?? 420;

    const { positions, pies } = resolveConfig(this.config, this.hass.states);

    // pnlPct is undefined (not 0) when the position/pie has no pnl_percent
    // sensor selected — distinct from a sensor that genuinely reports 0%.
    type Row = { label: string; value: number; pnlPct: number | undefined };
    let rows: Row[];

    if (mode === 'pies') {
      rows = pies.map((pie) => {
        const valStr = pie.value ? this.hass.states[pie.value]?.state : undefined;
        const pctStr = pie.pnl_percent ? this.hass.states[pie.pnl_percent]?.state : undefined;
        const value = parseFloat(valStr ?? '');
        const pnlPct = pctStr !== undefined ? parseFloat(pctStr) : NaN;
        return {
          label: pie.name,
          value: isNaN(value) || value <= 0 ? 0 : value,
          pnlPct: isNaN(pnlPct) ? undefined : pnlPct,
        };
      }).filter((r) => r.value > 0);
    } else {
      // Optionally filter to positions belonging to a specific pie
      let filteredPositions = positions;
      if (pieFilter) {
        const prefix = (cfg.prefix as string) ?? 'sensor.trading212_';
        const pieValueEntity = `${prefix}${pieFilter}_value`;
        const pieTickers: string[] = this.hass.states[pieValueEntity]?.attributes?.tickers ?? [];
        if (pieTickers.length > 0) {
          const tickerSet = new Set(pieTickers.map((t: string) => t.toLowerCase()));
          filteredPositions = positions.filter((pos) => tickerSet.has((pos.ticker ?? '').toLowerCase()));
        }
      }
      rows = filteredPositions.map((pos) => {
        const valStr = pos.value ? this.hass.states[pos.value]?.state : undefined;
        const pctStr = pos.pnl_percent ? this.hass.states[pos.pnl_percent]?.state : undefined;
        const value = parseFloat(valStr ?? '');
        const pnlPct = pctStr !== undefined ? parseFloat(pctStr) : NaN;
        return {
          label: displayTicker(pos.ticker ?? pos.name),
          value: isNaN(value) || value <= 0 ? 0 : value,
          pnlPct: isNaN(pnlPct) ? undefined : pnlPct,
        };
      }).filter((r) => r.value > 0);
    }

    if (rows.length === 0) {
      return html`<ha-card><div class="warning">No ${mode} data available.</div></ha-card>`;
    }

    const pieName = pieFilter
      ? (pies.find((p) => {
          const prefix = (cfg.prefix as string) ?? 'sensor.trading212_';
          return p.value === `${prefix}${pieFilter}_value`;
        })?.name ?? pieFilter.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()))
      : '';
    const subtitle = mode === 'pies'
      ? 'Each pie in your portfolio weighted by value and coloured by overall P&L'
      : pieFilter
        ? 'Each position in this pie weighted by value and coloured by overall P&L'
        : 'Each position in your portfolio weighted by value and coloured by P&L';

    const w = this._containerW;
    const rects = w > 0 ? computeTreemap(rows.map((r) => r.value), w, treemapHeight) : [];
    const GAP = 3;

    return html`
      <ha-card>
        <div class="alloc-header">
          <div class="alloc-title">Asset Allocation</div>
          <div class="alloc-subtitle">${subtitle}</div>
        </div>
        <div class="treemap-wrap" style="height:${treemapHeight}px">
          ${rows.map((row, i) => {
            const r = rects[i];
            if (!r) return nothing;
            const left = r.x + GAP / 2;
            const top = r.y + GAP / 2;
            const cellW = r.w - GAP;
            const cellH = r.h - GAP;
            if (cellW < 2 || cellH < 2) return nothing;

            const pnlPct = row.pnlPct;
            const bg = pnlPct !== undefined ? pnlBg(pnlPct) : 'var(--secondary-background-color)';
            const pctCls = pnlPct !== undefined ? (pnlPct >= 0 ? 'positive' : 'negative') : '';
            const sign = pnlPct !== undefined && pnlPct >= 0 ? '+' : '';
            const pctLabel = pnlPct !== undefined ? `${sign}${pnlPct.toFixed(2)}%` : undefined;
            const showAvatar = cellW >= 52 && cellH >= 72;
            const showLabel = cellW >= 28 && cellH >= 36;
            const showPct = cellW >= 36 && cellH >= 54 && pctLabel !== undefined;
            const initial = row.label.charAt(0).toUpperCase();

            return html`
              <div
                class="treemap-cell"
                style="left:${left}px;top:${top}px;width:${cellW}px;height:${cellH}px;background:${bg}"
                title="${pctLabel ? `${row.label}: ${pctLabel} P&L` : row.label}"
              >
                ${showAvatar ? html`
                  <div class="cell-avatar" style="background:${avatarColor(row.label)}">${initial}</div>
                ` : nothing}
                ${showLabel ? html`<div class="cell-ticker">${row.label}</div>` : nothing}
                ${showPct ? html`<div class="cell-pct ${pctCls}">${pctLabel}</div>` : nothing}
              </div>`;
          })}
        </div>
      </ha-card>`;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'investment-allocation-card': InvestmentAllocationCard; }
}
