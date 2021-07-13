# Base

Base is called as the first Sass module in order and includes a CSS reset and a variety of important variables and mixins.

---

### Usage

```scss
// Apply the CSS reset.
@forward '@miraidesigns/base/styles';

// Make use of the Base model with all its components.
@use '@miraidesigns/base';
```

---

## Sass

### Prefix

The prefix variable is generally applied to every given class for consistency sake.

```scss
.#{base.$prefix}-class__name {
    color: #fff;
}
```

---

### Breakpoints

To serve content appropriately to a variety of devices, we use breakpoints (media queries) to set rules for various display dimensions.

Media queries are stored in the `$breakpoints` map and are called through the mixin of the same name.

```scss
.#{base.$prefix}-class__name {
    color: #fff;

    @include base.breakpoint('tablet-landscape') {
        color: #000;
    }
}
```

---

### Layers

Layers are indicator for the elevation and/or importance of a given element.

All layers are stored inside the `$layers` map and are called through the mixin and function of the same name.

```scss
.#{base.$prefix}-class__name {
    // Using the mixin.
    @include base.layer('sidebar');

    // OR through the function.
    z-index: base.layer('sidebar');
}
```

---

## TypeScript

### Prototypes

For ease of access and readability we use prototypes to extend the functions of native JS objects.

### Element

| Function                              | Type                     | Description                                                              |
| ------------------------------------- | ------------------------ | ------------------------------------------------------------------------ |
| `.addClass(...classes)`               | `(string[]): void`       | Add a class or a set of classes                                          |
| `.removeClass(...classes)`            | `(string[]): void`       | Remove a class or a set of classes                                       |
| `.removeClassByPrefix(prefix)`        | `(string): void`         | Remove a class with a specific prefix                                    |
| `.toggleClass(className, condition?)` | `(string, any): void`    | Toggle the given class on the `Element`, optionally based on a condition |
| `.replaceClass(oldClass, newClass)`   | `(string, string): void` | Replace one class with another                                           |
| `.hasClass(className)`                | `(string): boolean`      | Returns wether or not the `Element` has the given class                  |
| `.show()`                             | `(): void`               | Remove the `mdf-hidden` class to show the `Element`                      |
| `.hide()`                             | `(): void`               | Adds the `mdf-hidden` class to hide the `Element`                        |

### String

| Function           | Type               | Description                                                                  |
| ------------------ | ------------------ | ---------------------------------------------------------------------------- |
| `.truncate(limit)` | `(number): string` | Stop the `String` from exceeding the set length and adds ellipses at the end |

A quick example on how to use the prototypes.

```ts
// Simply importing the base module is enough
import '@miraidesigns/base';

// We get the element we want to manipulate
const elem = document.querySelector('.example');

// Aaaand we added a class. It's just that easy
elem.addClass('class-name');
```