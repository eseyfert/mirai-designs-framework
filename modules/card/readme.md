# Cards

Cards are containers with a single object or focus. They are made up of a title and description and may also include media elements and require user actions.

---

### HTML

```html
<div class="mdf-card"> 
    <div class="mdf-card__header">
        <h2 class="mdf-card__title">Card title</h2>
    </div>

    <div class="mdf-card__content">
        <p>Some text describing the card's content or purpose.</p>
    </div>
</div>
```

### Sass

```scss
// Include default styles without configuration
@forward '@miraidesigns/card/styles';
```

```scss
// Configure appearance
@use '@miraidesigns/card' with (
    $variable: value
);

@include card.styles();
```

---

## Examples

Some basic examples on how the module can be used.

### Card with Media and Actions

Media like images or video and user actions are easily added to any card.

```html
<div class="mdf-card">
    <div class="mdf-card__media">
        <img class="mdf-card__media-item" src="1.jpg" alt="Image description">
    </div>

    <div class="mdf-card__header">
        <h2 class="mdf-card__title">Card title</h2>
    </div>

    <div class="mdf-card__content">
        <p>Some text describing the card's content or purpose.</p>
    </div>

    <div class="mdf-card__footer">
        <button class="mdf-button">Action 1</button>
        <button class="mdf-button">Action 2</button>
    </div>
</div>
```

---

## Implementation

### Classes

| Name                    | Type     | Description                                               |
| ----------------------- | -------- | --------------------------------------------------------- |
| `mdf-card`              | Parent   | Container for the card elements                           |
| `mdf-card--bordered`    | Modifier | Add a border to the card                                  |
| `mdf-card--raised`      | Modifier | Elevate the card by adding a shadow                       |
| `mdf-card--fixed-width` | Modifier | Restrict the card's width                                 |
| `mdf-card__media`       | Child    | Contains the media elements. Child to `.mdf-card`         |
| `mdf-card__media-item`  | Child    | Media element. Child to `.mdf-card__media`                |
| `mdf-card__header`      | Child    | Contains the title. Child to `.mdf-card`                  |
| `mdf-card__title`       | Child    | Title element. Child to `.mdf-card__header`               |
| `mdf-card__content`     | Child    | Contains the cards text description. Child to `.mdf-card` |
| `mdf-card__footer`      | Child    | Contains the action buttons. Child to `.mdf-card`         |