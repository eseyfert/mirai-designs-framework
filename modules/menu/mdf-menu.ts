import '@miraidesigns/base';
import { getScrollbarParent } from '@miraidesigns/utils';
import { attr, classes, events, selectors } from './constants';
import { MDFMenuOptions, MDFMenuActivatedEvent } from './types';

/**
 * MDFMenu
 *
 * Menus display a list of choices or options to the user.
 *
 * @export
 * @class MDFMenu
 * @version 1.0.0
 */
export class MDFMenu {
	public readonly anchor: HTMLElement;
	public readonly items: HTMLElement[];
	public readonly menu: HTMLElement;
	public readonly options: MDFMenuOptions;

	private anchorRect: ClientRect;
	private defaults: MDFMenuOptions;
	private index: number;
	private list: HTMLElement;
	private menus: NodeListOf<HTMLElement>;
	private menuRect: ClientRect;
	private useKeyboard: boolean;

	/**
	 * Creates an instance of MDFMenu.
	 *
	 * @param {Element} menu The menu element we are manipulating
	 * @param {MDFMenuOptions} [options] Object holding user options
	 *
	 * @memberof MDFMenu
	 * @since 1.0.0
	 */
	constructor(menu: Element, options: MDFMenuOptions) {
		// If the supplied element doesn't exist, abort the script.
		if (!menu) return;

		// Store a reference to the given element.
		this.menu = menu as HTMLElement;

		// Default values for user options.
		this.defaults = {
			anchor: null,
			posX: 'center',
			posY: 'bottom',
			origin: 'top center',
			callbacks: {},
			onOpen: null,
			onClose: null,
			hideOnClick: true,
		};

		// Merge defaults and user options.
		this.options = Object.assign({}, this.defaults, options);

		// Get the element we will anchor the menu to.
		this.anchor = this.options.anchor as HTMLElement;

		// Cancel script if we cant find the anchor element.
		if (!this.anchor) return;

		// Get the list element.
		this.list = this.menu.querySelector(selectors.list);

		// Get a list of all menus.
		this.menus = document.querySelectorAll(selectors.menu);

		// Get a list of the menu items.
		this.items = Array.from(this.menu.querySelectorAll(selectors.item));

		// We store ClientRect information about the menu ahead of time because it doesn't change.
		this.menuRect = this.menu.getBoundingClientRect();

		// The index always starts at 0 (the first menu item).
		this.index = 0;

		// We start with the expectation that users will interact with the menu using clicks.
		this.useKeyboard = false;

		// Add event listeners to the anchor element.
		this.anchorEvents();
	}

	/**
	 * isActive
	 *
	 * Wether or not the menu is visible.
	 *
	 * @public
	 * @memberof MDFMenu
	 * @since 1.0.0
	 */
	public isActive = (): boolean => {
		return this.menu.hasClass(classes.active);
	};

	/**
	 * setFocusOnFirstItem
	 *
	 * Set focus on the first menu item.
	 *
	 * @private
	 * @memberof MDFMenu
	 * @since 1.0.0
	 */
	private setFocusOnFirstItem = () => {
		// Grab the first item from the item list.
		const firstItem = this.items[0];

		// Make sure to set the `tabIndex` to `0` before we set the focus.
		firstItem.tabIndex = 0;
		firstItem.focus();
	};

	/**
	 * setFocusOnItem
	 *
	 * Set focus on the specified menu item.
	 *
	 * @param {number} index The item's index
	 *
	 * @private
	 * @memberof MDFMenu
	 * @version 1.0.0
	 */
	private setFocusOnItem = (index: number) => {
		// We get the last item that is currently in focus.
		const lastActiveItem = document.activeElement as HTMLElement;

		// We set the `tabIndex` to `-1` to remove it from the tab flow.
		lastActiveItem.tabIndex = -1;

		// We get the new item we need to focus on.
		const item = this.items[index];

		// We change the `tabindex` to `0` and set the focus.
		item.tabIndex = 0;
		item.focus();
	};

