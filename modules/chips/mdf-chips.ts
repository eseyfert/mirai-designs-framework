import '@miraidesigns/base';
import { MDFChipsOptions, MDFChipsAddedEvent } from './types';
import { attr, classes, events, selectors } from './constants';

/**
 * MDFChips
 *
 * Chips are elements that represent small pieces of information like tags or inputs.
 *
 * @export
 * @class MDFChips
 * @version 1.0.0
 */
export class MDFChips {
	public readonly chips: HTMLCollectionOf<Element>;
	public readonly container: HTMLElement;
	public readonly grid: HTMLElement;
	public readonly input: HTMLInputElement;
	public readonly options: MDFChipsOptions;

	private ariaLive: HTMLElement;
	private defaults: MDFChipsOptions;
	private focusableElements: HTMLElement[];
	private values: string[];

	/**
	 * Creates an instance of MDFChips.
	 *
	 * @param {HTMLElement} container The chips container element we are manipulating
	 *
	 * @memberof MDFChips
	 * @since 1.0.0
	 */
	constructor(container: Element, options?: MDFChipsOptions) {
		// If the supplied element doesn't exist, abort the script.
		if (!container) return;

		// Store a reference to the given element.
		this.container = container as HTMLElement;

		// Default values for user options.
		this.defaults = {
			iconURL: null,
		};

		// Merge defaults and user options.
		this.options = Object.assign({}, this.defaults, options);

		// This flex container holds all the chips.
		this.grid = this.container.querySelector(selectors.grid);

		// Get a live collection of all available chips.
		this.chips = this.container.getElementsByClassName(classes.chip);

		// Input element we use for chips creation.
		this.input = this.container.querySelector(selectors.input);

		// We use this element to announce changes to assistive technologies.
		this.ariaLive = this.container.querySelector(selectors.live);

		// Get list of all focusable elements.
		this.focusableElements = Array.from(this.container.querySelectorAll(selectors.focus));

		// Add event listeners.
		this.addEvents();
	}

	/**
	 * addChip
	 *
	 * Adds a chip with the given text to the DOM on call.
	 *
	 * @param value The chip's text
	 * @param callback Optional callback to execute
	 *
	 * @public
	 * @memberof Chips
	 * @since 1.0.0
	 */
	public addChip = (value: string, callback?: () => void): void => {
		// Add the chip to the DOM.
		this.create(value);

		// Announce chip addition to assistive technologies.
		this.ariaLive.textContent = 'Chip added';

		// Update references to all focusable elements.
		this.updateElements();

		// Execute the callback function.
		if (callback) {
			callback();
		}

		// Dispatch event with info about the added chip.
		this.grid.dispatchEvent(
			new CustomEvent<MDFChipsAddedEvent>(events.added, {
				bubbles: true,
				detail: {
					text: value,
				},
			})
		);
	};

	/**
	 * deleteChip
	 *
	 * Delete the chip permanently from the DOM on call.
	 *
	 * @param {HTMLElement} chip The chip element we want to delete
	 * @param {Function} callback Optional callback to execute
	 *
	 * @public
	 * @memberof Chips
	 * @since 1.0.0
	 */
	public deleteChip = (chip: HTMLElement, callback?: () => void): void => {
		// Delete the chip from the DOM.
		this.grid.removeChild(chip);

		// Announce chip removal to assistive technologies.
		this.ariaLive.textContent = 'Chip removed';

		// Update references to all focusable elements.
		this.updateElements();

		// Execute the callback function.
		if (callback) {
			callback();
		}

		// Dispatch event to inform user about chip deletion.
		this.grid.dispatchEvent(
			new CustomEvent(events.deleted, {
				bubbles: true,
			})
		);
	};

	/**
	 * getValues
	 *
	 * Get a list of all chips text values.
	 *
	 * @public
	 * @memberof Chips
	 * @since 1.0.0
	 */
	public getValues = (): string[] => {
		// Reset the array.
		this.values = [];

		// Fill the array with the chips text values.
		for (const chip of this.chips) {
			const text = chip.querySelector(selectors.text).textContent;
			this.values.push(text);
		}

		return this.values;
	};

