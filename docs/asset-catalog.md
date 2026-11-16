# Asset catalog

Original vector and source assets live in [`assets/brand/`](../assets/brand/). Raster exports live in [`exports/png/`](../exports/png/).

## Font-independent outlined SVGs

Use the files in [`exports/svg/`](../exports/svg/) when placing a logo in a design tool, print workflow, or other environment where the brand fonts may not be installed. These SVGs contain vector paths rather than live text and do not load external files.

| Asset | Format | Recommended use |
| --- | --- | --- |
| `exports/svg/sporthub-wordmark.svg` | Outlined SVG | Primary mark on light backgrounds |
| `exports/svg/sporthub-wordmark-reversed.svg` | Outlined SVG | White/Optic Yellow mark on dark backgrounds |
| `exports/svg/sporthub-softball-lockup.svg` | Outlined SVG | Softball product lockup |
| `exports/svg/sh-monogram.svg` | Outlined SVG | App icon and compact light-surface use |
| `exports/svg/sh-monogram-reversed.svg` | Outlined SVG | Compact mark for dark surfaces |
| `exports/svg/favicon.svg` | Outlined SVG | Font-independent favicon source |

The originals in `assets/brand/` remain the editable, font-based source files. Keep them alongside the supplied Barlow fonts when editing text or preparing future variants. Regenerate outlined exports on macOS with `npm run outline` after approved source changes.

## Marks

| Asset | Format | Recommended use |
| --- | --- | --- |
| `assets/brand/sporthub-wordmark.svg` | SVG | Primary mark on light backgrounds |
| `assets/brand/sporthub-wordmark-reversed.svg` | SVG | Wordmark on Dugout Navy/dark backgrounds |
| `assets/brand/sporthub-softball-lockup.svg` | SVG | Softball product lockup |
| `assets/brand/sh-monogram.svg` | SVG | App icon, favicon, compact light-surface use |
| `assets/brand/sh-monogram-reversed.svg` | SVG | Navigation/compact use on dark surfaces |
| `assets/favicon.svg` | SVG | Browser favicon source |

## Raster derivatives

The PNG exports preserve transparency. Prefer an outlined SVG where vector output is supported; use PNG derivatives when a consuming tool cannot render SVG.

| Export | Size | Use |
| --- | ---: | --- |
| `sporthub-wordmark.png` | 590 × 120 | Standard wordmark raster |
| `sporthub-wordmark@2x.png` | 1180 × 240 | High-density wordmark raster |
| `sporthub-wordmark-reversed.png` | 590 × 120 | Standard reversed wordmark |
| `sporthub-wordmark-reversed@2x.png` | 1180 × 240 | High-density reversed wordmark |
| `sporthub-softball-lockup.png` | 590 × 154 | Standard softball lockup raster |
| `sporthub-softball-lockup@2x.png` | 1180 × 308 | High-density softball lockup |
| `sh-monogram.png`, `sh-monogram@2x.png`, `sh-monogram@4x.png` | 120, 240, 480 square | App/icon surfaces |
| `sh-monogram-reversed.png`, `sh-monogram-reversed@2x.png`, `sh-monogram-reversed@4x.png` | 120, 240, 480 square | Dark-surface app/navigation icon |
| `favicon-32.png`, `favicon-64.png`, `favicon-512.png` | 32, 64, 512 square | Browser and app icon fallbacks |
| `softball-hitting*.png`, `softball-pitching*.png` | 120, 240, 512 square | Softball pictogram fallbacks |

## Supporting artwork

- `assets/brand/realball_flat.png` — decorative softball image used in team selection.
- `assets/brand/realball_transparent.png` — transparent softball source artwork.
- `assets/brand/softball-hitting.svg` and `assets/brand/softball-pitching.svg` — simplified softball pictograms.

## Fonts

- `assets/brand/fonts/barlow-700-latin.woff2`
- `assets/brand/fonts/barlow-800-latin.woff2`
- `assets/brand/fonts/inter-latin-variable.woff2`

The corresponding SIL Open Font License texts are in `assets/brand/fonts/OFL-Barlow.txt` and `assets/brand/fonts/OFL-Inter.txt`.
