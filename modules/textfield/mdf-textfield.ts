import '@miraidesigns/base';
import { isRTL } from '@miraidesigns/utils';
import { classes, selectors, strings } from './constants';

/**
 * MDFTextfield
 *
 * Text fields allow for text based inputs.
 *
 * @export
 * @class MDFTextfield
 * @version 1.0.0
 */
export class MDFTextfield {
	public readonly counter: HTMLElement;
	public readonly helper: HTMLElement;
	public readonly input: HTMLInputElement;
	public readonly label: HTMLElement;
	public readonly leadingIcon: HTMLElement;
	public readonly toggle: HTMLElement;
	public readonly trailingIcon: HTMLElement;

	private container: HTMLElement;
	private currState: string;
	private prefixElem: HTMLElement;
	private shouldValidate: boolean;
	private suffixElem: HTMLElement;

	/**
	 * Creates an instance of MDFTextfield.
	 *
	 * @param {Element} elem The element we are manipulating
	 * @memberof MDFTextfield
	 * @since 1.0.0
	 */
	constructor(elem: Element) {
		// If the supplied element doesn't exist, abort the script.
		if (!elem) return;

		// Store a reference to the given element.
		this.container = elem as HTMLElement;

		// Get the input element.
		this.input = this.container.querySelector(selectors.input);

		// Get the label element.
		this.label = this.container.querySelector(selectors.label);

		// Get the prefixElem and suffixElem elements.
		this.prefixElem = this.container.querySelector(selectors.prefix);
		this.suffixElem = this.container.querySelector(selectors.suffix);

		// Get the leading and trailing icons.
		this.leadingIcon = this.container.querySelector(selectors.leadingIcon);
		this.trailingIcon = this.container.querySelector(selectors.trailingIcon);

		// Get the helper and text counter elements.
		this.helper = this.container.querySelector(selectors.helper);
		this.counter = this.container.querySelector(selectors.counter);

		// Get the password toggle element.
		this.toggle = this.container.querySelector(selectors.toggle);

		// Validation is turned on by default.
		this.validate = true;

		// Set the initial state of our elements.
		this.setInitialState();

		// Add event listeners.
		this.addEvents();
	}

	get type(): string {
		return this.input.type;
	}

	set type(type: string) {
		this.input.type = type;
	}

	get value(): string {
		return this.input.value;
	}

	set value(value: string) {
		this.input.value = value;
	}

	get length(): number {
		return this.input.value.length;
	}

	get minLength(): number {
		return this.input.minLength;
	}

	set minLength(length: number) {
		this.input.minLength = length;
	}

	get maxLength(): number {
		return this.input.maxLength;
	}

	set maxLength(length: number) {
		this.input.maxLength = length;
	}

	get min(): string {
		return this.input.min;
	}

	set min(min: string) {
		this.input.min = min;
	}

	get max(): string {
		return this.input.max;
	}

	set max(max: string) {
		this.input.max = max;
	}

	get step(): string {
		return this.input.step;
	}

	set step(step: string) {
		this.input.step = step;
	}

	get pattern(): string {
		return this.input.pattern;
	}

	set pattern(pattern: string) {
		this.input.pattern = pattern;
	}

	get required(): boolean {
		return this.input.required;
	}

	set required(required: boolean) {
		this.input.required = required;
	}

	get disabled(): boolean {
		return this.input.disabled;
	}

	set disabled(disabled: boolean) {
		// Set input disabled state.
		this.input.disabled = disabled;
		this.container.toggleClass(classes.disabled, disabled);
	}

	get prefix(): string {
		return this.prefixElem.textContent;
	}

	set prefix(prefix: string) {
		this.prefixElem.textContent = prefix;
	}

	get suffix(): string {
		return this.suffixElem.textContent;
	}

	set suffix(suffix: string) {
		this.suffixElem.textContent = suffix;
	}

	get message(): string {
		return this.helper.textContent;
	}

	set message(message: string) {
		this.helper.textContent = message;
	}

	get validate(): boolean {
		return this.shouldValidate;
	}

	set validate(validate: boolean) {
		this.shouldValidate = validate;
	}

	get state(): string {
		return this.currState;
	}

	/**
	 * setState
	 *
	 * Set the state of the input element.
	 * Valid values are `success`, `warning` and `error`.
	 *
	 * @param {string} state The desired state
	 * @memberof MDFTextfield
	 * @since 1.0.0
	 */
	public setState = (state: string): void => {
		// Update current state.
		this.currState = state;

		// Remove any previous `state` class before adding the new one.
		this.container.removeClassByPrefix(strings.statePrefix);

		// Set state according to given value.
		switch (this.currState.toLowerCase()) {
			case 'success':
				this.container.addClass(classes.stateSuccess);
				break;
			case 'warning':
				this.container.addClass(classes.stateWarning);
				break;
			case 'error':
				this.container.addClass(classes.stateError);
				break;
		}
	};

