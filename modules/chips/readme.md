# Chips

Chips are elements that represent small pieces of information like tags or inputs.

---

### HTML

```html
<div class="mdf-chips">
    <div class="mdf-chips__grid" role="grid">   
        <div class="mdf-chips__chip" role="row">
            <span role="gridcell">
                <span class="mdf-chips__text" tabindex="0">Some preview text</span>
            </span>
        </div>

        <div class="mdf-chips__chip" role="row">
            <span role="gridcell">
                <span class="mdf-chips__text" tabindex="0">Some other text</span>
            </span>
        </div>
    </div>
</div>
```

### Sass

```scss
// Include default styles without configuration
@forward '@miraidesigns/chips/styles';
```

```scss
// Configure appearance
@use '@miraidesigns/chips' with (
    $variable: value
);

@include chips.styles();
```

---

## Examples

Some basic examples on how the module can be used.

### User Created Chips

Requires the `Helpers` module for the `mdf-offscreen` class.

```html
<div class="mdf-chips mdf-chips--has-input">
    <div class="mdf-chips__grid" role="grid">   
        <div class="mdf-chips__chip" role="row">
            <span role="gridcell">
                <span class="mdf-chips__text" tabindex="0">Preview</span>
            </span>

            <span role="gridcell">
                <button class="mdf-chips__action" aria-label="Remove chip">
                    <svg class="mdf-icon" viewBox="0 0 24 24" aria-hidden="true">
                        <use href="icons.svg#cancel"></use>
                    </svg>
                </button>
            </span>
        </div>
    </div>

    <input class="mdf-chips__input" placeholder="Add new chip">

    <span class="mdf-offscreen" aria-live="polite"></span>
</div>
```

### TypeScript

```ts
import { MDFChips } from '@miraidesigns/chips';

const chips = new MDFChips(document.querySelector('.mdf-chips'), {
    iconURL: 'icons.svg#cancel' // Make sure to set this URL correctly
});

// Get the chips container and text input elements.
const chipsContainer = chips.container;
const chipsInput = chips.input;

// Listen to keydown events on the text input.
chipsInput.addEventListener('keydown', (evt: KeyboardEvent) => {
    if (evt.key === 'Enter') {
        // Get the input value when the user hits `ENTER`.
        const input = evt.target as HTMLInputElement;
        const value = input.value;

        // Array of the existing chips values.
        const chipsValues = chips.getValues();

        // Make sure there is no existing chip with the same value.
        if (!chipsValues.includes(value)) {
            // Add the new chip.
            chips.addChip(value);

            // Clear out the text input.
            input.value = '';
        }
    }
});

// Event delegation on the chips container.
chipsContainer.addEventListener('click', (evt: MouseEvent) => {
    // Get the clicked element.
    const _this = evt.target as HTMLElement;

    // Only trigger when we click the `action` button.
    if (_this.matches('.mdf-chips__action')) {
        // Get the chip element it belongs to.
        const chip: HTMLElement = _this.closest('.mdf-chips__chip');

        // Delete the chip.
        chips.deleteChip(chip);
    }
});
```

---

## Implementation

### Attributes

Please see the [WAI-ARIA](https://www.w3.org/TR/wai-aria-practices-1.1/examples/grid/LayoutGrids.html) page for attributes and best practices regarding layout grids.

### Classes

| Name                   | Type           | Description                                                       |
| ---------------------- | -------------- | ----------------------------------------------------------------- |
| `mdf-chips`            | Parent         | Contains the chips elements                                       |
| `mdf-chips--has-input` | Modifier       | Apply if an input is present to dynamically create chip elements  |
| `mdf-chips--active`    | Modifier       | Applied when the chips container is in focus                      |
| `mdf-chips__grid`      | Child          | Contains the grid elements. Child to `.mdf-chips`                 |
| `mdf-chips__chip`      | Parent / Child | Chip element. Child to `.mdf-chips__grid`                         |
| `mdf-chips__text`      | Child          | Text element. Child to `.mdf-chips__chip`                         |
| `mdf-chips__icon`      | Child          | Icon element. Child to `.mdf-chips__chip`                         |
| `mdf-chips__action`    | Child          | Button element used to delete a chip. Child to `.mdf-chips__chip` |
| `mdf-chips__input`     | Child          | Input element to dynamically create chips. Child to `.mdf-chips`  |

### Events

| Name               | Data             | Description                                                      |
| ------------------ | ---------------- | ---------------------------------------------------------------- |
| `MDFChips:added`   | `{text: string}` | Fires when a new chip gets added. Includes the chip's text value |
| `MDFChips:deleted` | `null`           | Fires when a chip gets removed                                   |

### Properties

| Name                              | Type                        | Description                                                                     |
| --------------------------------- | --------------------------- | ------------------------------------------------------------------------------- |
| `.chips`                          | `HTMLCollectionOf<Element>` | Returns a collection of all chips elements                                      |
| `.container`                      | `HTMLElement`               | Returns the chips container element                                             |
| `.grid`                           | `HTMLElement`               | Returns the chips grid                                                          |
| `.input`                          | `HTMLInputElement`          | Returns the chips input element if available                                    |
| `.addChip(text, callback?)`       | `(string, () => void)`      | Create a chip with the given text and execute the callback function if provided |
| `.deleteChip(element, callback?)` | `(HTMLElement, () => void)` | Delete the given chip element and execute the callback function if provided     |
| `.getValues()`                    | `(): string[]`              | Returns an `Array` of all chips text values                                     |

### Options

| Name      | Type     | Default | Description                                                                     |
| --------- | -------- | ------- | ------------------------------------------------------------------------------- |
| `iconURL` | `string` | `null`  | URL to the `.svg` file used in the `<use>` `href` attribute of the close button |
