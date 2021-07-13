# Tabs

Tabs allow you to organize content into different panels or screens.

---

### HTML

```html
<div class="mdf-tabs">
    <div class="mdf-tabs__bar">
        <button class="mdf-tabs__tab mdf-tabs__tab--selected" role="tab" aria-selected="true">
            <span class="mdf-tabs__content">
                <span class="mdf-tabs__text">Tab 1</span>
            </span>

            <span class="mdf-tabs__selection"></span>
        </button>

        <button class="mdf-tabs__tab" role="tab" aria-selected="false" tabindex="-1">
            <span class="mdf-tabs__content">
                <span class="mdf-tabs__text">Tab 2</span>
            </span>

            <span class="mdf-tabs__selection"></span>
        </button>

        <button class="mdf-tabs__tab" role="tab" aria-selected="false" tabindex="-1">
            <span class="mdf-tabs__content">
                <span class="mdf-tabs__text">Tab 3</span>
            </span>

            <span class="mdf-tabs__selection"></span>
        </button>
    </div>

    <div class="mdf-tabs__panels">
        <div class="mdf-tabs__panel mdf-tabs__panel--active" role="tabpanel" tabindex="0">
            Panel 1
        </div>

        <div class="mdf-tabs__panel" role="tabpanel" tabindex="0">
            Panel 2
        </div>

        <div class="mdf-tabs__panel" role="tabpanel" tabindex="0">
            Panel 3
        </div>
    </div>
</div>
```

### Sass

```scss
// Include default styles without configuration
@forward '@miraidesigns/tabs/styles';
```

```scss
// Configure appearance
@use '@miraidesigns/tabs' with (
    $variable: value
);

@include tabs.styles();
```

### TypeScript

```ts
import { MDFTabs } from '@miraidesigns/tabs';

new MDFTabs(document.querySelector('.mdf-tabs'));
```

---

## Implementation

### Attributes

Please see the [WAI-ARIA](https://www.w3.org/TR/wai-aria-practices-1.1/#tabpanel) page for attributes and best practices regarding tabs. 

### Classes

| Name                       | Type           | Description                                                              |
| -------------------------- | -------------- | ------------------------------------------------------------------------ |
| `mdf-tabs`                 | Parent         | Contains the tabs elements                                               |
| `mdf-tabs__bar`            | Parent / Child | Horizontal grid containing the tabs. Child to `.mdf-tabs`                |
| `mdf-tabs__bar--left`      | Modifier       | Move the tabs to the left of the grid                                    |
| `mdf-tabs__bar--right`     | Modifier       | Move the tabs to the right of the grid                                   |
| `mdf-tabs__bar--stretched` | Modifier       | Evenly stretch the tabs across the entire container width                |
| `mdf-tabs__tab`            | Parent / Child | Contains the tab content. Child to `.mdf-tabs__bar`                      |
| `mdf-tabs__tab--selected`  | Modifier       | Set tab as selected                                                      |
| `mdf-tabs__tab--stacked`   | Modifier       | Moves the icon on top of the text                                        |
| `mdf-tabs__content`        | Parent / Child | Contains the tab text, icon and selection bar. Child to `.mdf-tabs__tab` |
| `mdf-tabs__text`           | Child          | Tab text description. Child to `.mdf-tabs__content`                      |
| `mdf-tabs__selection`      | Child          | Selection bar, shows active tab. Child to `.mdf-tabs__content`           |
| `mdf-tabs__panels`         | Parent / Child | Contains the tab panel elements. Child to `.mdf-tabs`                    |
| `mdf-tabs__panel`          | Child          | Tab panel element. Child to `.mdf-tabs__panels`                          |
| `mdf-tabs__panel--active`  | Child          | Set panel as active                                                      |

### Events

| Name              | Data                                                    | Description                                                                              |
| ----------------- | ------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `MDFTabs:changed` | `{index: number, tab: HTMLElement, panel: HTMLElement}` | Fires whenever the active tab changes. Includes the current index, tab and panel element |

### Properties

| Name         | Type            | Description                                   |
| ------------ | --------------- | --------------------------------------------- |
| `.container` | `HTMLElement`   | Returns the container element                 |
| `.panels`    | `HTMLElement[]` | Returns an `Array` holding all panel elements |
| `.tabs`      | `HTMLElement[]` | Returns an `Array` holding all tabs elements  |