	/**
	 * setFocusOnAnchor
	 *
	 * Set focus on the anchor that called the menu.
	 *
	 * @private
	 * @memberof MDFMenu
	 * @since 1.0.0
	 */
	private setFocusOnAnchor = () => {
		// We get the last item that is currently in focus.
		const lastActiveItem = document.activeElement as HTMLElement;

		// We set the `tabIndex` to `-1` to remove it from the tab flow.
		lastActiveItem.tabIndex = -1;

		// We set the focus on the anchor.
		this.anchor.focus();
	};

	/**
	 * prevItem
	 *
	 * We move the focus to the previous item in the menu.
	 *
	 * @private
	 * @memberof MDFMenu
	 */
	private prevItem = () => {
		if (this.index >= 1) {
			// Move to the previous item.
			this.index--;
		} else if (this.index === 0) {
			// If we are on the first item, wrap back around to the last item.
			this.index = this.items.length - 1;
		}

		// We move the focus to the previous item.
		this.setFocusOnItem(this.index);
	};

	/**
	 * nextItem
	 *
	 * We move the focus to the next item in the menu.
	 *
	 * @private
	 * @memberof MDFMenu
	 */
	private nextItem = () => {
		if (this.index === this.items.length - 1) {
			// If we are on the last item, wrap back around to the first item.
			this.index = 0;
		} else if (this.index >= 0) {
			// Move to the next item.
			this.index++;
		}

		// We move the focus to the next item.
		this.setFocusOnItem(this.index);
	};

	/**
	 * openMenu
	 *
	 * Position the menu relative to the anchor and fade it in.
	 *
	 * @param {boolean} setFocus Wether or not we set focus on the first menu item
	 *
	 * @public
	 * @memberof MDFMenu
	 * @since 1.0.0
	 */
	public openMenu = (setFocus?: boolean): void => {
		// Hide any other open menu before we continue.
		for (const menu of this.menus) {
			menu.removeClass(classes.active);
		}

		// We get ClientRect information about the anchor whenever we open the menu to always have the right position.
		this.anchorRect = this.anchor.getBoundingClientRect();

		// We get the viewport width and height to make sure the menu won't be cut off.
		const docHeight = window.innerHeight;
		const docWidth = window.innerWidth;

		// We use these delta values to alter the menu's position.
		let topDelta: number;
		let leftDelta: number;

		// We store the desired position of the menu and offer an alternative in case it would be cut off.
		let desiredPos: number;
		let alternativePos: number;

		// We use these values to check if the menu would be cut off at any side.
		const isCutOff = {
			top: this.anchorRect.top - this.menuRect.height < 0 ? true : false,
			right: this.anchorRect.left + this.menuRect.width > docWidth ? true : false,
			bottom: this.anchorRect.top + this.anchorRect.height + this.menuRect.height > docHeight ? true : false,
			left: this.anchorRect.left - this.menuRect.width < 0 ? true : false,
		};

		// Set delta values for the X-axis (horizontal).
		switch (this.options.posX) {
			case 'left':
				desiredPos = this.anchorRect.left - this.menuRect.width;
				alternativePos = this.anchorRect.left;

				leftDelta = isCutOff.left ? alternativePos : desiredPos;
				break;
			case 'center':
				desiredPos = this.anchorRect.left + this.anchorRect.width / 2 - this.menuRect.width / 2;

				leftDelta = desiredPos;
				break;
			case 'right':
				desiredPos = this.anchorRect.left + this.anchorRect.width;
				alternativePos = this.anchorRect.left - this.menuRect.width;

				leftDelta = isCutOff.right ? alternativePos : desiredPos;
				break;
		}

		// Set delta values for the Y-axis (vertical).
		switch (this.options.posY) {
			case 'top':
				desiredPos = this.anchorRect.top - this.menuRect.height;
				alternativePos = this.anchorRect.top + this.anchorRect.height;

				topDelta = isCutOff.top ? alternativePos : desiredPos;
				break;
			case 'center':
				desiredPos = this.anchorRect.top + this.anchorRect.height / 2 - this.menuRect.height / 2;

				topDelta = desiredPos;
				break;
			case 'bottom':
				desiredPos = this.anchorRect.top + this.anchorRect.height;
				alternativePos = this.anchorRect.top - this.menuRect.height;

				topDelta = isCutOff.bottom ? alternativePos : desiredPos;
				break;
		}

		// We disable the transitions while we prepare the position and scale of the menu.
		this.menu.addClass(classes.transitions);
		this.menu.style.top = `${topDelta}px`;
		this.menu.style.left = `${leftDelta}px`;
		this.menu.style.transform = 'scale(0.5)';
		this.menu.style.transformOrigin = this.options.origin;

		// Force repaint, otherwise the transform will not work properly.
		this.menu.getBoundingClientRect();

		// Enable transitions again.
		this.menu.removeClass(classes.transitions);

		// Show the menu.
		this.menu.addClass(classes.active);

		// We list assistive technologies know that the menu is open.
		this.anchor.setAttribute(attr.expanded, 'true');
		this.list.removeAttribute(attr.hidden);

		// Once the menu starts fading-in, all we do is change the scale back to `1` for a smooth effect.
		this.menu.style.transform = `scale(1)`;

		// If available, execute the callback function when opening the menu.
		if (this.options.onOpen) {
			this.options.onOpen();
		}

		// We move the focus onto the first menu item for keyboard users.
		if (setFocus) {
			this.setFocusOnFirstItem();
		}

		// Add ARIA compliant keyboard controls to the menu.
		if (this.useKeyboard) {
			this.addKeyboardEvents();
		}

		// Add the menu events.
		this.addMenuEvents();

		// Dispatch event letting user know the menu is open.
		this.menu.dispatchEvent(new Event(events.opened));
	};

