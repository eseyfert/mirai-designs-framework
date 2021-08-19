import '@miraidesigns/base';
import { hasScrollbar } from '@miraidesigns/utils';
import { attr, classes, events, selectors } from './constants';
import { MDFSelectChangedEvent } from './types';

/**
 * MDFSelect
 *
 * Alternative to native HTML <select> element.
 * Allows for keyboard navigation following ARIA guidelines.
 *
 * @export
 * @class MDFSelect
 * @version 1.0.1
 */
export class MDFSelect {
	public readonly container: HTMLElement;
	public readonly items: HTMLElement[];
	public readonly menu: HTMLElement;

	private button: HTMLButtonElement;
	private input: HTMLInputElement;
	private list: HTMLElement;
	private menuStyles: CSSStyleDeclaration;
	private active: boolean;
	private label: HTMLElement;
	private selectedItem: HTMLElement;
	private timer: number;
	private textContainer: HTMLElement;
	private typedCharacters: string[];

	/**
	 * Creates an instance of MDFSelect.
	 *
	 * @param {Element} elem The select element container
	 * @memberof MDFSelect
	 * @since 1.0.0
	 */
	constructor(elem: Element) {
		// If the supplied element doesn't exist, abort the script.
		if (!elem) return;

		// Store a reference to the given element.
		this.container = elem as HTMLElement;

		// Get the anchor element that calls the select menu.
		this.button = this.container.querySelector(selectors.button);

		// Get the select label element.
		this.label = this.button.querySelector(selectors.label);

		// Get the text element we will update with the user's choice.
		this.textContainer = this.button.querySelector(selectors.text);

		// Get the select menu element.
		this.menu = this.container.querySelector(selectors.menu);

		// Get the list element holding the select options.
		this.list = this.container.querySelector(selectors.list);

		// Create an array holding our select menu items (the options).
		this.items = Array.from(this.container.querySelectorAll(selectors.listItem));

		// Get the currently selected element, if available.
		this.selectedItem = this.container.querySelector(selectors.listItemSelected);

		// Get the hidden input we store the selected option in.
		this.input = this.container.querySelector(selectors.input);

		// Get the computed styles for our menu to use them in calculations later.
		this.menuStyles = window.getComputedStyle(this.menu);

		// We use this array to store any typeahead characters.
		this.typedCharacters = [];

		// Keep track of menu state. It's closed by default.
		this.active = false;

		// Make sure the select menu and its children are properly setup.
		this.setInitialState();

		// Add the event listeners.
		this.buttonEvents();
	}

	get text(): string {
		return this.textContainer.textContent;
	}

	set text(text: string) {
		this.textContainer.textContent = text;
	}

	get value(): string {
		return this.input.value;
	}

	set value(value: string) {
		this.input.value = value;
	}

	get disabled(): boolean {
		return this.input.disabled;
	}

	set disabled(disabled: boolean) {
		// Set input disabled state.
		this.input.disabled = disabled;
		this.container.toggleClass('disabled', disabled);
	}

	/**
	 * isActive
	 *
	 * Returns wether or not the menu is currently visible.
	 *
	 * @returns {boolean}
	 * @memberof MDFSelect
	 * @since 1.0.0
	 */
	public isActive(): boolean {
		return this.active;
	}

	/**
	 * getSelectedElem
	 *
	 * Returns the currently selected item.
	 *
	 * @returns {HTMLElement}
	 * @memberof MDFSelect
	 * @since 1.0.0
	 */
	public getSelectedElem(): HTMLElement {
		return this.selectedItem;
	}

	/**
	 * setSelectedElem
	 *
	 * Set the given element as visually selected.
	 *
	 * @param {HTMLElement} elem The element to select
	 * @memberof MDFSelect
	 * @since 1.0.0
	 */
	public setSelectedElem(elem: HTMLElement): void {
		if (elem) {
			this.selectItem(elem);
		}
	}

	/**
	 * floatLabel
	 *
	 * Floats the label, moving it above the input's text.
	 *
	 * @private
	 * @param {boolean} float Whether to float the label
	 * @memberof MDFTextfield
	 * @since 1.0.0
	 */
	private floatLabel = (float: boolean): void => {
		if (this.label) {
			this.label.toggleClass(classes.labelFloating, float);
		}
	};

