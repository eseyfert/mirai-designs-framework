# Textfields

Text fields allow for text based inputs.

---

### HTML

```html
<div class="mdf-textfield">
    <label for="textfield" class="mdf-textfield__label">Label</label>
    <input id="textfield" class="mdf-textfield__input" type="text">
</div>
```

### Sass

```scss
// Include default styles without configuration
@forward '@miraidesigns/textfield/styles';
```

```scss
// Configure appearance
@use '@miraidesigns/textfield' with (
    $variable: value
);

@include textfield.styles();
```

### TypeScript

```ts
import { MDFTextfield } from '@miraidesigns/textfield';

new MDFTextfield(document.querySelector('.mdf-textfield'));
```

---

## Examples

Some basic examples on how the module can be used.

### Icons

Icons are a great way to add visual information to your input, like a search icon for example.

```html
<!-- Leading icon -->
<div class="mdf-textfield mdf-textfield--icon-leading">
    <label for="textfield" class="mdf-textfield__label">Label</label>
    <input id="textfield" class="mdf-textfield__input" type="text">
    <svg class="mdf-textfield__icon">
        <use href="icons.svg#search"></use>
    </svg>
</div>

<!-- Trailing icon -->
<div class="mdf-textfield mdf-textfield--icon-trailing">
    <label for="textfield" class="mdf-textfield__label">Label</label>
    <input id="textfield" class="mdf-textfield__input" type="text">
    <svg class="mdf-textfield__icon">
        <use href="icons.svg#lock"></use>
    </svg>
</div>
```

### Counters

Display the current character count and character limit.

```html
<div class="mdf-textfield mdf-textfield--has-helper">
    <label for="textfield-counter" class="mdf-textfield__label">Text field</label>
    <input id="textfield-counter" class="mdf-textfield__input" type="text" maxlength="30">
    <div class="mdf-textfield__helper-line">
        <span class="mdf-textfield__helper mdf-textfield__helper--counter"></span>
    </div>
</div>
```

### Textareas

Textareas automatically grow in size to accommodate their content.

```html
<div class="mdf-textfield mdf-textfield--textarea">
    <label for="textarea" class="mdf-textfield__label">Textarea</label>
    <textarea id="textarea" class="mdf-textfield__input" rows="1"></textarea>
</div>
```

### Passwords

Password fields allow to toggle between hidden and plain text.

```html
<div class="mdf-textfield mdf-textfield--has-helper mdf-textfield--icon-trailing">
    <label for="password-field" class="mdf-textfield__label">Password</label>
    <input id="password-field" class="mdf-textfield__input" type="password" minlength="8" maxlength="12" pattern="[a-zA-Z0-9]+">
    <div class="mdf-textfield__helper-line">
        <span class="mdf-textfield__helper"></span>
    </div>

    <button class="mdf-textfield__button mdf-textfield__button--toggle">
        <svg class="mdf-textfield__icon" viewBox="0 0 24 24" aria-hidden="true">
            <use href="icons.svg#visibility"></use>
            <use class="mdf-hidden" href="icons.svg#visibility-off"></use>
        </svg>
    </button>
</div>
```

---

## Implementation

### Classes

