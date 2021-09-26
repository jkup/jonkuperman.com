---
title: "How to update node js"
description: "Want to learn how to update node js? This guide will show you how no matter which tool you used to install node.js in the first place!"
date: "2021-02-21"
tags: ["Tips", "Node"]
---

Want to learn how to update node js? It really depends on **how** you installed it in the first place! Let's look at your options:

---

## Option 1 (recommended) - NVM

The absolutely best way to install node js (and update node js later) is to use the [Node Version Manager](https://github.com/nvm-sh/nvm).

This will work even if you already have Node js installed some other way. You can just open up a terminal and run:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash
```

Note: For any installation help, check out their [official README](https://github.com/nvm-sh/nvm/blob/master/README.md)

And then run `nvm install YOUR-VERSION-OF-NODE. For example:

```bash
nvm install v15.9.0
```

And then set it to default by using:

```bash
nvm alias default v15.9.0
```

And you are good to go!

## Option 2 - Official Installer

You can head over to the [Node js website](https://nodejs.org/en/) and grab either the latest LTS (Long Term Support) build or the absolutely latest release. If the version you want to update to is not on there you can view their [releases page](https://nodejs.org/en/about/releases/) and if you have a different operating system you can find the download you need on their [download page](https://nodejs.org/en/download/).

## Conclusion

If you are looking for how to update node js, I really recommend taking a few minutes out of your day and moving over to the Node Version Manager. That way future updates will be a breeze! But if you need a specific binary version and don't want to use NVM. Feel free to check out the releases page above!
