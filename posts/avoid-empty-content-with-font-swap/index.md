---
title: "Avoid Rendering Empty Content with font-display: swap"
date: "2020-04-21"
tags: ["CSS"]
---

I've been working on rebuilding my website. I found this awesome font called [Wotfard](http://atipofoundry.com/fonts/wotfard) while browsing [Josh W Comeau](https://joshwcomeau.com/)'s site.

---

## My first attempt

I wanted to add it to my new site so I added this to the top of my global.css file.

```css
@font-face {
  font-family: "Wotfard";
  src: url("/fonts/wotfard-regular-webfont.eot");
  src: url("/fonts/wotfard-regular-webfont.eot?#iefix") format("embedded-opentype"),
    url("/fonts/wotfard-regular-webfont.woff2") format("woff2"),
    url("/fonts/wotfard-regular-webfont.ttf") format("truetype");
  font-weight: normal;
  font-style: normal;
}

body {
  font-family: "Wotfard", sans-serif;
}
```

This worked great! Except for this pesky problem where every time I refresh or load a new page, for a tiny split second, I see a bunch of empty content where the text is supposed to be!

![Flash of empty content.](/img/font.gif)

This is happening because the custom web font takes a split second to load after the page loads. And since all of our text is set to this custom font, our site doesn't have anything to display until the font is finished loading!

Fortunately, this can be fixed with a single line of CSS!

## Introducing font-display: swap

All I did was add `font-display: swap;` to my `@font-face` block.

```css
@font-face {
  font-family: "Wotfard";
  src: url("/fonts/wotfard-regular-webfont.eot");
  src: url("/fonts/wotfard-regular-webfont.eot?#iefix") format("embedded-opentype"),
    url("/fonts/wotfard-regular-webfont.woff2") format("woff2"),
    url("/fonts/wotfard-regular-webfont.ttf") format("truetype");
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

body {
  font-family: "Wotfard", sans-serif;
}
```

and voila! no more flash of unstyled content. Now it loads all of my text with a system font until the web font is ready, and then swaps it in! So it's a little jumpy but better than before!

![Jittery content but no flash!.](/img/font2.gif)
