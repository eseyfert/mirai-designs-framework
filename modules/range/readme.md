# Range Sliders

Range sliders allow users to pick between a minimum and maximum value.

---

### HTML

It is very important to set the input's `min`, `max` and `step` attribute for this module to work properly.\
Otherwise when executed the script will set the values below by default.

```html
<div class="mdf-range">
    <input class="mdf-range__input" type="range" min="0" max="100" step="10" aria-label="Slider">
</div>
```

### Sass

```scss
// Include default styles without configuration
@forward '@miraidesigns/range/styles';
```

```scss
// Configure appearance
@use '@miraidesigns/range' with (
    $variable: value
);

@include range.styles();
```

```ts
import { MDFRange } from '@miraidesigns/range';

new MDFRange(document.querySelector('.mdf-range'));
```

---

## Examples

Some basic examples on how the module can be used.

### Label

Lead the slider with a label.

```html
<div class="mdf-range">
    <div id="slider-label" class="mdf-range__leading">
        Label
    </div>

    <div class="mdf-range__track">
        <input class="mdf-range__input" type="range" min="0" max="100" step="10" aria-labelledby="slider-label">
    </div>
</div>
```

### Icons

Icons can be leading and trailing, here demonstrated as a volume slider.

```html
<div class="mdf-range">
    <div class="mdf-range__leading">
        <svg class="mdf-icon" viewBox="0 0 24 24" aria-hidden="true">
            <use href="icons.svg#volume-mute"></use>
        </svg>
    </div>

    <div class="mdf-range__track">
        <input class="mdf-range__input" type="range" min="0" max="100" step="10" aria-label="Volume slider">
    </div>

    <div class="mdf-range__trailing">
        <svg class="mdf-icon" viewBox="0 0 24 24" aria-hidden="true">
            <use href="icons.svg#volume-up"></use>
        </svg>
    </div>
</div>
```

### Value

Shows the current value trailing the slider.

```html
<div class="mdf-range">
    <div class="mdf-range__track">
        <input class="mdf-range__input" type="range" min="0" max="100" step="10" aria-label="Slider">
    </div>

    <div class="mdf-range__trailing"></div>
</div>
```

```ts
new MDFRange(document.querySelector('.mdf-range'), {
	value: true,
});
```

### Editable

Allows for the editing of the displayed value with an immediate response from the slider.

```html
<div class="mdf-range mdf-range--editable">
    <div id="slider-label" class="mdf-range__leading">
        Editable slider
    </div>

    <div class="mdf-range__track">
        <input class="mdf-range__input" type="range" min="0" max="100" step="10" aria-labelledby="slider-label">
    </div>

    <div class="mdf-range__trailing">
        <input class="mdf-range__value" type="number" aria-label="Slider value">
    </div>
</div>
```

```ts
new MDFRange(document.querySelector('.mdf-range'), {
	editable: true,
});
```

### Ticks

Ticks visualize the slider snapping points.\
You may display numbers underneath the ticks as well.\

```ts
// Without numbers
new MDFRange(document.querySelector('.mdf-range'), {
	ticks: true,
});

// With numbers
new MDFRange(document.querySelector('.mdf-range'), {
	ticks: true,
    numbers: true,
});
```

## Implementation

### Classes

| Name                  | Type             | Description                                                                                                |
| --------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------- |
| `mdf-range`           | `Parent`         | Range container element                                                                                    |
| `mdf-range--disabled` | `Modifier`       | Fades out the element and disabled all interaction                                                         |
| `mdf-range--editable` | `Modifier`       | Setup the range slider for the editable value input                                                        |
| `mdf-range__track`    | `Parent / Child` | Range track, holds the input and ticks elements. Child to `.mdf-range`                                     |
| `mdf-range__input`    | `Child`          | Range slider input element. Child to `.mdf-range__track`                                                   |
| `mdf-range__leading`  | `Child`          | The leading element. Can be used for icons or as a label. Child to `.mdf-range`                            |
| `mdf-range__trailing` | `Parent / Child` | The trailing element. Can be used for icons or show the current value. Child to `.mdf-range`               |
| `mdf-range__ticks`    | `Parent / Child` | Container element holding the ticks. Created through JavaScript. Child to `.mdf-range__trailing`           |
| `mdf-range__tick`     | `Child`          | Single tick element. Created through JavaScript. Child to `.mdf-range__ticks`                              |
| `mdf-range__value`    | `Child`          | Value input element. Offers another way to change the current range value. Child to `.mdf-range__trailing` |

### Properties

| Name          | Type               | Description                              |
| ------------- | ------------------ | ---------------------------------------- |
| `.input`      | `HTMLInputElement` | Returns the input element                |
| `.leading`    | `HTMLElement`      | Returns the leading element              |
| `.track`      | `HTMLElement`      | Returns the track element                |
| `.trailing`   | `HTMLElement`      | Returns the trailing element             |
| `.valueInput` | `HTMLInputElement` | Returns the editable value input element |
| `.disabled`   | `boolean`          | Get or set the input's `disabled` state  |
| `.value`      | `string`           | Get or set the input's `value`           |
| `.min`        | `string`           | Get or set the input's `min`             |
| `.max`        | `string`           | Get or set the input's `max`             |
| `.step`       | `string`           | Get or set the input's `step`            |

### Options

| Name       | Type      | Default | Description                                                         |
| ---------- | --------- | ------- | ------------------------------------------------------------------- |
| `value`    | `boolean` | `false` | Show the current value trailing the slider                          |
| `editable` | `boolean` | `false` | Allow for the editing of the current value through a separate input |
| `ticks`    | `boolean` | `false` | Show ticks underneath the slider visualizing snapping points        |
| `numbers`  | `boolean` | `false` | Show value numbers underneath the ticks                             |