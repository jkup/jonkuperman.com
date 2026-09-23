import { DateTime } from "luxon"
import pluginRss from "@11ty/eleventy-plugin-rss"
import pluginSyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight"
import pluginNavigation from "@11ty/eleventy-navigation"
import readingTime from "eleventy-plugin-reading-time"
import embeds from "eleventy-plugin-embed-everything"
import markdownIt from "markdown-it"
import markdownItAnchor from "markdown-it-anchor"

export default function (eleventyConfig) {
  // Add plugins
  eleventyConfig.addPlugin(pluginRss)
  eleventyConfig.addPlugin(pluginSyntaxHighlight)
  eleventyConfig.addPlugin(pluginNavigation)
  eleventyConfig.addPlugin(readingTime)
  eleventyConfig.addPlugin(embeds)

  // Alias `layout: post` to `layout: layouts/post.njk`
  eleventyConfig.addLayoutAlias("post", "layouts/post.njk")

  eleventyConfig.addFilter("readableDate", dateObj => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("dd LLL yyyy")
  })

  eleventyConfig.addFilter("md", function (content = "") {
    return markdownIt({ html: true }).render(content)
  })

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter("htmlDateString", dateObj => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy-LL-dd")
  })

  // Get the first `n` elements of a collection.
  eleventyConfig.addFilter("head", (array, n) => {
    if (!Array.isArray(array) || array.length === 0) {
      return []
    }
    if (n < 0) {
      return array.slice(n)
    }

    return array.slice(0, n)
  })

  // Explicit editorial order, independent of publication frequency.
  eleventyConfig.addFilter("selectPosts", (posts, slugs) =>
    slugs.map(slug => {
      const post = posts.find(item => item.fileSlug === slug)
      if (!post) throw new Error(`Selected post not found: ${slug}`)
      return post
    })
  )

  // Return the smallest number argument
  eleventyConfig.addFilter("min", (...numbers) => {
    return Math.min.apply(null, numbers)
  })

  function filterTagList(tags) {
    return (tags || []).filter(
      tag => ["all", "nav", "post", "posts"].indexOf(tag) === -1
    )
  }

  eleventyConfig.addFilter("filterTagList", filterTagList)

  // Create an array of all tags
  eleventyConfig.addCollection("tagList", function (collection) {
    let tagSet = new Set()
    collection.getAll().forEach(item => {
      ;(item.data.tags || []).forEach(tag => tagSet.add(tag))
    })

    const priority = ["JavaScript", "Compilers", "C++", "DevTools", "Performance", "Node"]
    return filterTagList([...tagSet]).sort((a, b) => {
      const rank = tag => priority.includes(tag) ? priority.indexOf(tag) : priority.length
      return rank(a) - rank(b) || a.localeCompare(b)
    })
  })

  // Featured posts collection (posts with topPost: true)
  eleventyConfig.addCollection("featuredPosts", function (collection) {
    return collection
      .getFilteredByTag("posts")
      .filter(item => item.data.topPost)
      .reverse()
  })

  eleventyConfig.addFilter("postYears", posts =>
    [...new Set(posts.map(post => post.date.getUTCFullYear()))].sort((a, b) => b - a)
  )

  eleventyConfig.addFilter("articleContents", html => {
    const words = html.replace(/<[^>]+>/g, " ").trim().split(/\s+/).length
    const headings = [...html.matchAll(/<h2\b[^>]*\bid="([^"]+)"[^>]*>([\s\S]*?)<\/h2>/g)].map(match => ({
      id: match[1],
      label: match[2].replace(/<a\b[^>]*class="direct-link"[^>]*>[\s\S]*?<\/a>/g, "").replace(/<[^>]+>/g, "").trim()
    }))
    return words >= 1000 && headings.length >= 4 ? headings : []
  })

  eleventyConfig.addFilter("relatedPosts", (posts, currentUrl, tags = [], preferred = []) => {
    const families = [
      ["JavaScript", "C++", "Compilers", "Node", "DevTools", "Performance", "React", "CSS", "Git"],
      ["Thoughts", "Life"],
      ["Career", "DevRel", "Interviewing"]
    ]
    const currentTags = filterTagList(tags)
    const selected = posts.filter(post => post.url !== currentUrl && preferred.includes(post.fileSlug))
    const ranked = posts.filter(post => post.url !== currentUrl && !preferred.includes(post.fileSlug)).map(post => {
      const candidateTags = filterTagList(post.data.tags)
      const shared = candidateTags.filter(tag => currentTags.includes(tag)).length
      const family = families.some(group => group.some(tag => currentTags.includes(tag)) && group.some(tag => candidateTags.includes(tag)))
      return { post, score: shared * 4 + (family ? 1 : 0) }
    }).filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score || b.post.date - a.post.date)
      .map(item => item.post)
    return [...selected, ...ranked].slice(0, 2)
  })

  // Copy the `img` and `css` folders to the output
  eleventyConfig.addPassthroughCopy("img")
  eleventyConfig.addPassthroughCopy("css")
  eleventyConfig.addPassthroughCopy({ "scripts/index.js": "scripts/index.js" })
  eleventyConfig.addPassthroughCopy({ static: "/" })

  // Customize Markdown library and settings:
  let markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true,
  }).use(markdownItAnchor, {
    permalink: markdownItAnchor.permalink.ariaHidden({
      placement: "before",
      class: "direct-link",
      symbol: "#",
      level: [1, 2, 3, 4],
    }),
    slugify: eleventyConfig.getFilter("slug"),
  })
  eleventyConfig.setLibrary("md", markdownLibrary)

  return {
    // Control which files Eleventy will process
    templateFormats: ["md", "njk", "html", "liquid"],

    // Pre-process *.md files with: (default: `liquid`)
    markdownTemplateEngine: "liquid",

    // Pre-process *.html files with: (default: `liquid`)
    htmlTemplateEngine: "liquid",

    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
  }
}
