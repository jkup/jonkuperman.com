---
title: 'Writing a Babel plugin to convert arrow functions to function expressions'
date: '2018-11-20T22:12:03.284Z'
tags: ['Compilers', 'JavaScript']
---

I'm still (slowly) learning how to work with ASTs and tools that use them. Today I wanted to learn how Babel takes arrow functions like:

```javascript
const log = (message) => console.log(message);
```

and converts it into ES5 function expressions like:

```javascript
const log = function (message) {
    console.log(message);
};
```

<!-- excerpt -->

Hilariously, Acorn (the JavaScript parser that Babel uses) comes with a built-in `arrowFunctionToExpression` method!

If we head over to [astexplorer.net](https://astexplorer.net/) and type in the code that we want to transform, we get an Abstract Syntax Tree like:

```json
{
    "type": "File",
    "start": 0,
    "end": 45,
    "loc": {
        "start": {
            "line": 1,
            "column": 0
        },
        "end": {
            "line": 2,
            "column": 44
        }
    },
    "program": {
        "type": "Program",
        "start": 0,
        "end": 45,
        "loc": {
            "start": {
                "line": 1,
                "column": 0
            },
            "end": {
                "line": 2,
                "column": 44
            }
        },
        "sourceType": "module",
        "interpreter": null,
        "body": [
            {
                "type": "VariableDeclaration",
                "start": 1,
                "end": 45,
                "loc": {
                    "start": {
                        "line": 2,
                        "column": 0
                    },
                    "end": {
                        "line": 2,
                        "column": 44
                    }
                },
                "declarations": [
                    {
                        "type": "VariableDeclarator",
                        "start": 7,
                        "end": 44,
                        "loc": {
                            "start": {
                                "line": 2,
                                "column": 6
                            },
                            "end": {
                                "line": 2,
                                "column": 43
                            }
                        },
                        "id": {
                            "type": "Identifier",
                            "start": 7,
                            "end": 10,
                            "loc": {
                                "start": {
                                    "line": 2,
                                    "column": 6
                                },
                                "end": {
                                    "line": 2,
                                    "column": 9
                                },
                                "identifierName": "log"
                            },
                            "name": "log"
                        },
                        "init": {
                            "type": "ArrowFunctionExpression",
                            "start": 13,
                            "end": 44,
                            "loc": {
                                "start": {
                                    "line": 2,
                                    "column": 12
                                },
                                "end": {
                                    "line": 2,
                                    "column": 43
                                }
                            },
                            "id": null,
                            "generator": false,
                            "async": false,
                            "params": [
                                {
                                    "type": "Identifier",
                                    "start": 13,
                                    "end": 20,
                                    "loc": {
                                        "start": {
                                            "line": 2,
                                            "column": 12
                                        },
                                        "end": {
                                            "line": 2,
                                            "column": 19
                                        },
                                        "identifierName": "message"
                                    },
                                    "name": "message"
                                }
                            ],
                            "body": {
                                "type": "CallExpression",
                                "start": 24,
                                "end": 44,
                                "loc": {
                                    "start": {
                                        "line": 2,
                                        "column": 23
                                    },
                                    "end": {
                                        "line": 2,
                                        "column": 43
                                    }
                                },
                                "callee": {
                                    "type": "MemberExpression",
                                    "start": 24,
                                    "end": 35,
                                    "loc": {
                                        "start": {
                                            "line": 2,
                                            "column": 23
                                        },
                                        "end": {
                                            "line": 2,
                                            "column": 34
                                        }
                                    },
                                    "object": {
                                        "type": "Identifier",
                                        "start": 24,
                                        "end": 31,
                                        "loc": {
                                            "start": {
                                                "line": 2,
                                                "column": 23
                                            },
                                            "end": {
                                                "line": 2,
                                                "column": 30
                                            },
                                            "identifierName": "console"
                                        },
                                        "name": "console"
                                    },
                                    "property": {
                                        "type": "Identifier",
                                        "start": 32,
                                        "end": 35,
                                        "loc": {
                                            "start": {
                                                "line": 2,
                                                "column": 31
                                            },
                                            "end": {
                                                "line": 2,
                                                "column": 34
                                            },
                                            "identifierName": "log"
                                        },
                                        "name": "log"
                                    },
                                    "computed": false
                                },
                                "arguments": [
                                    {
                                        "type": "Identifier",
                                        "start": 36,
                                        "end": 43,
                                        "loc": {
                                            "start": {
                                                "line": 2,
                                                "column": 35
                                            },
                                            "end": {
                                                "line": 2,
                                                "column": 42
                                            },
                                            "identifierName": "message"
                                        },
                                        "name": "message"
                                    }
                                ]
                            }
                        }
                    }
                ],
                "kind": "const"
            }
        ],
        "directives": []
    },
    "comments": []
}
```

When making Babel plugins or anything that parses ASTs we use a Computer Science concept called the [Visitor Pattern](https://en.wikipedia.org/wiki/Visitor_pattern). Basically, we pick the "type" of node we want to grab onto and then do operations on it. In our case we can our app goes _File_ -> _Program_ -> _VariableDeclaration_ -> _ArrowFunctionExpression_! Perfect, we'll grab ArrowFunctionExpression.

```javascript
export default function (babel) {
    const { types: t } = babel;

    return {
        visitor: {
            ArrowFunctionExpression(path) {
                return path.arrowFunctionToExpression();
            },
        },
    };
}
```

Most of that is just boilerplate. The important bit is that we hook into all ArrowFunctionExpression's and call `arrowFunctionToExpression()` on them. That results in the following output:

```javascript
const log = function (message) {
    return console.log(message);
};
```

Perfect! I promise I'll try something more challenging next time :)
