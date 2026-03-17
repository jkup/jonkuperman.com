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

    return filterTagList([...tagSet])
  })

  // Featured posts collection (posts with topPost: true)
  eleventyConfig.addCollection("featuredPosts", function (collection) {
    return collection
      .getFilteredByTag("posts")
      .filter(item => item.data.topPost)
      .reverse()
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
