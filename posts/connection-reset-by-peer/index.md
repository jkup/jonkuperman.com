---
title: 'ssh_exchange_identification: read: connection reset by peer'
date: '2015-10-07'
tags: ['Thoughts']
---

This tutorial is meant to help troubleshoot **connection reset by peer** issues you might have while using SSH.

Ever tried to SSH into your server and seen an error like this?

```bash
ssh_exchange_identification: read: Connection reset by peer
```

The first thing you should always do if SSH fails is try again with verbose logging on. Just try something like this:

```bash
ssh username@address.com -vv
```

If the problem is on your client’s side, some sort of error should show up in that log. If you aren’t seeing anything useful in there, the problem may be with your server.

## The Tricky Part

So, how do you get on your server if you cant ssh!?

If you’re lucky, your host will provide you with some sort of shell access via their web UI. If not, they should at least offer some alternative method for access. That part you’ll need to figure out for yourself.

## After You Get Access

If you want to see everything that SSH is doing on the server side, here’s what you can try ( assuming Debian or Ubuntu here ):

```bash
sudo service ssh stop
sudo /usr/sbin/sshd -d
```

That will show you a real time log of everything that happens to SSH. If, as I suspect, you are banned from your server ( fail2ban or some other program has put your IP in /etc/hosts.deny ) you should see something like this in the log:

```bash
debug1: Connection refused by tcp wrapper
```

It could mean a number of things, but very likely you’re being blocked by hosts.deny. The simplest way to test would be to put an allow all in hosts.allow

```bash
vi /etc/hosts.allow
```

and put in something like:

```bash
sshd: ALL
```

Then try re-connecting. If that was your problem, try re-configuring fail2ban or whatever you have on your server that is sticking IPs into hosts.deny. If not, keep Googling! 😉
