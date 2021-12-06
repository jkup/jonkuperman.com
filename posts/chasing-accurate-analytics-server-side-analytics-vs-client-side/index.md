---
title: "Chasing accurate analytics: Server-side vs client-side analytics"
description: "Have you ever wondered if you should be using server-side or client-side analytics? Let's compare them across accuraccy, performance and ease."
image: "/img/chasing-accurate-analytics.png"
date: "2021-12-06"
topPost: false
tags: ["Blogging"]
---

![Blog post banner](/img/chasing-accurate-analytics.png)

I've been thinking about server-side analytics vs client-side. The other day I Tweeted:

https://twitter.com/jkup/status/1465780792940978182

I got a lot of different responses. Some folks prefer server-side and some prefer client-side. Most are unhappy with both! Some folks are upset that ad-blockers make it difficult to get good data. Other folks are finding clever ways of getting around ad-blockers. There is a lot to unpack here!

## What's the problem?

For those that don't know, typical analytics tools like [Google Analytics](https://analytics.google.com/analytics/web/) work by asking website owners to add a JavaScript file to their website. That JavaScript file often fetches more files, adds a [tracking pixel](https://www.digitalmarketer.com/blog/what-is-tracking-pixel/) and starts batching and sending updates to your analytics dashboard as users browse your site.

The problem is that tools like Google Analytics is that they rely on JavaScript being enabled in the user's browser. And with the rise of ad-blockers, more and more users are disabling JavaScript. In fact, over 26% of internet users now use ad-blockers (although this number is likely higher for people that only use desktop computers).

This means that if you're relying on JavaScript-based analytics to figure out how much traffic your website is getting, you're likely going to get bad information.

## Server-side analytics

Server-side analytics software first came out in the mid-2000s and operate by making an HTTP request to the website just like a normal web browser would. This means that it can update your analytics dashboard regardless of whether JavaScript is enabled or not.

Some people suggest that server-side analytics are inherently better than client-side analytics because they're "less invasive" (client-side analytics require JavaScript to run). This is a myth.

Server-side analytics tools gather as much personal information as their client-side counterparts do. The only difference between the two is that because they're not dependent on JavaScript, the amount of information they can gather is greatly reduced (but usually isn't eliminated entirely).

## Client-side analytics

Client-side analytics, on the other hand, get you access to a ton of information. Services like Google Analytics can capture exactly what users are doing on your website when they're doing it, and if they do it multiple times.

The only downside to using Google Analytics is that, as we've established, a lot of users have ad-blockers enabled which means you're not getting an accurate count of how many people are actually visiting your website.

## Client-side vs Server-side comparison

Let's look at a few different metrics and compare the two options.

## Accuracy

As we already covered, client-side analytics can be inaccurate because 100% of users using an ad-blocker or with JavaScript disabled will not be logged. This means, on average, 26% of your visitors will not show up in your analytics dashboard. If you have a website that attracts more technical people (such as this blog!) it could be a lot higher.

On the other hand, server-side analytics suffer from the opposite problem. User's with ad-blockers or JS disabled will show up in the dashboard, but so will a ton of bots and spam content.

This discrepancy can be massive. For example, this month on my personal blog Google Analytics (client-side) shows **1200 unique visitors** but my Cloudflare Analytics (server-side) shows **7000 unique visitors**. As much as I'd love Cloudflare to be right, I suspect the truth is somewhere in between.

**Winner**: Client-Side (Really the bots are winning)

## Ease of use

It used to be quite difficult to set up your own server-side analytics platform. One of the biggest selling points for Google Analytics was that you just had to copy and paste a small JavaScript snippet into your HTML. These days, website hosts like [Netlify](https://www.netlify.com/products/analytics/) and [Cloudflare](https://www.cloudflare.com/analytics/) offer analytics alongside their hosting platform. If you are using one of these platforms to host your website, analytics are just a click away.

**Winner**: tie

## Performance

Another point worth mentioning is that client-side analytics require JS to be sent on each request, slowing your website down. In some cases, this slow down can be negligible but it's worth mentioning that server-side analytics get you some tracking without adding any bloat to your website.

Website bundles are getting bigger every year. In fact, the average time it takes to fully render a web page is 1.5 seconds which means server-side analytics are going to be faster for your users even if you don't care about server costs.

If speed is a big issue for you, server-side analytics might be a better option to help improve your bounce rate and conversion.

**Winner**: Server-side

## What is a visitor, anyway?

There are a lot of bots on the web. Like, a lot. This [report](https://www.imperva.com/blog/bot-traffic-report-2013/?utm_campaign=Incapsula-moved) from Imperva claims that 61.5% of all web traffic comes from bots.

> Compared to the previous report from 2012, we see a 21% growth in total bot traffic, which now represents 61.5% of website visitors.

This makes me feel like the client-side analytics numbers are closer to the truth. They might be a bit low due to ad-blockers, but server-side analytics numbers are very high because of bot traffic.

## What are these bots doing?

The most common types of web traffic bots are:

- search engine crawlers (spiders and worms)
- content scrapers
- comment spammers
- sign-up bots
- malware bots

These bots are all looking for different things. Crawlers and scrapers are looking for content to copy or steal, comment spammers are trying to add links to their websites, sign-up bots are trying to create fake accounts, and malware bots are trying to infect your website.

## Client-side server-side analytics

Or should it be server-side client-side analytics? Anyway if you're up for it you can host your own Google Analytics instance and pipe your server-side traffic to it. This means you don't bloat your website with extra client-side JavaScript but you still get the nice Google dashboard!

https://twitter.com/cramforce/status/1465800579649662980

## Getting tricky

One final option is to be a little tricky. Ad-blockers work by maintaining a list of common ads and tracking endpoints and then blocking all requests to those endpoints. Check out this [massive list](https://easylist.to/easylist/easylist.txt) of blocked endpoints and filenames.

These lists will have all the Google Analytics URLs blocked by default. If you really want to get around this, you can proxy all of your analytics requests through an innocent-looking endpoint. For example, you could use a service like [Plausible](https://plausible.io/) to establish client-side analytics at a custom endpoint that these lists will not block.

You could make an argument that this isn't super ethical. But I'm not sure it's more/less ethical than using a server-side analytics service that tracks users regardless of whether or not they have an ad-blocker or JavaScript disabled.

https://twitter.com/t3dotgg/status/1465787631367716868