	/**
	 * create
	 *
	 * Create the chip's HTML markup and then add it to the DOM.
	 *
	 * @param {string} value The text for the chip
	 *
	 * @private
	 * @memberof Chips
	 * @since 1.0.0
	 */
	private create = (value: string) => {
		const docFrag = document.createDocumentFragment();

		// Create the logical row holding our two gridcell elements.
		const divRow = document.createElement('div');
		divRow.className = classes.chip;
		divRow.tabIndex = 0;
		divRow.setAttribute(attr.role, 'row');

		// Grid cell holding the chips text.
		const textCell = document.createElement('span');
		textCell.setAttribute(attr.role, 'gridcell');

		// Grid cell holding the action button.
		const actionCell = document.createElement('span');
		actionCell.setAttribute(attr.role, 'gridcell');

		// The text element.
		const text = document.createElement('span');
		text.className = classes.text;
		text.textContent = value;
		text.setAttribute(attr.index, '0');

		// The action button element.
		const action = document.createElement('button');
		action.className = classes.action;
		action.setAttribute(attr.label, 'Remove chip');

		// Create the SVG icon element.
		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svg.classList.add(classes.icon);
		svg.setAttributeNS(null, 'viewBox', '0 0 24 24');
		svg.setAttributeNS(null, attr.hidden, 'true');

		const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
		use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', this.options.iconURL);

		// Append all necessary elements to their parents.
		svg.appendChild(use);
		action.appendChild(svg);

		textCell.appendChild(text);
		actionCell.appendChild(action);

		divRow.appendChild(textCell);
		divRow.appendChild(actionCell);

		// Add the finalized chip element to the document fragment.
		docFrag.appendChild(divRow);

		// Add our new chip to the DOM.
		this.grid.appendChild(docFrag);
	};

	/**
	 * updateElements
	 *
	 * We run this every time we add or remove a chip to have an up-to-date list of all focusable elements.
	 *
	 * @private
	 * @memberof Chips
	 * @since 1.0.0
	 */
	private updateElements = () => {
		this.focusableElements = [...this.container.querySelectorAll(selectors.focus)] as HTMLElement[];
	};

	/**
	 * setFocusOnFirstElement
	 *
	 * Set focus on the first element in the current logical row.
	 *
	 * @param {HTMLElement} currentElem Reference to the current element we will move the focus from
	 *
	 * @private
	 * @memberof Chips
	 * @since 1.0.0
	 */
	private setFocusOnFirstElement = (currentElem: HTMLElement) => {
		// We make sure we are not on the first element of the logical row.
		if (!currentElem.hasClass(classes.text)) {
			// We get the current logical row.
			const logicalRow = currentElem.closest(selectors.row);

			// We get the first focusable element, in this case the chips text element.
			const textNode: HTMLElement = logicalRow.querySelector(selectors.text);

			// Set focus on it.
			textNode.focus();
		}
	};

	/**
	 * setFocusOnElem
	 *
	 * Set focus on the element with the given index.
	 *
	 * @param {number} index Index of the element
	 *
	 * @private
	 * @memberof Chips
	 * @since 1.0.0
	 */
	private setFocusOnElem = (index: number) => {
		this.focusableElements[index].focus();
	};

	/**
	 * setFocusOnLastElement
	 *
	 * Set focus on the last element in the current logical row.
	 *
	 * @param {HTMLElement} currentElem Reference to the current element we will move the focus from
	 *
	 * @private
	 * @memberof Chips
	 * @since 1.0.0
	 */
	private setFocusOnLastElement = (currentElem: HTMLElement) => {
		// We make sure we are not on the last element of the logical row.
		if (!currentElem.hasClass(classes.action)) {
			// We get the current logical row.
			const logicalRow = currentElem.closest(selectors.row);

			// We get the last focusable element, in this case the chips action element.
			const actionButton: HTMLElement = logicalRow.querySelector(selectors.action);

			// Set focus on it.
			actionButton.focus();
		}
	};

