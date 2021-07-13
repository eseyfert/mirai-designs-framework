# Lists

Lists allow you to display a number of connected items, usually one below the other.

---

### HTML

```html
<ul class="mdf-list">
    <li class="mdf-list__item">
        <span class="mdf-list__text">List item</span>
    </li>

    <li class="mdf-list__item">
        <span class="mdf-list__text">List item</span>
    </li>

    <li class="mdf-list__item">
        <span class="mdf-list__text">List item</span>
    </li>
</ul>
```

### Sass

```scss
// Include default styles without configuration
@forward '@miraidesigns/list/styles';
```

```scss
// Configure appearance
@use '@miraidesigns/list' with (
    $variable: value
);

@include list.styles();
```

---

## Examples

Some basic examples on how the module can be used.

### Icons

Add leading or trailing icons to your list items.

```html
<ul class="mdf-list">
    <li class="mdf-list__item">
        <!-- Leading icon -->
        <span class="mdf-list__leading">
            <svg class="mdf-icon" viewBox="0 0 24 24" aria-hidden="true">
                <use href="icons.svg#favorite"></use>
            </svg>
        </span>

        <span class="mdf-list__text">List item</span>

        <!-- Trailing icon -->
        <span class="mdf-list__trailing">
            <svg class="mdf-icon" viewBox="0 0 24 24" aria-hidden="true">
                <use href="icons.svg#more"></use>
            </svg>
        </span>
    </li>
</ul>
```

### Two lines

Two lines can be used to offer a small description for the larger primary text.

```html
<ul class="mdf-list">
    <li class="mdf-list__item mdf-list__item--two-lines">
        <span class="mdf-list__text">
            <span class="mdf-list__primary-text">List item</span>
            <span class="mdf-list__secondary-text">Description text</span>
        </span>
    </li>
</ul>
```

---

## Implementation

### Classes

| Name                        | Type           | Description                                                           |
| --------------------------- | -------------- | --------------------------------------------------------------------- |
| `mdf-list`                  | Parent         | Contains the list items                                               |
| `mdf-list--add-dividers`    | Modifier       | Add dividers to the bottom of every list item                         |
| `mdf-list--condensed`       | Modifier       | Reduce the height of all list items                                   |
| `mdf-list__item`            | Parent / Child | List item, contains the item's text elements. Child to `.mdf-list`    |
| `mdf-list__item--disabled`  | Modifier       | Grey out the list item, stops all interaction                         |
| `mdf-list__item--two-lines` | Modifier       | Increase the height of list items to allow for two text lines         |
| `mdf-list__leading`         | Child          | Leading element (left side of the text). Child to `.mdf-list__item`   |
| `mdf-list__trailing`        | Child          | Trailing element (right side of the text). Child to `.mdf-list__item` |
| `mdf-list__text`            | Parent / Child | List item text element. Child to `.mdf-list__item`                    |
| `mdf-list__primary-text`    | Child          | Primary text of two-line list items. Child to `.mdf-list__text`       |
| `mdf-list__secondary-text`  | Child          | Secondary text of two-line list items. Child to `.mdf-list__text`     |
