# SportHub Brand

The source of truth for SportHub's visual identity: approved marks, raster exports, colors, typography, illustrations, and usage guidance.

## Start here

- [Brand usage guidelines](docs/usage-guidelines.md)
- [Asset catalog and export sizes](docs/asset-catalog.md)
- [Color and typography tokens](docs/typography-and-color.md)
- [Licensing and asset ownership](docs/licensing.md)
- [Brand preview sheet](preview/index.html)

Run `npm run check` to verify required assets, font licenses, color tokens, and PNG export dimensions.

Run `npm run check` to verify required assets, font licenses, color tokens, and PNG export dimensions.

## Repository layout

```text
assets/brand/       Original SVG marks, softball artwork, source PNGs, and font files
assets/favicon.svg  App favicon source
exports/png/        Transparent PNG derivatives at common display sizes
tokens/              Framework-neutral JSON and CSS brand tokens
docs/               Usage, asset, typography, color, and licensing guidance
preview/            Self-contained local HTML brand preview
```

The `assets/brand/` SVGs are the preferred source assets. Use PNG derivatives when a consuming tool cannot render SVG. Font files include their SIL Open Font License notices.

## Brand at a glance

- **Tagline:** “Coach like you've done this before.”
- **Display:** Barlow 700/800
- **Body/UI:** Inter variable
- **Core colors:** Dugout Navy `#0B1F3A`, Chalk `#F7F5EF`, Optic Yellow `#E8E337`, Slate `#5B6B82`
- **Sports scope:** softball-first; only use the softball pictograms and artwork included here.

## Change process

Keep original marks and their relative font paths intact. Add new exported sizes from the SVG masters instead of editing raster exports by hand. Update the asset catalog and preview whenever an approved asset or token changes. Do not copy the private source brand-board PDF into this public repository.
