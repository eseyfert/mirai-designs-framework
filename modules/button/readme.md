# Buttons

Buttons allow users to take actions with a single click or tap.

---

### HTML

```html
<button class="mdf-button">
    Button
</button>
```

### Sass

```scss
// Include default styles without configuration
@forward '@miraidesigns/button/styles';
```

```scss
// Configure appearance
@use '@miraidesigns/button' with (
    $variable: value
);

@include button.styles();
```

---

## Examples

Some basic examples on how the module can be used.

### Icons

Icons can help give more meaning or emphasis to your button.

```html
<!-- Leading icon -->
<button class="mdf-button mdf-button--leading-icon">
    <svg class="mdf-icon" viewBox="0 0 24 24" aria-hidden="true">
        <use href="icons.svg#favorite"></use>
    </svg>

    Favorite
</button>

<!-- Trailing icon -->
<button class="mdf-button mdf-button--trailing-icon">
    Favorite

    <svg class="mdf-icon" viewBox="0 0 24 24" aria-hidden="true">
        <use href="icons.svg#favorite"></use>
    </svg>
</button>
```

---

## Implementation

### Classes

| Name                           | Type     | Description                                                         |
| ------------------------------ | -------- | ------------------------------------------------------------------- |
| `mdf-button`                   | Parent   | Apply basic styling to a button element                             |
| `mdf-button--bordered`         | Modifier | Add a border to the button                                          |
| `mdf-button--filled `          | Modifier | Fill the button with the brand color                                |
| `mdf-button--small`            | Modifier | Reduced the height and padding of the button                        |
| `mdf-button--large`            | Modifier | Increase the height and padding of the button                       |
| `mdf-button--block`            | Modifier | Stretches the button to width of its parent                         |
| `mdf-button--block-responsive` | Modifier | Stretches the button to width of its parent (only on small devices) |
| `mdf-button--leading-icon`     | Modifier | Adjust spacing for the leading icon                                 |
| `mdf-button--trailing-icon`    | Modifier | Adjust spacing for the trailing icon                                |
| `mdf-button--icon`             | Modifier | Icon only button                                                    |
| `mdf-button--raised`           | Modifier | Elevate button by adding a shadow                                   |
| `mdf-button--no-hover`         | Modifier | Remove the button hover effect                                      |

---

# Toggles

A group of buttons where only one option can be active at a time.

---

### HTML

```html
<div class="mdf-toggles">
    <button class="mdf-button mdf-button--toggle" data-toggle-callback="callback1" aria-pressed="false" aria-label="Toggle 1">
        <svg class="mdf-icon" viewBox="0 0 24 24" aria-hidden="true">
            <use href="icons.svg#add"></use>
        </svg>
    </button>

    <button class="mdf-button mdf-button--toggle mdf-button--active" data-toggle-callback="callback2" aria-pressed="true" aria-label="Toggle 2">
        <svg class="mdf-icon" viewBox="0 0 24 24" aria-hidden="true">
            <use href="icons.svg#favorite"></use>
        </svg>
    </button>

    <button class="mdf-button mdf-button--toggle" data-toggle-callback="callback3" aria-pressed="false" aria-label="Toggle 3">
        <svg class="mdf-icon" viewBox="0 0 24 24" aria-hidden="true">
            <use href="icons.svg#clear"></use>
        </svg>
    </button>
</div>
```

### TypeScript

```ts
import { MDFToggles } from '@miraidesigns/button';

new MDFToggles(document.querySelector('.mdf-toggles'), {
	callback1: () => {
		console.log('Pressed toggle 1');
	},
	callback2: () => {
		console.log('Pressed toggle 2');
	},
	callback3: () => {
		console.log('Pressed toggle 3');
	},
});
```

---

## Implementation

### Attributes

Please see the [WAI-ARIA](https://www.w3.org/TR/wai-aria-practices-1.1/#button) page for attributes and best practices regarding button toggles. 

| Name                   | Element    | Description                                         |
| ---------------------- | ---------- | --------------------------------------------------- |
| `data-toggle-callback` | `<button>` | The name of the callback associated with the toggle |

### Classes

| Name                 | Type             | Description                                    |
| -------------------- | ---------------- | ---------------------------------------------- |
| `mdf-toggles`        | Parent           | Contains the toggle elements                   |
| `mdf-button--toggle` | Child / Modifier | Toggle button element. Child to `.mdf-toggles` |
| `mdf-button--active` | Modifier         | Set toggle as active                           |

### Events

| Name                | Data                                                           | Description                                                                                                    |
| ------------------- | -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `MDFToggle:changed` | `{callback: string, index: number, toggle: HTMLButtonElement}` | Fires whenever the active toggle element changes. Includes the callback name, the index and the element itself |

### Properties

| Name                    | Type                          | Description                                            |
| ----------------------- | ----------------------------- | ------------------------------------------------------ |
| `.container`            | `HTMLElement`                 | Returns the toggles container element                  |
| `.toggles`              | `HTMLButtonElement[]`         | Returns an `Array` of all toggle elements              |
| `.callbacks`            | `Record<string, () => void>`  | Returns an `Object` holding the toggle callbacks       |
| `.getToggle(index)`     | `(number): HTMLButtonElement` | Returns the toggle button element with the given index |
| `.getActiveToggle()`    | `(): HTMLButtonElement`       | Returns the currently active toggle element            |
| `.activateToggle(elem)` | `(HTMLButtonElement): void`   | Activate the given toggle element                      |

### Options

| Name        | Type                          | Default | Description                              |
| ----------- | ----------------------------- | ------- | ---------------------------------------- |
| `callbacks` | ` Record<string, () => void>` | `null`  | `Object` containing the toggle callbacks |