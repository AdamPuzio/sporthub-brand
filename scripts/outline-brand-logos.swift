#!/usr/bin/env swift
import CoreText
import Foundation

struct GlyphOutline {
    let index: Int
    let path: String
}

let root = URL(fileURLWithPath: #filePath)
    .deletingLastPathComponent()
    .deletingLastPathComponent()
let fonts = root.appendingPathComponent("assets/brand/fonts")
let output = root.appendingPathComponent("exports/svg")
let wordmarkFont = fonts.appendingPathComponent("barlow-800-latin.woff2")
let labelFont = fonts.appendingPathComponent("barlow-700-latin.woff2")
var loadedFonts = Set<URL>()

func fail(_ message: String) -> Never {
    fputs("Error: \(message)\n", stderr)
    exit(1)
}

func fontFromFile(_ url: URL, size: CGFloat) -> CTFont {
    if loadedFonts.insert(url).inserted {
        var error: Unmanaged<CFError>?
        guard CTFontManagerRegisterFontsForURL(url as CFURL, .process, &error) else {
            let detail = error?.takeRetainedValue().localizedDescription ?? "unknown CoreText error"
            fail("Could not load \(url.lastPathComponent): \(detail)")
        }
    }
    guard let descriptors = CTFontManagerCreateFontDescriptorsFromURL(url as CFURL) as? [CTFontDescriptor],
          let descriptor = descriptors.first else {
        fail("Could not read font descriptor from \(url.lastPathComponent)")
    }
    return CTFontCreateWithFontDescriptor(descriptor, size, nil)
}

func number(_ value: CGFloat) -> String {
    let rounded = (Double(value) * 1000).rounded() / 1000
    if rounded == 0 { return "0" }
    return String(format: "%.3f", locale: Locale(identifier: "en_US_POSIX"), rounded)
}

func pathData(_ path: CGPath) -> String {
    var commands: [String] = []
    path.applyWithBlock { elementPointer in
        let element = elementPointer.pointee
        let points = element.points
        switch element.type {
        case .moveToPoint:
            commands.append("M\(number(points[0].x)) \(number(points[0].y))")
        case .addLineToPoint:
            commands.append("L\(number(points[0].x)) \(number(points[0].y))")
        case .addQuadCurveToPoint:
            commands.append("Q\(number(points[0].x)) \(number(points[0].y)) \(number(points[1].x)) \(number(points[1].y))")
        case .addCurveToPoint:
            commands.append("C\(number(points[0].x)) \(number(points[0].y)) \(number(points[1].x)) \(number(points[1].y)) \(number(points[2].x)) \(number(points[2].y))")
        case .closeSubpath:
            commands.append("Z")
        @unknown default:
            fail("Encountered an unsupported CoreGraphics path element")
        }
    }
    return commands.joined(separator: " ")
}

func outlinedText(
    _ text: String,
    font: CTFont,
    tracking: CGFloat,
    originX: CGFloat,
    baseline: CGFloat
) -> [GlyphOutline] {
    let attributes: [NSAttributedString.Key: Any] = [
        NSAttributedString.Key(kCTFontAttributeName as String): font,
        NSAttributedString.Key(kCTKernAttributeName as String): tracking,
    ]
    let line = CTLineCreateWithAttributedString(NSAttributedString(string: text, attributes: attributes))
    let runs = CTLineGetGlyphRuns(line) as! [CTRun]
    var result: [GlyphOutline] = []
    var characterIndex = 0

    for run in runs {
        let count = CTRunGetGlyphCount(run)
        var glyphs = Array(repeating: CGGlyph(), count: count)
        var positions = Array(repeating: CGPoint.zero, count: count)
        CTRunGetGlyphs(run, CFRange(location: 0, length: 0), &glyphs)
        CTRunGetPositions(run, CFRange(location: 0, length: 0), &positions)
        let runAttributes = CTRunGetAttributes(run) as NSDictionary
        guard let fontAttribute = runAttributes[kCTFontAttributeName] else {
            fail("CoreText did not provide the font used for \(text)")
        }
        let runFont = fontAttribute as! CTFont

        for glyphIndex in 0..<count {
            let glyph = glyphs[glyphIndex]
            guard let glyphPath = CTFontCreatePathForGlyph(runFont, glyph, nil) else {
                fail("Could not outline glyph \(glyph) in \(text)")
            }
            var transform = CGAffineTransform(
                a: 1,
                b: 0,
                c: 0,
                d: -1,
                tx: originX + positions[glyphIndex].x,
                ty: baseline - positions[glyphIndex].y
            )
            guard let positionedPath = glyphPath.copy(using: &transform) else {
                fail("Could not position a glyph outline in \(text)")
            }
            result.append(GlyphOutline(index: characterIndex, path: pathData(positionedPath)))
            characterIndex += 1
        }
    }

    guard characterIndex == text.utf16.count else {
        fail("Expected one glyph per character while outlining \(text)")
    }
    return result
}

func centeredOrigin(_ text: String, font: CTFont, tracking: CGFloat, centerX: CGFloat) -> CGFloat {
    let attributes: [NSAttributedString.Key: Any] = [
        NSAttributedString.Key(kCTFontAttributeName as String): font,
        NSAttributedString.Key(kCTKernAttributeName as String): tracking,
    ]
    let line = CTLineCreateWithAttributedString(NSAttributedString(string: text, attributes: attributes))
    let width = CGFloat(CTLineGetTypographicBounds(line, nil, nil, nil))
    return centerX - width / 2
}

func pathElements(_ glyphs: [GlyphOutline], fill: String) -> String {
    glyphs.map { "  <path fill=\"\(fill)\" d=\"\($0.path)\"/>" }.joined(separator: "\n")
}

func svg(title: String, viewBox: String, body: String) -> String {
    """
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="\(viewBox)" role="img" aria-labelledby="title">
      <title id="title">\(title)</title>
    \(body)
    </svg>
    """
}

func write(_ fileName: String, contents: String) {
    do {
        try contents.appending("\n").write(to: output.appendingPathComponent(fileName), atomically: true, encoding: .utf8)
        print("Wrote exports/svg/\(fileName)")
    } catch {
        fail("Could not write \(fileName): \(error.localizedDescription)")
    }
}

do {
    try FileManager.default.createDirectory(at: output, withIntermediateDirectories: true)
} catch {
    fail("Could not create exports/svg: \(error.localizedDescription)")
}

let bold = fontFromFile(wordmarkFont, size: 104)
let wordmark = outlinedText("SportHub", font: bold, tracking: -4, originX: 4, baseline: 94)
write("sporthub-wordmark.svg", contents: svg(
    title: "SportHub",
    viewBox: "0 0 590 120",
    body: "\(pathElements(Array(wordmark.prefix(5)), fill: "#0B1F3A"))\n\(pathElements(Array(wordmark.suffix(3)), fill: "#5B6B82"))"
))
write("sporthub-wordmark-reversed.svg", contents: svg(
    title: "SportHub",
    viewBox: "0 0 590 120",
    body: "\(pathElements(Array(wordmark.prefix(5)), fill: "#FFFFFF"))\n\(pathElements(Array(wordmark.suffix(3)), fill: "#E8E337"))"
))

let lockupBold = fontFromFile(wordmarkFont, size: 104)
let lockupWordmark = outlinedText("SportHub", font: lockupBold, tracking: -4, originX: 4, baseline: 91)
let regular = fontFromFile(labelFont, size: 26)
let softball = "SOFTBALL"
let softballOrigin = centeredOrigin(softball, font: regular, tracking: 7, centerX: 295)
let softballGlyphs = outlinedText(softball, font: regular, tracking: 7, originX: softballOrigin, baseline: 145)
write("sporthub-softball-lockup.svg", contents: svg(
    title: "SportHub Softball",
    viewBox: "0 0 590 154",
    body: "\(pathElements(Array(lockupWordmark.prefix(5)), fill: "#0B1F3A"))\n\(pathElements(Array(lockupWordmark.suffix(3)), fill: "#5B6B82"))\n\(pathElements(softballGlyphs, fill: "#C8371F"))"
))

let monogramFont = fontFromFile(wordmarkFont, size: 58)
let monogramOrigin = centeredOrigin("SH", font: monogramFont, tracking: -4, centerX: 60)
let monogram = outlinedText("SH", font: monogramFont, tracking: -4, originX: monogramOrigin, baseline: 82)
write("sh-monogram.svg", contents: svg(
    title: "SportHub",
    viewBox: "0 0 120 120",
    body: """
      <rect x="3" y="3" width="114" height="114" rx="25" fill="#0B1F3A"/>
      <rect x="17" y="17" width="86" height="86" rx="21" fill="none" stroke="#5B6B82" stroke-width="2" opacity=".55"/>
    \(pathElements([monogram[0]], fill: "#F7F5EF"))
    \(pathElements([monogram[1]], fill: "#E8E337"))
    """
))
write("sh-monogram-reversed.svg", contents: svg(
    title: "SportHub",
    viewBox: "0 0 120 120",
    body: """
      <rect x="12" y="12" width="96" height="96" rx="25" fill="none" stroke="#5B6B82" stroke-width="3" opacity=".8"/>
    \(pathElements([monogram[0]], fill: "#F7F5EF"))
    \(pathElements([monogram[1]], fill: "#E8E337"))
    """
))

let favicon = svg(
    title: "SportHub",
    viewBox: "0 0 120 120",
    body: """
      <rect width="120" height="120" rx="26" fill="#0B1F3A"/>
    \(pathElements([monogram[0]], fill: "#F7F5EF"))
    \(pathElements([monogram[1]], fill: "#E8E337"))
    """
)
write("favicon.svg", contents: favicon)
