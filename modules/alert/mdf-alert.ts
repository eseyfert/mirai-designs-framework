import '@miraidesigns/base';
import { attr, classes, events, selectors } from './constants';
import { MDFAlertOptions } from './types';

/**
 * MDFAlert
 *
 * Alerts display an important message to the user fixed to the top of the screen.
 *
 * @export
 * @class MDFAlert
 * @version 1.0.0
 */
export class MDFAlert {
	public readonly alert: HTMLElement;
	public readonly options: MDFAlertOptions;

	private defaults: MDFAlertOptions;
	private text: HTMLElement;

	/**
	 * Creates an instance of MDFAlert.
	 *
	 * @param {Element} elem The alert element we are manipulating
	 * @param {MDFAlertOptions} [options] Object holding user options
	 *
	 * @memberof MDFAlert
	 * @since 1.0.0
	 */
	constructor(elem: Element, options?: MDFAlertOptions) {
		// If the supplied element doesn't exist, abort the script.
		if (!elem) return;

		// Store a reference to the given element.
		this.alert = elem as HTMLElement;

		// Default values for user options.
		this.defaults = {
			onOpen: null,
			onCancel: null,
			onConfirm: null,
		};

		// Merge defaults and user options.
		this.options = Object.assign({}, this.defaults, options);

		// Element that holds the alert text message.
		this.text = this.alert.querySelector(selectors.text);
	}

	/**
	 * Returns the alert text message.
	 *
	 * @readonly
	 * @type {string}
	 * @memberof MDFAlert
	 */
	get message(): string {
		return this.text.textContent;
	}

	/**
	 * Set the alert text message.
	 *
	 * @memberof MDFAlert
	 */
	set message(message: string) {
		this.text.textContent = message;
	}

	/**
	 * Displays the alert, optionally with a given message and a delay.
	 *
	 * @param {number} delay The delay before showing the alert (in ms)
	 *
	 * @memberof MDFAlert
	 * @since 1.0.0
	 */
	public showAlert = (delay?: number): void => {
		// Set the alert as active (optionally delayed).
		setTimeout(() => {
			this.alert.addClass(classes.active);
		}, delay);

		// Once the element is ready, show the alert.
		this.alert.addClass(classes.move);

		// If available, execute the `onOpen` callback.
		if (this.options.onOpen) {
			this.options.onOpen();
		}

		// Add the event listeners.
		this.addEvents();

		// Dispatch event letting the user know the alert is open.
		this.alert.dispatchEvent(new Event(events.opened));
	};

	/**
	 * closeAlert
	 *
	 * Hide the alert.
	 *
	 * @memberof Alert
	 * @since 1.0.0
	 */
	public closeAlert = (): void => {
		// Hide the alert.
		this.alert.removeClass(classes.move);

		const hideAlert = () => {
			// After the alert is no longer visible, deactivate it.
			this.alert.removeClass(classes.active);

			// Remove the event listeners.
			this.removeEvents();

			// Remove the `transitionend` event so it does not repeat.
			this.alert.removeEventListener('transitionend', hideAlert);

			// Dispatch event letting the user know the alert is closed.
			this.alert.dispatchEvent(new Event(events.closed));
		};

		// Add `transitionend` event so we know when the alert is done transitioning.
		this.alert.addEventListener('transitionend', hideAlert);
	};

	/**
	 * clickEvents
	 *
	 * Click events for the alert action buttons.
	 *
	 * @private
	 * @memberof Alert
	 * @since 1.0.0
	 */
	private clickEvents = (evt: MouseEvent) => {
		// Get the clicked element.
		const _this = evt.target as HTMLElement;

		// We make sure the clicked element matches an action button.
		if (_this.matches(selectors.action)) {
			// Get the type of action (`confirm` or `cancel`).
			const action = _this.getAttribute(attr.action);

			if (action === 'cancel') {
				// If available, execute the `onCancel` callback.
				if (this.options.onCancel) {
					this.options.onCancel();
				}
			} else if (action === 'confirm') {
				// If available, execute the `onConfirm` callback.
				if (this.options.onConfirm) {
					this.options.onConfirm();
				}
			}

			// Dismiss the alert.
			this.closeAlert();
		}
	};

	/**
	 * addEvents
	 *
	 * Add event listeners.
	 *
	 * @private
	 * @memberof Alert
	 * @since 1.0.0
	 */
	private addEvents = () => {
		this.alert.addEventListener('click', this.clickEvents);
	};

	/**
	 * removeEvents
	 *
	 * Remove event listeners.
	 *
	 * @private
	 * @memberof Alert
	 * @since 1.0.0
	 */
	private removeEvents = () => {
		this.alert.removeEventListener('click', this.clickEvents);
	};
}
