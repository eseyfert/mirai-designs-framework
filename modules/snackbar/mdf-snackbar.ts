import '@miraidesigns/base';
import { attr, classes, events, selectors } from './constants';
import { MDFSnackbarOptions } from './types';

/**
 * MDFSnackbar
 *
 * Snackbars show a quick message at the bottom of the screen.
 *
 * @export
 * @class MDFSnackbar
 * @version 1.0.0
 */
export class MDFSnackbar {
	public readonly options: MDFSnackbarOptions;
	public readonly snackbar: HTMLElement;

	private defaults: MDFSnackbarOptions;
	private textContainer: HTMLElement;
	private timeout: number;
	private queue: string[];
	private active: boolean;

	/**
	 * Creates an instance of Snackbar.
	 *
	 * @param {Element} snackbar The snackbar element we are manipulating
	 * @param {MDFSnackbarOptions} options Object holding user options
	 *
	 * @memberof MDFSnackbar
	 * @since 1.0.0
	 */
	constructor(snackbar: Element, options?: MDFSnackbarOptions) {
		// If the supplied element doesn't exist, abort the script.
		if (!snackbar) return;

		// Store a reference to the given element.
		this.snackbar = snackbar as HTMLElement;

		// Get the snackbar text element.
		this.textContainer = this.snackbar.querySelector(selectors.text);

		// Don't continue if the text element does not exist.
		if (!this.textContainer) return;

		// Default options.
		this.defaults = {
			delay: 5000,
			onOpen: null,
			onAction: null,
			onClose: null,
			hideOnESC: true,
		};

		// Options object containing user modified values.
		this.options = Object.assign({}, this.defaults, options);

		// Create queue array.
		this.queue = [];

		// Snackbar state, will change to `true` when shown on screen.
		this.active = false;
	}

	/**
	 * Returns the snackbar text message.
	 *
	 * @type {string}
	 *
	 * @memberof MDFSnackbar
	 * @since 1.0.0
	 */
	public get message(): string {
		return this.textContainer.textContent;
	}

	/**
	 * Sets the snackbar text message.
	 *
	 * @param {string} message The text message
	 *
	 * @memberof MDFSnackbar
	 * @since 1.0.0
	 */
	public set message(message: string) {
		this.textContainer.textContent = message;
	}

	/**
	 * isActive
	 *
	 * Wether or not the snackbar is currently visible.
	 *
	 * @public
	 * @memberof MDFSnackbar
	 * @since 1.0.0
	 */
	public isActive = (): boolean => {
		return this.active;
	};

	/**
	 * showSnackbar
	 *
	 * Display the snackbar, optionally with supplied message.
	 *
	 * @param {string} message The message to be displayed.
	 *
	 * @public
	 * @memberof MDFSnackbar
	 * @since 1.0.0
	 */
	public showSnackbar = (message?: string): void => {
		// If a snackbar is still active, add message to queue and don't continue.
		if (this.active) {
			if (message) {
				this.queue.push(message);
			}

			return;
		}

		// Clear the snackbar timeout id.
		clearTimeout(this.timeout);

		// Set the snackbar as `active`.
		this.active = true;

		if (message) {
			// Set snackbar text message.
			this.message = message;
		}

		// Announce message to assistive technologies.
		this.announceSnackbar();

		// Show the snackbar element.
		this.snackbar.addClass(classes.active);

		// If available, execute the callback function when the snackbar is open.
		if (this.options.onOpen) {
			this.options.onOpen();
		}

		// Add event listeners.
		this.addEvents();

		// After a set delay, hide the snackbar element.
		this.timeout = window.setTimeout(this.hideSnackbar, this.options.delay);

		// Dispatch event to let the user know the snackbar is open.
		this.snackbar.dispatchEvent(new Event(events.opened));
	};

