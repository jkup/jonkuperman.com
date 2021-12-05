---
title: "Increase Gatsby performance with Webpack Bundle Analyzer"
description: "Learn how to use Gatsby, webpack-bundle-analyzer, npm and the Chrome DevTools to increase the performance of your site!"
date: "2021-02-16"
tags: ["JavaScript", "Performance", "Compilers"]
---

I've been using webpack bundle analyzer a lot lately.

Over the past few days, it started to feel a little sluggish when I would refresh. I remember when I first launched this version of the site on [Gatsby](https://www.gatsbyjs.com/) and [Netlify](https://www.netlify.com/) it felt lightning fast!

---

## Measuring Gatsby Page Performance with Webpack bundle analyzer

Before I started diving in, I just wanted to see if I was correct that it had slowed down. I started up a production build on my local machine by running:

```bash
gatsby build
gatsby serve
```

Next I went to `https://localhost:9000` (my gatsby dev server running in prod mode) and opened it in an Incognito\* tab.

\* This is important because browser extensions can really mess with the DevTools. If you want to get a fair audit, disable all your extensions or open the page in an Incognito window.

I went to the Network tab and did a refresh. Here's what I saw:

![Gatsby site performance before fix](/img/gatsby-performance-before.png)

Really not great. I mean, not bad for a big feature rich application but this is just a simple blog. I swear it wasn't taking that long to load a few days ago!

## Analyzing your Webpack bundle

I knew my site was loading slow. And I knew that the culprit must be too much JavaScript. But what was causing it? Where was all that JS coming from?

There is this amazing tool called [Webpack Bundle Analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer). It hooks into your Webpack build and displays a really nice UI showing you all the stuff inside your bundle and how big it is!

Luckily for me, someone already made a [Gatsby plugin](https://www.gatsbyjs.com/plugins/gatsby-plugin-webpack-bundle-analyser-v2/) that sets Webpack Bundle Analyzer up for me! So all I had to do was

```bash
npm i gatsby-plugin-webpack-bundle-analyser-v2 -D
```

And then add it to my plugins list in my `gatsby-config.js`.

```javascript
module.exports = {
  plugins: ["gatsby-plugin-webpack-bundle-analyser-v2"],
}
```

I ran `gatsby build` again and this is what I saw:

![Webpack bundle analyzer output](/img/webpack-bundle-analyzer.png)

Yikes. What is Lottie!? It's taking up so much space and I don't remember installing anything by that name.

### npm ls

Fortunately again, npm provides an awesome tool where you can give it a package name and it will tell you why that package is in your `node_modules`. So, for Lottie which we can see in the image above has a package name of "lottie-web", you can type:

```bash
npm ls lottie-web
```

And I got:

```bash
☁  jonkuperman.com [master] ⚡ npm ls lottie-web
jonkuperman@0.1.0 /Users/kuperman/workspace/jonkuperman.com
└─┬ react-dark-mode-toggle@0.0.10
  └─┬ lottie-react-web@2.2.2
    └── lottie-web@5.7.6
```

Oh no! My favorite new [React component](https://www.npmjs.com/package/react-dark-mode-toggle) is slowing down my website with it's amazing animations and beautiful icons.

I could remove it. Replace it with a simple button like I used to have. But I really like it.

## Gatsby Code Splitting

Gatsby uses React and Webpack. Webpack supports a feature called [code splitting](https://webpack.js.org/guides/code-splitting/) which is, according to their site:

> Code splitting is one of the most compelling features of webpack. This feature allows you to split your code into various bundles which can then be loaded on demand or in parallel. It can be used to achieve smaller bundles and control resource load prioritization which, if used correctly, can have a major impact on load time.

That sounds like exactly what we need. Fortunately for us, the React team has already worked with the Webpack team and come up with a syntax that tells the bundler to split out an import and load it asynchronously. It's called [React.lazy](https://reactjs.org/docs/code-splitting.html).

I went to my Header component, which contains the dark mode toggle (which contains lottie!) and it looked like this (simplified):

```javascript
import React from "react"
import DarkModeToggle from "react-dark-mode-toggle"
const Header = props => {
  return (
    <>
      <div className="navigation">
        <DarkModeToggle />
      </div>
    </>
  )
}
```

All I had to do was switch it to the `React.lazy` syntax and Gatsby/React/Webpack would take care of the rest! The new syntax looks like:

```javascript
import React, { Suspense } from "react"
// React.lazy syntax for importing
const DarkModeToggle = React.lazy(() => import("react-dark-mode-toggle"))
const Header = props => {
  return (
    <>
      <div className="navigation">
        {/* a cool syntax for specifying what HTML to display
                while the component is loading*/}
        <Suspense fallback={<div>Loading...</div>}>
          <DarkModeToggle />
        </Suspense>
      </div>
    </>
  )
}
```

Now if we load our site again we should see 1 more Network request than we had before and for a split second we should see "Loading..." before the DarkModeToggle comes into view.

The upside though is that our site loads quite a bit faster!

![Gatsby site performance after fix](/img/gatsby-performance-after.png)

Looks like:

- The Finish time went from 772ms to 236ms.
- DOMContentLoaded went from 222ms to 36ms!
- The Load time went from 530ms to 193ms.

## Conclusion

If you're adding a bunch of dependencies and your Gatsby site gets slow:

1. Check the Network tab in the DevTools to make sure it's actually slow.
1. Install webpack-bundle-analyzer and run it against your site.
1. Run npm ls package-name to figure out where any surprise packages are coming from.
1. Wrap any big React Components that you don't need on page load in `React.lazy`
