import { createHash } from "node:crypto"
import { copyFile, mkdir, readFile, rename, stat } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import sharp from "sharp"

const root = fileURLToPath(new URL("../", import.meta.url))
const widths = [480, 800, 1440]
const formats = { webp: { quality: 78 }, jpeg: { quality: 80, progressive: true } }
// Match the article's 720px border-box and its desktop/mobile padding.
const sizes = "(max-width: 720px) calc(100vw - 64px), (max-width: 768px) 656px, 624px"

async function exists(filename) {
  try {
    await stat(filename)
    return true
  } catch (error) {
    if (error.code === "ENOENT") return false
    throw error
  }
}

async function createVariants(source, outputDirectory) {
  const input = await readFile(path.join(root, source))
  const metadata = await sharp(input).metadata()
  const { width, height } = metadata.autoOrient
  const imageWidths = [...new Set(widths.map(size => Math.min(size, width)))]
  const fingerprint = createHash("sha256")
    .update(input)
    .update(JSON.stringify({ widths, formats, versions: sharp.versions }))
    .digest("hex").slice(0, 12)
  const basename = `${path.parse(source).name}-${fingerprint}`
  const cacheDirectory = path.join(root, ".cache", "london-images")
  await mkdir(cacheDirectory, { recursive: true })
  const variants = { webp: [], jpeg: [] }

  // Bound simultaneous encodes: some originals are large phone photographs.
  for (const imageWidth of imageWidths) {
    await Promise.all(Object.entries(formats).map(async ([format, options]) => {
      const extension = format === "jpeg" ? "jpg" : format
      const filename = `${basename}-${imageWidth}.${extension}`
      const cached = path.join(cacheDirectory, filename)
      if (!await exists(cached)) {
        const temporary = `${cached}.${process.pid}.tmp`
        await sharp(input).autoOrient().resize({ width: imageWidth, withoutEnlargement: true })
          .toFormat(format, options).toFile(temporary)
        await rename(temporary, cached)
      }
      // Copy cached variants on every build, including after deleting the output.
      await copyFile(cached, path.join(outputDirectory, filename))
      variants[format].push({ url: `/img/london/${filename}`, width: imageWidth })
    }))
  }
  return { variants, width, height }
}

// Scope the transform to this photo essay, leaving Markdown and originals intact.
export async function optimizeLondonImages(content, outputPath) {
  outputPath ||= this?.page?.outputPath || this?.outputPath
  if (!outputPath || path.basename(path.dirname(outputPath)) !== "first-year-in-london" || !outputPath.endsWith(".html")) {
    return content
  }

  const outputDirectory = path.resolve(path.dirname(outputPath), "../img/london")
  await mkdir(outputDirectory, { recursive: true })
  const images = [...content.matchAll(/<img\b[^>]*\bsrc="(\/img\/[a-z0-9-]+\.(?:jpe?g|png))"[^>]*>/gi)]
  let optimized = content
  for (const [index, match] of images.entries()) {
    const { variants, width, height } = await createVariants(match[1].slice(1), outputDirectory)
    const srcset = format => variants[format].map(image => `${image.url} ${image.width}w`).join(", ")
    const fallback = variants.jpeg.find(image => image.width >= 800) || variants.jpeg.at(-1)
    // Preserve escaped alt text and any other authored attributes.
    const attributes = match[0]
      .replace(/^<img\b|\/?\s*>$/gi, "")
      .replace(/\s+(?:src|srcset|sizes|width|height|loading|decoding)="[^"]*"/gi, "")
    const picture = `<picture><source type="image/webp" srcset="${srcset("webp")}" sizes="${sizes}"><img${attributes} src="${fallback.url}" srcset="${srcset("jpeg")}" sizes="${sizes}" width="${width}" height="${height}" loading="${index === 0 ? "eager" : "lazy"}" decoding="async"></picture>`
    optimized = optimized.replace(match[0], picture)
  }
  return optimized
}