	/**
	 * announceSnackbar
	 *
	 * Method to have screen readers announce the snackbar message.
	 *
	 * @private
	 * @memberof MDFSnackbar
	 * @since 1.0.0
	 */
	private announceSnackbar = () => {
		// Don't continue if the snackbar is hidden.
		if (!this.active) return;

		// Set the `aria-live` attribute to `off` while we manipulate the element.
		this.snackbar.setAttribute(attr.live, 'off');

		// Cache the current snackbar message.
		const origMessage = this.message;

		/**
		 * Temporarily empty out the textContent to force the screen readers to detect a change.
		 * Based on: https://github.com/material-components/material-components-web/commit/b4b19b720417bea5f211be1e37821ffb7a5c0759
		 */
		this.textContainer.textContent = '';
		this.textContainer.innerHTML = '<span style="display: inline-block; width: 0; height: 1px;">&nbsp;</span>';

		// Temporarily display the message through the `::before` pseudo element while we reset the textContent.
		this.textContainer.setAttribute(attr.message, origMessage);

		setTimeout(() => {
			// We change the `aria-live` attribute to `polite` so screen readers can announce the message.
			this.snackbar.setAttribute(attr.live, 'polite');

			// Remove the `::before` text.
			this.textContainer.removeAttribute(attr.message);

			// Restore the original snackbar message to have the screen reader announce it.
			this.message = origMessage;
		}, 1000);
	};

	/**
	 * displayNextMessage
	 *
	 * Display next message in queue.
	 *
	 * @private
	 * @memberof MDFSnackbar
	 * @since 1.0.0
	 */
	private displayNextMessage = () => {
		// Queue is empty, don't continue.
		if (!this.queue.length) return;

		// Display next message.
		this.showSnackbar(this.queue.shift());
	};

	/**
	 * hideSnackbar
	 *
	 * Hide the snackbar element.
	 *
	 * @param {() => void} callback Function to run when the snackbar is closed
	 *
	 * @private
	 * @memberof MDFSnackbar
	 * @since 1.0.0
	 */
	private hideSnackbar = (callback?: () => void) => {
		// Hide the snackbar element.
		this.snackbar.removeClass(classes.active);

		// Function will fire as soon as the snackbar element transition has ended.
		const waitForTransition = () => {
			// Clear the snackbar timeout id.
			clearTimeout(this.timeout);

			// Execute callback function if available.
			if (callback) {
				callback();
			}

			// Set 'active' status to 'false'.
			this.active = false;

			// Remove event listeners.
			this.removeEvents();

			// Show next message.
			this.displayNextMessage();

			// Dispatch event to let the user know the snackbar is closed.
			this.snackbar.dispatchEvent(new Event(events.closed));

			// Remove 'transitionend' event from snackbar element.
			this.snackbar.removeEventListener('transitionend', waitForTransition);
		};

		// Add 'transitionend' event to the snackbar element.
		this.snackbar.addEventListener('transitionend', waitForTransition);
	};

	/**
	 * clickEvents
	 *
	 * Add `click` event listeners for the `action` and `close` button.
	 *
	 * @private
	 * @memberof MDFSnackbar
	 * @since 1.0.0
	 */
	private clickEvents = (evt: MouseEvent) => {
		// The clicked element.
		const _this = evt.target as HTMLButtonElement;

		if (_this.matches(selectors.action)) {
			// Dismiss the snackbar and execute the `action` callback.
			this.hideSnackbar(this.options.onAction);
		} else if (_this.matches(selectors.close)) {
			// Dismiss the snackbar and execute the `close` callback.
			this.hideSnackbar(this.options.onClose);
		}
	};

	/**
	 * keyboardEvents
	 *
	 * @private
	 * @memberof MDFSnackbar
	 * @since 1.0.0
	 */
	private keyboardEvents = (evt: KeyboardEvent) => {
		// Make sure the user pressed the `ESC` key.
		if (evt.key === 'Escape') {
			// Stop the event from bubbling up.
			evt.stopPropagation();

			// If the snackbar is currently visible, hide it.
			if (this.active && this.snackbar.hasClass(classes.active)) {
				this.hideSnackbar(this.options.onClose);
			}
		}
	};

	/**
	 * addEvents
	 *
	 * Add event listeners.
	 *
	 * @private
	 * @memberof MDFSnackbar
	 * @since 1.0.0
	 */
	private addEvents = () => {
		this.snackbar.addEventListener('click', this.clickEvents);

		if (this.options.hideOnESC) {
			document.addEventListener('keydown', this.keyboardEvents);
		}
	};

	/**
	 * removeEvents
	 *
	 * Remove event listeners.
	 *
	 * @private
	 * @memberof MDFSnackbar
	 * @since 1.0.0
	 */
	private removeEvents = () => {
		this.snackbar.removeEventListener('click', this.clickEvents);

		if (this.options.hideOnESC) {
			document.removeEventListener('keydown', this.keyboardEvents);
		}
	};
}
