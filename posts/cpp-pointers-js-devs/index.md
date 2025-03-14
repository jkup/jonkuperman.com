---
title: "C++ Pointers for JavaScript/TypeScript Developers"
description: "Understanding pointers in C++ is a great way to deepen your understanding of programming. Here's a guide to help you get started."
date: "2025-03-14"
topPost: false
tags: ["C++"]
layout: layouts/post.njk
---

## Introduction

I've been coding in JavaScript for years, but recently started working on a project that required C++. The biggest mental hurdle? Pointers. If you're like me, coming from JavaScript or TypeScript, the concept of pointers can feel alien at first.

In JavaScript, we create objects and arrays without thinking about where they live in memory:

```javascript
// JavaScript - create and forget
const user = { name: "Alice" };
const users = [user, { name: "Bob" }];
```

But in C++, you need to be much more explicit about memory:

```cpp
// C++ - be explicit about memory
User* user = new User("Alice");  // Allocate on heap
User users[2] = { *user, User("Bob") };  // Copy to stack array
delete user;  // Clean up when done
```

This post is my attempt to explain pointers in a way that makes sense to JavaScript developers. I won't pretend pointers are simple - they're powerful and can be dangerous - but understanding them will make you a better programmer, even if you never write C++ professionally.

Pointers give you direct access to memory, but they require careful handling to avoid bugs that simply don't exist in JavaScript.

## Memory Management: The Fundamental Difference

The biggest difference between JavaScript and C++ is how they handle memory. In JavaScript, the runtime does all the heavy lifting:

```javascript
// JavaScript
function createUsers(count) {
  const users = [];
  for (let i = 0; i < count; i++) {
    users.push({ id: i, name: `User ${i}` });
  }
  return users; // JavaScript handles memory automatically
}

const myUsers = createUsers(1000);
// Later, when myUsers is no longer referenced...
// JavaScript garbage collector cleans up
```

In C++, you're responsible for memory management. You need to explicitly allocate and free memory:

```cpp
// C++
User** createUsers(int count) {
  User** users = new User*[count]; // Allocate array on heap
  for (int i = 0; i < count; i++) {
    users[i] = new User(i, "User " + std::to_string(i)); // Allocate each user on heap
  }
  return users;
}

// Later...
User** myUsers = createUsers(1000);

// YOU must clean up
for (int i = 0; i < 1000; i++) {
  delete myUsers[i]; // Free each user
}
delete[] myUsers; // Free the array
```

Forget that cleanup code, and you've got a memory leak. In JavaScript, you'd never have to worry about this.

### Stack vs. Heap: Where Variables Live

In C++, you need to understand where your data lives:

1. **Stack**: Fast, automatic memory for local variables. Limited in size, automatically cleaned up.
2. **Heap**: Larger, manual memory that persists until you explicitly free it.

```cpp
void example() {
  // Stack allocation - automatic cleanup when function ends
  int stackNumber = 42;
  User stackUser("Alice");
  
  // Heap allocation - manual cleanup required
  int* heapNumber = new int(42);
  User* heapUser = new User("Bob");
  
  // Must clean up heap allocations!
  delete heapNumber;
  delete heapUser;
}
```

#### When to use Stack vs. Heap

It's important to understand that it's not the asterisk (`*`) that determines stack vs. heap allocation - it's how you create the object:

```cpp
// Stack allocation (no 'new' keyword)
int stackInt = 42;                // On stack
User stackUser("Alice");          // On stack
int stackArray[10];               // On stack
User* pointerToStackUser = &stackUser;  // Pointer is on stack, pointing to stack object

// Heap allocation (using 'new' keyword)
int* heapInt = new int(42);       // On heap
User* heapUser = new User("Bob"); // On heap
int* heapArray = new int[10];     // On heap
```

**What does the asterisk (*) actually mean?**

The asterisk (`*`) in C++ declarations indicates that a variable is a pointer. A pointer is simply a variable that stores a memory address rather than a value directly. The asterisk itself doesn't determine where the memory is allocated (stack vs. heap) - it just declares that the variable will hold an address.

