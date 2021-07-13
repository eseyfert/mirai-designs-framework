# Switches

Switches allow the user to toggle an option on or off.

---

### HTML

```html
<div class="mdf-switch">    
    <input id="switch" class="mdf-switch__input" type="checkbox" role="switch">

    <div class="mdf-switch__track"></div>
    <div class="mdf-switch__thumb"></div>
    <div class="mdf-switch__shadow"></div>
</div>
```

### Sass

```scss
// Include default styles without configuration
@forward '@miraidesigns/switch/styles';
```

```scss
// Configure appearance
@use '@miraidesigns/switch' with (
    $variable: value
);

@include switch.styles();
```

---

## Examples

Some basic examples on how the module can be used.

### Labels

To ensure proper alignment, wrap the switch and label element inside a `.mdf-control` element.

```html
<div class="mdf-control">
    <div class="mdf-switch">    
        <input id="switch" class="mdf-switch__input" type="checkbox" role="switch">
    
        <div class="mdf-switch__track"></div>
        <div class="mdf-switch__thumb"></div>
        <div class="mdf-switch__shadow"></div>
    </div>

    <label for="switch">Option</label>
</div>
```

---

## Implementation

### Classes

| Name                   | Type       | Description                                                                                    |
| ---------------------- | ---------- | ---------------------------------------------------------------------------------------------- |
| `mdf-control`          | `Parent`   | Wraps the switch and label element                                                             |
| `mdf-switch`           | `Parent`   | Switch container element                                                                       |
| `mdf-switch--disabled` | `Modifier` | Fades out the element and disabled all interaction                                             |
| `mdf-switch__input`    | `Child`    | Input element, visually hidden. Used to determine the `:checked` state. Child to `.mdf-switch` |
| `mdf-switch__track`    | `Child`    | The track the thumb runs on. Child to `.mdf-switch`                                            |
| `mdf-switch__thumb`    | `Child`    | The thumb. Child to `.mdf-switch`                                                              |
| `mdf-switch__shadow`   | `Child`    | The shadow underneath the thumb. Child to `.mdf-switch`                                        |