	/**
	 * closeMenu
	 *
	 * Fade-out the menu and remove any keyboard events we attached.
	 *
	 * @param {boolean} setFocus Wether or not we move the focus back to the anchor
	 *
	 * @public
	 * @memberof MDFMenu
	 * @since 1.0.0
	 */
	public closeMenu = (setFocus?: boolean): void => {
		// Fade-out the menu.
		this.menu.removeClass(classes.active);

		// We list assistive technologies know that the menu is closed.
		this.anchor.removeAttribute(attr.expanded);
		this.list.setAttribute(attr.hidden, 'true');

		// If available, execute the callback function when closing the menu.
		if (this.options.onClose) {
			this.options.onClose();
		}

		// Remove the menu events.
		this.removeMenuEvents();

		if (this.useKeyboard) {
			// We remove the event listeners for keyboard controls.
			this.removeKeyboardEvents();

			if (setFocus) {
				// We move the focus back to the anchor that opened the menu.
				this.setFocusOnAnchor();
			}
		}

		// Dispatch event letting user know the menu is closed.
		this.menu.dispatchEvent(new Event(events.closed));
	};

	/**
	 * closeMenuOnClick
	 *
	 * Close the menu when a click is registered outside of it.
	 *
	 * @param {Event} evt The event listener reference
	 *
	 * @private
	 * @memberof MDFMenu
	 */
	private closeMenuOnClick = (evt: Event) => {
		const _this = evt.target as HTMLElement;

		// We close the menu if the clicked element is neither the anchor, menu or anything inside of it.
		if (_this !== this.anchor && !this.menu.contains(_this)) {
			this.closeMenu();
		}
	};

	/**
	 * anchorEvents
	 *
	 * Add event listeners to the anchor element.
	 *
	 * @private
	 * @memberof MDFMenu
	 * @since 1.0.0
	 */
	private anchorEvents = () => {
		// If the anchor is activated by click, we simply open the menu.
		this.anchor.addEventListener('click', () => this.openMenu());

		// If the anchor is activated by keypress, we open the menu and add keyboard events.
		this.anchor.addEventListener('keydown', (evt: KeyboardEvent) => {
			if (evt.key === 'Enter' || evt.key === ' ') {
				// Prevent default behavior, stops the keypress from emulating a click.
				evt.preventDefault();

				// Enable keyboard controls.
				this.useKeyboard = true;

				// We open the menu and additionally set focus on the first item.
				this.openMenu(true);
			}
		});
	};

