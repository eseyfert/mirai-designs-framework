import '@miraidesigns/base';
import { classes, selectors } from './constants';

/**
 * MDFCheckbox
 *
 * Checkboxes allow users to select one or multiple options.
 *
 * @export
 * @class MDFCheckbox
 * @version 1.0.0
 */
export class MDFCheckbox {
	public readonly input: HTMLInputElement;

	private container: HTMLElement;

	/**
	 * Creates an instance of MDFCheckbox.
	 *
	 * @param {Element} elem The element we are manipulating
	 * @memberof MDFCheckbox
	 * @since 1.0.0
	 */
	constructor(elem: Element) {
		// If the supplied element doesn't exist, abort the script.
		if (!elem) return;

		// Store a reference to the given element.
		this.container = elem as HTMLElement;

		// Get the input element.
		this.input = this.container.querySelector(selectors.input);

		// Set the initial state of our elements.
		this.setInitialState();
	}

	get disabled(): boolean {
		return this.input.disabled;
	}

	set disabled(disabled: boolean) {
		this.container.toggleClass(classes.disabled, disabled);
		this.input.disabled = disabled;
	}

	get checked(): boolean {
		return this.input.checked;
	}

	set checked(checked: boolean) {
		this.input.checked = checked;
	}

	get indeterminate(): boolean {
		return this.input.indeterminate;
	}

	set indeterminate(indeterminate: boolean) {
		this.container.toggleClass(classes.indeterminate, indeterminate);
		this.input.indeterminate = indeterminate;
	}

	get value(): string {
		return this.input.value;
	}

	set value(value: string) {
		this.input.value = value;
	}

	/**
	 * setInitialState
	 *
	 * Make sure the checkbox has the proper attributes on page load.
	 *
	 * @private
	 * @memberof MDFCheckbox
	 * @since 1.0.0
	 */
	private setInitialState = () => {
		// If the `indeterminate` class is present, set the input's state as well.
		if (this.container.hasClass(classes.indeterminate)) {
			this.input.indeterminate = true;
		}

		// If the `disabled` class is present, set the input's state as well.
		if (this.container.hasClass(classes.disabled)) {
			this.input.disabled = true;
		}

		// If the input is disabled, add the `disabled` class as well.
		if (this.input.disabled) {
			this.container.addClass(classes.disabled);
		}
	};
}
