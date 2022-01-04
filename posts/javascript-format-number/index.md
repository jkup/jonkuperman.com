---
title: "JavaScript format number"
description: "This is the best way to modify your JavaScript format number. Add decimals or commas to a long number for currencies or units."
date: "2022-01-04"
topPost: false
tags: ["JavaScript"]
---

Using JavaScript to format numbers is a very common task. The cool thing is, there are a lot of new built-in methods that make JavaScript format number a lot easier.

Let's take a look at three common strategies.

## Format numbers with Regular expressions

The first thing we can try is using [Regular Expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions). We can take any number, cast it to a string and then use the [replace()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace) method to add add a comma or decmial after every group of 3 numbers.

```javascript
let number = 1000000000000
String(number).replace(/(.)(?=(\d{3})+$)/g, "$1,")
```

This returns `'1,000,000,000,000'`. And if you want decimals instead, change the last symbol to a period like so:

```javascript
let number = 1000000000000
let result = String(number).replace(/(.)(?=(\d{3})+$)/g, "$1.")
```

This returns `'1.000.000.000.000'`.

## JavaScript format number with toLocaleString

A better approach would be to use the built-in [toLocaleString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString) which returns language sensitive representations of numbers. We can simply:

```javascript
let number = 1000000000000
let result = number.toLocaleString()
```

This will print `'1.000.000.000.000'`.

What's cool about this approach is, if you are using JavaScript to format money, you can pass in the user's country code and it will adapt. For example:

```javascript
let number = 1000000000000
let result = number.toLocaleString("ja-JP", {
  style: "currency",
  currency: "JPY",
})
```

This will print `'￥1,000,000,000,000'`.

## Format JavaScript numbers with NumberFormat

While `toLocaleString` is super clean and easy, it will slow down significantly when passing it large numbers. From [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString):

> When formatting large numbers of numbers, it is better to create a Intl.NumberFormat object and use the function provided by its format property.

So, if we have a large number we need to format, we can use [NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat) instead.

```javascript
let number = 1000000000000
let result = new Intl.NumberFormat().format(number)
```

This will return `'1,000,000,000,000'`. The API is a little bit harder to use but you can still pass in all the country codes and formatting options that we used with `toLocaleString`. For example:

```javascript
let number = 1000000000000
let result = new Intl.NumberFormat("ja-JP", {
  style: "currency",
  currency: "JPY",
}).format(number)
```

Which will return `'￥1,000,000,000,000'`.

## Conclusion

Formatting JavaScript numbers used to be really hard. You had to write your own Regular Expression and cast your number to a string to use it. Now we have 2 great browser APIs for this task and they have a ton of flexibility.
