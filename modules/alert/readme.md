# Alerts

Alerts display an important message to the user fixed to the top of the screen.

---

### HTML

Make sure to put this as high in your `<body>` element as possible.

```html
<div id="alert" class="mdf-alert" role="alert">
    <div class="mdf-alert__content">
        <svg class="mdf-icon" viewBox="0 0 24 24" aria-hidden="true">
            <use href="icons.svg#error"></use>
        </svg>

        <span class="mdf-alert__text">This is an alert message</span>
    </div>

    <div class="mdf-alert__actions">
        <button class="mdf-button" data-alert-action="cancel">Dismiss</button>
        <button class="mdf-button" data-alert-action="confirm">Confirm</button>
    </div>
</div>
```

### Sass

```scss
// Include default styles without configuration
@forward '@miraidesigns/alert/styles';
```

```scss
// Configure appearance
@use '@miraidesigns/alert' with (
    $variable: value
);

@include alert.styles();
```

### TypeScript

```ts
import { MDFAlert } from '@miraidesigns/alert';

const alert = new MDFAlert(document.querySelector('.mdf-alert'));
alert.showAlert();
```

---

## Implementation

### Attributes

| Name                          | Element    | Description                                                       |
| ----------------------------- | ---------- | ----------------------------------------------------------------- |
| `data-alert-action="cancel"`  | `<button>` | Will execute the `onCancel` function when this button is clicked  |
| `data-alert-action="confirm"` | `<button>` | Will execute the `onConfirm` function when this button is clicked |

### Classes

| Name                 | Type           | Description                                                |
| -------------------- | -------------- | ---------------------------------------------------------- |
| `mdf-alert`          | Parent         | Alert element                                              |
| `mdf-alert--active`  | Modifier       | 1. Prepares the alert to be visible                        |
| `mdf-alert--move-in` | Modifier       | 2. Moves the alert on screen and allows for interaction    |
| `mdf-alert--filled`  | Modifier       | Fills the alert's background with the set `brand` color    |
| `mdf-alert--warning` | Modifier       | Fills the alert's background with the set `warning` color  |
| `mdf-alert--error`   | Modifier       | Fills the alert's background with the set `error` color    |
| `mdf-alert__content` | Parent / Child | Contains the alert text and actions. Child to `.mdf-alert` |
| `mdf-alert__text`    | Child          | Alert text. Child to `.mdf-alert__content`                 |
| `mdf-alert__actions` | Child          | Alert action buttons. Child to `.mdf-alert__content`       |

### Events

| Name              | Data   | Description                          |
| ----------------- | ------ | ------------------------------------ |
| `MDFAlert:opened` | `null` | Fires once the alert has been opened |
| `MDFAlert:closed` | `null` | Fires once the alert has been closed |

### Properties

| Name                 | Type              | Description                             |
| -------------------- | ----------------- | --------------------------------------- |
| `.alert`             | `HTMLElement`     | Returns the alert element               |
| `.message`           | `string`          | Get or set the alert's text message     |
| `.showAlert(delay?)` | `(number): void ` | Show the alert, optionally with a delay |

### Options

| Name        | Type         | Default | Description                                   |
| ----------- | ------------ | ------- | --------------------------------------------- |
| `onOpen`    | `() => void` | `null`  | Function will run when the alert is opened    |
| `onConfirm` | `() => void` | `null`  | Function will run when the alert is confirmed |
| `onCancel`  | `() => void` | `null`  | Function will run when the alert is dismissed |