For example:
- `int x = 5;` - Regular variable storing the value 5
- `int* ptr;` - Pointer variable that can store the address of an int
- `ptr = &x;` - Store the address of x in ptr
- `*ptr = 10;` - Follow the address in ptr and change the value to 10

The `new` keyword is what actually allocates memory on the heap, and the pointer is just used to keep track of where that memory is located.

**Choose Stack when:**
- You need small, fixed-size objects
- The object's lifetime is limited to the current function/scope
- You want automatic cleanup
- Performance is critical (stack allocation is much faster)
- The object size is known at compile time

**Choose Heap when:**
- You need large objects (stack size is limited, often to just a few MB)
- You need objects that persist beyond the current function
- You don't know the size at compile time (like dynamic arrays)
- You're returning objects from functions that need to live after the function returns
- You're sharing objects between different parts of your program

In JavaScript, this decision is made for you - primitive values like numbers are similar to stack variables, while objects and arrays are automatically managed on the heap.

## What Are Pointers, Really?

A pointer is just a variable that stores a memory address. That's it. Nothing more magical than that.

Think of your computer's memory like a giant apartment building. Each apartment (memory location) has an address and can store some data. A pointer is just a piece of paper with an apartment number written on it.

```cpp
int number = 42;        // Create a variable with value 42
int* pointer = &number; // Create a pointer that stores number's address
```

In this example:
- `number` is an apartment containing the value `42`
- `&number` is the address of that apartment (like "Apartment 1234")
- `pointer` is a piece of paper with "Apartment 1234" written on it
- `*pointer` means "go to the address written on the paper and get what's inside" (which is 42)

When you use the asterisk in front of a pointer variable (like `*pointer`), it's called "dereferencing" - you're accessing the value at the address stored in the pointer. This is different from when you use the asterisk in a declaration (like `int* ptr`), where it indicates that the variable is a pointer type.

### How This Differs From JavaScript References

In JavaScript, we have references, which might seem similar but work differently:

```javascript
let obj = { count: 42 };
let reference = obj;

// Both point to the same object
reference.count = 100;
console.log(obj.count); // 100

// But reassigning the reference just changes what it references
reference = { count: 200 };
console.log(obj.count); // Still 100
```

The key differences:
1. JavaScript references are **implicit** - you don't use special syntax to create or dereference them
2. JavaScript references are **higher-level** - they point to objects, not raw memory addresses
3. JavaScript references are **safer** - you can't manipulate memory directly or cause memory corruption

## Pointer Syntax and Operations: The Basics

Let's break down the essential pointer operations you'll need to know:

### 1. Declaring Pointers

There are two common styles for declaring pointers:

```cpp
int* ptr;  // Style 1: asterisk with the type
int *ptr;  // Style 2: asterisk with the variable name
```

Both are functionally identical. I prefer the first style because it makes it clearer that the type is "pointer to int," but you'll see both in C++ code.

### 2. Getting an Address with &

The address-of operator `&` gives you the memory address of a variable:

```cpp
int number = 42;
int* ptr = &number;  // ptr now holds the address of number
```

### 3. Dereferencing with *

The dereference operator `*` lets you access the value at an address:

```cpp
int number = 42;
int* ptr = &number;
*ptr = 100;  // Change the value at the address
std::cout << number << std::endl;  // Prints 100
```

### 4. Null Pointers

A pointer that doesn't point to anything should be set to `nullptr` (in modern C++):

```cpp
int* ptr = nullptr;  // Explicitly doesn't point to anything

// Always check before dereferencing
if (ptr != nullptr) {
    *ptr = 100;  // Safe
} else {
    // Handle null case
}

// Shorthand if check (nullptr converts to false)
if (ptr) {
    *ptr = 100;  // Safe
}
```

In older C++ code, you might see `NULL` or even `0` used instead of `nullptr`.

### 5. Pointer Arithmetic

C++ also allows you to perform arithmetic on pointers:

