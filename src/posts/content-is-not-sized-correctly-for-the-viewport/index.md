---
title: "Lighthouse Error: Content is not sized correctly for the viewport"
date: "2018-11-18"
tags: ["Performance"]
---

If you're like me, you probably spend quite a bit of time chasing those perfect 100's in [Lighthouse](https://developers.google.com/web/tools/lighthouse/). One error I've run into multiple times is `Content is not sized correctly for the viewport`.

This error can occur for multiple reasons. The Lighthouse rule checks

---

```javascript
window.innerWidth === window.outerWidth
```

Sometimes you have some quirky CSS causing this problem but something that's happened to me time and time again is leaving my browser tab zoomed in. If you zoom in our out before running a Lighthouse Audit, it can report back a false positive for content not being correctly sized for the viewport.

https://twitter.com/jkup/status/1064354253831958529

This is because the value of `window.innerWidth` changes as you zoom in or out but `window.outerWidth` stays the same!

So make sure you cmd+0 (or ctrl+0) before running that audit!