	/**
	 * menuEvents
	 *
	 * Run the callback associated with the menu item when it is activated by click.
	 *
	 * @private
	 * @memberof MDFMenu
	 * @since 1.0.0
	 */
	private menuEvents = (evt: Event) => {
		// Stop the event from bubbling up.
		evt.stopPropagation();

		// The clicked element.
		const _this = evt.target as HTMLElement;

		// We make sure it is a menu item.
		if (_this.getAttribute(attr.role) === 'menuitem') {
			// Get the name of the callback attached to the item.
			const callbackName = _this.getAttribute(attr.callback);

			// Save a reference to the callback.
			const callback = this.options.callbacks[callbackName];

			// If available, execute it.
			if (callback) {
				callback();
			}

			// Dispatch event letting user know the a menu item has been activated.
			this.menu.dispatchEvent(
				new CustomEvent<MDFMenuActivatedEvent>(events.activated, {
					detail: {
						callback: callbackName,
						index: this.index,
						item: _this,
					},
				})
			);

			// Close the menu.
			this.closeMenu();
		}
	};

	/**
	 * addMenuEvents
	 *
	 * Add the menu item events.
	 * We call for this when we open the menu.
	 *
	 * @private
	 * @memberof MDFMenu
	 * @since 1.0.0
	 */
	private addMenuEvents = () => {
		this.menu.addEventListener('click', this.menuEvents);

		if (this.options.hideOnClick) {
			document.addEventListener('click', this.closeMenuOnClick);
		}
	};

	/**
	 * removeMenuEvents
	 *
	 * Remove the menu item events.
	 * We call for this when we close the menu.
	 *
	 * @private
	 * @memberof MDFMenu
	 * @since 1.0.0
	 */
	private removeMenuEvents = () => {
		this.menu.removeEventListener('click', this.menuEvents);

		if (this.options.hideOnClick) {
			document.removeEventListener('click', this.closeMenuOnClick);
		}
	};

	/**
	 * keyboardNavigation
	 *
	 * ARIA compliant menu navigation controls.
	 *
	 * @private
	 * @memberof MDFMenu
	 * @since 1.0.0
	 */
	private keyboardNavigation = (evt: KeyboardEvent) => {
		if ((evt.shiftKey && evt.key === 'Tab') || evt.key === 'ArrowUp') {
			// Prevent default keypress behavior.
			evt.preventDefault();

			// We use [Shift] + [Tab] OR the [↑] key to move to the previous item.
			this.prevItem();
		} else if (evt.key === 'Tab' || evt.key === 'ArrowDown') {
			// Prevent default keypress behavior.
			evt.preventDefault();

			// We use [Tab] OR the [↓] key to move to the next item.
			this.nextItem();
		} else if (evt.key === 'Escape') {
			// Close the menu using the [ESC] key.
			this.closeMenu(true);
		}
	};

	/**
	 * keyboardMenuEvents
	 *
	 * Run the callback associated with the menu item when it is activated by keyboard input.
	 *
	 * @private
	 * @memberof MDFMenu
	 * @since 1.0.0
	 */
	private keyboardMenuEvents = (evt: KeyboardEvent) => {
		// The current active element.
		const _this = evt.target as HTMLElement;

		// We use [Enter] or [Space bar] to activate the item.
		if (evt.key === 'Enter' || evt.key === ' ') {
			// We prevent default key behavior.
			evt.preventDefault();

			// We make sure it is a menu item.
			if (_this.getAttribute(attr.role) === 'menuitem') {
				// And that it is not disabled.
				if (!_this.hasClass(classes.disabled)) {
					// Stop the event from bubbling up.
					evt.stopPropagation();

					// Get the name of the callback attached to the item.
					const callbackName = _this.getAttribute(attr.callback);

					// Save a reference to the callback.
					const callback = this.options.callbacks[callbackName];

					// If available, execute it.
					if (callback) {
						callback();
					}

					// Close the menu.
					this.closeMenu();
				}
			}
		}
	};

	/**
	 * addKeyboardEvents
	 *
	 * Add event listeners to the menu to allow for keyboard controls.
	 * We call for this when we open the menu.
	 *
	 * @private
	 * @memberof MDFMenu
	 * @since 1.0.0
	 */
	private addKeyboardEvents = () => {
		this.menu.addEventListener('keydown', this.keyboardNavigation);
		this.menu.addEventListener('keydown', this.keyboardMenuEvents);
	};

