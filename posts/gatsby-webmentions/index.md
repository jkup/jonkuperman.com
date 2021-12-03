---
title: "Setting up Gatsby Webmentions on your site"
description: "Learn how to display Webmentions from your favorite social networks on your Gatsby site"
date: "2021-02-14"
topPost: true
tags: ["JavaScript", "Blogging"]
---

I spent a lot of Sunday... ok pretty much **all** of Sunday setting up Webmentions on my Gatsby site so when people Tweet about my blog posts they show up like comments!

https://twitter.com/jkup/status/1360786533280800775

There are already quite a few articles on how to do this but I still got pretty stuck along the way so I figured I'd write another one.

---

## TL;DR

1. Make an account at <a href="https://webmention.io/">webmention.io</a>. Link it to your Twitter account. This means making one of those `rel="me"` links like they suggest!
1. Make a <a href="https://brid.gy/">Bridgy</a> account. Link it to your Twitter as well.
1. Install this awesome <a href="https://github.com/ChristopherBiscardi/gatsby-plugin-webmention">Gatsby Plugin</a>. Follow the instructions in the README and get your "token" from the webmention.io page above.
1. Copy literally all of my code from <a href="https://github.com/jkup/jonkuperman.com/blob/a3b7417af6b3db4197eba3d85efc6c381327b9f0/src/utils/webmentions.js">this file</a>. Don't feel bad! I stole most of it from <a href="https://twitter.com/mxstbr">Max Stoiber</a>. DO NOT TELL MAX.
1. In your `blog-post.js` file, import the util you just copy/pasted and call it (example below).
1. Copy <a href="https://github.com/jkup/jonkuperman.com/blob/a3b7417af6b3db4197eba3d85efc6c381327b9f0/src/components/global.css#L446">my CSS</a> too if you want! I stole that from a **different** person named <a href="https://twitter.com/mxbck">Max</a>!
1. Instead of running `yarn develop` or `npm run develop` you now have to run `WEBMENTIONS_TOKEN=YOUR_TOKEN npm run develop`. This is your life now. Update your deploy target too like your Netlify ENV variables or whatever.
1. Profit.

```javascript
// blog-post.js
import WebMentions from "../utils/webmentions.js"
;<WebMentions url={location.href} />
```

## Prior art

I was only able to figure this out because of some amazing blog posts. I'm only writing this post because I still managed to struggle to get things working so I'm hoping this might be helpful to someone.

1. This <a href="https://github.com/aarongustafson/jekyll-webmention_io">Jekyll Webmention Plugin</a>
1. This <a href="https://mxb.dev/blog/using-webmentions-on-static-sites/">post</a> on setting up Webmentions with Eleventy
1. This <a href="https://www.swyx.io/clientside-webmentions/">post</a> on setting up Webmentions with Svelte
1. Some <a href="https://github.com/mxstbr/mxstbr.com/blob/49aceb93a43d1e87736f204f26c07e203cb2a0e1/components/WebMentions/WebMentionCounts.js">code</a> I stole from Max Stoiber that no longer works but is super close to working!
1. The <a href="https://www.w3.org/TR/webmention/">Webmention Spec</a> haha jk I didn't read the spec

## Tools we'll need

