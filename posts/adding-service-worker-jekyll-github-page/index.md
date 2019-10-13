---
pageTitle: "Adding a Service Worker to a Jekyll blog hosted on GitHub Pages"
date: "2018-11-18T22:12:13.284Z"
---

I need to refresh my blog!

> ...famous last words

After a few days of researching all the latest and greatest technology, I ended up back where I started. Running a [Jekyll](https://jekyllrb.com/) blog on [GitHub Pages](https://pages.github.com/). Although there are a lot of great options out there, I'm pretty lazy, and this approach still works great!

One thing I was excited about with an alternative like [Gatsby](https://www.gatsbyjs.org/) or [Next.js](https://nextjs.org/) was taking advantage of some of the new web APIs like [Service Workers](https://developers.google.com/web/fundamentals/primers/service-workers/) and [Manifest](https://developers.google.com/web/fundamentals/web-app-manifest/) files. Luckily I found a [great looking plugin](https://github.com/lavas-project/jekyll-pwa) which generates Service Workers for you!

## Not So Fast

I installed the PWA plugin, configured it, and noticed it running smoothly in development! It couldn't have been easier. Unfortunately, when I went to deploy it to production, I didn't see the Service Worker, and the app was not available offline!

It seems like while GitHub pages host Jekyll sites easily, they run Jekyll in "safe mode" which disallows the use of many plugins. Back to the drawing board.

My next thought was to check out [Workbox](https://developers.google.com/web/tools/workbox/). Workbox is an initiative by the folks at Google to make Service Worker generation and customization easy.

I've used Workbox before with JS heavy apps alongside build tools like Gulp and Webpack. The integration with these build tools is seamless, but they didn't have a clean option for Jekyll.

## Introducing workbox-cli!

Workbox provides an [out of the box solution](https://developers.google.com/web/tools/workbox/modules/workbox-cli) for apps that don't use Webpack or Gulp. It's a standalone CLI app that can be installed with `npm install workbox-cli -g` and then used with a command like `workbox wizard`. The wizard generates a workbox-config.js file which then can be used to generate a service-worker.js file. Here is my lightweight configuration:

```javascript
module.exports = {
  globDirectory: "./_site",
  globPatterns: ["**/*.{html,css,png,ico,xml,json,js}"],
  swDest: "./sw.js"
};
```

Which generates something like this:

```json
/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "2018/11/18/content-is-not-sized-correctly-for-the-viewport.html",
    "revision": "b8296e61e61b180e1b4f7606c332d27a"
  },
  {
    "url": "2018/11/18/getting-started-with-asts.html",
    "revision": "9a7f7ec5aee1b59c98179f4eee0c4051"
  },
  {
    "url": "css/style.css",
    "revision": "5a5ff92978aed905a5cfcd43acdd3ed1"
  },
  {
    "url": "favicon-16x16.png",
    "revision": "c11b060a3fc097bb5dfa397801696181"
  },
  {
    "url": "favicon-32x32.png",
    "revision": "4106c0929ea4e86af8b4c32b3c5cb005"
  },
  {
    "url": "favicon-96x96.png",
    "revision": "258c7595bce80a8c608e51ae227d84eb"
  },
  {
    "url": "favicon.ico",
    "revision": "b4edcd8aecd2b771aec9a39cb032f740"
  },
  {
    "url": "feed.xml",
    "revision": "a4e7f5bdfb297a383c7e6e513abdb5a8"
  },
  {
    "url": "google115b0b3efae5b385.html",
    "revision": "4be3d71ff251a338c77a1e0d2e263e53"
  },
  {
    "url": "images/icons/icon-128x128.png",
    "revision": "406286c197ab21ec8bfc84bef3bbfd92"
  },
  {
    "url": "images/icons/icon-144x144.png",
    "revision": "05d0ef9821328286268e681a4edb649d"
  },
  {
    "url": "images/icons/icon-152x152.png",
    "revision": "5319ce81e0070ed214e0904053d91a43"
  },
  {
    "url": "images/icons/icon-192x192.png",
    "revision": "6738ac38beff3020bc1478994b6b1dd1"
  },
  {
    "url": "images/icons/icon-384x384.png",
    "revision": "2bd87bce217800ce8611c965b4e16c5c"
  },
  {
    "url": "images/icons/icon-512x512.png",
    "revision": "068ef79122e182e250ea12d541204655"
  },
  {
    "url": "images/icons/icon-72x72.png",
    "revision": "efe5da2908f53b6704e8e31a5691c6c0"
  },
  {
    "url": "images/icons/icon-96x96.png",
    "revision": "d992f5f38ea810ae6d062138b3070909"
  },
  {
    "url": "index.html",
    "revision": "4a2eab3f48167712ece3bdaea38f88bf"
  },
  {
    "url": "manifest.json",
    "revision": "cf78eefd76455d552c13a40594d9476c"
  },
  {
    "url": "workbox-config.js",
    "revision": "5a236654f477f68ae3829b7f219715db"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
```

The specific thing to note (which makes this work well with Jekyll) is that Workbox gathers its list of files from the generated \_site/ directory. If Workbox wrote the sw.js file to that directory it would just get deleted on the next Jekyll serve. Instead it reads from \_site/ and writes to ./ so that the generated file will be put back in \_site/ by Jekyll serve.

Does anyone have a better approach?
