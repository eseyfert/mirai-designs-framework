# Selects

Selects show a set of options the user can choose one from.\
Serves as an alternative to the native `<select>` element.\
Requires the `List` and `Menu` modules.

---

### HTML

```html
<div class="mdf-select">
    <button class="mdf-select__button" aria-haspopup="listbox" aria-labelledby="select-label select-text">
        <span id="select-label" class="mdf-select__label">Select</span>
        <span id="select-text" class="mdf-select__text"></span>

        <span class="mdf-select__icon">
            <svg class="mdf-icon" viewBox="0 0 24 24" aria-hidden="true">
                <use href="icons.svg#arrow-keyboard"></use>
            </svg>
        </span>
    </button>

    <div class="mdf-select__menu mdf-menu">
        <ul class="mdf-list" role="listbox" aria-labelledby="select-label" tabindex="-1">
            <li class="mdf-list__item mdf-list__item--selected" role="option" data-value="1">Option 1</li>
            <li class="mdf-list__item" role="option" data-value="2">Option 2</li>
            <li class="mdf-list__item" role="option" data-value="3">Option 3</li>
        </ul>

        <input class="mdf-select__input" type="hidden" name="option" />
    </div>
</div>
```

### Sass

```scss
// Include default styles without configuration
@forward '@miraidesigns/select/styles';
```

```scss
// Configure appearance
@use '@miraidesigns/select' with (
    $variable: value
);

@include select.styles();
```

### TypeScript

```ts
import { MDFSelect } from '@miraidesigns/select';

new MDFSelect(document.querySelector('.mdf-select'));
```

---

### Attributes

Please see the [WAI-ARIA](https://www.w3.org/TR/wai-aria-practices-1.1/#Listbox) page for attributes and best practices regarding listboxes.

| Name         | Element | Description                                                               |
| ------------ | ------- | ------------------------------------------------------------------------- |
| `data-value` | `<li>`  | The option's value, equivalent to a native `<option value="">` attribute. |

### Classes

| Name                          | Type           | Description                                           |
| ----------------------------- | -------------- | ----------------------------------------------------- |
| `mdf-select`                  | Parent         | Select container element                              |
| `mdf-select__button`          | Child / Parent | Select button element that activates the menu         |
| `mdf-select__label`           | Child          | Select label element                                  |
| `mdf-select__label--floating` | Modifier       | Moves the label above the button                      |
| `mdf-select__text`            | Child          | Select text element                                   |
| `mdf-select__icon`            | Child          | Select arrow icon element                             |
| `mdf-select__input`           | Child          | Select hidden input element, holds the selected value |
| `mdf-list__item--selected`    | Modifier       | Marks the list item as selected                       |

### Events

| Name                | Data                                               | Description                                                                                       |
| ------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `MDFSelect:opened`  | `null`                                             | Fires when the select menu opens                                                                  |
| `MDFSelect:changed` | `{item: HTMLElement, text: string, value: string}` | Fires whenever the active select item changes. Includes the item itself, its text and input value |
| `MDFSelect:closed`  | `null`                                             | Fires when the select menu closes                                                                 |

### Properties

| Name                     | Type                  | Description                                         |
| ------------------------ | --------------------- | --------------------------------------------------- |
| `.container`             | `HTMLElement`         | Returns the select container element                |
| `.items`                 | `HTMLElement[]`       | Returns an `Array` holding all menu items           |
| `.menu`                  | `HTMLElement`         | Returns the menu element                            |
| `.text`                  | `string`              | Get or set the select button text                   |
| `.value`                 | `string`              | Get or set the select hidden input value            |
| `.isActive()`            | `(): boolean`         | Returns wether or not the menu is currently visible |
| `.getSelectedElem()`     | `(): HTMLElement`     | Returns the currently selected item                 |
| `.setSelectedElem(elem)` | `(HTMLElement): void` | Set the given element as selected                   |