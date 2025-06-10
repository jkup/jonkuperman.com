---
title: "Chatting with an old friend"
date: "2025-06-10"
topPost: true
tags: ["Life"]
---

Mikeal Rogers passed away yesterday. We weren't especially close but he had a profound impact on my life and was always very kind to me. One of my favorite tweets of all time was from him, when I gave a talk as a young kid about how cool Chrome DevTools were and the Chrome DevTools team showed up unexpectedly to watch.

He was a hugely influenctial person. His work on Node.js, TC39, web3, has been foundational to the web we have today.

<blockquote class="twitter-tweet" data-dnt="true" align="center"><p lang="en" dir="ltr">Watching <a href="https://twitter.com/paul_irish?ref_src=twsrc%5Etfw">@paul_irish</a> watch a talk at <a href="https://twitter.com/wafflejs?ref_src=twsrc%5Etfw">@wafflejs</a> about Chrome Dev Tools. <a href="https://t.co/nXNAIUIn8f">pic.twitter.com/nXNAIUIn8f</a></p>&mdash; Mikeal Rogers (@mikeal) <a href="https://twitter.com/mikeal/status/684960175527084032?ref_src=twsrc%5Etfw">January 7, 2016</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

I was reading Jenn Schiffer's Bluesky post about him when I realized I had also recorded a podcast with Mikeal, way back in the day.

<blockquote class="bluesky-embed" data-bluesky-uri="at://did:plc:x5leeami62gbmjekf7ro6sqo/app.bsky.feed.post/3lrbfmksxnk2d" data-bluesky-cid="bafyreigelu2ngfgbnhgs66fdauct2nduwkwe5sqimi4ltingddrrivtncy" data-bluesky-embed-color-mode="system"><p lang="en">a collaborator and friend has moved on this week, and in memoriam i wanted to share my train of thought in grief.<br><br><a href="https://bsky.app/profile/did:plc:x5leeami62gbmjekf7ro6sqo/post/3lrbfmksxnk2d?ref_src=embed">[image or embed]</a></p>&mdash; jenn schiffer 🕷️🕯️ (<a href="https://bsky.app/profile/did:plc:x5leeami62gbmjekf7ro6sqo?ref_src=embed">@jennschiffer.com</a>) <a href="https://bsky.app/profile/did:plc:x5leeami62gbmjekf7ro6sqo/post/3lrbfmksxnk2d?ref_src=embed">June 10, 2025 at 6:19 PM</a></blockquote><script async src="https://embed.bsky.app/static/embed.js" charset="utf-8"></script>

## The Web Behind

I had started this podcast called The Web Behind to interview developers I knew (mostly in SF) and ask them about how they got their start. It was really fun for me getting to know people and hearing their diverse stories. I went to go to my [old website](https://webbehind.com/) to listen to the episode with Mikeal but there was a problem.

![web behind website is gone](/img/web-behind-gone.png)

That's annoying, but then I figured I could use the way back machine to find it!

I found a snapshot of the old site, and found the link for the episode! But there was no audio embed!

![wayback machine web behind](/img/wayback-web-behind.png)

That's ok, I opened the Chrome Devtools and found the embed link! It's for a Soundcloud file. But when I clicked on it, it just redirect to the Soundcloud home page. At least I had a lead...

![wayback machine chrome devtools](/img/wayback-devtools.png)

I searched Soundcloud for "web behind" and I found the page! But strangely, there were only 4 episodes on there and Mikeal's wasn't one of them. Even stranger, the right sidebar said "8 tracks" but I could only see 4. I wondered if I could still get into that account.

![soundcloud web behind](/img/soundcloud-web-behind.png)

I went to soundcloud and logged in with my email address. Had to reset it multiple times since I had missed multiple security breaches while I'd been gone. I finally got in only to find that email address did not own the web behind account.

I searched a few times to see if there was any way to figure out what email address a channel belonged to but obviously that would be a terrible thing for Soundcloud to do so I was stuck.

## A lucky break

I was clicking all around, trying old email addresses, looking at my web hosting to see all the email accounts I've ever created but having no luck. I kept trying things like `jon@webbehind.com` or `admin@webbehind.com`. One nice thing is that Soundcloud lets you know after you enter just an email address whether it's associated with an account or not. No luck.

I was playing around with Postman to see if I could scrape any information when I caught a break! It turns out that I had linked my Soundcloud account to iTunes and the iTunes email address is listed in the RSS feed!

![soundcloud rss](/img/soundcloud-rss.png)

I couldn't guess the gmail password but as luck would have it, I did set up my real email address as the backup for the account, so I was able to reset it!

With that, I was able to reset my Soundcloud password and log in! At first I had no luck, I was still only able to see the 4 public episodes. But then I noticed on the Insights page if I zoomed out I could see traffic to Mikeal's episode from years ago. Eventually I figured out what had happened!

![soundcloud hidden tracks](/img/soundcloud-hidden.png)

## A bargain at any price

All I needed to do was give Soundcloud $10 for whatever Soundcloud Artist is and download the episode!

![soundcloud artist](/img/soundcloud-artist.png)

![soundcloud unlocked](/img/soundcloud-unlocked.png)

## It's nice to hear your voice

Thanks for the puzzle, Mikeal. It's nice to hear your voice again.

<iframe width="100%" height="300" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/252513132&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"></iframe><div style="font-size: 10px; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;font-weight: 100;"><a href="https://soundcloud.com/the-web-behind" title="The Web Behind" target="_blank" style="color: #cccccc; text-decoration: none;">The Web Behind</a> · <a href="https://soundcloud.com/the-web-behind/mikeal-rogers" title="Mikeal Rogers" target="_blank" style="color: #cccccc; text-decoration: none;">Mikeal Rogers</a></div>

