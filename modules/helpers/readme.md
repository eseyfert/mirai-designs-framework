# Helpers

Collection of helpful CSS classes.

---

### Sass

```scss
@forward '@miraidesigns/helpers/styles';
```

---

### Transitions

Disable transitions generally or on a specific element.

| Name                      | Description                                                      |
| ------------------------- | ---------------------------------------------------------------- |
| `mdf-preload`             | Apply to the `<body>` element. Stops all transitions from firing |
| `mdf-disable-transitions` | Stops transitions on the applied element                         |

### Floats

Float elements to the left or right of its parent allowing content to move around it.

| Name              | Description                                                               |
| ----------------- | ------------------------------------------------------------------------- |
| `mdf-float-left`  | Float element to the left of the content                                  |
| `mdf-float-right` | Float element to the right of the content                                 |
| `mdf-clearfix`    | Apply clearfix to parent element, stops floating content from overflowing |

### Visibility

Hide elements in various ways.

| Name                 | Description                                                                       |
| -------------------- | --------------------------------------------------------------------------------- |
| `mdf-hidden`         | Hides an element by setting `display` to `none`                                   |
| `mdf-hidden-mobile`  | Hides an element on mobile devices by setting `display` to `none`                 |
| `mdf-hidden-tablets` | Hides an element on tablets by setting `display` to `none`                        |
| `mdf-hidden-laptop`  | Hides an element on laptops by setting `display` to `none`                        |
| `mdf-offscreen`      | Move the element offscreen but keep it content relevant to support ARIA practices |

### Sizes

Set the `height` or `width` of an element in percentages. Format is either `mdf-h-*` for height or `mdf-w-*` for width.

| Name             | Description   |
| ---------------- | ------------- |
| `one-fifth`      | 20%           |
| `one-quarter`    | 25%           |
| `one-third`      | 33.3%         |
| `two-fifths`     | 40%           |
| `half`           | 50%           |
| `three-fifths`   | 60%           |
| `two-thirds`     | 66.666666667% |
| `three-quarters` | 75%           |
| `four-fifths`    | 80%           |
| `full`           | 100%          |

### Spacing

Two simple classes to either reset an element's margin or padding.

| Name                | Description        |
| ------------------- | ------------------ |
| `mdf-margin-reset`  | Set `margin` to 0  |
| `mdf-padding-reset` | Set `padding` to 0 |

### Overflow

Hide an element's scrollbar or only show a horizontal or vertical one if necessary.

| Name                   | Description                                                                 |
| ---------------------- | --------------------------------------------------------------------------- |
| `mdf-scrollbar-hidden` | Set `overflow` to `hidden`                                                  |
| `mdf-scrollbar-h`      | Set `overflow-x` to `auto` displaying only a horizontal scrollbar if needed |
| `mdf-scrollbar-v`      | Set `overflow-y` to `auto` displaying only a vertical scrollbar if needed   |

### Others

Miscellaneous helper classes that aren't part of a bigger "category".

| Name             | Description                                                                       |
| ---------------- | --------------------------------------------------------------------------------- |
| `mdf-round`      | Rounds the edges of an element to make it circular. Sets `border-radius` to `50%` |
| `mdf-rotate-90`  | Rotates an element by `90deg`. Sets `transform` to `rotate(90deg)`                |
| `mdf-rotate-180` | Rotates an element by `180deg`. Sets `transform` to `rotate(180deg)`              |
| `mdf-rotate-270` | Rotates an element by `270deg`. Sets `transform` to `rotate(270deg)`              |