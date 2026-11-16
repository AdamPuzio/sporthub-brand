import assert from 'node:assert/strict'
import { existsSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { inflateSync } from 'node:zlib'

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
  'scripts/outline-brand-logos.swift',
  'exports/svg/sporthub-wordmark.svg',
  'exports/svg/sporthub-wordmark-reversed.svg',
  'exports/svg/sporthub-softball-lockup.svg',
  'exports/svg/sh-monogram.svg',
  'exports/svg/sh-monogram-reversed.svg',
  'exports/svg/favicon.svg',
  'BRAND-BOARD.md',
  'exports/palette-swatches.svg',
  'tokens/brand-colors.json',
  'tokens/brand-type.json',
  'tokens/brand.css',
  'docs/usage-guidelines.md',
  'docs/asset-catalog.md',
  'docs/licensing.md',
  'preview/index.html',
  'preview/wordmark-reversed-on-navy.png',
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

for (const file of [
  'exports/svg/sporthub-wordmark.svg',
  'exports/svg/sporthub-wordmark-reversed.svg',
  'exports/svg/sporthub-softball-lockup.svg',
  'exports/svg/sh-monogram.svg',
  'exports/svg/sh-monogram-reversed.svg',
  'exports/svg/favicon.svg',
]) {
  const svg = readFileSync(path.join(root, file), 'utf8')
  assert.match(svg, /<svg\b/, `${file} should be an SVG document`)
  assert.match(svg, /<path\b/, `${file} should contain outlined vector paths`)
  assert.doesNotMatch(svg, /<text\b|@font-face|font-family\s*=|url\(/i, `${file} should not depend on external fonts or resources`)
}

function firstPixelAlpha(data, file) {
  let offset = 8
  let colorType = -1
  const compressed = []
  while (offset < data.length) {
    const length = data.readUInt32BE(offset)
    const type = data.subarray(offset + 4, offset + 8).toString('ascii')
    const payload = data.subarray(offset + 8, offset + 8 + length)
    if (type === 'IHDR') colorType = payload[9]
    if (type === 'IDAT') compressed.push(payload)
    offset += length + 12
  }
  assert.equal(colorType, 6, `${file} should be RGBA PNG to preserve transparency`)
  const firstScanline = inflateSync(Buffer.concat(compressed))
  return firstScanline[4]
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

for (const file of ['exports/png/sporthub-wordmark.png', 'exports/png/sporthub-wordmark-reversed.png', 'exports/png/sporthub-softball-lockup.png', 'exports/png/sh-monogram.png', 'exports/png/favicon-32.png']) {
  const data = readFileSync(path.join(root, file))
  assert.equal(firstPixelAlpha(data, file), 0, `${file} should have a transparent outer corner`)
}

assert.equal(existsSync(path.join(root, 'input/SportHub Brand Board.pdf')), false, 'Private source board must not be copied')
console.log('✓ Brand board links, font-independent SVGs, sources, licenses, tokens, PNG dimensions, and transparent logo exports are valid.')
