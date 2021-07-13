# Elements

A small module mostly for handling graphics like icons or images.

---

### Sass

```scss
@forward '@miraidesigns/elements/styles';
```

---

## Icons

Icons can be used to symbolize user actions like revealing a menu or deleting elements.\
The framework stores all icons in a single `.svg` file.\
I recommend [reading up on the href attribute](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/href) in `<use>` elements.

```html
<svg class="mdf-icon" viewBox="0 0 24 24" aria-hidden="true">
    <use href="icons.svg#favorite"></use>
</svg>
```

---

## Images

Images can be made responsive by simply adding the `mdf-img` class to any `<img>` element.\
The result will be an image that automatically scales to the available container width.

```html
<img class="mdf-img" src="1.jpg" alt="Image description">
```