# Radio Buttons

Radio buttons allow users to select one option from a set of options.

---

### HTML

```html
<div class="mdf-radio">
    <input id="radio" class="mdf-radio__input" type="radio">

    <div class="mdf-radio__circle"></div>
</div>
```

### Sass

```scss
// Include default styles without configuration
@forward '@miraidesigns/radio/styles';
```

```scss
// Configure appearance
@use '@miraidesigns/radio' with (
    $variable: value
);

@include radio.styles();
```

---

## Examples

Some basic examples on how the module can be used.

### Labels

To ensure proper alignment, wrap the radio button and label element inside a `.mdf-control` element.

```html
<div class="mdf-control">
    <div class="mdf-radio">
        <input id="option-1" class="mdf-radio__input" type="radio" name="options">

        <div class="mdf-radio__circle"></div>
    </div>

    <label for="option-1">Option #1</label>
</div>

<div class="mdf-control">
    <div class="mdf-radio">
        <input id="option-2" class="mdf-radio__input" type="radio" name="options">

        <div class="mdf-radio__circle"></div>
    </div>

    <label for="option-2">Option #2</label>
</div>
```

---

## Implementation

### Classes

| Name                  | Type       | Description                                                                                   |
| --------------------- | ---------- | --------------------------------------------------------------------------------------------- |
| `mdf-control`         | `Parent`   | Wraps the radio and label element                                                             |
| `mdf-radio`           | `Parent`   | Radio container element                                                                       |
| `mdf-radio--disabled` | `Modifier` | Fades out the element and disabled all interaction                                            |
| `mdf-radio__input`    | `Child`    | Input element, visually hidden. Used to determine the `:checked` state. Child to `.mdf-radio` |
| `mdf-radio__circle`   | `Child`    | The circle icon. Child to `.mdf-radio`                                                        |