# Utils

A collection of useful Sass and TypeScript functions.

---

## Sass

### px2rem

A basic function to convert a given `px` value into `rem`.

```scss
@use '@miraidesigns/utils';

p {
    font-size: utils.px2rem(16px); // Results in 1rem
}
```

--- 

## TypeScript

### Functions

| Name                                    | Type                                             | Description                                                                      |
| --------------------------------------- | ------------------------------------------------ | -------------------------------------------------------------------------------- |
| `isRTL()`                               | `(): boolean`                                    | Returns wether or not the page is currently in RTL mode                          |
| `hasScrollbar(elem, horizontal?)`       | `(Element, boolean): boolean`                    | Returns wether or not the current element has a visible scrollbar                |
| `getScrollbarParent(elem, ignoreElem?)` | `(HTMLElement, string): HTMLElement`             | Starting from the given element, returns the closest parent that has a scrollbar |
| `matchParentHeight(elem)`               | `(HTMLElement): void`                            | Match the given element's height to that of its parent.                          |
| `throttle(func, delay)`                 | `((...args: any[]) => void, number): () => void` | Will limit how often a function can be executed                                  |
| `debounce(func, timeout)`               | `((...args: any[]) => void, number): () => void` | Will block a function from being executed again until enough time has passed     |
| `empty(string)`                         | `(string): boolean`                              | Strip string of white spaces and check if its empty.                             |
| `imageLoaded(image)`                    | `(HTMLImageElement): Promise<boolean>`           | Will resolve promise once an image is fully loaded.                              |

Here is a small example using the `throttle` function.

```ts
// Here we import the throttle function from our utils module.
import { throttle } from '@miraidesigns/utils';

const throttledFunc = () => {
    console.log('I only execute every 250ms');
}

// And we apply the throttle to a scroll event, a very common way to avoid overhead on repeated calls.
window.addEventListener('scroll', throttle(throttledFunc, 250));
```