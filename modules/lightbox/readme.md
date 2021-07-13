# Lightbox

Lightbox creates a modal carousel from a set of media elements such as images or videos.

---

### HTML

```html
<a href="images/1.jpg" data-lightbox="id" data-lightbox-alt="Image alt description">
    <img src="images/1_thumbnail.jpg" alt="Image thumbnail">
</a>
```

### Sass

```scss
// Include default styles without configuration
@forward '@miraidesigns/lightbox/styles';
```

```scss
// Configure appearance
@use '@miraidesigns/lightbox' with (
    $variable: value
);

@include lightbox.styles();
```

### TypeScript

```ts
import { MDFLightbox } from '@miraidesigns/lightbox';

new MDFLightbox(document.querySelectorAll('[data-lightbox="id"]'), {
    icons: {
        type: 'svg',
        control: 'icons.svg#arrow-keyboard',
        close: 'icons.svg#clear'
    }
});
```

---

## Implementation

### Attributes

| Name                        | Element | Description                                                |
| --------------------------- | ------- | ---------------------------------------------------------- |
| `data-lightbox`             | `<a>`   | Lightbox id. Use this attribute to group elements together |
| `data-lightbox-title`       | `<a>`   | Set lightbox item title                                    |
| `data-lightbox-description` | `<a>`   | Set lightbox item description                              |
| `data-lightbox-alt`         | `<a>`   | Set `alt` attribute text for images                        |
| `data-lightbox-type`        | `<a>`   | Content type. Allowed values are `video` or `embed`        |

### Classes

| Name                                    | Type           | Description                                                                                     |
| --------------------------------------- | -------------- | ----------------------------------------------------------------------------------------------- |
| `mdf-lightbox-container`                | Parent         | Contains the lightbox and backdrop                                                              |
| `mdf-lightbox-container--active`        | Modifier       | 1. Prepares the lightbox to be visible                                                          |
| `mdf-lightbox-container--fade-in`       | Modifier       | 2. Fades-in the lightbox and allows for interaction                                             |
| `mdf-lightbox`                          | Parent / Child | Contains the header, items and controls. Child to `.mdf-lightbox-container`                     |
| `mdf-lightbox__items`                   | Parent / Child | Contains the lightbox items. Child to `.mdf-lightbox`                                           |
| `mdf-lightbox__item`                    | Parent / Child | Lightbox item. Contains the item info and media element. Child to `.mdf-lightbox__items`        |
| `mdf-lightbox__item--scale`             | Modifier       | Plays animation on item when opening the lightbox                                               |
| `mdf-lightbox__info`                    | Parent / Child | Contains the title and description. Child to `.mdf-lightbox__item`                              |
| `mdf-lightbox__title`                   | Child          | Item title. Child to `.mdf-lightbox__info`                                                      |
| `mdf-lightbox__description`             | Child          | Item description. Child to `.mdf-lightbox__info`                                                |
| `mdf-lightbox__media-wrapper`           | Parent / Child | Media wrapper element. Allows for scaling of videos and iframes. Child to `.mdf-lightbox__item` |
| `mdf-lightbox__media-wrapper--bordered` | Modifier       | Add border to media element, used for iframes                                                   |
| `mdf-lightbox__media`                   | Child          | Media element. Child to `.mdf-lightbox__media-wrapper`                                          |
| `mdf-lightbox__control`                 | Child          | Lightbox control button element. Child to `.mdf-lightbox`                                       |
| `mdf-lightbox__control--close`          | Modifier       | `Close` button element                                                                          |
| `mdf-lightbox__control--prev`           | Modifier       | `Previous` button element                                                                       |
| `mdf-lightbox__control--next`           | Modifier       | `Next` button element                                                                           |
| `mdf-lightbox-backdrop`                 | Child          | Lightbox backdrop. Child to `.mdf-lightbox-container`                                           |

### Events

| Name                  | Data                                 | Description                                                                             |
| --------------------- | ------------------------------------ | --------------------------------------------------------------------------------------- |
| `MDFLightbox:opened`  | `null`                               | Fires when the lightbox opens                                                           |
| `MDFLightbox:changed` | `{index: number, item: HTMLElement}` | Fires whenever the active lightbox item changes. Includes the item itself and its index |
| `MDFLightbox:closed`  | `null`                               | Fires when the lightbox closes                                                          |

### Properties

| Name              | Type                | Description                                           |
| ----------------- | ------------------- | ----------------------------------------------------- |
| `.activeItem`     | `HTMLElement`       | Returns the current lightbox item on display          |
| `.container`      | `HTMLElement`       | Returns the lightbox container element                |
| `.index`          | `number`            | Returns the index of the current lightbox item        |
| `.items`          | `HTMLCollection`    | Returns a `HTMLCollection` holding all lightbox items |
| `.itemsContainer` | `HTMLElement`       | Returns the lightbox items container element          |
| `.lightbox`       | `HTMLElement`       | Returns the lightbox element                          |
| `.links`          | `HTMLLinkElement[]` | Returns an `Array` holding all lightbox links         |

### Options

| Name              | Type         | Default  | Description                                                                                 |
| ----------------- | ------------ | -------- | ------------------------------------------------------------------------------------------- |
| `onOpen`          | `() => void` | `null`   | Function will run when the lightbox is opened                                               |
| `onChange`        | `() => void` | `null`   | Function will run when the lightbox item changes                                            |
| `onClose`         | `() => void` | `null`   | Function will run when the lightbox is closed                                               |
| `titlePos`        | `string`     | `bottom` | Set title position. Allowed values are `top` or `bottom`                                    |
| `titleAlign`      | `string`     | `center` | Set title text alignment. Allowed values are `left` `center` or `right`                     |
| `iframeAddBorder` | `boolean`    | `false`  | Add border to embedded iframes                                                              |
| `sandboxing`      | `boolean`    | `false`  | Enable sandboxing for iframes                                                               |
| `sandboxingRules` | `string`     | `null`   | See: [HTML iframe sandbox Attribute](https://www.w3schools.com/tags/att_iframe_sandbox.asp) |
| `enableSwipe`     | `boolean`    | `true`   | Allow for navigation by swiping left and right on touch devices                             |
| `hideOnClick`     | `boolean`    | `true`   | Lightbox will be hidden when clicked outside of it's content                                |
