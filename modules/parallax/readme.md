# Parallax

Add a parallax effect to `<img>` or `<picture>` elements.

---

### HTML

```html
<div class="mdf-parallax">
    <img src="/path/to/image.jpg" />
</div>
```

### Sass

```scss
// Include default styles without configuration
@forward '@miraidesigns/parallax/styles';
```

### TypeScript

```ts
import { MDFParallax } from '@miraidesigns/parallax';

new MDFParallax(document.querySelector('.mdf-parallax'));
```

---

## Implementation

### Classes

| Name           | Type   | Description                      |
| -------------- | ------ | -------------------------------- |
| `mdf-parallax` | Parent | Wrapper for the parallax element |

### Properties

| Name         | Type          | Description                            |
| ------------ | ------------- | -------------------------------------- |
| `.container` | `HTMLElement` | Returns the parallax container element |
| `.image`     | `HTMLElement` | Returns the parallax image element     |

### Options

| Name        | Type     | Default  | Description                                                                       |
| ----------- | -------- | -------- | --------------------------------------------------------------------------------- |
| `delay`     | `number` | `0`      | Transition delay                                                                  |
| `direction` | `string` | `up`     | Scrolling direction. Allowed values are `up` `right` `down` `left`                |
| `easing`    | `string` | `linear` | Transition timing function                                                        |
| `scale`     | `number` | `1.2`    | Image scaling factor to create headroom for the parallax effect. Keep above `1.2` |