	/**
	 * setInitialState
	 *
	 * Set the initial state of the select element.
	 *
	 * @private
	 * @memberof MDFSelect
	 * @since 1.0.0
	 * @version 1.0.1
	 */
	private setInitialState = () => {
		// Make sure the select button and menu both have the same width applied.
		this.button.style.width = `${this.menu.offsetWidth}px`;
		this.menu.style.width = `${this.menu.offsetWidth}px`;

		// Loop through the available list items and make sure they all required attributes.
		for (const item of this.items) {
			// We make sure that every item has an id for a11y technologies.
			if (item.id.length === 0) {
				item.id = `select-option-${item.getAttribute(attr.value)}`;
			}

			// If an item is marked as selected, let a11y technologies know.
			if (item.hasClass(classes.listItemSelected)) {
				item.setAttribute(attr.selected, 'true');
			}
		}

		// Check if an option has already been set.
		if (this.selectedItem) {
			// Update the button text.
			this.text = this.selectedItem.textContent;

			// Update the hidden input value.
			this.input.value = this.selectedItem.getAttribute(attr.value);
		}

		if (this.text.length) {
			// Move the label out of the way.
			this.floatLabel(true);
		}
	};

	/**
	 * selectItem
	 *
	 * Select a given item and update all necessary attributes.
	 *
	 * @private
	 * @param {HTMLElement} item The item to select
	 * @memberof MDFSelect
	 * @since 1.0.0
	 */
	private selectItem = (item: HTMLElement) => {
		// Deselect the previous item before we continue.
		for (const item of this.items) {
			item.removeClass(classes.listItemSelected);
			item.removeAttribute(attr.selected);
		}

		// Update the selected item reference.
		this.selectedItem = item;

		// Set focus to the item visually.
		this.selectedItem.addClass(classes.listItemSelected);

		// Set the `aria-selected` attribute on the item.
		this.selectedItem.setAttribute(attr.selected, 'true');

		// Let a11y technologies know which item is currently visually selected.
		this.list.setAttribute(attr.active, this.selectedItem.id);

		// Check if the menu has a scrollbar.
		if (hasScrollbar(this.menu)) {
			// Get the menu's height, top padding and current scroll bar position.
			const menuHeight = this.menu.clientHeight - parseFloat(this.menuStyles.paddingTop);
			const menuTopPadding = parseFloat(this.menuStyles.paddingTop);
			const menuScrollTop = this.menu.scrollTop;

			// Get the selected item's relative top position and its height.
			const itemPosTop = item.offsetTop;
			const itemHeight = item.offsetHeight;

			// We check if we either need to scroll up or down to move the selected item into view.
			if (itemPosTop + itemHeight > menuHeight + menuScrollTop) {
				// Item is underneath the current visible overflow, scroll down.
				this.menu.scrollTop = itemPosTop + itemHeight - menuHeight;
			} else if (itemPosTop < menuScrollTop) {
				// Item is above the current visible overflow, scroll up.
				this.menu.scrollTop = itemPosTop - menuTopPadding;
			}
		}
	};

	/**
	 * selectPreviousItem
	 *
	 * Move the selection to the previous item in the list.
	 *
	 * @private
	 * @memberof MDFSelect
	 * @since 1.0.0
	 */
	private selectPreviousItem = () => {
		// We won't allow the index to go below this value.
		const threshold = 0;

		// Get the index of the currently selected item.
		let index = this.items.indexOf(this.selectedItem);

		// If we are not on the first item, subtract from the index value.
		if (index > threshold) {
			index--;
		}

		// Make sure our index can't reach below 0 (the first item in our array).
		if (index <= threshold) {
			index = threshold;
		}

		// Change the selected item with our new index.
		this.selectItem(this.items[index]);
	};