1. <a href="https://brid.gy/">brid.gy</a>. This site uses social network APIs to find all mentions of your site and generate Webmentions for each mention.
1. <a href="https://webmention.io/">webmention.io</a>. A free, hosted service that receives and stores all the Webmentions Bridgy sends. This will also act as the API for our static Gatsby site!
1. <a href="https://github.com/ChristopherBiscardi/gatsby-plugin-webmention">gatsby-plugin-webmention</a>. You can totally configure Webmentions yourself. You have to add some &lt;link>`s to the &lt;head> and configure your social network handles but **also** you can just install this handy plugin by <a href="https://twitter.com/chrisbiscardi">Chris</a> and save yourself the trouble!

## The basic idea

At a high level, we want to set up <a href="https://brid.gy/">brid.gy</a> to watch Twitter for any tweets that mention our blog! When it finds one, it will send a Webmention to our site which <a href="https://webmention.io/">webmention.io</a> will see and add to it's database! That way, in client-side JavaScript we can hit <a href="https://webmention.io/">webmention.io</a> and give it a certain post and it will return to us all of the "likes" and "mentions" for that post which we can display however we want!

## The implementation

### 1. Setting up third party services

1. Register our <a href="https://brid.gy/">brid.gy</a> and <a href="https://webmention.io/">webmention.io</a> accounts. For webmention.io you have to add a twitter link to your site with the `rel="me"` attribute.

If you get stuck on setting these up please <a href="https://twitter.com/intent/tweet/?text=@jkup%20how%20could%20you">holler at me!</a> and I'll update this post.

### 2. Configuring our Gatsby site

The easiest way to do this is to copy your auth token from <a href="https://webmention.io/">webmention.io</a>, install <a href="https://github.com/ChristopherBiscardi/gatsby-plugin-webmention">gatsby-plugin-webmention</a> and then copy paste the config file from the README and add it to your **gatsby-config.js**.

The other option is you can log into webmention.io and go to <a href="https://webmention.io/settings">settings</a> where you'll get 2 links to copy/paste into your site's head tag. For example, mine look like:

```javascript
<link rel="webmention" href="https://webmention.io/jonkuperman.com/webmention" />
<link rel="pingback" href="https://webmention.io/jonkuperman.com/xmlrpc" />
```

Add those to the head by using `react-helmet` and you should be good to go!

### Fetching the mentions

I took a lot of liberties here. Essentially, we'll want to hit two different webmention.io endpoints.

1. You'll want to load the count for your post. This is how many likes/retweets/mentions/replies your post got!

A few things to note here:

1. The api endpoint looks like `https://webmention.io/api/count.json?target=${target}` where `target` is the full URL of your blog post. I pass `location.href` into my `<Webmentions>` component from `blog-post.js` and then use that as the target.
1. As <a href="https://twitter.com/swyx">@swyx</a> says in his blog post, make sure whatever you do, the target ends with a trailing slash or it won't work!
1. I smoosh all my likes and reposts together and also my mentions and replies (code below). That way I can show a nice heart icon followed by the total count of likes and reposts and then a nice message icon followed by mentions plus replies.

```jsx
<span>
  <Heart color="#e0245e" />
  {type.like || 0 + type.repost || 0}
  <MessageCircle color="#17bf63" />
  {type.mention || 0 + type.reply || 0}
</span>
```

2. You'll want to load all the mentions so you can display them like comments!

1. The api endpoint for mentions is paginated and looks like `https://webmention.io/api/mentions?page=${page}&per-page=20&sort-dir=up&sort-by=published&target=${target}` where `target` is the full URL of your blog post and `page` is the current page (starting at 0) of the paginated api.

REMINDER: You can skip reading all of this and copy/paste the code directly from <a href="https://github.com/jkup/jonkuperman.com/blob/a3b7417af6b3db4197eba3d85efc6c381327b9f0/src/utils/webmentions.js">my repo</a>!

I made one function for fetching the count and one for fetching the mentions themselves:

```javascript
export const loadWebMentionCounts = async target => {
  return fetch(`https://webmention.io/api/count.json?target=${target}`)
    .then(res => res.json())
    .then(res => res.type)
}

export const loadWebMentions = async (target, page = 0) => {
  return fetch(
    `https://webmention.io/api/mentions?page=${page}&per-page=20&sort-dir=up&sort-by=published&target=${target}`
  )
    .then(res => res.json())
    .then(json => (Array.isArray(json.links) ? json.links : []))
}
```

Then I made my `<Webmentions>` component have a `useEffect` hook for each:

```javascript
export default function WebMentions({ url }) {
  const [type, setType] = useState({})
  const [page, setPage] = useState(0)
  const [links, setLinks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPage() {
      loadWebMentions(url, page).then(returnedLinks => {
        setLoading(false)
        setLinks(links => links.concat(returnedLinks))

        if (returnedLinks.length === 20) {
          setPage(page + 1)
        }
      })
    }

    loadPage()
  }, [url, page])

  useEffect(() => {
    loadWebMentionCounts(url).then(data => setType(data))
  }, [url])
}
```

## FAQ

### I'm stuck

Please please please @mention me on Twitter! I'll do my best to help you out and then update this post!

### Someone else wrote this better

Totally.

### Some of my Webmentions aren't making it to my site

I'm seeing that too. For me at least they are picked up by Bridgy and it says they are "sent" but webmention.io never gets them. You can manually re-send them via Bridgy but I don't know why that happens.

### Your code is bad

You sound like my manager.

### Some of the build time examples like the Eleventy one have a fancy cache and make things faster

Yep.

### I Tweeted my site link and it's not showing up

They take a while. Bridgy seems to poll Twitter every hour. If you're in a real hurry you can log in and force a re-poll but yeah it's a bit slow.
