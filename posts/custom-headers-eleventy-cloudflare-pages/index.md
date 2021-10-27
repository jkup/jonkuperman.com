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

## And then everything broke...

I was so pumped! I wrote this blog post and Tweeted it! But then when I went to view it, I noticed that my Tweet embeds weren't working. I looked in the console and my Google Fonts and inline scripts stopped working too!

Dang you, CSP!

Ok so I found this awesome website on [content security policies](https://content-security-policy.com/) and scraped together some allowed domains to get my Google Fonts and Twitter embeds working again.

```
Content-Security-Policy: default-src 'self';font-src fonts.gstatic.com;style-src 'self' fonts.googleapis.com 'sha256-5g0QXxO6NfvHJ6Uf5BK/hqQHtso8ZOdjlnbyKtYLvwc='; script-src 'self' platform.twitter.com syndication.twitter.com; frame-src 'self' platform.twitter.com
```

But what about my sweet dark mode toggle which is some inline JavaScript?

It turns out you have three choices:

1. Use a [nonce](https://content-security-policy.com/nonce/)
2. Use the 'unsafe-inline' [option](https://content-security-policy.com/unsafe-inline/)
3. Generate a SHA hash and allow that.

I like pain so I chose option #3. I minified all of my inline JS into a single line

```javascript
<script>function toggle_light_mode(){"dark"==localStorage.getItem("theme")?(localStorage.setItem("theme","light"),document.documentElement.setAttribute("data-theme","light")):(localStorage.setItem("theme","dark"),document.documentElement.setAttribute("data-theme","dark"))}"dark"===localStorage.getItem("theme")?document.documentElement.setAttribute("data-theme","dark"):document.documentElement.setAttribute("data-theme","light");</script>
```

And then I ran

```sh
echo -n 'that single line of js above' | openssl sha256 -binary | openssl base64
```

And that generated a unique hash, `8ZCTxR11UEYhveA/O/iAlHa4qNfBXa9oH8mU57KOrps=`.

Finally, I added `sha256-that_hash_above` to the `script-src` section of my `_header` file. So now it looks like

```
/*
Content-Security-Policy: default-src 'self';font-src fonts.gstatic.com;style-src 'self' fonts.googleapis.com 'sha256-5g0QXxO6NfvHJ6Uf5BK/hqQHtso8ZOdjlnbyKtYLvwc='; script-src 'self' platform.twitter.com syndication.twitter.com 'sha256-8ZCTxR11UEYhveA/O/iAlHa4qNfBXa9oH8mU57KOrps='; frame-src 'self' platform.twitter.com
```

I really need to get back to work 😅