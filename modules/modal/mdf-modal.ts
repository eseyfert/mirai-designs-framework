import '@miraidesigns/base';
import { getScrollbarParent } from '@miraidesigns/utils';
import { classes, events, selectors } from './constants';

/**
 * MDFModal
 *
 * Create a modal containing various kinds of content.
 *
 * @export
 * @class MDFModal
 * @version 1.0.0
 */
export class MDFModal {
	public readonly container: HTMLElement;
	public readonly request: XMLHttpRequest;

	private content: HTMLElement;
	private doc: Document;
	private focusableElements: NodeListOf<HTMLElement>;
	private firstFocusableElement: HTMLElement;
	private lastFocusableElement: HTMLElement;
	private lastActiveElement: HTMLElement;
	private loading: HTMLElement;
	private scrollbarParent: HTMLElement;

	/**
	 * Creates an instance of MDFModal.
	 *
	 * @param {Element} elem The element we are manipulating
	 * @memberof MDFModal
	 * @since 1.0.0
	 */
	constructor(elem: Element) {
		if (!elem || typeof elem != 'object' || !elem.nodeType) return;

		// Save a reference to the container element.
		this.container = elem as HTMLElement;

		// Get the modal content element.
		this.content = this.container.querySelector(selectors.content);

		// Get the modal loading element.
		this.loading = this.container.querySelector(selectors.loading);

		// Create a new XMLHttpRequest.
		this.request = new XMLHttpRequest();

		// Set a default timeout value.
		this.timeout = 15000;
	}

	get timeout(): number {
		return this.request.timeout;
	}

	set timeout(timeout: number) {
		this.request.timeout = timeout;
	}

	get readyState(): number {
		return this.request.readyState;
	}

	/**
	 * open
	 *
	 * Open the modal.
	 *
	 * @memberof MDFModal
	 * @since 1.0.0
	 */
	public open = (): void => {
		// Activate the modal container without making it visible yet.
		this.container.addClass(classes.active);

		// Fade-in the modal.
		setTimeout(() => this.container.addClass(classes.fadeIn), 10);

		// Dispatch an event letting the user know the modal is open.
		this.container.dispatchEvent(new Event(events.open, { bubbles: true }));

		// Store the element that had focus before the modal was opened.
		this.lastActiveElement = document.activeElement as HTMLElement;

		// Get the closet element with a scrollbar.
		this.scrollbarParent = getScrollbarParent(this.lastActiveElement, selectors.container);

		// Temporarily hide the scrollbar for the found element.
		this.scrollbarParent.addClass(classes.disableScrollbar);

		// Get all focusable elements.
		this.getFocusableElements();

		// Set focus to the first focusable element in our modal.
		if (this.firstFocusableElement) {
			this.firstFocusableElement.focus();
		}

		// Add event listeners.
		this.addEvents();
	};

	/**
	 * close
	 *
	 * Close the modal.
	 *
	 * @memberof MDFModal
	 * @since 1.0.0
	 */
	public close = (): void => {
		// Fade-out the modal without deactivating it yet.
		this.container.removeClass(classes.fadeIn);

		// After the successful fade-out, deactivate it.
		const afterFadeOut = () => {
			this.container.removeClass(classes.active);

			// Remove the event listener to avoid repetitions.
			this.container.removeEventListener('transitionend', afterFadeOut);
		};

		// Add the `transitionend` event to know when the fade-out is complete.
		this.container.addEventListener('transitionend', afterFadeOut);

		// Dispatch an event letting the user know the modal is closed.
		this.container.dispatchEvent(new Event(events.closed, { bubbles: true }));

		// Restore the scrollbar for the scrollbar parent element.
		this.scrollbarParent.removeClass(classes.disableScrollbar);

		// Move focus back to the last active element we stored when opening the modal.
		this.lastActiveElement.focus();

		// Remove event listeners.
		this.removeEvents();
	};

	/**
	 * append
	 *
	 * Add given element to the modal content element.
	 *
	 * @param {Element} elem The element to be added
	 * @memberof MDFModal
	 * @since 1.0.0
	 */
	public append = (elem: Element): void => {
		this.removeOldContent();
		this.content.append(elem);
	};

