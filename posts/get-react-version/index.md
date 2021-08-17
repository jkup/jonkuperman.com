---
title: 'Get React Version'
description: 'How to get react version from any app running React.js. React actually exposes the version in the core object.'
date: '2021-02-22'
tags: ['Tips', 'React']
---

Looking to get react version from one of your apps? You have a few different options!

## Get React Version in code

If you're already in the JavaScript, you can print the current React version by doing:

```javascript
import React, { version } from 'react';

console.log(version);
```

This also works with the require syntax:

```javascript
const React = require('react');
const version = React.version;

console.log(version);
```

You can also check your `package-lock.json` or `yarn.lock` file!

```bash
cat package-lock.json | grep \"react\" -A 1
```

Or, if you are using Yarn:

```bash
cat yarn.lock | grep \"react\" -A 1
```
