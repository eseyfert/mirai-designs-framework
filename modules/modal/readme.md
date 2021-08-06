# Modal

Modal allows you to display any kind of content in a modal popup.\
Requires the `Button`, `Elements` and `Helpers` module for proper appearance.

---

### HTML

```html
<div class="mdf-modal" aria-modal="true">
    <div class="mdf-modal__content">
        <!-- Your content here -->
    </div>

    <button class="mdf-button mdf-button--icon mdf-modal__close" aria-label="Close modal">
        <svg class="mdf-icon" viewBox="0 0 24 24" aria-hidden="true">
            <use href="./assets/images/icons.svg#clear"></use>
        </svg>
    </button>

    <div class="mdf-modal__backdrop"></div>
</div>
```

### Sass

```scss
// Include default styles without configuration
@forward '@miraidesigns/modal/styles';
```

```scss
// Configure appearance
@use '@miraidesigns/modal' with (
    $variable: value
);

@include modal.styles();
```

### TypeScript

```ts
import { MDFModal } from '@miraidesigns/modal';

const modal = new MDFModal(document.querySelector('.mdf-modal'));
modal.open();
```

---

## Examples

### Dynamic content

Its very easy to add content to the modal.\
In the example below we will create a baby Lightbox.

```ts
import { MDFModal } from '@miraidesigns/modal';

const modal = new MDFModal(document.querySelector('.mdf-modal'));

// Here we loop through our hypothetical list of image links.
for (const link of document.querySelectorAll('a.img-link')) {
    // We listen for the click event.
    link.addEventListener('click', (evt: MouseEvent) => {
        // Prevent the default link behavior.
        evt.preventDefault();
    
        // The link's `href` attribute holds the URL to our image file.
        const src = (link as HTMLLinkElement).href;

        // Now we simply insert an `<img>` tag with our `src`.
        modal.insertHTML(`<img src="${src}">`);

        // And open the modal.
        modal.open();
    });
}
```

### Requests

You may request content from a different URL to populate the modal.

#### HTML

```html
<div class="mdf-modal" aria-modal="true">
    <div class="mdf-modal__content mdf-modal__content--padded">
        <div class="mdf-modal__loading"></div>
    </div>

    <button class="mdf-button mdf-button--icon mdf-modal__close" aria-label="Close modal">
        <svg class="mdf-icon" viewBox="0 0 24 24" aria-hidden="true">
            <use href="./assets/images/icons.svg#clear"></use>
        </svg>
    </button>

    <div class="mdf-modal__backdrop"></div>
</div>
```

#### TypeScript

```ts
import { MDFModal } from '@miraidesigns/modal';

const modal = new MDFModal(document.querySelector('.mdf-modal'));

// Open the request for the given URL.
modal.openRequest('example.org');

// Set any headers if you need to.
modal.setRequestHeader('Content-Type', 'text/html');

// Finally we request the element we need with a CSS selector.
modal.requestContent('.example');
```

---

## Implementation

### Classes

| Name                         | Type         | Description                                      |
| ---------------------------- | ------------ | ------------------------------------------------ |
| `mdf-modal`                  | Parent       | Contains the modal content and backdrop          |
| `mdf-modal--active`          | Modifier     | 1. Prepares the modal to be visible              |
| `mdf-modal--fade-in`         | Modifier     | 2. Fades-in the modal and allows for interaction |
| `mdf-modal__content`         | Parent/Child | Content container. Child to `.mdf-modal`         |
| `mdf-modal__content--padded` | Modifier     | Add padding to the content                       |
| `mdf-modal__close`           | Child        | Closes the modal. Child to `.mdf-modal`          |
| `mdf-modal__backdrop`        | Child        | Modal backdrop. Child to `.mdf-modal`            |

### Events

| Name              | Data   | Description                                     |
| ----------------- | ------ | ----------------------------------------------- |
| `MDFModal:closed` | `null` | Fires when the modal closes                     |
| `MDFModal:load`   | `null` | Fires when the requested modal content is ready |
| `MDFModal:open`   | `null` | Fires when the modal opens                      |

### Properties

| Name                               | Type                                                                          | Description                                                                 |
| ---------------------------------- | ----------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `.container`                       | `HTMLElement`                                                                 | Returns the modal container element                                         |
| `.request`                         | `XMLHttpRequest`                                                              | Returns the current request                                                 |
| `.timeout`                         | `number`                                                                      | Get or set the request timeout value                                        |
| `.readyState`                      | `number`                                                                      | Get the request readyState                                                  |
| `.open()`                          | `(): void`                                                                    | Open the modal                                                              |
| `.close()`                         | `(): void`                                                                    | Close the modal                                                             |
| `.append(elem)`                    | `(Element): void`                                                             | Add the given element to the modal content                                  |
| `.insertHTML(html)`                | `(string): void`                                                              | Insert the given string of HTML into the modal content                      |
| `.openRequest(url)`                | `(string): void`                                                              | Open the request for the given URL                                          |
| `.setRequestHeader(header, value)` | `(string, string): void`                                                      | Add header to the request. May be called repeatedly to add multiple headers |
| `.requestContent(selector)`        | `(string): void`                                                              | Request the element with the given selector from the opened URL             |
| `.on(type, listener, options?)`    | `(string, EventListenerOrEventListenerObject, AddEventListenerOptions): void` | Listen to Modal specific events. Allowed values are `load` `open` `close`.  |
