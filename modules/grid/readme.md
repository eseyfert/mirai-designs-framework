# Grids

Grids allow you to display content like image galleries or collections of data.

---

### HTML

```html
<div class="mdf-grid">
    <img src="1.jpg" alt="Image #1 description">
    <img src="2.jpg" alt="Image #2 description">
    <img src="3.jpg" alt="Image #3 description">
</div>
```

### Sass

```scss
// Include default styles without configuration
@forward '@miraidesigns/grid/styles';
```

```scss
// Configure appearance
@use '@miraidesigns/grid' with (
    $variable: value
);

@include grid.styles();
```

---

## Examples

Some basic examples on how the module can be used.

### Masonry grid

Masonry grids place the items as close to each other as possible making optimal use of the available vertical space.\
The most common application would be for image galleries but can be used or any type of content.\
Make sure to follow the example bellow and wrap your content in two `<div>` elements, `mdf-grid__item` and `mdf-grid__item-content`.

#### HTML

```html
<div class="mdf-grid mdf-grid--masonry">
    <div class="mdf-grid__item">
        <div class="mdf-grid__item-content">
            <!-- Content -->
            <img src="1.jpg" alt="Image #1 description">
        </div>
    </div>
    <div class="mdf-grid__item">
        <div class="mdf-grid__item-content">
            <!-- Content -->
            <img src="2.jpg" alt="Image #2 description">
        </div>
    </div>
    <div class="mdf-grid__item">
        <div class="mdf-grid__item-content">
            <!-- Content -->
            <img src="3.jpg" alt="Image #3 description">
        </div>
    </div>
</div>
```

#### TypeScript

```ts
import { debounce } from '@miraidesigns/utils';
import { MDFGrid } from '@miraidesigns/grid';

const grid = new MDFGrid(document.querySelector('.mdf-grid'));
grid.resize();

// Update grid sizing whenever the browser window gets resized
window.addEventListener('resize', debounce(() => grid.resize(), 100));
```

---

## Implementation

### Classes

| Name                      | Type           | Description                                                             |
| ------------------------- | -------------- | ----------------------------------------------------------------------- |
| `mdf-grid`                | Parent         | Contains the grid items.                                                |
| `mdf-grid--masonry`       | Modifier       | Prepare for masonry style grid                                          |
| `mdf-grid--columns-*`     | Modifier       | Set amount of columns. Number based on # of classes generated           |
| `mdf-grid--rows-*`        | Modifier       | Set amount of rows. Number based on # of classes generated              |
| `mdf-grid--gap-*`         | Modifier       | Set gap size. Value based on generated classes                          |
| `mdf-grid__item`          | Parent / Child | Grid item element, masonry only. Child to `.mdf-grid`                   |
| `mdf-grid__item--fade-in` | Modifier       | Fades-in the grid item, used by the masonry script                      |
| `mdf-grid__item-content`  | Parent / Child | Wrapper for grid item content, masonry only. Child to `.mdf-grid__item` |

### Properties

| Name                      | Type                       | Description                                                |
| ------------------------- | -------------------------- | ---------------------------------------------------------- |
| `.container`              | `(): HTMLElement`          | Returns the grid container element                         |
| `.items`                  | `(): HTMLElement`          | Returns an `Array` of all grid items                       |
| `.resize()`               | `(): void`                 | Resize all grid items                                      |
| `.addItem(item, fadeIn?)` | `(Element, boolean): void` | Resize the given item and optionally fade it in afterwards |