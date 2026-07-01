import { css } from 'lit';

export const sharedStyles = css`
  :host {
    display: block;
    font-family: var(--paper-font-body1_-_font-family, sans-serif);
    color: var(--primary-text-color);
  }

  .stat-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 8px;
    padding: 16px;
  }

  .stat-chip {
    background: var(--secondary-background-color);
    border-radius: 8px;
    padding: 10px 12px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .stat-label {
    font-size: 0.72rem;
    color: var(--secondary-text-color);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .stat-value {
    font-size: 1rem;
    font-weight: 600;
  }

  .positive { color: var(--success-color, #4caf50); }
  .negative { color: var(--error-color, #f44336); }

  .mover-row {
    display: flex;
    gap: 8px;
    padding: 0 16px 16px;
  }

  .mover-chip {
    flex: 1;
    background: var(--secondary-background-color);
    border-radius: 8px;
    padding: 10px 12px;
    min-width: 0;
  }

  .mover-label {
    font-size: 0.72rem;
    color: var(--secondary-text-color);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .mover-name {
    font-weight: 600;
    font-size: 0.9rem;
    margin: 2px 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .mover-change { font-size: 0.8rem; }

  .list-container {
    overflow-y: auto;
    padding: 0 16px 16px;
  }

  .list-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 0;
    border-bottom: 1px solid var(--divider-color);
    cursor: pointer;
    user-select: none;
  }

  .list-item:last-child { border-bottom: none; }

  .item-main {
    flex: 1 1 auto;
    min-width: 0;
  }

  .item-name {
    font-weight: 500;
    font-size: 0.9rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .item-ticker {
    font-size: 0.75rem;
    color: var(--secondary-text-color);
  }

  .item-value {
    font-weight: 600;
    font-size: 0.9rem;
    text-align: right;
    flex-shrink: 0;
  }

  .item-pnl {
    font-size: 0.8rem;
    text-align: right;
    flex-shrink: 0;
  }

  .expand-panel {
    padding: 12px 0;
    border-bottom: 1px solid var(--divider-color);
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 8px;
  }

  .expand-stat { display: flex; flex-direction: column; gap: 2px; }

  .expand-label {
    font-size: 0.72rem;
    color: var(--secondary-text-color);
    text-transform: uppercase;
  }

  .expand-value { font-size: 0.85rem; font-weight: 500; }

  .progress-bar-track {
    height: 4px;
    background: var(--divider-color);
    border-radius: 2px;
    overflow: hidden;
    margin-top: 4px;
  }

  .progress-bar-fill {
    height: 100%;
    background: var(--primary-color);
    border-radius: 2px;
  }

  .warning {
    padding: 16px;
    color: var(--secondary-text-color);
    font-size: 0.85rem;
    font-style: italic;
  }
`;