| Name                             | Type             | Description                                                                                        |
| -------------------------------- | ---------------- | -------------------------------------------------------------------------------------------------- |
| `mdf-textfield`                  | `Parent`         | Contains the input elements                                                                        |
| `mdf-textfield--condensed`       | `Modifier`       | Reduce the input's height                                                                          |
| `mdf-textfield--stretch`         | `Modifier`       | Stretches the input to the width of its parent                                                     |
| `mdf-textfield--disabled`        | `Modifier`       | Greys out the input, stops all interaction with the element                                        |
| `mdf-textfield--state--success`  | `Modifier`       | Used in input validation, changes input colors to green                                            |
| `mdf-textfield--state--warning`  | `Modifier`       | Used in input validation, changes input colors to yellow                                           |
| `mdf-textfield--state--error`    | `Modifier`       | Used in input validation, changes input colors to red                                              |
| `mdf-textfield--textarea`        | `Modifier`       | For textarea elements                                                                              |
| `mdf-textfield--number`          | `Modifier`       | For number input elements                                                                          |
| `mdf-textfield--has-helper`      | `Modifier`       | Prepare the input for helper text (also used for error messages)                                   |
| `mdf-textfield--icon-leading`    | `Modifier`       | Prepare the input for a leading icon                                                               |
| `mdf-textfield--icon-trailing`   | `Modifier`       | Prepare the input for a trailing icon                                                              |
| `mdf-textfield__label`           | `Child`          | Label element, child to `.mdf-textfield`                                                           |
| `mdf-textfield__label--floating` | `Modifier`       | Moves the label above the input                                                                    |
| `mdf-textfield__label--focus`    | `Modifier`       | Focus styles for the label                                                                         |
| `mdf-textfield__label--shake`    | `Modifier`       | Play the shake animation                                                                           |
| `mdf-textfield__input`           | `Child`          | Input element. Child to `.mdf-textfield`                                                           |
| `mdf-textfield__icon`            | `Child`          | Icon element. Child to `.mdf-textfield`                                                            |
| `mdf-textfield__button`          | `Child`          | Button element. Child to `.mdf-textfield`                                                          |
| `mdf-textfield__helper-line`     | `Parent / Child` | Contains the helper text and text counter. Child to `.mdf-textfield`                               |
| `mdf-textfield__helper`          | `Child`          | Helper text, used to display useful information and errors. Child to `.mdf-textfield__helper-line` |
| `mdf-textfield__helper--counter` | `Modifier`       | Used for the character counter                                                                     |

### Properties

| Name                 | Type               | Description                                                              |
| -------------------- | ------------------ | ------------------------------------------------------------------------ |
| `.counter`           | `HTMLElement`      | Returns the counter element                                              |
| `.helper`            | `HTMLElement`      | Returns the helper element                                               |
| `.input`             | `HTMLInputElement` | Returns the input element                                                |
| `.label`             | `HTMLElement`      | Returns the label element                                                |
| `.leadingIcon`       | `HTMLElement`      | Returns the leading icon element                                         |
| `.toggle`            | `HTMLElement`      | Returns the password toggle element                                      |
| `.trailingIcon`      | `HTMLElement`      | Returns the trailing icon element                                        |
| `.type`              | `string`           | Get or set the input's `type`                                            |
| `.value`             | `string`           | Get or set the input's `value`                                           |
| `.length`            | `number`           | Get the value's current length                                           |
| `.minLength`         | `number`           | Get or set the input's `minLength`                                       |
| `.maxLength`         | `number`           | Get or set the input's `maxLength`                                       |
| `.min`               | `string`           | Get or set the input's `min`                                             |
| `.max`               | `string`           | Get or set the input's `max`                                             |
| `.step`              | `string`           | Get or set the input's `step`                                            |
| `.pattern`           | `string`           | Get or set the input's `pattern`                                         |
| `.required`          | `boolean`          | Get or set the input's `required` state                                  |
| `.disabled`          | `boolean`          | Get or set the input's `disabled` state                                  |
| `.prefix`            | `string`           | Get or set the prefix text                                               |
| `.suffix`            | `string`           | Get or set the suffix text                                               |
| `.message`           | `string`           | Get or set the helper message                                            |
| `.validate`          | `boolean`          | Get or set if the input should use validation (defaults to `true`)       |
| `.state`             | `string`           | Get the current input state                                              |
| `.setState(state)`   | `(string): void`   | Set the current input state. Valid value are `Success` `Warning` `Error` |
| `.clearState()`      | `(): void`         | Clear the current input state                                            |
| `.setError(error)`   | `(string): void`   | Set `Error` state and display the given error message                    |
| `.clearError()`      | `(): void`         | Clear input state and remove message                                     |
| `.floatLabel(float)` | `(boolean): void`  | Float the label or restore the default position                          |
| `.focusLabel(focus)` | `(boolean): void`  | Focus the label or remove focus from it                                  |
| `.shakeLabel()`      | `(): void`         | Shake the label to indicate an invalid input                             |