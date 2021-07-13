# Mirai Designs Framework

A modular framework written in [Dart Sass](https://sass-lang.com/dart-sass) and [TypeScript](https://www.typescriptlang.org/).\
This framework powers every [Mirai Designs](https://miraidesigns.net) app and website.\
It requires a basic understanding of Sass and TypeScript and how to compile both into usable CSS and JS.

---

## Modules

Modules are the individual components that makeup the framework.\
A few modules like `Base` or `Theme` are generally required by every single module but the idea is that you can pick and choose what you need for your project without creating bloat.

### HTML

Most modules have some sort of required HTML markup.\
Check the module's documentation to see what that looks like.\
For our example, let's use the `Button` module.

```html
<button class="mdf-button">
    Button
</button>
```

All we do is apply the `mdf-button` class to a regular `<button>` element and that's it.

### Modifiers

Most modules come with alternative or additional styles, known as modifiers.\
They all follow the same pattern.\
Let's use the `Button` module again for this example.

```html
<button class="mdf-button mdf-button--filled">
    Button
</button>
```

As you can see, our `<button>` now has **2** classes.\
The original `mdf-button` class and now a modifier class, identified by the connecting `--` symbol.\
Whenever a class contains the double dash symbol, it's a modifier class and requires the base class to be present.

---

### Sass

Every module has several Sass files that are used to configure that module's appearance and functionality.

### Implementation

If the module has a style component to it, there are generally two ways to import it.\
You can either use the `@forward` rule below and use the default styling...

```scss
@forward '@miraidesigns/button/styles';
```

...or apply the `@use` rule and overwrite the default values.

```scss
@use '@miraidesigns/button' with (
    $variable: value
);

@include button.styles();
```

It's very important to call the `.styles()` mixin after configuring the module so that the styles actually get applied.

### Variables

Variables are stored in the `_variables.scss` file and contain the module's default values.\
I recommend applying the `@use` method above if you would like to alter them instead of changing the defaults.

### Functions

Functions are stored in the `_functions.scss` file.\
They help us do certain tasks in an easier fashion or help our code stay easily readable and maintained.\
A very commonly used function is the `Theme` module's `prop` function.\
It allows us to access one of the many `Theme` variables in an easy way.

```scss
// Import the module.
@use '@miraidesigns/theme';

button {
    // Using `prop`, we apply our theme's primary text color.
    color: theme.prop('primary');
}
```

### Mixins

Mixins are stored in the `_mixins.scss` file.\
They are reusable sets of styles and makeup our module's look.\
Generally every parent, modifier and child has it's own mixin to easily separate them and avoid breaking changes.\
Most modules have the `styles()` mixin that creates the actual stylesheet rules and includes the various other mixins to create the final style.

```scss
// _mixins.scss

// We create a few mixins to style our elements:
@mixin base() {
    color: red;
}

@mixin modifier() {
    color: green;
}

@mixin child() {
    font-size: 12px;
}

// Here we bring it all together:
@mixin styles() {
    .element {
        @include base();

        &--modifier {
            @include modifier();
        }

        &__child {
            @include child();
        }
    }
}
```

---

### TypeScript

Most modules contain several Typescript `.ts` files that add additional functionality to the component.\
Every readme covers the TypeScript properties and options, if present or required.

### Implementation

There are just a few steps to add a TypeScript module to your app.\
First, we import the module we need, in our example we are using `MDFSelect`.

```ts
import { MDFSelect } from '@miraidesigns/select';
```

Next, we initialize it and add the element that is associated with it.

```ts
new MDFSelect(document.querySelector('.mdf-select'));
```

In general, the modules are created to operate with a single element, but you can also apply it to a group of elements.

```ts
for (const elem of document.querySelectorAll('.mdf-select')) {
    new MDFSelect(elem);
}
```

And what it looks like all together:

```ts
// Import the module.
import { MDFSelect } from '@miraidesigns/select';

// Apply it to a single element.
new MDFSelect(document.querySelector('.mdf-select'));

// Apply it to a group of elements.
for (const elem of document.querySelectorAll('.mdf-select')) {
    new MDFSelect(elem);
}
```

### Options

Options get applied to the element before it gets initialized and can change the module's functionality or appearance.

```ts
import { MDFSelect } from '@miraidesigns/select';

// Here we supply our options in the curly brackets.
new MDFSelect(document.querySelector('.mdf-select'), {
    option: 'value',
    option2: false
});
```

### Properties

Properties give you information about the various states and elements of the module and in many cases allow you to change them after the fact.

```ts
import { MDFSelect } from '@miraidesigns/select';

// Store the module's instance.
const select = new MDFSelect(document.querySelector('.mdf-select'));

// Getting a property.
console.log(select.disabled); // false

// Setting a property.
select.disabled = true;
```

---

And that's it. Thank you for your interest in this project of mine and I hope this will help you understand the framework a little more. 