	/**
	 * getPreviousElem
	 *
	 * Move focus to the previous focusable element.
	 *
	 * @param {HTMLElement} currentElem Reference to the current element we will move the focus from
	 * @param {boolean} focusRows Move from one logical row to another instead of every focusable element
	 *
	 * @private
	 * @memberof Chips
	 * @since 1.0.0
	 */
	private getPreviousElem = (currentElem: HTMLElement, focusRows?: boolean) => {
		let index = this.focusableElements.indexOf(currentElem);

		if (focusRows) {
			if (index >= 2) {
				// Move to the previous logical row if possible.
				index = index - 2;
			} else {
				if (currentElem.matches(selectors.text)) {
					// Stop at the first text element.
					index = 0;
				} else {
					// Stop at the first action button element.
					index = 1;
				}
			}
		} else {
			if (index >= 1) {
				// Move back one element.
				index--;
			} else {
				// Stop at the beginning.
				index = 0;
			}
		}

		// We move the focus to the previous element.
		this.setFocusOnElem(index);
	};

	/**
	 * getNextElem
	 *
	 * Move focus to the next focusable element.
	 *
	 * @param {HTMLElement} currentElem Reference to the current element we will move the focus from
	 * @param {boolean} focusRows Move from one logical row to another instead of every focusable element
	 *
	 * @private
	 * @memberof Chips
	 * @since 1.0.0
	 */
	private getNextElem = (currentElem: HTMLElement, focusRows?: boolean) => {
		let index = this.focusableElements.indexOf(currentElem);

		if (focusRows) {
			if (index < this.focusableElements.length - 3) {
				// Move to the next logical row if possible.
				index = index + 2;
			} else {
				if (currentElem.matches(selectors.text)) {
					// Stop at the last text element.
					index = this.focusableElements.length - 2;
				} else {
					// Stop at the last action button element.
					index = this.focusableElements.length - 1;
				}
			}
		} else {
			if (index < this.focusableElements.length - 1) {
				// Move forward one element.
				index++;
			} else {
				// Stop at the end.
				index = this.focusableElements.length - 1;
			}
		}

		// We move the focus to the next element.
		this.setFocusOnElem(index);
	};

	/**
	 * keyboardEvents
	 *
	 * Add ARIA-compliant keyboard navigation.
	 *
	 * @param {KeyboardEvent} evt The keyboard event
	 *
	 * @private
	 * @memberof Sidebar
	 * @since 1.0.0
	 */
	private keyboardEvents = (evt: KeyboardEvent) => {
		const _this = evt.target as HTMLElement;

		switch (evt.key) {
			case 'Home':
				evt.preventDefault();
				this.setFocusOnFirstElement(_this);
				break;
			case 'End':
				evt.preventDefault();
				this.setFocusOnLastElement(_this);
				break;
			case 'ArrowUp':
				evt.preventDefault();
				this.getPreviousElem(_this, true);
				break;
			case 'ArrowLeft':
				evt.preventDefault();
				this.getPreviousElem(_this);
				break;
			case 'ArrowDown':
				evt.preventDefault();
				this.getNextElem(_this, true);
				break;
			case 'ArrowRight':
				evt.preventDefault();
				this.getNextElem(_this);
				break;
		}
	};

	/**
	 * addEvents
	 *
	 * Add event listeners.
	 *
	 * @private
	 * @memberof Chips
	 */
	private addEvents = () => {
		this.container.addEventListener('keydown', this.keyboardEvents);

		if (this.input) {
			// Add input event listeners to provide proper styling to the chips container element.
			this.input.addEventListener('focus', () => this.container.addClass(classes.active));
			this.input.addEventListener('blur', () => this.container.removeClass(classes.active));
		}
	};
}
