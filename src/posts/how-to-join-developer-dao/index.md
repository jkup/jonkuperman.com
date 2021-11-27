---
title: "How to join Developer DAO"
date: "2021-09-04"
topPost: false
tags: ["Crypto"]
---

I saw a tweet from [@nader](https://twitter.com/dabit3) about him creating a new DAO yesterday. I don't know much about them, but it sounded interesting. Here's how I joined and what I learned so far!

---

https://twitter.com/dabit3/status/1433879106119208966

## Joining a DAO

In his tweet, he links to an [etherscan URL](https://etherscan.io/token/0x25ed58c027921E14D86380eA2646E3a1B5C55A8b) which shows all of the tokens for this DAO. To "join" the DAO, you need to purchase a token. Sounds easy, right?

This crypto stuff is super cool, but they are sorely missing UI designers and developers.

The TL;DR is you need to click a few buttons in the Etherscan site and "buy" a token. The tokens are free, but there is a hefty (and constantly changing fee called a gas price needed to make any purchase). Also, you'll need an Ethereum wallet to be able to make the purchase! Let's start there.

## Creating a wallet

I went to [metamask.io](https://metamask.io/) and created a wallet. I wrote down my secret key phrase thing and then added the Chrome extension.

I have some Ethereum that I bought using [Coinbase](https://www.coinbase.com/). I copied my Metamask wallet address from the Chrome extension, then I went to my Coinbase account and withdrew 0.03 (what I estimated the gas fee would be at the time) Ethereum (needed to cover the transaction fee mentioned above).

## Connecting your wallet to Etherscan

BOOM. I now have money (or rather Ethereum) in my Metamask wallet. Then, with the Chrome extension installed, I made an Etherscan account and went back to the [url](https://etherscan.io/token/0x25ed58c027921E14D86380eA2646E3a1B5C55A8b) mentioned above. I clicked on **Contract** -> **Write contract** -> **Connect to Web3** and clicked accept on all the thingies to connect my Metamask wallet to my Etherscan account.

![Connecting to Web3 on Etherscan](/img/etherscan-purchase.png)

## Finding an available token

Another weird part. There are 8000 total tokens for this DAO, and you want to buy one. It sure would be nice if you could just click a "give me one" button and get one. But things aren't that easy. You'll need to find the ID of an available token. I'm sure there is a better way, but here's what I did:

Click on **Inventory** and look for any id not showing up in sequential order. At the time of this writing, I see 1005, 1006 and 1007 but not 1008. So I think 1008 is available to purchase?

Take that ID and go back to **Contract** -> **Write contract**. Click the "claim" dropdown and enter that ID. Then click "Write." It should open the Metamask extension and give you a button to approve the transaction. The price varies minute by minute. It seems like it's fluctuating between $45 and $400 right now. So if it's higher than $100 you should just wait and try again later!

Hopefully that worked, and now you are an official member of the DAO!

## Joining the Discord

First, you can join the Discord without joining the DAO by following [this link](https://discord.gg/Aa4NBSuW).

To "join" the DAO part of the Discord you have to:

- Enter the "public" voice channel. Don't worry, you don't need to talk or have audio. You just need to be in there.
- Go to any one of the text channels under "INFO" and type "!join". You will get a DM from a bot called "Collab.land", and it will give you a link. You follow that link and enter your Metamask wallet address, and you're done!

## Come say hi!

I hope this helped. If you get stuck, message me on [Twitter](https://twitter.com/jkup), and I'll do my best to help you!

Also, you should follow [@developer_dao](https://twitter.com/developer_dao) on Twitter!

### A note about gas prices

I'm pretty new to Ethereum, but the gas price is a fee for **any** transaction. They fluctuate wildly! They were like $400 last night, $40 this morning and $80 when I purchased. My best advice is to keep this [gas tracker](https://etherscan.io/gastracker) open and when you see it drop low, go do the steps above!

Good luck out there.

### What the heck is a DAO!?

A DAO is a Decentralized Autonomous Organization. Basically a community where we can make [Smart contracts](https://www.ibm.com/topics/smart-contracts) and all vote on the direction the community takes. Honestly if this sounds confusing it's because I have no idea what they really are. The gas prices are a huge issue but otherwise this DAO is free to join. It's a fun Discord of developers who are interested in Crypto!

Here's mine 😎

![My Developer DAO token](/img/my-developer-dao-token.png)

### What does my token look like?

After you purchase your token, you can go to [OpenSea](https://opensea.io/collection/devs-for-revolution) and type in your ID number! It'll show you this funny list of things. That image represents your token. Post it in the #show-your-dev channel in Discord!

### What should I do if the Collab.Land message is blank?

If you are entering the !join command and the bot is replying with a blank message, you likely have Link Preview turned off in your user settings.

User Settings > Text & Images > Link Preview and enable it
