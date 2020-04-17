---
title: "Easier Type Safety in JavaScript Classes"
date: "2019-07-09T22:12:13.284Z"
---

I work with TypeScript a lot at Adobe. It's really great for so many reasons, but I often find new shorthand tricks I wish I knew when I was getting started! This is one of those tricks.

Let's say you have a `Person` class with a few properties.

```javascript
class Person {
  constructor(name, age, job) {
    this.name = name;
    this.age = age;
    this.job = job;
  }
}
```

<!-- excerpt -->

Now you can call it like this.

```javascript
const person = new Person("Jon", "31", "Programmer");
console.log(person.name); // Jon
```

Now let's say you want to add some types to this class, so it errors if people misuse it.

You might try doing something like:

```javascript
class Person {
  constructor(name: string, age: number, job: string) {
    this.name = name;
    this.age = age;
    this.job = job;
  }
}
const person = new Person("Jon", "31", "Programmer");
console.log(person.name); // Jon
```

But then you'd get an error saying.

```bash
Property 'name' does not exist on type 'Person'.
```

So then you might try to move the type declarations to the class properties like this.

```javascript
class Person {
  name: string;
  age: number;
  job: string;

  constructor(name, age, job) {
    this.name = name;
    this.age = age;
    this.job = job;
  }
}
const person = new Person("Jon", "31", "Programmer"); // Does not error :(
console.log(person.name); // Jon
```

Now this compiles! But, it no longer has the type information for the constructor parameters, so it doesn't error even though you pass in a string for age instead of a number.

So then you might take this long-winded approach and add duplicate type declarations to the class properties as well as the constructor parameters.

```javascript
class Person {
  name: string;
  age: number;
  job: string;

  constructor(name: string, age: number, job: string) {
    this.name = name;
    this.age = age;
    this.job = job;
  }
}
const person = new Person('Jon', '31, 'Programmer'); // Errors! :)
console.log(person.age); // Jon
```

And now we get the type safety we've been looking for!

The shorthand I learned today is that you can add access modifiers to your constructor parameters and then TypeScript will automatically set those parameters as class values when initialized.

```javascript
class Person {
  constructor(public name: string, public age: number, public job: string) {}
}
const person = new Person('Jon', '31', 'Programmer'); // Errors! :)
console.log(person.age); // Jon
```

TypeScript's access modifiers allow you to set class properties as `public`, `private` and `protected`. All class properties are `public` by default, but this neat trick will save you a good amount of lines while preserving type safety.