	/**
	 * selectNextItem
	 *
	 * Move the selection to the next item in the list.
	 *
	 * @private
	 * @memberof MDFSelect
	 * @since 1.0.0
	 */
	private selectNextItem = () => {
		// We won't allow the index to exceed this value.
		const threshold = this.items.length - 1;

		// Get the index of the currently selected item.
		let index = this.items.indexOf(this.selectedItem);

		// If we are not on the last item, add to the index value.
		if (index < threshold) {
			index++;
		}

		// Make sure our index can't reach below 0 (the first item in our array).
		if (index >= threshold) {
			index = threshold;
		}

		// Change the selected item with our new index.
		this.selectItem(this.items[index]);
	};

	/**
	 * openMenu
	 *
	 * Open the select menu and set focus to the options list.
	 *
	 * @private
	 * @memberof MDFSelect
	 * @since 1.0.0
	 */
	private openMenu = () => {
		// Move the label above the input.
		this.floatLabel(true);

		// Indicate that the menu is expanded for a11y technologies.
		this.button.setAttribute(attr.expanded, 'true');

		// Show the menu.
		this.menu.addClass(classes.menuActive);

		// Set focus to the list.
		this.list.focus();

		// Select the required
		if (this.selectedItem) {
			// If an item is pre-selected, focus on it.
			this.selectItem(this.selectedItem);
		} else {
			// Otherwise focus on the first available option.
			this.selectItem(this.items[0]);
		}

		// Add the events for your select menu.
		this.addEvents();

		// Dispatch event letting the user know the menu is open.
		this.menu.dispatchEvent(new Event(events.opened, { bubbles: true }));
	};

	/**
	 * closeMenu
	 *
	 * Close the select menu and update the necessary attributes.
	 *
	 * @private
	 * @memberof MDFSelect
	 * @since 1.0.0
	 */
	private closeMenu = (focus?: boolean) => {
		// Remove the `aria-activedescendant` attribute from the list.
		this.list.removeAttribute(attr.active);

		// Close the menu.
		this.menu.removeClass(classes.menuActive);

		// Let a11y technologies know the menu is no longer accessible.
		this.button.removeAttribute(attr.expanded);

		// If no option was picked, un-float the label.
		if (!this.text.length) {
			this.floatLabel(false);
		}

		if (focus) {
			setTimeout(() => {
				// Move the focus back to the select button.
				this.button.focus();
			}, 10);
		}

		// Remove the event listeners attached to the select menu.
		this.removeEvents();

		// Dispatch event letting the user know the menu is closed.
		this.menu.dispatchEvent(new Event(events.closed, { bubbles: true }));
	};

	/**
	 * menuEvents
	 *
	 * Handle the menu interactions.
	 *
	 * @private
	 * @memberof MDFSelect
	 * @since 1.0.0
	 */
	private menuEvents = (evt: MouseEvent) => {
		// Get the clicked element.
		const _this = evt.target as HTMLElement;

		// Make sure we are interacting with a list item.
		if (_this.matches(selectors.listItem)) {
			// Update the selected item.
			this.selectItem(_this);

			// Change the button text.
			this.text = _this.textContent;

			// Update the hidden input value.
			this.input.value = _this.getAttribute(attr.value);

			// Close the menu.
			this.closeMenu();

			// Dispatch event whenever the selected item changes.
			this.list.dispatchEvent(
				new CustomEvent<MDFSelectChangedEvent>(events.changed, {
					bubbles: true,
					detail: {
						item: this.selectedItem,
						text: this.selectedItem.textContent,
						value: this.selectedItem.getAttribute(attr.value),
					},
				})
			);
		}
	};

	/**
	 * clickEvents
	 *
	 * Setup the mouse `click` events to our select elements.
	 *
	 * @private
	 * @memberof MDFSelect
	 * @since 1.0.0
	 */
	private buttonEvents = () => {
		this.button.addEventListener('click', () => {
			// Show the select menu holding our options.
			this.openMenu();
		});
	};

