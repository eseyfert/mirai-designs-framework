# Snackbars

Snackbars show a quick message at the bottom of the screen.

---

### HTML

Make sure to put this as high in your `<body>` element as possible.

```html
<div class="mdf-snackbar" role="status" aria-live="polite">
    <span class="mdf-snackbar__text">This is a preview text message</span>

    <div class="mdf-snackbar__actions">
        <button class="mdf-button" data-snackbar-action="action">Action</button>

        <button class="mdf-snackbar__close" data-snackbar-action="close" aria-label="Dismiss snackbar">
            <svg class="mdf-icon" viewBox="0 0 24 24" aria-hidden="true">
                <use href="icons.svg#clear"></use>
            </svg>
        </button>
    </div>
</div>
```

### Sass

```scss
// Include default styles without configuration
@forward '@miraidesigns/snackbar/styles';
```

```scss
// Configure appearance
@use '@miraidesigns/snackbar' with (
    $variable: value
);

@include snackbar.styles();
```

### TypeScript

```ts
import { MDFSnackbar } from '@miraidesigns/snackbar';

const snackbar = new MDFSnackbar(document.querySelector('.mdf-snackbar'));
snackbar.showSnackbar();
```

---

## Implementation

### Attributes

Please see the [WAI-ARIA](https://www.w3.org/WAI/WCAG21/Understanding/status-messages) page for attributes and best practices regarding status messages.

| Name                            | Element    | Description                                                      |
| ------------------------------- | ---------- | ---------------------------------------------------------------- |
| `data-snackbar-action="action"` | `<button>` | Will execute the `onAction` function when this button is clicked |
| `data-snackbar-action="close"`  | `<button>` | Will execute the `onClose` function when this button is clicked  |

### Classes

| Name                    | Type           | Description                                                     |
| ----------------------- | -------------- | --------------------------------------------------------------- |
| `mdf-snackbar`          | Parent         | Contains the snackbar elements                                  |
| `mdf-snackbar--active`  | Modifier       | Fades-in and moves the snackbar on-screen                       |
| `mdf-snackbar__text`    | Child          | Holds the snackbar text message. Child to `.mdf-snackbar`       |
| `mdf-snackbar__actions` | Parent / Child | Holds the action and close button. Child to `.mdf-snackbar`     |
| `mdf-snackbar__action`  | Child          | Executes the supplied action. Child to `.mdf-snackbar__actions` |
| `mdf-snackbar__close`   | Child          | Dismisses the snackbar. Child to `.mdf-snackbar__actions`       |

### Events

| Name                 | Data   | Description                    |
| -------------------- | ------ | ------------------------------ |
| `MDFSnackbar:opened` | `null` | Fires when the snackbar opens  |
| `MDFSnackbar:closed` | `null` | Fires when the snackbar closes |

### Properties

| Name                      | Type             | Description                                          |
| ------------------------- | ---------------- | ---------------------------------------------------- |
| `.message`                | `string`         | Get or set the snackbar text message                 |
| `.snackbar`               | `HTMLElement`    | Returns the snackbar element                         |
| `.isActive()`             | `(): boolean`    | Returns wether or not the sidebar is active          |
| `.snowSnackbar(message?)` | `(string): void` | Show the snackbar, optionally with the given message |

### Options

| Name        | Type         | Default | Description                                                                |
| ----------- | ------------ | ------- | -------------------------------------------------------------------------- |
| `delay`     | `number`     | `5000`  | The amount of time that has to pass before the snackbar disappears (in ms) |
| `onOpen`    | `() => void` | `null`  | Function will run when the snackbar is opened                              |
| `onAction`  | `() => void` | `null`  | Function will run when the `action` button is activated                    |
| `onClose`   | `() => void` | `null`  | Function will run when the snackbar is closed by the user                  |
| `hideOnESC` | `boolean`    | `true`  | Hide the snackbar when the `ESC` key is pressed                            |