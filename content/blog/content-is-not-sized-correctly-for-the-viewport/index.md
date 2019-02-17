---
title: "Lighthouse Error: Content is not sized correctly for the viewport"
date: "2018-11-18T22:12:05.284Z"
---

If you're like me, you probably spend quite a bit of time chasing those perfect 100's in [Lighthouse](https://developers.google.com/web/tools/lighthouse/). One error I've run into multiple times is `Content is not sized correctly for the viewport`.

This error can occur for multiple reasons. The Lighthouse rule checks

```javascript
window.innerWidth === window.outerWidth;
```

Sometimes you have some quirky CSS causing this problem but something that's happened to me time and time again is leaving my browser tab zoomed in. If you zoom in our out before running a Lighthouse Audit, it can report back a false positive for content not being correctly sized for the viewport.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Did you know that zooming in on a website can affect its <a href="https://twitter.com/____lighthouse?ref_src=twsrc%5Etfw">@____lighthouse</a> score? <a href="https://t.co/y9agBezIty">pic.twitter.com/y9agBezIty</a></p>&mdash; Jon Kuperman (@jkup) <a href="https://twitter.com/jkup/status/1064354253831958529?ref_src=twsrc%5Etfw">November 19, 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

This is because the value of `window.innerWidth` changes as you zoom in or out but `window.outerWidth` stays the same!

So make sure you cmd+0 (or ctrl+0) before runnning that audit!
