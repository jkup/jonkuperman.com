---
title: "JavaScript math methods I never knew existed"
date: "2021-09-07"
tags: ["JavaScript"]
---

I was trying to break Cloudflare Workers tonight and did a search for "CPU intensive JavaScript" because I'm really good at my job.

[This gist](https://gist.github.com/sqren/5083d73f184acae0c5b7) popped up with the following code:

---

```javascript
function mySlowFunction(baseNumber) {
  console.time("mySlowFunction")
  let result = 0
  for (var i = Math.pow(baseNumber, 7); i >= 0; i--) {
    result += Math.atan(i) * Math.tan(i)
  }
  console.timeEnd("mySlowFunction")
}

mySlowFunction(8) // higher number => more iterations => slower
```

Cool, cool. It's some loop that does something and returns a... wait a minute what the heck is `Math.atan`!?

According to [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/atan) it's:

> The Math.atan() function returns the arctangent (in radians) of a number

I don't know anything about math so I'm not even going to pretend to understand actangents but it led me to wondering what other math methods I never heard of. Here's a list:

- Math.acos(): The Math.acos() function returns the arccosine (in radians) of a number.
- Math.acosh(): The Math.acosh() function returns the hyperbolic arc-cosine of a number.
- Math.asin(): The Math.asin() function returns the arcsine (in radians) of a number.
- Math.asinh(): The Math.asinh() function returns the hyperbolic arcsine of a number.
- Math.atan2(): The Math.atan2() function returns the angle in the plane (in radians) between the positive x-axis and the ray from (0,0) to the point (x,y), for Math.atan2(y,x).
- Math.atanh(): The Math.atanh() function returns the hyperbolic arctangent of a number.
- Math.cbrt(): The Math.cbrt() function returns the cube root of a number.
- Math.clz32(): The Math.clz32() function returns the number of leading zero bits in the 32-bit binary representation of a number.
- Math.cosh(): The Math.cosh() function returns the hyperbolic cosine of a number, that can be expressed using the constant e.
- Math.expm1(): The Math.expm1() function returns e^x - 1, where x is the argument, and e the base of the natural logarithms.
- Math.fround(): The Math.fround() function returns the nearest 32-bit single precision float representation of a Number.
- Math.hypot(): The Math.hypot() function returns the square root of the sum of squares of its arguments.
- Math.imul(): The Math.imul() function returns the result of the C-like 32-bit multiplication of the two parameters.
- Math.log10(): The Math.log10() function returns the base 10 logarithm of a number.
- Math.log1p(): The Math.log1p() function returns the natural logarithm (base e) of 1 + a number.
- Math.log2(): The Math.log2() function returns the base 2 logarithm of a number.
- Math.sin(): The Math.sin() function returns the sine of a number.
- Math.sinh(): The Math.sinh() function returns the hyperbolic sine of a number, that can be expressed using the constant e.
- Math.tan(): The Math.tan() function returns the tangent of a number.
- Math.tanh(): The Math.tanh() function returns the hyperbolic tangent of a number.
- Math.trunc(): The Math.trunc() function returns the integer part of a number by removing any fractional digits.