	/**
	 * clearState
	 *
	 * Clear the current input state.
	 *
	 * @memberof MDFTextfield
	 * @since 1.0.0
	 */
	public clearState = (): void => {
		this.currState = null;

		// Remove any previous `state` class before adding the new one.
		this.container.removeClassByPrefix(strings.statePrefix);
	};

	/**
	 * setError
	 *
	 * Display an error message while setting the `error` state.
	 *
	 * @param {string} error The error message
	 * @memberof MDFTextfield
	 * @since 1.0.0
	 */
	public setError = (error: string): void => {
		this.setState('error');

		if (this.helper) {
			this.message = error;
		}
	};

	/**
	 * clearError
	 *
	 * Remove the error message and clear the `error` state.
	 *
	 * @memberof MDFTextfield
	 * @since 1.0.0
	 */
	public clearError = (): void => {
		this.clearState();

		if (this.helper) {
			this.message = '';
		}
	};

	/**
	 * floatLabel
	 *
	 * Floats the label, moving it above the input's text.
	 *
	 * @param {boolean} float Whether to float the label
	 * @memberof MDFTextfield
	 * @since 1.0.0
	 */
	public floatLabel = (float: boolean): void => {
		if (this.label) {
			this.label.toggleClass(classes.labelFloating, float);
		}
	};

	/**
	 * focusLabel
	 *
	 * Apply the proper focus state to the label.
	 *
	 * @param {boolean} focus Whether to focus the label
	 * @memberof MDFTextfield
	 * @since 1.0.0
	 */
	public focusLabel = (focus: boolean): void => {
		if (this.label) {
			this.label.toggleClass(classes.labelFocus, focus);
		}
	};

	/**
	 * shakeLabel
	 *
	 * Shake the label to indicate an invalid input.
	 *
	 * @memberof MDFTextfield
	 * @since 1.0.0
	 */
	public shakeLabel = (): void => {
		if (this.label) {
			// Here we wait for the animation to finish.
			const shakeEvent = () => {
				// Remove the class and event listener to stop the animation.
				this.label.removeClass(classes.labelShake);
				this.label.removeEventListener('animationend', shakeEvent);
			};

			// Play the `shake` animation.
			this.label.addEventListener('animationend', shakeEvent);
			this.label.addClass(classes.labelShake);
		}
	};

	/**
	 * setRTLPadding
	 *
	 * Set RTL-layout aware padding for the given element.
	 *
	 * @private
	 * @param {HTMLElement} elem The element we are manipulating
	 * @param {string} dir The padding direction `left` or `right`
	 * @param {number} padding The amount of padding to add
	 * @memberof MDFTextfield
	 * @since 1.0.0
	 */
	private setRTLPadding = (elem: HTMLElement, dir: string, padding: number) => {
		switch (dir) {
			case 'right':
				isRTL() ? (elem.style.paddingLeft = `${padding}px`) : (elem.style.paddingRight = `${padding}px`);
				break;
			case 'left':
				isRTL() ? (elem.style.paddingRight = `${padding}px`) : (elem.style.paddingLeft = `${padding}px`);
				break;
		}
	};

	/**
	 * prepPrefixSuffix
	 *
	 * Adjust padding of the label and input element to accommodate a prefix or suffix.
	 *
	 * @private
	 * @memberof MDFTextfield
	 * @since 1.0.0
	 */
	private prepPrefixSuffix = () => {
		// Adds an additional buffer to allow for more space between the elements.
		const buffer = 8;

		// Set padding aware of the prefix element.
		if (this.prefixElem) {
			// We make sure our label is not floating before we apply this.
			if (this.label && !this.label.hasClass(classes.labelFloating)) {
				this.setRTLPadding(this.label, 'left', this.prefixElem.offsetWidth + buffer);
			}

			this.setRTLPadding(this.input, 'left', this.prefixElem.offsetWidth + buffer);
		}

		// Set padding aware of the suffix element.
		if (this.suffixElem) {
			// We make sure our label is not floating before we apply this.
			if (this.label && !this.label.hasClass(classes.labelFloating)) {
				this.setRTLPadding(this.label, 'right', this.suffixElem.offsetWidth + buffer);
			}

			this.setRTLPadding(this.input, 'right', this.suffixElem.offsetWidth + buffer);
		}
	};

	/**
	 * setCounter
	 *
	 * Set/update the counter text.
	 *
	 * @private
	 * @memberof MDFTextfield
	 * @since 1.0.0
	 */
	private setCounter = () => {
		if (this.maxLength) {
			// Display both current count and maxLength if present.
			this.counter.textContent = `${this.value.length} / ${this.maxLength}`;
		} else {
			// Otherwise only display the current character count.
			this.counter.textContent = `${this.value.length}`;
		}
	};