	/**
	 * insertHTML
	 *
	 * Insert HTML into the modal content element.
	 *
	 * @param {string} html The HTML to be inserted
	 * @memberof MDFModal
	 * @since 1.0.0
	 */
	public insertHTML = (html: string): void => {
		this.removeOldContent();
		this.content.insertAdjacentHTML('beforeend', html);
	};

	/**
	 * openRequest
	 *
	 * Opens the XMLHttpRequest for the given URL.
	 *
	 * @param {string} url The URL we are requesting
	 * @memberof MDFModal
	 * @since 1.0.0
	 */
	public openRequest = (url: string): void => {
		this.request.open('GET', url);
	};

	/**
	 * setRequestHeader
	 *
	 * Set headers for the XMLHttpRequest.
	 * You may call this function repeatedly to add multiple headers.
	 * Make sure to call this function before `requestContent()`.
	 *
	 * @param {string} header The header name
	 * @param {string} value The header value
	 * @memberof MDFModal
	 * @since 1.0.0
	 */
	public setRequestHeader = (header: string, value: string): void => {
		this.request.setRequestHeader(header, value);
	};

	/**
	 * requestContent
	 *
	 * Lookup the element with the given selector in the requested URL
	 * and append it to the modal content element.
	 *
	 * @param {string} selector The element selector
	 * @memberof MDFModal
	 * @since 1.0.0
	 */
	public requestContent = (selector: string): void => {
		// Watch for changes in the request's readyState.
		this.request.onreadystatechange = () => {
			// If below 4, the document is still loading.
			if (this.request.readyState < 4) {
				// Show the loading element.
				this.showLoading();
			} else if (this.request.readyState === 4) {
				// The document is ready, hide the loading element.
				this.hideLoading();
			}
		};

		// Do this after the requested URL is done loading.
		this.request.onload = () => {
			try {
				// Get the new Document.
				const parser = new DOMParser();
				this.doc = parser.parseFromString(this.request.responseText, 'text/html');

				// Look for the needed element.
				const requestedElem = this.doc.querySelector(selector);

				// If the element exists, we continue, otherwise throw an error.
				if (requestedElem) {
					// Add the element to the modal.
					this.append(requestedElem);

					// Open the modal.
					this.open();

					// Dispatch an event to let the user know the modal content is fully loaded.
					this.container.dispatchEvent(new Event(events.load, { bubbles: true }));
				} else {
					// The element doesn't exist, throw an error.
					throw new Error(`Couldn't find element '${selector}'`);
				}
			} catch (error) {
				console.error(error);
			}
		};

		this.request.ontimeout = () => {
			console.error('Request timed out');
		};

		this.request.onerror = () => {
			console.error('Request failed');
		};

		// Send the request.
		this.request.send();
	};

	/**
	 * on
	 *
	 * Wrapper for adding event listeners to the modal.
	 *
	 * @param {string} type Event type to listen for. Allowed values are `load`, `open` or `close`
	 * @param {EventListenerOrEventListenerObject} listener Function to execute when the event fires
	 * @param {boolean | AddEventListenerOptions} options Specify event listener options
	 * @memberof MDFModal
	 * @since 1.0.0
	 *
	 * @example
	 * MDFModal.on('load', () => console.log('Modal loaded'));
	 */
	public on = (
		type: string,
		listener: EventListenerOrEventListenerObject,
		options?: boolean | AddEventListenerOptions
	): void => {
		switch (type) {
			case 'load':
				this.container.addEventListener(events.load, listener, options);
				break;
			case 'open':
				this.container.addEventListener(events.open, listener, options);
				break;
			case 'close':
				this.container.addEventListener(events.closed, listener, options);
				break;
		}
	};

	/**
	 * showLoading
	 *
	 * Show the loading element.
	 *
	 * @private
	 * @memberof MDFModal
	 * @since 1.0.0
	 */
	private showLoading = () => {
		if (this.loading) {
			this.loading.addClass(classes.loadingActive);
		}
	};

	/**
	 * hideLoading
	 *
	 * Hide the loading element.
	 *
	 * @private
	 * @memberof MDFModal
	 * @since 1.0.0
	 */
	private hideLoading = () => {
		if (this.loading) {
			this.loading.removeClass(classes.loadingActive);
		}
	};

