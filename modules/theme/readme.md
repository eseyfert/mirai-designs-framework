# Theme

Theme is a collection of variables, functions and mixins all created to streamline colors across our apps.

---

### Sass

```scss
// Include default styles without configuration
@forward '@miraidesigns/theme/styles';
```

```scss
// Configure appearance
@use '@miraidesigns/theme' with (
    $variable: value
);

@include theme.styles();
```

---

## Implementation

All of our colors get saved as CSS3 variables. The `styles()` mixin takes care of that.\
It creates a set of variables for each theme, a *light* and *dark* theme.\
The `$themes` map holds the values for both themes. The map keys and CSS3 variables share the same names for ease of access.\
I recommend loading this module early in your load order.

### Variables

| Name                | Default   | Description                            |
| ------------------- | --------- | -------------------------------------- |
| `$brand`            | `blue`    | Primary brand color                    |
| `$complementary`    | `orange`  | Complementary to the brand color       |
| `$theme`            | `light`   | Default page theme: `light` or `dark`  |
| `$primary-light`    | `#000`    | Base text color for the `light` theme  |
| `$background-light` | `#fff`    | Background color for the `light` theme |
| `$primary-dark`     | `#fff`    | Base text color for the `dark` theme   |
| `$background-dark`  | `#212121` | Background color for the `dark` theme  |

### Color

The `.color()` function is used to lookup values from our `$colors` map.

```scss
a {
    color: theme.color('red'); // #f44336 by default
}
```

Alternatively, if all you want to access is your `$brand` or `$complementary` color, use the function with the same name.

```scss
a.logo {
    color: theme.brand(); // Brand color
}

a.links {
    color: theme.complementary(); // Complementary color
}
```

### Prop

The `.prop()` function uses the `$theme` variable as its default.

```scss
div {
    background-color: theme.prop('background');
}
```

Otherwise you can supply a second string to lookup a specific theme like `.prop('background', 'dark')` will try to get the `background` value from the `dark` theme.

```scss
div {
    background-color: theme.prop('background', 'dark');
}
```

### Color Contrast

The function `.color-contrasted()` is used to determine if a given color needs light or dark text to meet contrast requirements.\
It will take the supplied color like `.color-contrasted('red')` and then return either white or black. That gets further modified by using our `$colors-alpha` map and applies subtle opacity changes to make the text and background blend together better without sacrificing readability.

```scss
button {
    background-color: theme.color('red');
    color: theme.color-contrasted('red'); // This text will have proper contrast to match the background
}
```
