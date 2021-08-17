---
title: 'Staying Mostly Safe Online'
description: 'With massive hacks everywhere, its more important than ever to learn how to stay safe online.'
date: '2016-11-14'
tags: ['Thoughts']
---

# Staying Mostly Safe Online

![Anonymous Hacker so you know this is a legit post](https://cdn-images-1.medium.com/max/2000/0*IaiYD3_nHw9p4LJi.jpeg)

2016 has become the year of the data breach. With massive hacks affecting [ADP](http://krebsonsecurity.com/2016/05/fraudsters-steal-tax-salary-data-from-adp/), the [Department of Homeland Security](http://motherboard.vice.com/read/hacker-plans-to-dump-alleged-details-of-20000-fbi-9000-dhs-employees), the [Internal Revenue Service](http://fortune.com/2016/02/10/irs-hack-refunds/), [LinkedIn](http://www.makeuseof.com/tag/need-know-massive-linkedin-accounts-leak/) and [Myspace](https://www.wired.com/2016/05/hack-brief-old-myspace-account-just-came-back-haunt/) to name a few. It’s more important than ever before to talk about staying safe online.

The [Electronic Frontier Foundation](https://ssd.eff.org/en) has a great page dedicated to educating users on “Surveillance Self Defense” but I’ve always wished they would be more liberal with a cheat sheet of good general tools you can use to stay safe(er) online. So here is mine:

## Passwords

One of the best things you can do to stay safe online is to have secure and unique passwords for all of your sites.

## Password Managers

The idea of memorizing dozens of different passwords for all of your websites is overwhelming! Luckily there is no need to. I recommend downloading a password manager immediately ([1Password](https://1password.com/) if you only need Mac/Windows and [Lastpass](https://www.lastpass.com/) if you need Linux support).

Password managers help you out by easily allowing you to generate long and unique passwords for each site you visit. You only have one master password to remember and then you simply “unlock” passwords for sites as you use them.

These password managers have the added advantage autocompleting login forms but _only_ autocompleting when you are on the correct domain! This means they will not only help you with hard to crack passwords but help you avoid [Phishing](https://en.wikipedia.org/wiki/Phishing) attempts where bad sites make themselves look like good sites in an attempt to get your login credentials.

## General rules

Aside from using a password manager the general rules for passwords are easier to remember if you understand how passwords are stolen in the first place.

There are two main types of password attacks which can be mitigated by choosing a “strong” password.

1. **Brute Force**: This type of attack uses a computer program to try as many passwords as possible until it finally gets it. This means common passwords (Password123) and short passwords are easier to crack. **So make yours long and uncommon**

1. **Dictionary Attack**: This type of attack uses a list of common words in an attempt to speed up figuring out your password. This means a password like (MySecretPass) will be a lot easier to crack than (1lk2j3b). **So at least add some randomness to your password**

![1Password Home Screen](https://cdn-images-1.medium.com/max/2800/0*yC692JjiI6-zg2uI.png)_1Password Home Screen_

## Browsing

Browsing the internet makes you vulnerable to many different types of attacks. Fortunately there are tools available to make browsing the web a lot safer!

Here are the things that can go wrong while browsing the internet and tools I recommend to mitigate risks.

> _You are growing the web on an unsecured wireless network and someone is sitting there reading all your secret data ([man-in-the-middle attack](https://en.wikipedia.org/wiki/Man-in-the-middle_attack))_

The easiest thing you can do here is invest in a good Virtual Private Network ([VPN](https://en.wikipedia.org/wiki/Virtual_private_network)). I personally use [ExpressVPN](https://www.expressvpn.com/) but I’ve heard great things about [Private Internet Access](https://www.privateinternetaccess.com/) as well! They cost about $7 a month and are essentially just a little app you put on your phone and computer that will keep you safe on public networks.

![Express VPN connect screen](https://cdn-images-1.medium.com/max/2000/0*9hxmFxb2CDZpxu_x.png)

VPN’s also give you protection from your Internet Service Provider. If you’d rather Comcast not know what you are doing online, a VPN will encrypt all of your traffic and keep your privacy.

> You are being tracked by advertising companies on every site you visit. Sometimes they even collude to share your data with each other. They know what you are shopping for, what illnesses you have and use that information to hike up prices and target you for advertising.

The easiest thing to do here is use a browser that prevents that sort of tracking. I use [Brave browser](https://brave.com/) (confession: I also work there!) but if you are happy with Chrome or Firefox you can supplement with plugins such as:

-   [Adblock Plus](https://adblockplus.org/) helps by stopping bad ads and trackers from making it through to your browser.

-   [Disconnect](https://disconnect.me/) stops trackers and malware and makes the web faster!

-   [HTTPS Everywhere](https://www.eff.org/https-everywhere) Forces website to send you data securely if possible.

Last shameless Brave plug: You get all that and more for free by simply using the Brave browser.

## Authentication

This section relates to the password section above but it really is a separate issue.

Most websites these days offer [2 Factor Authentication (2FA)](https://en.wikipedia.org/wiki/Multi-factor_authentication). An easy way to think about 2FA is by thinking about entering your password as 1 factor, so this approach has you enter your password and then it requires a second factor.

The most common approach is that websites will send you a text message with a short code. So you not only need your username and password but you’ll also need your cell phone to log into your account.

This is great because even if someone cracked your password with one of the approaches above they still wouldn’t be able to access your account!

I highly recommend setting up 2FA with **every** one of your accounts that allows it.

You can find a list of websites that offer 2fa on [twofactorauth.org](https://twofactorauth.org/).

![two factor auth website](https://cdn-images-1.medium.com/max/2800/0*-8F7SVG1ky-pUlyi.png)
