# Menus

Menus display a list of choices or options to the user.\
This module also requires the [List](https://github.com/miraidesigns/mirai-designs-framework/tree/master/modules/list) module.

---

### HTML

```html
<button id="menu-anchor" class="mdf-button">Show menu</button>

<div class="mdf-menu">
    <ul class="mdf-list" role="menu" aria-orientation="vertical" aria-hidden="true" tabindex="-1">
        <li class="mdf-list__item" role="menuitem" tabindex="-1">Menu item</li>
        <li class="mdf-list__item" role="menuitem" tabindex="-1">Menu item</li>
        <li class="mdf-list__item" role="menuitem" tabindex="-1">Menu item</li>
    </ul>
</div>
```

### Sass

```scss
// Include default styles without configuration
@forward '@miraidesigns/menu/styles';
```

```scss
// Configure appearance
@use '@miraidesigns/menu' with (
    $variable: value
);

@include menu.styles();
```

### TypeScript

```ts
import { MDFMenu } from '@miraidesigns/menu';

new MDFMenu(document.querySelector('.mdf-menu'), {
    anchor: document.getElementById('menu-anchor')
});
```

---

## Implementation

### Attributes

Please see the [WAI-ARIA](https://www.w3.org/TR/wai-aria-practices/#menu) page for attributes and best practices regarding menus.

| Name                 | Element | Description                                                          |
| -------------------- | ------- | -------------------------------------------------------------------- |
| `data-menu-callback` | `<li>`  | Name of the callback has to match the name set in the script options |

### Classes

| Name                | Type     | Description                          |
| ------------------- | -------- | ------------------------------------ |
| `mdf-menu`          | Parent   | Contains the menu list and its items |
| `mdf-menu--active`  | Modifier | Fades-in and moves menu on-screen    |
| `mdf-menu__caption` | Child    | Caption to describe the menu         |

### Events

| Name                | Data                                                   | Description                                                                                            |
| ------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| `MDFMenu:opened`    | `null`                                                 | Fires when the menu opens                                                                              |
| `MDFMenu:activated` | `{callback: string, index: number, item: HTMLElement}` | Fires whenever the a menu item is activated. Includes the callback name, the item itself and its index |
| `MDFMenu:closed`    | `null`                                                 | Fires when the menu closes                                                                             |

### Properties

| Name                    | Type              | Description                                            |
| ----------------------- | ----------------- | ------------------------------------------------------ |
| `.anchor`               | `HTMLElement`     | Returns the anchor element                             |
| `.items`                | `HTMLElement[]`   | Returns an `Array` with all menu items                 |
| `.menu`                 | `HTMLElement`     | Returns the menu element                               |
| `.isActive()`           | `(): boolean`     | Wether or not the menu is visible                      |
| `.openMenu(setFocus?)`  | `(boolean): void` | Open the menu (optionally set focus on the first item) |
| `.closeMenu(setFocus?)` | `(boolean): void` | Close the menu (optionally set focus on the anchor)    |

### Options

| Name          | Type                         | Default      | Description                                                                       |
| ------------- | ---------------------------- | ------------ | --------------------------------------------------------------------------------- |
| `anchor`      | `Element`                    | `null`       | The anchor element that will call the menu                                        |
| `posX`        | `string`                     | `center`     | The menu's position on the X-axis. Values are `left` `center` `right`             |
| `posY`        | `string`                     | `bottom`     | The menu's position on the Y-axis. Values are `top` `center` `bottom`             |
| `origin`      | `string`                     | `top center` | Origin of the menu transition. Same values as the `transform-origin` CSS property |
| `callbacks`   | `Record<string, () => void>` | `{}`         | Object holding the menu item callbacks                                            |
| `onOpen`      | `() => void`                 | `null`       | Function will run when the menu is opened                                         |
| `onClose`     | `() => void`                 | `null`       | Function will run when the menu is closed                                         |
| `hideOnClick` | `boolean`                    | `true`       | Close the menu when a click is registered outside of it                           |
