# Sliders

Sliders allow you to create a carousel of elements, usually used to display images or other media elements.

---

### HTML

```html
<section class="mdf-slider" aria-roledescription="carousel" aria-label="Slider preview">
    <div id="slider-items" class="mdf-slider__slides" aria-live="polite">
        <div class="mdf-slider__slide" role="group" aria-roledescription="slide" aria-label="1 of 3">
            <img class="mdf-slider__media" src="1.jpg" alt="Picture #1">
        </div>

        <div class="mdf-slider__slide" role="group" aria-roledescription="slide" aria-label="2 of 3">
            <img class="mdf-slider__media" src="2.jpg" alt="Picture #2">
        </div>

        <div class="mdf-slider__slide" role="group" aria-roledescription="slide" aria-label="3 of 3">
            <img class="mdf-slider__media" src="3.jpg" alt="Picture #3">
        </div>
    </div>

    <button class="mdf-slider__control mdf-slider__control--prev" data-slider-action="prev" aria-controls="slider-items" aria-label="Previous slide">
        <svg class="mdf-icon" viewBox="0 0 24 24" aria-hidden="true">
            <use href="icons.svg#arrow-keyboard"></use>
        </svg>
    </button>

    <button class="mdf-slider__control mdf-slider__control--next" data-slider-action="next" aria-controls="slider-items" aria-label="Next slide">
        <svg class="mdf-icon" viewBox="0 0 24 24" aria-hidden="true">
            <use href="icons.svg#arrow-keyboard"></use>
        </svg>
    </button>
</section>
```

### Sass

```scss
// Include default styles without configuration
@forward '@miraidesigns/slider/styles';
```

```scss
// Configure appearance
@use '@miraidesigns/slider' with (
    $variable: value
);

@include slider.styles();
```

### TypeScript

```ts
import { MDFSlider } from '@miraidesigns/slider';

new MDFSlider(document.querySelector('.mdf-slider'));
```

---

## Implementation

### Attributes

Please see the [WAI-ARIA](https://www.w3.org/TR/wai-aria-practices-1.1/#carousel) page for attributes and best practices regarding carousels. 

| Name                        | Element    | Description                       |
| --------------------------- | ---------- | --------------------------------- |
| `data-slider-action="prev"` | `<button>` | Action to show the previous slide |
| `data-slider-action="next"` | `<button>` | Action to show the next slide     |

### Classes

| Name                           | Type           | Description                                                                                |
| ------------------------------ | -------------- | ------------------------------------------------------------------------------------------ |
| `mdf-slider`                   | Parent         | Contains the slider elements                                                               |
| `mdf-slider--is-dragging`      | Modifier       | Changes cursor appearance while dragging a slide                                           |
| `mdf-slider--has-nav-top`      | Modifier       | Moves the navigation to the top of the slider                                              |
| `mdf-slider__slides`           | Parent / Child | Contains the slides. Child to `.mdf-slider`                                                |
| `mdf-slider__slide`            | Parent / Child | Contains any content you want to display for a given slide. Child to `.mdf-slider__slides` |
| `mdf-slider__media`            | Child          | Used for images and videos to display correctly. Child to `.mdf-slider__slide`             |
| `mdf-slider__control`          | Child          | Used to show the previous or next slide. Child to `.mdf-slider`                            |
| `mdf-slider__control--prev`    | Modifier       | Styling for the `previous` element                                                         |
| `mdf-slider__control--next`    | Modifier       | Styling for the `next` element                                                             |
| `mdf-slider__nav`              | Parent / Child | Holds the navigation bullets                                                               |
| `mdf-slider__nav-item`         | Child          | Navigation item element. Added by script based on how many slides we have                  |
| `mdf-slider__nav-item--active` | Modifier       | Styling for the `active` item element                                                      |

### Events

| Name                | Data                                 | Description                                                                      |
| ------------------- | ------------------------------------ | -------------------------------------------------------------------------------- |
| `MDFSlider:changed` | `{index: number, item: HTMLElement}` | Fires whenever the active slide changes. Includes the slide itself and its index |

### Properties

| Name                 | Type                    | Description                                           |
| -------------------- | ----------------------- | ----------------------------------------------------- |
| `.slides`            | `HTMLElement[]`         | Returns an `Array` holding all slides                 |
| `.slider`            | `HTMLElement`           | Returns the slider element                            |
| `.content`           | `HTMLElement`           | Returns the slides container element                  |
| `.getCurrentSlide()` | `(): HTMLElement`       | Returns the active slide                              |
| `.getSlide(index)`   | `(number): HTMLElement` | Returns the slide with the given index (starts at 0). |

### Options

| Name               | Type         | Default | Description                                                                                |
| ------------------ | ------------ | ------- | ------------------------------------------------------------------------------------------ |
| `onChange`         | `() => void` | `null`  | Function will run whenever the slide changes                                               |
| `defaultSlide`     | `number`     | `0`     | Index of the first visible slide (starts at 0)                                             |
| `enableNavigation` | `boolean`    | `true`  | Enable slider bullet navigation. Dynamically creates navigation items based on # of slides |
| `enableSwipe`      | `boolean`    | `true`  | Enable changing slides by swiping left or right on touch devices                           |
| `enableDrag`       | `boolean`    | `true`  | Enable changing slides by dragging the mouse left or right                                 |
