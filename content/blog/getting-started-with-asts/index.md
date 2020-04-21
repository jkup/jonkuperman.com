---
title: 'Getting Started with ASTs'
date: '2018-11-18T22:12:20.284Z'
tags: ['Compilers']
---

Hey all!

I've wanted to move my blog back to my domain for a while now. I miss writing a lot. Medium is excellent but makes me feel like everything I write is high stakes and needs to polish.

Lately, I'm interested in Abstract Syntax Trees. If you're not familiar, they are a data format used by programs like Babel, ESLint, and Webpack. ASTs are a tree representation of code. Let's take a look at a small example.

<!-- excerpt -->

We can head over to [AST Explorer](https://astexplorer.net/) and type any JavaScript we want into the top left panel. Then we'll see the equivalent AST in the top right panel.

Here is some JavaScript:

```javascript
console.log('Hello World!');
```

And the AST:

```json
{
    "type": "Program",
    "start": 0,
    "end": 28,
    "range": [0, 28],
    "body": [
        {
            "type": "ExpressionStatement",
            "start": 0,
            "end": 28,
            "range": [0, 28],
            "expression": {
                "type": "CallExpression",
                "start": 0,
                "end": 27,
                "range": [0, 27],
                "callee": {
                    "type": "MemberExpression",
                    "start": 0,
                    "end": 11,
                    "range": [0, 11],
                    "object": {
                        "type": "Identifier",
                        "start": 0,
                        "end": 7,
                        "range": [0, 7],
                        "name": "console"
                    },
                    "property": {
                        "type": "Identifier",
                        "start": 8,
                        "end": 11,
                        "range": [8, 11],
                        "name": "log"
                    },
                    "computed": false
                },
                "arguments": [
                    {
                        "type": "Literal",
                        "start": 12,
                        "end": 26,
                        "range": [12, 26],
                        "value": "Hello World!",
                        "raw": "'Hello World!'"
                    }
                ]
            }
        }
    ],
    "sourceType": "module"
}
```

ASTs are an intermediary representation of your code. They allow you to do things like transpilation, linting or bundling. I'm especially interested in contributing to some of these projects. I've been spending a lot of my free time learning more about ASTs, languages, and compilers in general.

Here are some of the resources I've found helpful:

1. [The Babel Plugin Handbook](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md) It's somewhat out of date but full of great information for making Babel plugins and understanding important concepts like the Visitor Pattern.
2. [Code Transformation and Linting with ASTs](https://frontendmasters.com/courses/linting-asts/) This course by Kent C. Dodds is excellent for beginners who want to get their feet wet making some plugins for ESLint and Babel.
3. [Language Implementation Patterns](http://a.co/d/b13e3q5) This book is excellent, although a bit on the heavy side. It talks about the shared patterns across all languages and compiles and offers straightforward examples of each.
4. [Compilers: Principles, Techniques, and Tools](https://www.amazon.com/Compilers-Principles-Techniques-Tools-2nd/dp/0321486811) The "Dragon" book. This is the de-facto book in our industry when it comes to writing compilers. I haven't finished it yet so I'll hold off on my thoughts until then!

Have you done any work with ASTs or compilers? Did you find any helpful resources that I didn't mention here? Drop me a comment on Twitter [@jkup](https://twitter.com/jkup)! I'd love to hear from you.
