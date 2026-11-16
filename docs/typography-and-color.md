# Typography and color

## Typography

| Role | Family | Weight | Guidance |
| --- | --- | ---: | --- |
| Display/headlines | Barlow | 800 | Use for main headings and large SportHub wordmark treatments. |
| Uppercase labels | Barlow | 700 | Pair with restrained letter spacing; use `.brand-label` in the app. |
| Body/UI | Inter variable | 400 | Default for paragraphs, labels, and controls. |
| UI emphasis | Inter variable | 600 | Use for buttons, table headings, and short emphasis. |

Use the self-hosted WOFF2 files in `assets/brand/fonts/` and keep the accompanying OFL notices with any copy or redistribution. Example CSS:

```css
@font-face {
  font-family: Barlow;
  src: url('../assets/brand/fonts/barlow-800-latin.woff2') format('woff2');
  font-weight: 800;
  font-display: swap;
}

@font-face {
  font-family: Inter;
  src: url('../assets/brand/fonts/inter-latin-variable.woff2') format('woff2');
  font-weight: 100 900;
  font-display: swap;
}
```

## Color tokens

Canonical values are in [`../tokens/brand-colors.json`](../tokens/brand-colors.json) and [`../tokens/brand.css`](../tokens/brand.css). The token prefix is `--sh-` to avoid collisions when imported into another product.

### Palette

| Token | Hex | Primary use |
| --- | --- | --- |
| `--sh-dugout-navy` | `#0B1F3A` | Brand anchor, dark surface, primary text/action |
| `--sh-optic-yellow` | `#E8E337` | Small highlight and active state |
| `--sh-chalk` | `#F7F5EF` | Light surface and text on Navy |
| `--sh-stitch-red` | `#C8371F` | Softball lockup and destructive/warning semantics |
| `--sh-field-blue` | `#1C3A66` | Dark-mode card and hover surface |
| `--sh-outfield-green` | `#2E7D4F` | Success and strengths |
| `--sh-infield-clay` | `#B5651D` | Opportunity/warm accent |
| `--sh-slate` | `#5B6B82` | Secondary text and borders |
| `--sh-white` | `#FFFFFF` | Light cards and reversed logo color |

### Light and dark themes

Light theme uses Chalk background, Navy text/actions, and White cards. Dark theme uses Navy background, Chalk text/actions, and Field Blue cards. Semantic destructive, success, and info colors are lightened in dark mode to preserve readability. Keep the approved accent roles; in particular, Yellow on Chalk is not a readable text pairing.

### Accessibility reference pairs

| Pair | Contrast |
| --- | ---: |
| Chalk / Navy | 15.15:1 |
| Optic Yellow / Navy | 12.17:1 |
| Slate / Chalk | 4.98:1 |
| Stitch Red / White | 5.22:1 |
| Outfield Green / White | 5.05:1 |
| Optic Yellow / Chalk | 1.24:1 — do not use for text |

These ratios are based on the approved sRGB hex values. Recheck contrast if either color changes or if a new semantic pairing is introduced.
