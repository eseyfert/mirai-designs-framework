import '@miraidesigns/base';
import { attr, classes, events, selectors } from './constants';
import { MDFTogglesEvent } from './types';

/**
 * MDFToggles
 *
 * A group of buttons where only one button (toggle) can be selected at a time.
 * Each button has a different function attached.
 *
 * @export
 * @class MDFToggles
 * @version 1.0.0
 */
export class MDFToggles {
	public readonly container: HTMLElement;
	public readonly toggles: HTMLButtonElement[];
	public readonly callbacks: Record<string, () => void>;

	private activeToggle: HTMLButtonElement;

	/**
	 * Creates an instance of MDFToggles.
	 *
	 * @param {Element} elem The toggles container element
	 * @param {Record<string, () => void>} callbacks The toggles callback functions
	 *
	 * @memberof MDFToggles
	 * @since 1.0.0
	 */
	constructor(elem: Element, callbacks: Record<string, () => void>) {
		// If the supplied element doesn't exist, abort the script.
		if (!elem) return;

		// Store a reference to the given element.
		this.container = elem as HTMLElement;

		// Get all available toggle elements.
		this.toggles = Array.from(this.container.querySelectorAll(selectors.toggle));

		// Get the callbacks.
		this.callbacks = Object.assign({}, callbacks);

		// Add the toggle click events.
		this.addEvents();
	}

	/**
	 * getToggle
	 *
	 * Return the toggle button element with the given index.
	 *
	 * @param {number} index The index of the toggle element
	 *
	 * @public
	 * @memberof MDFToggles
	 * @since 1.0.0
	 */
	public getToggle = (index: number): HTMLButtonElement => {
		return this.toggles[index];
	};

	/**
	 * getActiveToggle
	 *
	 * Return the active toggle button element.
	 *
	 * @public
	 * @memberof MDFToggles
	 * @since 1.0.0
	 */
	public getActiveToggle = (): HTMLButtonElement => {
		return this.activeToggle;
	};

	/**
	 * activateToggle
	 *
	 * Activate the given toggle.
	 *
	 * @memberof MDFToggles
	 */
	public activateToggle = (elem: HTMLButtonElement): void => {
		// Set all toggles as not pressed.
		for (const toggle of this.toggles) {
			toggle.setAttribute(attr.pressed, 'false');
			toggle.removeClass(classes.active);
		}

		// Update the reference to the active element.
		this.activeToggle = elem;

		// Set the clicked toggle as pressed.
		this.activeToggle.setAttribute(attr.pressed, 'true');
		this.activeToggle.addClass(classes.active);

		// Get the toggle's callback function.
		const callback = this.callbacks[elem.getAttribute(attr.callback)];

		// If its available, execute it.
		if (callback) {
			callback();
		}

		// Dispatch event letting the user know that the toggle changed.
		this.container.dispatchEvent(
			new CustomEvent<MDFTogglesEvent>(events.changed, {
				detail: {
					callback: elem.getAttribute(attr.callback),
					index: this.toggles.indexOf(this.activeToggle),
					toggle: this.activeToggle,
				},
			})
		);
	};

	/**
	 * clickEvents
	 *
	 * Set current toggle as pressed and run the required callback.
	 *
	 * @private
	 * @memberof MDFToggles
	 * @since 1.0.0
	 */
	private clickEvents = (evt: Event) => {
		// Get the clicked element.
		const _this = evt.target as HTMLButtonElement;

		// Make sure it was a toggle that was pressed.
		if (_this.matches(selectors.toggle)) {
			// Set the pressed toggle as active.
			this.activateToggle(_this);
		}
	};

	/**
	 * addEvents
	 *
	 * Add the event listeners.
	 *
	 * @private
	 * @memberof MDFToggles
	 * @since 1.0.0
	 */
	private addEvents = () => {
		this.container.addEventListener('click', this.clickEvents);
	};
}
