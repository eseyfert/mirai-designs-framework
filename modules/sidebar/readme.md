# Sidebars

Sidebars provide site navigation and can be permanent or called on-screen.

---

### HTML

Make sure to put this as high in your `<body>` element as possible.

```html
<div class="mdf-sidebar-container" aria-hidden="true">
    <aside class="mdf-sidebar mdf-sidebar--left" aria-labelledby="sidebar-title">
        <header class="mdf-sidebar__header">
            <h2 id="sidebar-title" class="mdf-sidebar__title">Sidebar</h2>

            <button class="mdf-sidebar__close" aria-label="Close sidebar">
                <svg class="mdf-icon" viewBox="0 0 24 24" aria-hidden="true">
                    <use href="icons.svg#clear"></use>
                </svg>
            </button>
        </header>

        <div class="mdf-sidebar__content">
            <nav role="navigation" aria-label="Site navigation">
                <a class="mdf-sidebar__link" href="#1">
                    Link #1
                </a>

                <a class="mdf-sidebar__link" href="#2">
                    Link #2
                </a>

                <a class="mdf-sidebar__link" href="#3">
                    Link #3
                </a>
            </nav>
        </div>

        <footer class="mdf-sidebar__footer">
            <p>Sidebar footer text</p>
        </footer>
    </aside>

    <div class="mdf-sidebar-backdrop"></div>
</div>
```

### Sass

```scss
// Include default styles without configuration
@forward '@miraidesigns/sidebar/styles';
```

```scss
// Configure appearance
@use '@miraidesigns/sidebar' with (
    $variable: value
);

@include sidebar.styles();
```

### TypeScript

```ts
import { MDFSidebar } from '@miraidesigns/sidebar';

new MDFSidebar(document.querySelector('.mdf-sidebar'), {
    anchor: document.getElementById('sidebar-anchor')
});
```

---

## Implementation

### Classes

| Name                             | Type           | Description                                                                      |
| -------------------------------- | -------------- | -------------------------------------------------------------------------------- |
| `mdf-sidebar-container`          | Parent         | Contains the sidebar and backdrop. Used for off-screen sidebars                  |
| `mdf-sidebar-container--active`  | Modifier       | 1. Prepares the sidebar to be visible. Used for off-screen sidebars              |
| `mdf-sidebar-container--move-in` | Modifier       | 2. Fades-in the sidebar and allows for interaction. Used for off-screen sidebars |
| `mdf-sidebar`                    | Parent         | Contains the header, content and footer                                          |
| `mdf-sidebar--left`              | Modifier       | Moves the sidebar to the left of the screen. Used for off-screen sidebars        |
| `mdf-sidebar--right`             | Modifier       | Moves the sidebar to the right of the screen. Used for off-screen sidebars       |
| `mdf-sidebar__header`            | Parent / Child | Contains the title and close button. Child to `.mdf-sidebar`                     |
| `mdf-sidebar__title`             | Child          | Title element. Child to `.mdf-sidebar__header`                                   |
| `mdf-sidebar__close`             | Child          | Closes the sidebar. Child to `.mdf-sidebar__header`                              |
| `mdf-sidebar__content`           | Parent / Child | Contains the navigation links or other content. Child to `.mdf-sidebar`          |
| `mdf-sidebar__link`              | Child          | Navigation link element. Child to `.mdf-sidebar__content`                        |
| `mdf-sidebar__footer`            | Parent / Child | Footer element. Child to `.mdf-sidebar`                                          |
| `mdf-sidebar-backdrop`           | Child          | Sidebar backdrop. Child to `.mdf-sidebar-container`                              |

### Events

| Name                | Data   | Description                   |
| ------------------- | ------ | ----------------------------- |
| `MDFSidebar:opened` | `null` | Fires when the sidebar opens  |
| `MDFSidebar:closed` | `null` | Fires when the sidebar closes |

### Properties

| Name                      | Type              | Description                                               |
| ------------------------- | ----------------- | --------------------------------------------------------- |
| `.anchor`                 | `HTMLElement`     | Returns the anchor element                                |
| `.container`              | `HTMLElement`     | Returns the sidebar container element                     |
| `.content`                | `HTMLElement`     | Returns the sidebar main content element                  |
| `.sidebar`                | `HTMLElement`     | Returns the sidebar element                               |
| `.isActive()`             | `(): boolean`     | Returns wether or not the sidebar is active               |
| `.openSidebar(setFocus?)` | `(boolean): void` | Open the sidebar (optionally set focus on the first item) |
| `.closeSidebar()`         | `(): void`        | Close the sidebar                                         |

### Options

| Name          | Type         | Default | Description                                                |
| ------------- | ------------ | ------- | ---------------------------------------------------------- |
| `anchor`      | `Element`    | `null`  | The anchor element that will call the sidebar              |
| `onOpen`      | `() => void` | `null`  | Function will run when the sidebar is opened               |
| `onClose`     | `() => void` | `null`  | Function will run when the sidebar is closed               |
| `hideOnClick` | `boolean`    | `true`  | Close the sidebar when a click is registered outside of it |