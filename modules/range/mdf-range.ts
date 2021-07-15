import '@miraidesigns/base';
import { empty } from '@miraidesigns/utils';
import { classes, selectors } from './constants';
import { MDFRangeOptions } from './types';

/**
 * MDFRange
 *
 * Range sliders allow users to pick between a minimum and maximum value.
 *
 * @export
 * @class MDFRange
 * @version 1.0.2
 */
export class MDFRange {
	private container: HTMLElement;
	private defaults: MDFRangeOptions;
	private ticksContainer: HTMLElement;

	public readonly options: MDFRangeOptions;
	public readonly input: HTMLInputElement;
	public readonly leading: HTMLElement;
	public readonly track: HTMLElement;
	public readonly trailing: HTMLElement;
	public readonly valueInput: HTMLInputElement;

	/**
	 * Creates an instance of MDFRange.
	 *
	 * @param {Element} elem The element we are manipulating
	 * @param {MDFRangeOptions} options Object holding user options
	 * @memberof MDFRange
	 * @since 1.0.0
	 */
	constructor(elem: Element, options?: MDFRangeOptions) {
		// If the supplied element doesn't exist, abort the script.
		if (!elem) return;

		// Store a reference to the given element.
		this.container = elem as HTMLElement;

		// Default values for user options.
		this.defaults = {
			value: false,
			editable: false,
			ticks: false,
			numbers: false,
		};

		// Merge defaults and user options.
		this.options = Object.assign({}, this.defaults, options);

		// Get the track element.
		this.track = this.container.querySelector(selectors.track);

		// Get the input element.
		this.input = this.container.querySelector(selectors.input);

		// Get the leading element.
		this.leading = this.container.querySelector(selectors.leading);

		// Get the trailing element.
		this.trailing = this.container.querySelector(selectors.trailing);

		// Get the editable value input.
		this.valueInput = this.container.querySelector(selectors.valueInput);

		// Make sure everything is setup properly on page load.
		this.setInitialState();

		// Add event listeners.
		this.addEvents();
	}

	get value(): string {
		return this.input.value;
	}

	set value(value: string) {
		this.input.value = value;

		if (this.valueInput) {
			this.valueInput.value = value;
		}
	}

	get min(): string {
		return this.input.min;
	}

	set min(min: string) {
		this.input.min = min;

		if (this.valueInput) {
			this.valueInput.min = min;
		}
	}

	get max(): string {
		return this.input.max;
	}

	set max(max: string) {
		this.input.max = max;

		if (this.valueInput) {
			this.valueInput.max = max;
		}
	}

	get step(): string {
		return this.input.step;
	}

	set step(step: string) {
		this.input.step = step;

		if (this.valueInput) {
			this.valueInput.step = step;
		}
	}

	get disabled(): boolean {
		return this.input.disabled;
	}

	set disabled(disabled: boolean) {
		this.input.disabled = disabled;
		this.container.toggleClass(classes.disabled, disabled);

		if (this.valueInput) {
			this.valueInput.disabled = disabled;
		}
	}

	/**
	 * setInputDefaults
	 *
	 * Set default input attributes if they were left empty.
	 *
	 * @private
	 * @memberof MDFRange
	 * @since 1.0.0
	 * @version 1.0.2
	 */
	private setInputDefaults = () => {
		if (empty(this.value)) {
			this.value = '0';
		}

		if (empty(this.min)) {
			this.min = '0';
		}

		if (empty(this.max)) {
			this.max = '100';
		}

		if (empty(this.step === '')) {
			this.step = '10';
		}
	};

	/**
	 * setInitialState
	 *
	 * Make sure our elements have the proper attributes on page load.
	 *
	 * @private
	 * @memberof MDFRange
	 * @since 1.0.0
	 */
	private setInitialState = () => {
		// If the range input is disabled, make sure to apply the `disabled` class as well.
		if (this.disabled) {
			this.container.addClass(classes.disabled);
		}

		// If the `disabled` class is applied, make sure the range and edit inputs are disabled as well.
		if (this.container.hasClass(classes.disabled)) {
			this.input.disabled = true;

			if (this.valueInput) {
				this.valueInput.disabled = true;
			}
		}

		// Set default input attributes if they were left empty.
		this.setInputDefaults();

		// Show the current value if needed.
		if (this.trailing) {
			this.currentValue();
		}

		// If editing is enabled, apply the proper styling and attributes for it.
		if (this.options.editable) {
			// Add the `editable` class.
			this.container.addClass(classes.editable);

			// Make sure the edit's input attributes matches the range.
			this.valueInput.min = this.min;
			this.valueInput.max = this.max;
			this.valueInput.step = this.step;

			// Set the correct input width.
			this.correctEditInputWidth();
		}

		// If enabled, create ticks to visualize snapping points.
		if (this.options.ticks) {
			this.createTicks();
		}
	};

