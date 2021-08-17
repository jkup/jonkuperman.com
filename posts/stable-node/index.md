---
title: "Stable Node Versions"
description: "How to find the latest stable node versions and what does stable or long term support actually mean"
date: "2021-02-22"
tags: ["Node"]
---

If you're looking to find stable node versions, head over to [nodejs.org](https://nodejs.org/en/) and look for the button on the left side. That will always point to the current LTS (Long Term Support) version which you can download.

![node stable version website](/img/stable-node-versions.png)

LTS versions of stable node mean they will get critical bug fixes for **30 months**. You can read more on the [node.js releases page](https://nodejs.org/en/about/releases/) which says:

> Major Node.js versions enter Current release status for six months, which gives library authors time to add support for them. After six months, odd-numbered releases (9, 11, etc.) become unsupported, and even-numbered releases (10, 12, etc.) move to Active LTS status and are ready for general use. LTS release status is "long-term support", which typically guarantees that critical bugs will be fixed for a total of 30 months. Production applications should only use Active LTS or Maintenance LTS releases.

## Using the "n" node module for stable node versions

Another approach you could take is to install the [n module](https://www.npmjs.com/package/n) which helps you "Interactively Manage Your Node.js Versions". It also comes with a stable command so you can simply run:

```bash
npm install -g n
n stable
```
