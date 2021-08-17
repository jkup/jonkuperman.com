module.exports = [{
      plugin: require('../node_modules/gatsby-plugin-mdx/gatsby-browser.js'),
      options: {"plugins":[],"extensions":[".md",".mdx"],"gatsbyRemarkPlugins":[{"resolve":"gatsby-remark-images","options":{"maxWidth":590,"linkImagesToOriginal":false}},{"resolve":"gatsby-remark-responsive-iframe","options":{"wrapperStyle":"margin-bottom: 1.0725rem"}},"gatsby-remark-copy-linked-files","gatsby-remark-smartypants",{"resolve":"gatsby-remark-vscode","options":{"theme":"Monokai"}}],"defaultLayouts":{},"lessBabel":false,"remarkPlugins":[],"rehypePlugins":[],"mediaTypes":["text/markdown","text/x-markdown"],"root":"/Users/jonathankuperman/workspace/jonkuperman.com"},
    },{
      plugin: require('../node_modules/gatsby-plugin-mdx-embed/gatsby-browser.js'),
      options: {"plugins":[]},
    },{
      plugin: require('../node_modules/gatsby-plugin-manifest/gatsby-browser.js'),
      options: {"plugins":[],"name":"Jon Kuperman's Blog","short_name":"JonKuperman","start_url":"/","background_color":"#ffffff","theme_color":"#663399","display":"minimal-ui","icon":"content/assets/icon.png","legacy":true,"theme_color_in_head":true,"cache_busting_mode":"query","crossOrigin":"anonymous","include_favicon":true,"cacheDigest":"e2af8066bf71c4e25f9d0f006dfcd102"},
    },{
      plugin: require('../node_modules/gatsby-plugin-webmention/gatsby-browser.js'),
      options: {"plugins":[],"username":"jonkuperman.com","identity":{"github":"jkup","twitter":"jkup"},"mentions":true,"pingbacks":false,"forwardPingbacksAsWebmentions":"","domain":"jonkuperman.com","fetchLimit":10000},
    },{
      plugin: require('../gatsby-browser.js'),
      options: {"plugins":[]},
    }]
