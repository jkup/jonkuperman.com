import { createHash } from "node:crypto"
import { readFileSync } from "node:fs"

export default function () {
  // Give changed CSS a new URL even when browsers retain the old file.
  const css = readFileSync(new URL("../css/index.css", import.meta.url))
  const version = createHash("sha256").update(css).digest("hex").slice(0, 12)
  return { stylesheet: `/css/index.css?v=${version}` }
}
