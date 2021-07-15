# Breadcrumbs

Breadcrumbs are a type of navigation that show your current location on the app or website.

---

### HTML

```html
<nav aria-label="Breadcrumb">
    <ol class="mdf-breadcrumbs">
        <li class="mdf-breadcrumbs__item">
            <a href="/">Home</a>
        </li>

        <li class="mdf-breadcrumbs__item mdf-breadcrumbs__item--active">
            Breadcrumbs
        </li>
    </ol>
</nav>
```

### Sass

```scss
// Include default styles without configuration
@forward '@miraidesigns/breadcrumbs/styles';
```

```scss
// Configure appearance
@use '@miraidesigns/breadcrumbs' with (
    $variable: value
);

@include breadcrumbs.styles();
```

---

### Attributes

Please see the [WAI-ARIA](https://www.w3.org/TR/wai-aria-practices-1.1/#breadcrumb) page for attributes and best practices regarding breadcrumbs.

### Classes

| Name                            | Type     | Description                                             |
| ------------------------------- | -------- | ------------------------------------------------------- |
| `mdf-breadcrumbs`               | Parent   | Contains the breadcrumb elements                        |
| `mdf-breadcrumbs__item`         | Child    | Breadcrumb navigation item. Child to `.mdf-breadcrumbs` |
| `mdf-breadcrumbs__item--active` | Modifier | Set navigation item as active (current page)            |