	/**
	 * removeKeyboardEvents
	 *
	 * Remove the event listeners to stop the menu from intercepting any keyboard inputs.
	 * We call for this when we close the menu.
	 *
	 * @private
	 * @memberof MDFMenu
	 * @since 1.0.0
	 */
	private removeKeyboardEvents = () => {
		this.menu.removeEventListener('keydown', this.keyboardNavigation);
		this.menu.removeEventListener('keydown', this.keyboardMenuEvents);
	};
}

/**
 * QuickMenu
 *
 * @export
 * @class QuickMenu
 * @version 1.0.0
 */
export class QuickMenu {
	private containers: NodeListOf<HTMLElement>;
	private menus: NodeListOf<HTMLElement>;
	private activeContainer: HTMLElement;
	private activeAnchor: HTMLElement;
	private activeMenu: HTMLElement;
	private activeList: HTMLElement;
	private activeItems: NodeListOf<HTMLElement>;
	private menuRect: ClientRect;
	private index: number;
	private useKeyboard: boolean;

	/**
	 * Creates an instance of QuickMenu.
	 *
	 * @memberof QuickMenu
	 * @version 1.0.0
	 */
	constructor() {
		// Get a list of all quick menus containers.
		this.containers = document.querySelectorAll(selectors.quickContainer);

		// Cancel script if we cant find any.
		if (!this.containers) return;

		// Get a list of all menus.
		this.menus = document.querySelectorAll(selectors.quickMenu);

		// The index always starts at 0 (the first menu item).
		this.index = 0;

		// We start with the expectation that users will interact with the menu using clicks.
		this.useKeyboard = false;

		// Add the anchor events.
		this.anchorEvents();
	}

	/**
	 * setFocusOnAnchor
	 *
	 * Set focus on the anchor that called the menu.
	 *
	 * @private
	 * @memberof QuickMenu
	 * @since 1.0.0
	 */
	private setFocusOnAnchor = () => {
		// We get the last item that is currently in focus.
		const lastActiveItem = document.activeElement as HTMLElement;

		// We set the `tabIndex` to `-1` to remove it from the tab flow.
		lastActiveItem.tabIndex = -1;

		// We set the focus on the anchor.
		this.activeAnchor.focus();
	};

	/**
	 * setFocusOnFirstItem
	 *
	 * Set focus on the first menu item.
	 *
	 * @private
	 * @memberof QuickMenu
	 * @since 1.0.0
	 */
	private setFocusOnFirstItem = () => {
		// Grab the first item from the item list.
		const firstItem = this.activeItems[0];

		// Make sure to set the `tabIndex` to `0` before we set the focus.
		firstItem.tabIndex = 0;
		firstItem.focus();
	};

	/**
	 * setFocusOnItem
	 *
	 * Set focus on the specified menu item.
	 *
	 * @param {number} index The item's index
	 *
	 * @private
	 * @memberof QuickMenu
	 * @since 1.0.0
	 */
	private setFocusOnItem = (index: number) => {
		// We get the last item that is currently in focus.
		const lastActiveItem = document.activeElement as HTMLElement;

		// We set the `tabIndex` to `-1` to remove it from the tab flow.
		lastActiveItem.tabIndex = -1;

		// We get the new item we need to focus on.
		const item = this.activeItems[index];

		// We change the `tabindex` to `0` and set the focus.
		item.tabIndex = 0;
		item.focus();
	};

	/**
	 * prevItem
	 *
	 * We move the focus to the previous item in the menu.
	 *
	 * @private
	 * @memberof QuickMenu
	 * @since 1.0.0
	 */
	private prevItem = () => {
		if (this.index >= 1) {
			// Move to the previous item.
			this.index--;
		} else if (this.index === 0) {
			// If we are on the first item, wrap back around to the last item.
			this.index = this.activeItems.length - 1;
		}

		// We move the focus to the previous item.
		this.setFocusOnItem(this.index);
	};

