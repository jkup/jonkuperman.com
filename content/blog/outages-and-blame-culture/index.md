---
title: "Outages and blame culture"
date: "2019-12-09T22:12:13.284Z"
---

If you work with software, you experience bugs. If you work with cloud software, sometimes those bugs cause outages.

Every job I've had has some approach to "dealing" with outages. There's usually some form of an on-call person. Maybe there is an Operations team to help organize (paging the on-call, getting other teams involved, deducing root cause, writing up a report). This is great because if you don't document, it's easy to have rose-colored glasses and feel like things don't happen "that often."

Some companies even make you present your "findings" after each outage. This can have value in showing your company what happened and what steps you are talking to prevent it from happening again. That's the critical thing, answering two questions:

1. What could we do to prevent something like this from happening again?
2. How can we be 100% sure this exact thing won't happen again?

Some companies put you through the wringer. They force you to write multiple docs explaining what happened and attend many public meetings where you must fall on your sword and tell rooms full of strangers how you messed up and that it will "not happen again."

This might seem like a good idea! The more punishing you are around outages, the more you drive the point home that we all must have a very high quality bar. The problem is, it backfires in a lot of strange and nasty ways.

Companies that overly punish outages end up with blame game cultures. If a client team and a service team are on a call about an outage, and whoever takes the "blame" will have to write docs and attend meetings for the next three weeks, it becomes a very high stakes game of hot potato.

Another problem with this culture is many outages don't have a single team at fault. Maybe a client team was misusing an API, but that API wasn't documented, or returned an incorrect error code!

TL;DR Companies should be careful about how much they punish teams for having outages and flexible enough to understand that many outages share blame across multiple teams. It's better to focus on these three things alone:

1. What happened?
2. How can we prevent that specific thing from ever happening again?
3. Are there any things we learned that could help us prevent similar things from happening?

And call it a day.
