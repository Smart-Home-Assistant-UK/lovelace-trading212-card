# Investment Card for Home Assistant

A Lovelace custom card for displaying investment portfolios. Auto-detects
[Trading212](https://github.com/Smart-Home-Assistant-UK/homeassistant-trading212)
sensors with zero config. Supports any integration via sensor prefix or explicit mapping.

## Installation

### HACS (recommended)

Add this repository as a custom HACS repository, install **Investment Card**, then add the resource:

```yaml
resources:
  - url: /hacsfiles/lovelace-investment-card/investment-card.js
    type: module
```

### Manual

Copy `dist/investment-card.js` to `config/www/` and add:

```yaml
resources:
  - url: /local/investment-card.js
    type: module
```

## Cards

| Card type | Description |
|---|---|
| `investment-portfolio-card` | All-in-one: overview + positions + pies |
| `investment-overview-card` | Account summary and daily movers |
| `investment-positions-card` | Scrollable positions list with sparklines |
| `investment-pies-card` | Scrollable pies / buckets list |

## Usage

**Zero-config (Trading212)**
```yaml
type: custom:investment-portfolio-card
```

**Custom prefix**
```yaml
type: custom:investment-positions-card
prefix: sensor.my_broker_
```

**Explicit mapping**
```yaml
type: custom:investment-positions-card
positions:
  - name: Apple
    value: sensor.aapl_value
    pnl: sensor.aapl_pnl
    pnl_percent: sensor.aapl_pct
    quantity: sensor.aapl_qty
    avg_price: sensor.aapl_avg
    current_price: sensor.aapl_price
```

## Options

| Option | Default | Description |
|---|---|---|
| `prefix` | `sensor.trading212_` | Sensor prefix for auto-discovery |
| `max_height` | `400px` | Max height of scrollable lists |
| `show_overview` | `true` | Show overview section (portfolio card only) |
| `show_positions` | `true` | Show positions section (portfolio card only) |
| `show_pies` | `true` | Show pies section (portfolio card only) |

## Screenshots

<!-- Screenshots will be added once the card is deployed against a live Home Assistant instance -->