	/**
	 * nextItem
	 *
	 * We move the focus to the next item in the menu.
	 *
	 * @private
	 * @memberof QuickMenu
	 * @since 1.0.0
	 */
	private nextItem = () => {
		if (this.index === this.activeItems.length - 1) {
			// If we are on the last item, wrap back around to the first item.
			this.index = 0;
		} else if (this.index >= 0) {
			// Move to the next item.
			this.index++;
		}

		// We move the focus to the next item.
		this.setFocusOnItem(this.index);
	};

	/**
	 * openMenu
	 *
	 * Fade in the menu.
	 *
	 * @param {boolean} setFocus Wether or not we set focus on the first menu item
	 *
	 * @private
	 * @memberof QuickMenu
	 * @since 1.0.0
	 */
	private openMenu = (setFocus?: boolean) => {
		// Hide any other open menu before we continue.
		for (const menu of this.menus) {
			menu.removeClass(classes.active);
		}

		// Get ClientRect box information about the active menu.
		this.menuRect = this.activeMenu.getBoundingClientRect();

		// Get the next closest parent that has a scrollbar.
		const overflowParent = getScrollbarParent(this.activeMenu);

		// Scroll the menu into view.
		overflowParent.scrollTo({
			left: 0,
			top: overflowParent.scrollTop + this.menuRect.height * 2,
			behavior: 'smooth',
		});

		// Fade-in the menu.
		this.activeMenu.addClass(classes.active);

		// We list assistive technologies know that the menu is open.
		this.activeAnchor.setAttribute(attr.expanded, 'true');
		this.activeList.removeAttribute(attr.hidden);

		// Add click events.
		this.addClickEvents();

		if (setFocus) {
			// Set the focus on the first menu item.
			this.setFocusOnFirstItem();
		}

		if (this.useKeyboard) {
			// Add keyboard events.
			this.addKeyboardEvents();
		}
	};

	/**
	 * closeMenu
	 *
	 * Fade-out the menu and remove any keyboard events we attached.
	 *
	 * @param {boolean} setFocus Wether or not we move the focus back to the anchor
	 *
	 * @private
	 * @memberof QuickMenu
	 * @since 1.0.0
	 */
	private closeMenu = (setFocus?: boolean) => {
		// Fade-out the menu.
		this.activeMenu.removeClass(classes.active);

		// We list assistive technologies know that the menu is closed.
		this.activeAnchor.removeAttribute(attr.expanded);
		this.activeList.setAttribute(attr.hidden, 'true');

		// Remove the click events.
		this.removeClickEvents();

		if (setFocus) {
			// We move the focus back to the anchor that opened the menu.
			this.setFocusOnAnchor();
		}

		if (this.useKeyboard) {
			// Remove the keyboard events.
			this.removeKeyboardEvents();
		}
	};

	/**
	 * anchorEvents
	 *
	 * We use event delegation on the DOM to see if an anchor was activated.
	 *
	 * @private
	 * @memberof QuickMenu
	 * @since 1.0.0
	 */
	private anchorEvents = () => {
		// We use a click event to activate the quick menu.
		document.addEventListener('click', (evt: Event) => {
			// Get the clicked element.
			const _this = evt.target as HTMLElement;

			// Make sure we clicked a quick menu anchor.
			if (_this.matches(selectors.quickAnchor)) {
				// Save references to all associated elements.
				this.activeAnchor = _this;
				this.activeContainer = this.activeAnchor.parentElement;
				this.activeMenu = this.activeContainer.querySelector(selectors.menu);
				this.activeList = this.activeMenu.querySelector(selectors.list);
				this.activeItems = this.activeList.querySelectorAll(selectors.item);

				// Open the menu.
				this.openMenu();
			}
		});

		// We use a keyboard input to activate the quick menu.
		document.addEventListener('keydown', (evt: KeyboardEvent) => {
			if (evt.key === 'Enter' || evt.key === ' ') {
				// Get the keypress target.
				const _this = evt.target as HTMLElement;

				// Make sure we activated a quick menu anchor.
				if (_this.matches(selectors.quickAnchor)) {
					// Prevent default keypress action.
					evt.preventDefault();

					// Save references to all associated elements.
					this.activeAnchor = _this;
					this.activeContainer = this.activeAnchor.parentElement;
					this.activeMenu = this.activeContainer.querySelector(selectors.menu);
					this.activeList = this.activeMenu.querySelector(selectors.list);
					this.activeItems = this.activeList.querySelectorAll(selectors.item);

					// Enable keyboard controls.
					this.useKeyboard = true;

					// Open the menu.
					this.openMenu(true);
				}
			}
		});
	};

