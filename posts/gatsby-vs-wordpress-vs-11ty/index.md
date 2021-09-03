---
title: "Choosing a blogging platform: Gatsby vs. Wordpress vs. 11ty"
date: "2020-04-23"
topPost: true
tags: ["Blogging"]
---

I have a little bit of a problem.

https://twitter.com/jkup/status/1252322493072920577

## My Problem

There are really two parts to my problem. On the one hand, I love new technologies, blogging platforms are getting better at such an exciting pace and it's so much fun to explore them! On the other hand, I want to be blogging more and I **love** to procrastinate by redesigning my blog.

## The Contenders

I've played with a lot of frameworks, but my main 3 favorites are [WordPress](https://wordpress.org/), [11ty](https://www.11ty.dev/), and [Gatsby](https://www.gatsbyjs.org/).

### WordPress

Founded in 2003, WordPress has been a fundamental part of the web for almost two decades! It's a full-fledged Content Management System that offers a great editing experience.

#### Pros

- Beautiful WYSIWYG editor
- A huge community of themes and plugins
- Great security and caching plugins
- Easily connects to any popular third-party services

#### Cons

- Requires a server (more on this later)
- Requires a database
- Must be kept up to date or face security issues
- Most hosts struggle to keep up with increased traffic (more on this later as well)
- Being the most popular blogging platform, it's the most commonly targeted by attackers

The big problem that I have with WordPress is that it's a dynamic application. You need to get a web host running PHP and MySQL and you need to keep WordPress up to date as well as all of your plugins and themes.

If you forget to update, you are susceptible to any number of common attacks. I've had WordPress sites hacked many times when I forget to check-in and update them.

My last problem is also related to its dynamic nature. Since each visitor requires the server to make a MySQL connection, and MySQL has a limit to the number of concurrent connections so if you have an article get popular on Reddit or Hacker News your users may start seeing MySQL errors. This can be mostly avoided by using a good caching plugin.

### 11ty

11ty is a simplified take on static site generators. I've been a huge fan of static sites since Jekyll first came out in 2008. There's something so nice about your website consisting of **only** HTML and CSS.

#### Pros

- Completely secure
- Lighting fast page loads
- Easy to find a host

#### Cons

- No WYSIWYG. You have to edit your posts locally in a text editor with markdown
- Although JavaScript is often seen as the enemy to web performance, there are some really neat things you can do to improve performance with JS.

### Gatsby

A relatively new player on the scene, Gatsby takes an innovative approach to generating static sites. It comes with a rich plugin ecosystem that provides out of the box support for really cool things.

#### Pros

- Progressively loading images
- Offline page access
- Prefetching linked pages

#### Cons

- Slow build times (it's doing a lot of work!)
- Slower initial page load (with faster consecutive loads)

## My conclusion

After a lot of thought and experimentation, I decided to go with Gatsby and host my site on [Netlify](https://www.netlify.com/). I'm really happy with it so far.
