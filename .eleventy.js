const { DateTime } = require("luxon")
const fs = require("fs")
const pluginRss = require("@11ty/eleventy-plugin-rss")
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight")
const pluginNavigation = require("@11ty/eleventy-navigation")
const readingTime = require("eleventy-plugin-reading-time")
const embeds = require("eleventy-plugin-embed-everything")
const markdownIt = require("markdown-it")
const markdownItAnchor = require("markdown-it-anchor")

module.exports = function (eleventyConfig) {
  // Add plugins
  eleventyConfig.addPlugin(pluginRss)
  eleventyConfig.addPlugin(pluginSyntaxHighlight)
  eleventyConfig.addPlugin(pluginNavigation)
  eleventyConfig.addPlugin(readingTime)
  eleventyConfig.addPlugin(embeds)

  // https://www.11ty.dev/docs/data-deep-merge/
  eleventyConfig.setDataDeepMerge(true)

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

  // Copy the `img` and `css` folders to the output
  eleventyConfig.addPassthroughCopy("img")
  eleventyConfig.addPassthroughCopy("css")
  eleventyConfig.addPassthroughCopy("scripts")
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

  // Override Browsersync defaults (used only with --serve)
  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function (err, browserSync) {
        const content_404 = fs.readFileSync("_site/404.html")

        browserSync.addMiddleware("*", (req, res) => {
          // Provides the 404 content without redirect.
          res.writeHead(404, { "Content-Type": "text/html; charset=UTF-8" })
          res.write(content_404)
          res.end()
        })
      },
    },
    ui: false,
    ghostMode: false,
  })

  return {
    // Control which files Eleventy will process
    // e.g.: *.md, *.njk, *.html, *.liquid
    templateFormats: ["md", "njk", "html", "liquid"],

    // Pre-process *.md files with: (default: `liquid`)
    markdownTemplateEngine: "liquid",

    // Pre-process *.html files with: (default: `liquid`)
    htmlTemplateEngine: "liquid",

    // These are all optional:
    dir: {
      input: ".", // default: "."
      includes: "_includes", // default: "_includes"
      data: "_data", // default: "_data"
      output: "_site",
    },
  }
}