	/**
	 * currentValue
	 *
	 * Shows the current value of our slider in the trailing element.
	 *
	 * @private
	 * @memberof MDFRange
	 * @since 1.0.0
	 */
	private currentValue = () => {
		if (this.options.value && !this.options.editable) {
			// Only show the current value without being able to edit it.
			this.trailing.textContent = this.value;
		} else if (this.options.editable) {
			// Match the editable input value to the range input.
			this.valueInput.value = this.value;
		}
	};

	/**
	 * correctEditInputWidth
	 *
	 * Set the correct width for the editable value input.
	 *
	 * @private
	 * @memberof MDFRange
	 * @since 1.0.0
	 */
	private correctEditInputWidth = () => {
		// Make sure the input is always at least 1 character long for proper appearance.
		const width = this.valueInput.value.length > 1 ? this.valueInput.value.length : 1;

		// Adjust the edit's input width to match its value.
		this.valueInput.style.width = `${width}ch`;
	};

	/**
	 * webKitProgress
	 *
	 * Make sure WebKit based browsers have the correct track appearance.
	 *
	 * @private
	 * @memberof MDFRange
	 * @since 1.0.0
	 */
	private webKitProgress = () => {
		// Get the current progress as a percentage.
		const progress = ((+this.value - +this.min) / (+this.max - +this.min)) * 100;

		// Upgrade progress bar value for WebKit browsers.
		this.input.style.setProperty('--rangeProgress', `${progress}%`);
	};

	/**
	 * createTicks
	 *
	 * Create the ticks matching the input's attributes.
	 *
	 * @private
	 * @memberof MDFRange
	 * @since 1.0.0
	 */
	private createTicks = () => {
		if (!this.ticksContainer) {
			// Create the container element holding the ticks.
			this.ticksContainer = document.createElement('div');
			this.ticksContainer.addClass(classes.ticksContainer);

			// Create a document fragment to hold our ticks.
			const docFrag = document.createDocumentFragment();

			// Create ticks using the input's `min`, `max` and `step` attribute.
			for (let i = +this.min; i <= +this.max; i += +this.step) {
				const tick = document.createElement('div');
				tick.addClass(classes.tick);

				// If enabled, show the step number beneath the tick.
				if (this.options.numbers) {
					// Set the tick value and if available, the prefix or suffix.
					tick.textContent = i.toString();
				}

				// Add the tick to our document fragment.
				docFrag.append(tick);
			}

			// Add the fragment holding our ticks to the container element.
			this.ticksContainer.append(docFrag);

			// And finally add the ticks to our track.
			this.track.append(this.ticksContainer);
		}
	};

	/**
	 * inputEvents
	 *
	 * Behavior for the `input` events.
	 *
	 * @private
	 * @memberof MDFRange
	 * @since 1.0.0
	 */
	private inputEvents = () => {
		// Show correct progress for Webkit browsers.
		this.webKitProgress();

		// Make sure we have the trailing element.
		if (this.trailing) {
			// Display the current value.
			this.currentValue();

			// If enabled, make sure the value input has the correct width.
			if (this.options.editable) {
				this.correctEditInputWidth();
			}
		}
	};

	/**
	 * editEvents
	 *
	 * Behavior for `input` events of the editable value input.
	 *
	 * @private
	 * @memberof MDFRange
	 * @since 1.0.0
	 */
	private editEvents = () => {
		// Set the correct input width.
		this.correctEditInputWidth();

		// Make sure the editable input's value is reflected immediately in the range input.
		this.value = this.valueInput.value;
	};

	/**
	 * addEvents
	 *
	 * Add event listeners.
	 *
	 * @private
	 * @memberof MDFRange
	 * @since 1.0.0
	 */
	private addEvents = () => {
		this.input.addEventListener('input', this.inputEvents);

		if (this.options.editable && this.valueInput) {
			this.valueInput.addEventListener('input', this.editEvents);
		}
	};
}
