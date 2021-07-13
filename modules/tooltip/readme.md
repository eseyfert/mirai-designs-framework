# Tooltips

Tooltips reveal information when users focus or hover over an element.

---

### HTML

```html
<button class="mdf-button" data-tooltip="This shows a tooltip message">Tooltip</button>
```

### Sass

```scss
// Include default styles without configuration
@forward '@miraidesigns/tooltip/styles';
```

```scss
// Configure appearance
@use '@miraidesigns/tooltip' with (
    $variable: value
);

@include tooltip.styles();
```

### TypeScript

```ts
import { MDFTooltip } from '@miraidesigns/tooltip';

new MDFTooltip(document.querySelectorAll('[data-tooltip]'));
```

---

## Implementation

### Attributes

Please see the [WAI-ARIA](https://www.w3.org/TR/wai-aria-practices/#tooltip) page for attributes and best practices regarding tooltips.

| Name           | Element | Description                         |
| -------------- | ------- | ----------------------------------- |
| `data-tooltip` | `<any>` | Tooltip text that will be displayed |

### Classes

| Name                  | Type     | Description                               |
| --------------------- | -------- | ----------------------------------------- |
| `mdf-tooltip`         | Parent   | Tooltip element                           |
| `mdf-tooltip--scale`  | Modifier | Change the tooltips scale while fading-in |
| `mdf-tooltip--active` | Modifier | Tooltip becomes visible (active)          |

### Events

| Name                | Data                                          | Description                                                                      |
| ------------------- | --------------------------------------------- | -------------------------------------------------------------------------------- |
| `MDFTooltip:active` | `{anchor: HTMLElement, tooltip: HTMLElement}` | Fires whenever a tooltip gets activated. Includes the anchor and tooltip element |
| `MDFTooltip:hidden` | `{anchor: HTMLElement, tooltip: HTMLElement}` | Fires whenever a tooltip gets hidden. Includes the anchor and tooltip element    |

### Properties

| Name       | Type            | Description                                    |
| ---------- | --------------- | ---------------------------------------------- |
| `.anchors` | `HTMLElement[]` | Returns an `Array` holding all anchor elements |