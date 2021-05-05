---
title: 'Exciting movement in JavaScript tooling'
description: ''
date: '2021-05-04'
tags: ['JavaScript', 'Compilers']
---

It's been an exciting month for the JavaScript tooling ecosystem. I've never been much good at guessing what's coming next, but there are a lot of projects that have me very excited.

First, [Snowpack](https://www.snowpack.dev/) launched. Now that JS has a proper [module system](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules), you can literally just export and import components with no need for a bundler in modern browsers. Snowpack takes advantage of this by skipping the "bundle" step entirely and just letting you serve your ESM (JS module) components natively.

Then, [esbuild](https://esbuild.github.io/) hit the scene. A JavaScript bundler written in Go that produces bundles at 10x-100x the speed of tools like webpack, Rollup, and parcel. It's still in the early stages, but playing around with it, it's a game-changer.

![Esbuild states](./esbuild.png)

Then, the team behind Vue.js came out with an exciting project called [vite](http://vitejs.dev/). You can think of vite like using Snowpack for dev mode and Rollup for production. Vite lets you have lightning-fast rebuilds (no bundling needed) while you're working and then deploy a proper bundled app to production.

![Vite logo](./vite.png)

As if this week couldn't get more exciting, the Parcel team [rewrote the transformer in Rust](https://github.com/parcel-bundler/parcel/pull/6230). They are seeing a 10x improvement in speed with the new Rust PR. It looks like it wasn't just changing languages but a more efficient transform algorithm that helped speed things up!

But wait, there's more! Sebastian and Jamie, the team behind Babel and Rome, announced today that they have secured VC funding and are building a company around Rome, their new all-in-one linter/compiler/bundler for JavaScript!

<Tweet tweetLink="sebmck/status/1389609712220528643" />

I hope my apps get faster soon. So many amazing people doing amazing work.