	/**
	 * removeOldContent
	 *
	 * Remove the existing modal content.
	 *
	 * @private
	 * @memberof MDFModal
	 * @since 1.0.0
	 */
	private removeOldContent = () => {
		// Get the last element inside the modal content.
		const oldElem = this.content.lastElementChild;

		// We make sure its not the loading element.
		if (oldElem && !oldElem.matches(selectors.loading)) {
			// And remove it.
			this.content.removeChild(oldElem);
		}
	};

	/**
	 * getFocusableElements
	 *
	 * Store references to all focusable modal elements for keyboard navigation.
	 *
	 * @private
	 * @memberof MDFModal
	 * @since 1.0.0
	 */
	private getFocusableElements = () => {
		// Get all focusable elements inside our modal.
		this.focusableElements = this.container.querySelectorAll(selectors.focusableElements);

		if (this.focusableElements.length) {
			// Set the first element in order to receive focus.
			this.firstFocusableElement = this.focusableElements[0];

			// Set the last element in order to receive focus.
			this.lastFocusableElement = this.focusableElements[this.focusableElements.length - 1];
		}
	};

	/**
	 * clickEvents
	 *
	 * Handle mouse clicks events for the modal.
	 *
	 * @private
	 * @memberof MDFModal
	 * @since 1.0.0
	 */
	private clickEvents = (evt: MouseEvent) => {
		// Get the clicked element.
		const _this = evt.target as HTMLElement;

		// Close the modal if we either click the backdrop or the close button.
		if (_this.matches(selectors.backdrop) || _this.matches(selectors.close)) {
			this.close();
		}
	};

	/**
	 * keyboardBackwardTab
	 *
	 * Handle behavior for backwards tabs.
	 *
	 * @private
	 * @memberof MDFModal
	 * @since 1.0.0
	 */
	private keyboardBackwardTab = (evt: KeyboardEvent) => {
		// If we end up on the first element, wrap back around to the last element.
		if (document.activeElement === this.firstFocusableElement) {
			evt.preventDefault();
			this.lastFocusableElement.focus();
		}
	};

	/**
	 * keyboardForwardTab
	 *
	 * Handle behavior for forward tabs.
	 *
	 * @private
	 * @memberof MDFModal
	 * @since 1.0.0
	 */
	private keyboardForwardTab = (evt: KeyboardEvent) => {
		// If we end up on the last element, wrap back around to the first element.
		if (document.activeElement === this.lastFocusableElement) {
			evt.preventDefault();
			this.firstFocusableElement.focus();
		}
	};

	/**
	 * keyboardEvents
	 *
	 * Add A11Y compliant keyboard navigation.
	 *
	 * @private
	 * @memberof MDFModal
	 * @since 1.0.0
	 */
	private keyboardEvents = (evt: KeyboardEvent) => {
		switch (evt.key) {
			case 'Escape':
				// If the modal is open, close it.
				if (this.container.hasClass(classes.active)) {
					this.close();
				}

				break;
			case 'Tab':
				// Prevent tabbing if there is just one focusable element.
				if (this.focusableElements.length === 1) {
					evt.preventDefault();
					break;
				}

				if (evt.shiftKey) {
					// Move the focus one element backwards.
					this.keyboardBackwardTab(evt);
				} else {
					// Move the focus one element forwards.
					this.keyboardForwardTab(evt);
				}

				break;
		}
	};

	/**
	 * addEvents
	 *
	 * Add event listeners.
	 *
	 * @private
	 * @memberof MDFModal
	 * @since 1.0.0
	 */
	private addEvents = () => {
		this.container.addEventListener('click', this.clickEvents);
		document.addEventListener('keydown', this.keyboardEvents);
	};

	/**
	 * removeEvents
	 *
	 * Remove event listeners.
	 *
	 * @private
	 * @memberof MDFModal
	 * @since 1.0.0
	 */
	private removeEvents = () => {
		this.container.removeEventListener('click', this.clickEvents);
		document.removeEventListener('keydown', this.keyboardEvents);
	};
}
