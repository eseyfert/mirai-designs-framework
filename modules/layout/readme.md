# Layout

Layout classes help you structure your webpage and content.

---

### Sass

```scss
// Include default styles without configuration
@forward '@miraidesigns/layout/styles';
```

```scss
// Configure appearance
@use '@miraidesigns/layout' with (
    $variable: value
);

@include layout.styles();
```

---

## Examples

Some basic examples on how the module can be used.

### Columns & Rows

Columns and rows allow you to decide whether content will flow horizontally or vertically.

```html
<!-- Elements will be aligned vertically, like in a column. -->
<div class="mdf-column">
    <!-- Element -->
    <!-- Element -->
    <!-- Element -->
</div>

<!-- Elements will be aligned horizontally, like in a row. -->
<div class="mdf-row">
    <!-- Element --><!-- Element --><!-- Element -->
</div>
```

### Containers

Containers wrap your content limiting its max width and allow for easy positioning.

```html
<!-- Container aligned left -->
<div class="mdf-container mdf-container--left"></div>

<!-- Container centered -->
<div class="mdf-container mdf-container--center"></div>

<!-- Container aligned right -->
<div class="mdf-container mdf-container--right"></div>
```

### Groups

Groups allow you to organize a collection of elements.

```html
<div class="mdf-group">
    <div class="mdf-container"></div>
    <div class="mdf-container"></div>
    <div class="mdf-container"></div>
</div>
```

### RTL

RTL (Right To Left) layouts are fully supported and every module is 100% compatible.
Add the `mdf-rtl` class to the `<html>` element and your website will be served in RTL mode.

```html
<html class="mdf-rtl">
    <body>
        <!-- All content will be in RTL mode. -->
    </body>
</html>
```

---

## Implementation

### Classes

| Name                      | Type       | Description                                                                     |
| ------------------------- | ---------- | ------------------------------------------------------------------------------- |
| `mdf-column`              | `Parent`   | Container element, all content inside will flow vertically                      |
| `mdf-row`                 | `Parent`   | Container element, all content inside will flow horizontally                    |
| `mdf-container`           | `Parent`   | Container element, use to restrict content width and allow for easy positioning |
| `mdf-container--left`     | `Modifier` | Move container to the left of its parent                                        |
| `mdf-container--centered` | `Modifier` | Move container to the center of its parent                                      |
| `mdf-container--right`    | `Modifier` | Move container to the right of its parent                                       |
| `mdf-group`               | `Parent`   | Container element, use to organize a collection of items                        |
| `mdf-group--stacked`      | `Modifier` | Content will flow vertically, like a list                                       |
| `mdf-group--wrap`         | `Modifier` | Content will wrap around to the next line if not enough space is available      |
| `mdf-group--gap-none`     | `Modifier` | Removes the gap between items                                                   |
| `mdf-group--gap-*`        | `Modifier` | Set gap size according to `$gaps` map                                           |