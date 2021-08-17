var plugins = [{
      name: 'gatsby-plugin-mdx',
      plugin: require('/Users/jonathankuperman/workspace/jonkuperman.com/node_modules/gatsby-plugin-mdx/gatsby-ssr'),
      options: {"plugins":[],"extensions":[".md",".mdx"],"gatsbyRemarkPlugins":[{"resolve":"gatsby-remark-images","options":{"maxWidth":590,"linkImagesToOriginal":false}},{"resolve":"gatsby-remark-responsive-iframe","options":{"wrapperStyle":"margin-bottom: 1.0725rem"}},"gatsby-remark-copy-linked-files","gatsby-remark-smartypants",{"resolve":"gatsby-remark-vscode","options":{"theme":"Monokai"}}],"defaultLayouts":{},"lessBabel":false,"remarkPlugins":[],"rehypePlugins":[],"mediaTypes":["text/markdown","text/x-markdown"],"root":"/Users/jonathankuperman/workspace/jonkuperman.com"},
    },{
      name: 'gatsby-plugin-mdx-embed',
      plugin: require('/Users/jonathankuperman/workspace/jonkuperman.com/node_modules/gatsby-plugin-mdx-embed/gatsby-ssr'),
      options: {"plugins":[]},
    },{
      name: 'gatsby-plugin-manifest',
      plugin: require('/Users/jonathankuperman/workspace/jonkuperman.com/node_modules/gatsby-plugin-manifest/gatsby-ssr'),
      options: {"plugins":[],"name":"Jon Kuperman's Blog","short_name":"JonKuperman","start_url":"/","background_color":"#ffffff","theme_color":"#663399","display":"minimal-ui","icon":"content/assets/icon.png","legacy":true,"theme_color_in_head":true,"cache_busting_mode":"query","crossOrigin":"anonymous","include_favicon":true,"cacheDigest":"e2af8066bf71c4e25f9d0f006dfcd102"},
    },{
      name: 'gatsby-plugin-react-helmet',
      plugin: require('/Users/jonathankuperman/workspace/jonkuperman.com/node_modules/gatsby-plugin-react-helmet/gatsby-ssr'),
      options: {"plugins":[]},
    },{
      name: 'gatsby-plugin-webmention',
      plugin: require('/Users/jonathankuperman/workspace/jonkuperman.com/node_modules/gatsby-plugin-webmention/gatsby-ssr'),
      options: {"plugins":[],"username":"jonkuperman.com","identity":{"github":"jkup","twitter":"jkup"},"mentions":true,"pingbacks":false,"forwardPingbacksAsWebmentions":"","domain":"jonkuperman.com","fetchLimit":10000},
    },{
      name: 'gatsby-plugin-sitemap',
      plugin: require('/Users/jonathankuperman/workspace/jonkuperman.com/node_modules/gatsby-plugin-sitemap/gatsby-ssr'),
      options: {"plugins":[],"output":"/sitemap","createLinkInHead":true,"entryLimit":45000,"query":"{ site { siteMetadata { siteUrl } } allSitePage { nodes { path } } }","excludes":[]},
    },{
      name: 'gatsby-plugin-feed',
      plugin: require('/Users/jonathankuperman/workspace/jonkuperman.com/node_modules/gatsby-plugin-feed/gatsby-ssr'),
      options: {"plugins":[],"query":"{\n                    site {\n                        siteMetadata {\n                            title\n                            description\n                            siteUrl\n                            site_url: siteUrl\n                        }\n                    }\n                }","feeds":[{"query":"{\n                            allMdx(\n                                sort: { order: DESC, fields: [frontmatter___date] },\n                            ) {\n                                edges {\n                                    node {\n                                        excerpt\n                                        body\n                                        fields { slug }\n                                        frontmatter {\n                                            title\n                                            date\n                                        }\n                                    }\n                                }\n                            }\n                        }","output":"/feed.xml","title":"Jon Kuperman's RSS Feed","link":"https://feeds.feedburner.com/JonKuperman"}]},
    }]
/* global plugins */
// During bootstrap, we write requires at top of this file which looks like:
// var plugins = [
//   {
//     plugin: require("/path/to/plugin1/gatsby-ssr.js"),
//     options: { ... },
//   },
//   {
//     plugin: require("/path/to/plugin2/gatsby-ssr.js"),
//     options: { ... },
//   },
// ]

const apis = require(`./api-ssr-docs`)

function augmentErrorWithPlugin(plugin, err) {
  if (plugin.name !== `default-site-plugin`) {
    // default-site-plugin is user code and will print proper stack trace,
    // so no point in annotating error message pointing out which plugin is root of the problem
    err.message += ` (from plugin: ${plugin.name})`
  }

  throw err
}

export function apiRunner(api, args, defaultReturn, argTransform) {
  if (!apis[api]) {
    console.log(`This API doesn't exist`, api)
  }

  const results = []
  plugins.forEach(plugin => {
    const apiFn = plugin.plugin[api]
    if (!apiFn) {
      return
    }

    try {
      const result = apiFn(args, plugin.options)

      if (result && argTransform) {
        args = argTransform({ args, result })
      }

      // This if case keeps behaviour as before, we should allow undefined here as the api is defined
      // TODO V4
      if (typeof result !== `undefined`) {
        results.push(result)
      }
    } catch (e) {
      augmentErrorWithPlugin(plugin, e)
    }
  })

  return results.length ? results : [defaultReturn]
}

export async function apiRunnerAsync(api, args, defaultReturn, argTransform) {
  if (!apis[api]) {
    console.log(`This API doesn't exist`, api)
  }

  const results = []
  for (const plugin of plugins) {
    const apiFn = plugin.plugin[api]
    if (!apiFn) {
      continue
    }

    try {
      const result = await apiFn(args, plugin.options)

      if (result && argTransform) {
        args = argTransform({ args, result })
      }

      // This if case keeps behaviour as before, we should allow undefined here as the api is defined
      // TODO V4
      if (typeof result !== `undefined`) {
        results.push(result)
      }
    } catch (e) {
      augmentErrorWithPlugin(plugin, e)
    }
  }

  return results.length ? results : [defaultReturn]
}