	/**
	 * menuClickEvents
	 *
	 * We use event delegation on the DOM to hide the active menu if a click outside of it is registered.
	 *
	 * @private
	 * @memberof QuickMenu
	 * @since 1.0.0
	 */
	private menuClickEvents = (evt: Event) => {
		// The clicked element.
		const _this = evt.target as HTMLElement;

		// We close the menu if the clicked element is neither the anchor, menu or anything inside of it.
		if (_this !== this.activeAnchor && !this.activeMenu.contains(_this)) {
			this.closeMenu();
		}
	};

	/**
	 * addClickEvents
	 *
	 * Add the menu click events.
	 * We call for this when we open the menu.
	 *
	 * @private
	 * @memberof QuickMenu
	 * @since 1.0.0
	 */
	private addClickEvents = () => {
		document.addEventListener('click', this.menuClickEvents);
	};

	/**
	 * removeClickEvents
	 *
	 * Remove the menu click events.
	 * We call for this when we close the menu.
	 *
	 * @private
	 * @memberof QuickMenu
	 * @since 1.0.0
	 */
	private removeClickEvents = () => {
		document.removeEventListener('click', this.menuClickEvents);
	};

	/**
	 * keyboardNavigation
	 *
	 * ARIA compliant menu navigation controls.
	 *
	 * @private
	 * @memberof QuickMenu
	 * @since 1.0.0
	 */
	private keyboardNavigation = (evt: KeyboardEvent) => {
		if ((evt.shiftKey && evt.key === 'Tab') || evt.key === 'ArrowUp') {
			// Prevent default key behavior.
			evt.preventDefault();

			// We use [Shift] + [Tab] OR the [↑] key to move to the previous item.
			this.prevItem();
		} else if (evt.key === 'Tab' || evt.key === 'ArrowDown') {
			// Prevent default keys behavior.
			evt.preventDefault();

			// We use [Tab] OR the [↓] key to move to the next item.
			this.nextItem();
		} else if (evt.key === 'Escape') {
			// Close the menu using the [ESC] key.
			this.closeMenu(true);
		}
	};

	/**
	 * keyboardMenuEvents
	 *
	 * Follow the link nested in the menu item by activating it through keyboard input.
	 *
	 * @private
	 * @memberof QuickMenu
	 * @since 1.0.0
	 */
	private keyboardMenuEvents = (evt: KeyboardEvent) => {
		// Get the active element.
		const _this = evt.target as HTMLElement;

		// We use [Enter] or [Space bar] to activate the item.
		if (evt.key === 'Enter' || evt.key === ' ') {
			// We prevent default key behavior.
			evt.preventDefault();

			// We make sure it is a menu item.
			if (_this.getAttribute(attr.role) === 'menuitem') {
				// And that it is not disabled.
				if (!_this.parentElement.hasClass(classes.disabled)) {
					// We emulate a click event to activate the item.
					_this.click();
				}
			}
		}
	};

	/**
	 * addKeyboardEvents
	 *
	 * Add event listeners to the menu to allow for keyboard controls.
	 * We call for this when we open the menu.
	 *
	 * @private
	 * @memberof QuickMenu
	 * @since 1.0.0
	 */
	private addKeyboardEvents = () => {
		this.activeMenu.addEventListener('keydown', this.keyboardNavigation);
		this.activeMenu.addEventListener('keydown', this.keyboardMenuEvents);
	};

	/**
	 * removeKeyboardEvents
	 *
	 * Remove the event listeners to stop the menu from intercepting any keyboard inputs.
	 * We call for this when we close the menu.
	 *
	 * @private
	 * @memberof QuickMenu
	 * @since 1.0.0
	 */
	private removeKeyboardEvents = () => {
		this.activeMenu.removeEventListener('keydown', this.keyboardNavigation);
		this.activeMenu.removeEventListener('keydown', this.keyboardMenuEvents);
	};
}