```cpp
int numbers[] = {10, 20, 30, 40, 50};
int* ptr = numbers;  // Points to first element

std::cout << *ptr << std::endl;      // 10
std::cout << *(ptr + 1) << std::endl; // 20
std::cout << *(ptr + 2) << std::endl; // 30

// Shorthand using array notation
std::cout << ptr[0] << std::endl;     // 10
std::cout << ptr[1] << std::endl;     // 20
```

This is powerful but dangerous - C++ won't stop you from accessing memory beyond the array bounds. For example:

```cpp
int numbers[5] = {10, 20, 30, 40, 50};
int* ptr = numbers;

// This is dangerous - accessing beyond the array
std::cout << *(ptr + 10) << std::endl;  // Reading unknown memory!
*(ptr + 10) = 500;                      // Writing to unknown memory!
```

C++ will happily let you read or write to memory locations that don't belong to your array. This can cause:
- Program crashes (if you're lucky)
- Corrupted data in other variables
- Security vulnerabilities like buffer overflows
- Unpredictable behavior that's hard to debug

### Memory Safety and Modern Languages

This issue is exactly why memory-safe languages like Rust have gained popularity. Rust provides similar performance to C++ but prevents these memory safety issues through its ownership system and compile-time checks.

In Rust, the equivalent code would fail to compile or would perform bounds checking at runtime:

```rust
let numbers = [10, 20, 30, 40, 50];
println!("{}", numbers[10]);  // Runtime panic: index out of bounds
```

JavaScript, like Rust, is memory-safe by design:

```javascript
const numbers = [10, 20, 30, 40, 50];
console.log(numbers[10]);  // undefined (not a crash)
```

According to Microsoft, around 70% of their security vulnerabilities are related to memory safety issues in languages like C and C++. This is why there's a growing movement toward memory-safe languages for systems programming, with Rust leading the charge.

C++ has evolved to provide safer alternatives like `std::vector` with bounds checking, but the raw pointer operations remain available for performance-critical code:

```cpp
// Safer alternative with bounds checking
std::vector<int> numbers = {10, 20, 30, 40, 50};
// This will throw an exception instead of accessing invalid memory
try {
    std::cout << numbers.at(10) << std::endl;
} catch (const std::out_of_range& e) {
    std::cout << "Error: " << e.what() << std::endl;
}
```

## References vs Pointers: The C++ Alternative

C++ offers another mechanism called "references" that might feel more familiar to JavaScript developers:

```cpp
// Pointer approach
void updateUser(User* user) {
    user->name = "Bob";
}

// Reference approach
void updateUser(User& user) {
    user.name = "Bob";
}
```

References provide a syntax that feels more like JavaScript's reference behavior, but with important differences:
- References can't be null
- References can't be reassigned
- References must be initialized when declared

**When to use which?** Here's a quick decision guide:
- Need to represent "no value"? → Pointer (`nullptr`)
- Need to reassign to point to different objects? → Pointer
- Just need to modify an existing object? → Reference

## Void Pointers and Type Casting

Sometimes you need a pointer that can point to any type - enter the `void*`:

```cpp
void* genericPointer;
int number = 42;
genericPointer = &number;  // Points to an int

// To use it, you must cast it back
int* numberPointer = static_cast<int*>(genericPointer);
```

This is somewhat analogous to TypeScript's type assertions, but with a crucial difference: in C++, you're responsible for ensuring the cast is valid.

## Pointers and Arrays: Two Sides of the Same Coin

In C++, arrays and pointers are intimately connected in ways that might surprise JavaScript developers:

```cpp
int numbers[5] = {1, 2, 3, 4, 5};
int* ptr = numbers;  // Array name decays to pointer

// These are equivalent:
cout << numbers[2] << endl;  // Array syntax
cout << *(ptr + 2) << endl;  // Pointer arithmetic
```

This relationship has no real equivalent in JavaScript, though TypedArrays and ArrayBuffers come closest.

## Memory Allocation: Manual Management

In JavaScript, you create objects and the runtime handles memory. In C++, you must explicitly request and release memory:

```cpp
// Allocating memory
int* numbers = new int[100];  // Request space for 100 integers

// Using the memory
numbers[0] = 42;

// MUST release the memory when done
delete[] numbers;  // Return the memory to the system
```

If you forget the delete, you'll create memory leaks - a problem JavaScript developers rarely encounter.

## Smart Pointers: Modern C++ to the Rescue

Modern C++ provides smart pointers that help manage memory automatically, bringing some of JavaScript's convenience to C++:

```cpp
// Old way with manual management
User* user = new User("Alice");
// ... code that might throw exceptions ...
delete user;  // Might never get called if an exception occurs!

// Modern way with smart pointers
auto user = std::make_unique<User>("Alice");
// No need to delete - memory is automatically freed when user goes out of scope
```

**Types of smart pointers:**
- `std::unique_ptr` - Exclusive ownership (only one pointer can own the object)
- `std::shared_ptr` - Shared ownership with reference counting (similar to JS objects)

## Move Semantics: Efficient Resource Transfer

Modern C++ introduced move semantics to efficiently transfer resources:

```cpp
std::vector<int> createLargeVector() {
    std::vector<int> result(10000);
    // Fill the vector...
    return result;  // Efficiently moved rather than copied
}

auto myVector = createLargeVector();  // No expensive copy!
```

This concept has no direct JavaScript equivalent but helps understand how C++ optimizes resource handling.

## Function Pointers and Callbacks

JavaScript developers are familiar with passing functions as arguments. C++ has several ways to achieve this:

```cpp
// Traditional function pointer
void processData(int* data, int size, int (*processor)(int)) {
    for (int i = 0; i < size; i++) {
        data[i] = processor(data[i]);
    }
}

// Modern approach with std::function
void processData(int* data, int size, std::function<int(int)> processor) {
    // Same implementation
}

// Usage with lambda (similar to JS arrow functions)
processData(numbers, 100, [](int x) { return x * 2; });
```

## Common Pitfalls: Where JavaScript Developers Stumble

When coming from JavaScript, these are the pointer-related mistakes you're most likely to make:

1. **Using uninitialized pointers**
   ```cpp
   int* ptr;  // Contains random address!
   *ptr = 42;  // CRASH: Writing to random memory
   ```

2. **Forgetting to delete allocated memory**
   ```cpp
   void processData() {
       int* data = new int[1000];
       // Process data...
       // Oops, forgot to delete[] data
   }  // Memory leak!
   ```

3. **Using a pointer after freeing it**
   ```cpp
   int* ptr = new int(42);
   delete ptr;  // Free the memory
   cout << *ptr;  // DANGER: Using freed memory
   ```

## Debugging Pointer Issues

When pointer problems arise, these tools become your best friends:

- **Valgrind** - Detects memory leaks and access errors
- **AddressSanitizer** - Finds memory corruption bugs
- **Debugger watch expressions** - Inspect pointer values during execution

**Common error messages decoded:**
- "Segmentation fault" → You've accessed invalid memory
- "Double free" → You've tried to delete memory twice
- "Memory leak detected" → You've forgotten to free memory

## Practical Examples: From JavaScript to C++

Let's see how common JavaScript patterns translate to C++ with pointers:

### Linked List Implementation

```javascript
// JavaScript
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}
```

```cpp
// C++
class Node {
public:
    int value;
    Node* next;
    
    Node(int val) : value(val), next(nullptr) {}
};
```

### Event Handling

```javascript
// JavaScript
element.addEventListener('click', () => {
  console.log('Clicked!');
});
```

```cpp
// C++
button->setOnClickListener([](Button* sender) {
    std::cout << "Clicked!" << std::endl;
});
```

## Conclusion: Embracing the Power and Responsibility

Understanding pointers in C++ not only helps you work with the language but also deepens your understanding of how memory works in all programming languages. Even in JavaScript, concepts like ArrayBuffer and SharedArrayBuffer expose some of these lower-level memory concerns.

The next time you create an object in JavaScript, you'll have a better appreciation for what's happening under the hood!

What C++ pointer concept do you find most useful when coming from JavaScript?