	/**
	 * setTextareaHeight
	 *
	 * Dynamically set height of the textarea element based on its content.
	 *
	 * @private
	 * @memberof MDFTextfield
	 * @since 1.0.0
	 */
	private setTextareaHeight = () => {
		this.input.style.height = 'auto';
		this.input.style.height = `${this.input.offsetHeight - this.input.clientHeight + this.input.scrollHeight}px`;
	};

	/**
	 * setInitialState
	 *
	 * Make sure the text field has the proper attributes on page load.
	 *
	 * @private
	 * @memberof MDFTextfield
	 * @since 1.0.0
	 */
	private setInitialState = () => {
		// If the `disabled` class is present, make sure to disable the input as well.
		if (this.container.hasClass(classes.disabled)) {
			this.disabled = true;
		}

		// If we have any preexisting values, float the label.
		if (this.value.length) {
			this.floatLabel(true);
		}

		// Make sure the label is floating for these input types.
		if (strings.alwaysFloat.includes(this.type)) {
			this.floatLabel(true);
		}

		// Should we have a prefixElem or suffixElem, make sure it properly fits.
		if (this.prefixElem || this.suffixElem) {
			this.prepPrefixSuffix();
		}

		// If we have a counter present, set it properly.
		if (this.counter) {
			this.setCounter();
		}

		// Set proper height if we have a textarea element.
		if (this.container.hasClass(classes.textarea)) {
			this.setTextareaHeight();
		}
	};

	/**
	 * togglePassword
	 *
	 * Toggle password input between obfuscated and plain text.
	 *
	 * @private
	 * @memberof MDFTextfield
	 * @since 1.0.0
	 */
	private togglePassword = (evt: MouseEvent) => {
		// Make sure the button does not submit a form.
		evt.preventDefault();

		// Get the `use` icon references.
		const useElements = this.toggle.getElementsByTagName('use');

		// Get the two icons we will toggle.
		const iconVisible = useElements[0];
		const iconHidden = useElements[1];

		if (this.type === 'password') {
			// Set the input type to `text` displaying the password as plain text.
			this.type = 'text';

			// Display the needed icon for the next action.
			iconVisible.hide();
			iconHidden.show();
		} else {
			// Set the input type to `password` obfuscating the text again.
			this.type = 'password';

			// Display the needed icon for the next action.
			iconVisible.show();
			iconHidden.hide();
		}
	};

	/**
	 * validateInput
	 *
	 * Make user aware of invalid input values.
	 *
	 * @private
	 * @memberof MDFTextfield
	 * @since 1.0.0
	 */
	private validateInput = () => {
		// Check the HTML5 API for a validation message.
		if (this.input.validationMessage.length) {
			// If we have one, display it.
			this.setError(this.input.validationMessage);
		} else {
			// Otherwise clear the error.
			this.clearError();
		}
	};

	/**
	 * focusEvents
	 *
	 * Behavior for the `focus` event.
	 *
	 * @private
	 * @memberof MDFTextfield
	 * @since 1.0.0
	 */
	private focusEvents = () => {
		// Float our label and set focus to it.
		this.floatLabel(true);
		this.focusLabel(true);

		if (this.label) {
			// Remove any leftover style rules on the label.
			this.label.removeAttribute('style');
		}
	};

	/**
	 * blurEvents
	 *
	 * Behavior for the `blur` event.
	 *
	 * @private
	 * @memberof MDFTextfield
	 */
	private blurEvents = () => {
		// If the input is empty, un-float the label.
		if (!this.value.length || this.value === '') {
			this.floatLabel(false);

			if (this.label) {
				// Make sure the label has the correct sizing again.
				this.prepPrefixSuffix();
			}
		}

		// Remove focus from the label.
		this.focusLabel(false);
	};

	/**
	 * inputEvents
	 *
	 * Behavior for the `input` event.
	 *
	 * @private
	 * @memberof MDFTextfield
	 * @since 1.0.0
	 */
	private inputEvents = () => {
		if (this.container.hasClass(classes.textarea)) {
			// Update height if we have a textarea element.
			this.setTextareaHeight();
		}

		if (this.counter) {
			// Update the counter if we have one.
			this.setCounter();
		}

		if (this.shouldValidate) {
			// Validate the input as it is being typed.
			this.validateInput();
		}
	};

	/**
	 * addEvents
	 *
	 * Add event listeners.
	 *
	 * @private
	 * @memberof MDFTextfield
	 * @since 1.0.0
	 */
	private addEvents = () => {
		this.input.addEventListener('focus', this.focusEvents);
		this.input.addEventListener('blur', this.blurEvents);
		this.input.addEventListener('input', this.inputEvents);
		this.input.addEventListener('paste', this.validateInput);

		if (this.toggle) {
			this.toggle.addEventListener('click', this.togglePassword);
		}
	};
}
