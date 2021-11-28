---
title: "A Content Security Policy for Google Analytics"
date: "2021-11-27"
tags: ["Security"]
---

So you want to add Google Analytics to a website that has a [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)? Well you are in for a treat!

The problem is that having a good CSP locks your site down. That means scripts, CSS, fonts, etc cannot connect to outside sources unless they are specified as ok by your CSP.

In short, you can grab the CSP below if you'd like to just move right along. It should allow everything you need to get Google Analytics working.

One final note is that Google Analytics, be default, enables DoubeClick ad tracking. If you aren't making active use of that you should just disable it. More on that later!

A working CSP:

```bash
  Content-Security-Policy: default-src 'self'; script-src 'self' https://www.google-analytics.com https://ssl.google-analytics.com https://www.googletagmanager.com 'unsafe-inline'; img-src 'self' https://www.google-analytics.com; connect-src https://www.google-analytics.com;
```

## A frustrating evening

![My GitHub history getting angry while I work on this CSP project](/img/github-history-csp-google-analytics.png)

The main problems here are:

1. Google Analytics has scripts that call other scripts, add tracking pixels (images) and make connections.
2. Every time you add a new CSP category (default-src, script-src, etc) it will break all your current requests unless you remember to add `self`.
3. It's kind of annoying to test CSPs without building and deploying your site each time.
4. You can't have whitespace within a CSP line so they get really, REALLY long.

## Breaking down the CSP

Even though you'll have to copy and paste the snippet above to get it to work, let's add some whitespace just so we can read through it together.

```bash
Content-Security-Policy:
    default-src 'self';
    img-src 'self' https://www.google-analytics.com;
    connect-src https://www.google-analytics.com;
    script-src 'self' https://www.google-analytics.com https://ssl.google-analytics.com https://www.googletagmanager.com 'unsafe-inline';
```

- The `default-src` policy is a fallback. It says that if you don't specify a policy, in this case we don't have one for `font-src`, it will inherit the behavior of the `default-src`.
- Images are allowed to come from the self host or Google Analytics.
- Connections can come from Google Analytics.
- Scripts can come from the self host, Google Analytics, the ssl Google Analytics domain and the Google Tag Manager domain.

## Removing DoubleClick

If you get this working, you should be able to deploy your site with Google Analytics and see only one remaining error in the console. It's complaining about DoubleClick.

Go into your GA dashboard and click **Admin** -> **Tracking Info** -> **Data Collection** and toggle the "Advertising Reporting Features" to "off".

You should be good to go!
