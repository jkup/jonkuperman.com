---
title: "How to add custom headers to Eleventy with Cloudflare Pages"
description: "Cloudflare pages just announced support for custom headers. Here's how to add them to your Eleventy site."
date: "2021-10-27"
topPost: false
tags: ["Blogging"]
layout: layouts/post.njk
---

https://twitter.com/jkup/status/1453410224119898123

I'm obsessed with [WebPageTest](https://www.webpagetest.org/). It's such an amazing free resource and I use it to measure every project I build. When I first moved this website over to Cloudflare Pages (literally my first day at Cloudflare) I was sad to see it get a FAILING grade on WebPageTest.

https://twitter.com/jkup/status/1424916560980979728

It was getting A's across the board except for the security audit. Digging a bit deeper, it was unhappy that my site was missing a few important security headers.

![WebPageTest Security Failing](/img/webpagetest-security-failing.png)

![WebPageTest Security Details Page](/img/webpagetest-security-reasons.png)

At the time, it wasn't super easy to add custom headers to a Cloudflare Pages project. It was definitely doable! But you needed to build a Cloudflare Worker to sit in front of the site and add response headers. That all changed today!

[Cloudflare adds custom headers for Pages](https://blog.cloudflare.com/custom-headers-for-pages/)

Now you can simply add a `_headers` file to your Pages project and Cloudflare will add them to the responses!

So I went to my website, adding a `_headers` file in the root directory with the security headers in it and deployed!

```
/*
  Content-Security-Policy: default-src 'self'
  X-Frame-Options: DENY
  X-XSS-Protection: 1
  X-Content-Type-Options: nosniff
```

I raced over to check my WebPageTest score and...

![WebPageTest Security Failing](/img/webpagetest-security-failing.png)

Dangit. I checked my `_site` directory and sure enough, there was no `_headers` file in there.

## Adding the headers file to Eleventy

Then I remembered something about static assets on Eleventy. I did a quick search and found this lovely documentation page (their docs are so good) [Passthrough file copy](https://www.11ty.dev/docs/copy/)

So I added this line of code to my `eleventy.js` file:

```javascript
eleventyConfig.addPassthroughCopy({ static: "/" })
```

Now, any files I stick in my `/static/` directory will be directly copied over to the root of my `_site` folder on build! So `/static/_headers` becomes `/_site/_headers` when you run `eleventy`.

Deployed it again and BOOM, A+ city.

![WebPageTest All A's](/img/webpagetest-cloudflare-pages.png)
