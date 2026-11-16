import assert from 'node:assert/strict'
import { existsSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const required = [
  'assets/brand/sporthub-wordmark.svg',
  'assets/brand/sporthub-wordmark-reversed.svg',
  'assets/brand/sporthub-softball-lockup.svg',
  'assets/brand/sh-monogram.svg',
  'assets/brand/sh-monogram-reversed.svg',
  'assets/brand/softball-hitting.svg',
  'assets/brand/softball-pitching.svg',
  'assets/brand/fonts/barlow-700-latin.woff2',
  'assets/brand/fonts/barlow-800-latin.woff2',
  'assets/brand/fonts/inter-latin-variable.woff2',
  'assets/brand/fonts/OFL-Barlow.txt',
  'assets/brand/fonts/OFL-Inter.txt',
  'assets/favicon.svg',
  'BRAND-BOARD.md',
  'exports/palette-swatches.svg',
  'tokens/brand-colors.json',
  'tokens/brand-type.json',
  'tokens/brand.css',
  'docs/usage-guidelines.md',
  'docs/asset-catalog.md',
  'docs/licensing.md',
  'preview/index.html',
]

for (const file of required) {
  const fullPath = path.join(root, file)
  assert.ok(existsSync(fullPath), `Missing required brand-kit asset: ${file}`)
  assert.ok(statSync(fullPath).size > 0, `Brand-kit asset is empty: ${file}`)
}

const board = readFileSync(path.join(root, 'BRAND-BOARD.md'), 'utf8')
for (const [, assetPath] of board.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)) {
  assert.ok(existsSync(path.join(root, assetPath)), `Brand board references a missing image: ${assetPath}`)
}

const colors = JSON.parse(readFileSync(path.join(root, 'tokens/brand-colors.json'), 'utf8'))
const css = readFileSync(path.join(root, 'tokens/brand.css'), 'utf8')
for (const [name, hex] of Object.entries(colors.brand)) {
  const cssName = name.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
  assert.ok(css.includes(`--sh-${cssName}: ${hex};`), `CSS color token does not match JSON for ${name}`)
}

const expectedPngSizes = {
  'exports/png/sporthub-wordmark.png': [590, 120],
  'exports/png/sporthub-wordmark@2x.png': [1180, 240],
  'exports/png/sporthub-wordmark-reversed.png': [590, 120],
  'exports/png/sporthub-softball-lockup.png': [590, 154],
  'exports/png/sporthub-softball-lockup@2x.png': [1180, 308],
  'exports/png/sh-monogram.png': [120, 120],
  'exports/png/sh-monogram@2x.png': [240, 240],
  'exports/png/sh-monogram@4x.png': [480, 480],
  'exports/png/favicon-32.png': [32, 32],
  'exports/png/favicon-64.png': [64, 64],
}
for (const [file, [width, height]] of Object.entries(expectedPngSizes)) {
  const data = readFileSync(path.join(root, file))
  assert.equal(data.subarray(1, 4).toString('ascii'), 'PNG', `${file} is not PNG data`)
  assert.equal(data.readUInt32BE(16), width, `${file} width should be ${width}`)
  assert.equal(data.readUInt32BE(20), height, `${file} height should be ${height}`)
}

assert.equal(existsSync(path.join(root, 'input/SportHub Brand Board.pdf')), false, 'Private source board must not be copied')
console.log('✓ Brand board links, sources, licenses, tokens, and PNG export dimensions are present and consistent.')
