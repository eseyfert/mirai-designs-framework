/**
 * isRTL
 *
 * Wether or not the page is in RTL mode.
 *
 * @export
 * @returns {boolean}
 * @version 1.0.0
 */
export function isRTL(): boolean {
	return document.documentElement.classList.contains('mdf-rtl');
}

/**
 * hasScrollbar
 *
 * Check wether a given element has a visible scrollbar.
 * Tests for a vertical scrollbar by default.
 *
 * @export
 * @param {Element} elem The element we are testing
 * @param {boolean} horizontal Check for horizontal instead of vertical scrollbar
 * @returns {boolean}
 * @version 1.0.0
 */
export function hasScrollbar(elem: Element, horizontal?: boolean): boolean {
	// Get all CSS properties of the given element.
	const cssProps = window.getComputedStyle(elem);

	if (horizontal) {
		// Test for a horizontal scrollbar.
		return cssProps.getPropertyValue('overflow-x') === 'auto' && elem.scrollWidth > elem.clientWidth;
	} else {
		// Test for a vertical scrollbar.
		return cssProps.getPropertyValue('overflow-y') === 'auto' && elem.scrollHeight > elem.clientHeight;
	}
}

/**
 * getScrollbarParent
 *
 * Starting from the given element, find the closest parent element that has a scrollbar.
 *
 * @export
 * @param {HTMLElement} elem The element we start our search from
 * @param {string} ignoreElem Selector for element to ignore while traversing the DOM
 * @returns {HTMLElement}
 * @version 1.1.0
 */
export function getScrollbarParent(elem: HTMLElement, ignoreElem?: string): HTMLElement {
	// If recursion arrives at the document body, return the body element and stop the script.
	if (elem === document.body) {
		return elem;
	}

	// If specified, ignore the element with the given selector and run the function again.
	if (ignoreElem.length && elem.matches(ignoreElem)) {
		return getScrollbarParent(elem.parentElement);
	}

	if (hasScrollbar(elem, true) || hasScrollbar(elem)) {
		// If the current elem has a visible horizontal or vertical scrollbar, return the element.
		return elem;
	} else {
		// Otherwise run the same test again on its parent.
		return getScrollbarParent(elem.parentElement);
	}
}

/**
 * matchParentHeight
 *
 * Attempts to match the given element's height to that of its parent.
 *
 * @export
 * @param {HTMLElement} elem The elem we need to match to its parent
 * @returns {void}
 * @version 1.0.0
 */
export function matchParentHeight(elem: HTMLElement): void {
	// If recursion arrives at the document body, stop the script.
	if (elem === document.body) {
		return;
	}

	// If the given element and its parent share the same height, move up in the DOM.
	if (elem.offsetHeight === elem.parentElement.offsetHeight) {
		return matchParentHeight(elem.parentElement);
	} else {
		// Match the element's height to the parent's.
		elem.style.height = `${elem.parentElement.offsetHeight}px`;
	}
}

/**
 * throttle
 *
 * Throttle the repeated execution of a given function.
 * Useful for functions that get called repeatedly like mouse movements or scroll-wheel activation.
 *
 * @export
 * @param {(...args: any[]) => void} func The function with its arguments
 * @param {number} delay The amount of time between function calls
 * @returns {() => void}
 * @version 1.0.0
 */
export function throttle(func: (...args: any[]) => void, delay: number): () => void {
	// Wether or not the callback has fired.
	let isCalled = false;

	const throttledFunc = (...args: any[]) => {
		// Proceed if the function was not called yet.
		if (!isCalled) {
			// Run function with supplied arguments.
			func(...args);

			// Let script know the function has been called.
			isCalled = true;

			// Wait the given timeout before we can call the function again.
			setTimeout(() => {
				isCalled = false;
			}, delay);
		}
	};

	return throttledFunc;
}

/**
 * debounce
 *
 * Block repeated calls of the same function until the timer has cleared.
 * Good for blocking things like repeated mouse-clicks or window resize calls.
 *
 * @export
 * @param {(...args: any[]) => void} func The function with its arguments
 * @param {number} timeout The amount of time between before the function can be called again
 * @returns {() => void}
 * @version 1.0.0
 */
export function debounce(func: (...args: any[]) => void, timeout: number): () => void {
	// We use this variable to keep track of the setTimeout id.
	let timer: number;

	const debouncedFunc = (...args: any[]) => {
		// If we have an existing setTimeout instance, clear it.
		if (timer) {
			clearTimeout(timer);
		}

		// Run function with supplied arguments and start our timer.
		timer = setTimeout(() => func(...args), timeout);
	};

	return debouncedFunc;
}

/**
 * empty
 *
 * Strip string of white spaces and check if its empty.
 *
 * @export
 * @param {string} string The string to test
 * @returns {boolean}
 * @version 1.0.0
 */
export function empty(string: string): boolean {
	return string.trim().length === 0;
}

/**
 * imageLoaded
 *
 * Will resolve promise once an image is fully loaded.
 *
 * @export
 * @param {HTMLImageElement} image The image to watch
 * @return {Promise<boolean>}
 * @version 1.0.0
 */
export async function imageLoaded(image: HTMLImageElement): Promise<boolean> {
	return new Promise<boolean>((resolve, reject) => {
		// Create a clone of the current image without adding it to the DOM.
		const clone = new Image();
		clone.src = image.src;

		// Wait for the cloned image to be fully loaded.
		void clone
			.decode()
			.then(() => {
				// Image loaded, resolve the promise.
				resolve(true);
			})
			.catch((error) => {
				// Caught error, reject the promise.
				reject(error);
			});
	});
}
