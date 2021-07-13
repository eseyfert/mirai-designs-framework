# Checkboxes

Checkboxes allow users to select one or multiple options.

---

### HTML

```html
<div class="mdf-checkbox">
    <input id="checkbox" class="mdf-checkbox__input" type="checkbox" />

    <div class="mdf-checkbox__box">
        <svg class="mdf-checkbox__check" viewBox="0 0 24 24" aria-hidden="true">
            <use href="icons.svg#checkbox"></use>
        </svg>
    </div>
</div>
```

### Sass

```scss
// Include default styles without configuration
@forward '@miraidesigns/checkbox/styles';
```

```scss
// Configure appearance
@use '@miraidesigns/checkbox' with (
    $variable: value
);

@include checkbox.styles();
```

---

## Examples

Some basic examples on how the module can be used.

### Labels

To ensure proper alignment, wrap the checkbox and label element inside a `.mdf-control` element.

```html
<div class="mdf-control">
    <div class="mdf-checkbox">
        <input id="labeled-checkbox" class="mdf-checkbox__input" type="checkbox" />

        <div class="mdf-checkbox__box">
            <svg class="mdf-checkbox__check" viewBox="0 0 24 24" aria-hidden="true">
                <use href="icons.svg#checkbox"></use>
            </svg>
        </div>
    </div>

    <label for="labeled-checkbox">Checkbox</label>
</div>
```

### Indeterminate

JavaScript is required to set the `indeterminate` state.

```html
<div class="mdf-control">
    <div class="mdf-checkbox">
        <input id="indeterminate-checkbox" class="mdf-checkbox__input" type="checkbox" />

        <div class="mdf-checkbox__box">
            <svg class="mdf-checkbox__check" viewBox="0 0 24 24" aria-hidden="true">
                <use href="icons.svg#checkbox"></use>
            </svg>

            <svg class="mdf-checkbox__indeterminate" viewBox="0 0 24 24" aria-hidden="true">
                <use href="icons.svg#checkbox-indeterminate"></use>
            </svg>
        </div>
    </div>

    <label for="indeterminate-checkbox">Indeterminate Checkbox</label>
</div>
```

```ts
import { MDFCheckbox } from '@miraidesigns/checkbox';

const checkbox = new MDFCheckbox(document.querySelector('.mdf-checkbox'));
checkbox.indeterminate = true;
```

---

## Implementation

### Classes

| Name                          | Type       | Description                                                                                      |
| ----------------------------- | ---------- | ------------------------------------------------------------------------------------------------ |
| `mdf-control`                 | `Parent`   | Wraps the checkbox and label element                                                             |
| `mdf-checkbox`                | `Parent`   | Checkbox container element                                                                       |
| `mdf-checkbox--disabled`      | `Modifier` | Fades out the element and disabled all interaction                                               |
| `mdf-checkbox--indeterminate` | `Modifier` | Sets the checkbox state as indeterminate. Done through JavaScript                                |
| `mdf-checkbox__input`         | `Child`    | Input element, visually hidden. Used to determine the `:checked` state. Child to `.mdf-checkbox` |
| `mdf-checkbox__box`           | `Child`    | The border around the check. Child to `.mdf-checkbox`                                            |
| `mdf-checkbox__check`         | `Child`    | The check icon. Child to `.mdf-checkbox`                                                         |
| `mdf-checkbox__indeterminate` | `Child`    | The indeterminate icon. Child to `.mdf-checkbox`                                                 |

### Properties

| Name             | Type               | Description                                  |
| ---------------- | ------------------ | -------------------------------------------- |
| `.input`         | `HTMLInputElement` | Returns the input element                    |
| `.disabled`      | `boolean`          | Get or set the input's `disabled` state      |
| `.checked`       | `boolean`          | Get or set the input's `checked` state       |
| `.indeterminate` | `boolean`          | Get or set the input's `indeterminate` state |
| `.value`         | `string`           | Get or set the input's `value`               |