	/**
	 * closeMenuOnClick
	 *
	 * Close the menu if a click is registered outside of it.
	 *
	 * @private
	 * @memberof MDFSelect
	 * @since 1.0.0
	 */
	private closeMenuOnClick = (evt: MouseEvent) => {
		// Get the currently clicked item.
		const _this = evt.target as HTMLElement;

		// Close the menu if any click is registered outside of it.
		if (_this !== this.button && !this.menu.contains(_this)) {
			// Indicate that the menu is closed for a11y technologies.
			this.button.removeAttribute(attr.expanded);

			// Close the menu.
			this.closeMenu();
		}
	};

	/**
	 * keyboardEvents
	 *
	 * Make sure the select menu has all a11y required keyboard controls.
	 *
	 * @private
	 * @memberof MDFSelect
	 * @since 1.0.0
	 */
	private keyboardEvents = (evt: KeyboardEvent) => {
		if (this.menu.hasClass(classes.menuActive)) {
			switch (evt.key) {
				case 'Escape':
					this.closeMenu(true);
					break;
				case 'ArrowUp':
					evt.preventDefault();

					this.selectPreviousItem();
					break;
				case 'Home':
					evt.preventDefault();

					// Jump to the first item in the list.
					this.selectItem(this.items[0]);
					break;
				case 'ArrowDown':
					evt.preventDefault();

					this.selectNextItem();
					break;
				case 'End':
					evt.preventDefault();

					// Jump to the last item in the list.
					this.selectItem(this.items[this.items.length - 1]);
					break;
				case 'Enter':
					// Change the button text.
					this.text = this.selectedItem.textContent;

					// Update the hidden input value.
					this.input.value = this.selectedItem.getAttribute(attr.value);

					// Close the menu.
					this.closeMenu(true);

					// Dispatch event whenever the selected item changes.
					this.list.dispatchEvent(
						new CustomEvent<MDFSelectChangedEvent>(events.changed, {
							bubbles: true,
							detail: {
								item: this.selectedItem,
								text: this.selectedItem.textContent,
								value: this.selectedItem.getAttribute(attr.value),
							},
						})
					);
					break;
			}

			// If the list loses focus, close the menu.
			if (evt.key === 'Tab' || (evt.shiftKey && evt.key === 'Tab')) {
				this.closeMenu(true);
			}
		}
	};

	/**
	 * keyboardTypeAhead
	 *
	 * Typeahead feature allows to search the list by typing characters in rapid succession.
	 *
	 * @private
	 * @memberof MDFSelect
	 * @since 1.0.0
	 */
	private keyboardTypeAhead = (evt: KeyboardEvent) => {
		// Make sure we only use alphanumeric keys for the function.
		if (/^[a-z0-9 ]$/i.test(evt.key)) {
			// The timer resets as soon as another character is hit on the keyboard.
			clearTimeout(this.timer);

			// Every typed character gets added to our array.
			this.typedCharacters.push(evt.key);

			this.timer = setTimeout(() => {
				// Combine all searched characters into a single word.
				const searchValue = this.typedCharacters.join('');

				// Search through all available list items and see if the search matches any.
				const results = this.items.filter((el) => {
					return el.textContent.toUpperCase().includes(searchValue.toUpperCase());
				});

				// If any results exist, grab the first one and select it from the list.
				if (results[0]) {
					this.selectItem(results[0]);
				}

				// Reset the characters for the next timer.
				this.typedCharacters = [];
			}, 500);
		}
	};

	/**
	 * addEvents
	 *
	 * Add the event listeners.
	 *
	 * @private
	 * @memberof MDFSelect
	 * @since 1.0.0
	 */
	private addEvents = () => {
		this.container.addEventListener('click', this.menuEvents);
		document.addEventListener('click', this.closeMenuOnClick);
		document.addEventListener('keydown', this.keyboardEvents);
		document.addEventListener('keyup', this.keyboardTypeAhead);
	};

	/**
	 * removeEvents
	 *
	 * Remove the event listeners.
	 *
	 * @private
	 * @memberof MDFSelect
	 * @since 1.0.0
	 */
	private removeEvents = () => {
		this.container.removeEventListener('click', this.menuEvents);
		document.removeEventListener('click', this.closeMenuOnClick);
		document.removeEventListener('keydown', this.keyboardEvents);
		document.removeEventListener('keyup', this.keyboardTypeAhead);
	};
}
