import '@miraidesigns/base';
import { getScrollbarParent } from '@miraidesigns/utils';
import { attr, classes, events, selectors } from './constants';
import { MDFSidebarOptions } from './types';

/**
 * MDFSidebar
 *
 * Sidebars provide site navigation and can be permanent or called on-screen.
 *
 * @export
 * @class MDFSidebar
 * @version 1.0.1
 */
export class MDFSidebar {
	public readonly anchor: HTMLElement;
	public readonly container: HTMLElement;
	public readonly content: HTMLElement;
	public readonly options: MDFSidebarOptions;
	public readonly sidebar: HTMLElement;

	private defaults: MDFSidebarOptions;
	private backdrop: HTMLElement;
	private closeButton: HTMLButtonElement;
	private focusableElements: HTMLElement[];
	private lastActiveElement: HTMLElement;
	private index: number;
	private scrollbarParent: HTMLElement;

	/**
	 * Creates an instance of MDFSidebar.
	 *
	 * @param {Element} sidebar The sidebar element we are manipulating
	 * @param {MDFSidebarOptions} [options] Object holding user options
	 *
	 * @memberof MDFSidebar
	 * @since 1.0.0
	 * @version 1.0.1
	 */
	constructor(sidebar: Element, options: MDFSidebarOptions) {
		// If the supplied element doesn't exist, abort the script.
		if (!sidebar) return;

		// Store a reference to the given element.
		this.sidebar = sidebar as HTMLElement;

		// Sidebar container element.
		this.container = this.sidebar.parentElement;

		// Don't continue if the sidebar container element does not exist.
		if (!this.container.matches(selectors.container)) return;

		// Sidebar backdrop element.
		this.backdrop = this.container.querySelector(selectors.backdrop);

		// Don't continue if the backdrop element does not exist.
		if (!this.backdrop) return;

		// Default options.
		this.defaults = {
			anchor: null,
			onOpen: null,
			onClose: null,
			hideOnClick: true,
		};

		// Options object containing user modified values.
		this.options = Object.assign({}, this.defaults, options);

		// Sidebar buttons.
		this.anchor = this.options.anchor as HTMLButtonElement;

		// Don't continue if the anchor element does not exist.
		if (!this.anchor) return;

		// Find the closest element with a scrollbar. We'll use this later.
		this.scrollbarParent = getScrollbarParent(this.anchor);

		// Sidebar content.
		this.content = this.sidebar.querySelector(selectors.content);

		// Get the `close` button element.
		this.closeButton = this.sidebar.querySelector(selectors.closeButton);

		// Get list of all focusable elements.
		this.focusableElements = Array.from(this.container.querySelectorAll(selectors.focus));

		// Index of the current element in focus. We always start at 0;
		this.index = 0;

		// Add event listeners to the anchor element.
		this.anchorEvents();
	}

	/**
	 * isActive
	 *
	 * Wether or not the sidebar is visible.
	 *
	 * @public
	 * @memberof MDFSidebar
	 * @since 1.0.0
	 */
	public isActive = (): boolean => {
		return this.container.hasClass(classes.active);
	};

	/**
	 * setFocusOnFirstElement
	 *
	 * Set focus on the first element in the list of focusable elements.
	 *
	 * @private
	 * @memberof MDFSidebar
	 * @since 1.0.0
	 */
	private setFocusOnFirstElement = () => {
		this.focusableElements[0].focus();
	};

	/**
	 * setFocusOnElem
	 *
	 * Set focus on element with the given index.
	 *
	 * @param {number} index Index of the element
	 *
	 * @private
	 * @memberof MDFSidebar
	 * @since 1.0.0
	 */
	private setFocusOnElem = (index: number) => {
		this.focusableElements[index].focus();
	};

	/**
	 * setFocusOnLastActiveElement
	 *
	 * Set focus on the last element that had focus before we opened the sidebar.
	 *
	 * @private
	 * @memberof MDFSidebar
	 * @since 1.0.0
	 */
	private setFocusOnLastActiveElement = () => {
		this.lastActiveElement.focus();
	};

	/**
	 * focusPreviousElem
	 *
	 * Move focus to the previous focusable element.
	 *
	 * @private
	 * @memberof MDFSidebar
	 * @since 1.0.0
	 */
	private focusPreviousElem = () => {
		if (this.index >= 1) {
			// Move to the previous element.
			this.index--;
		} else if (this.index === 0) {
			// If we are on the first element, wrap back around to the last element.
			this.index = this.focusableElements.length - 1;
		}

		// We move the focus to the previous element.
		this.setFocusOnElem(this.index);
	};

	/**
	 * focusNextElem
	 *
	 * Move focus to the next focusable element.
	 *
	 * @private
	 * @memberof MDFSidebar
	 * @since 1.0.0
	 */
	private focusNextElem = () => {
		if (this.index === this.focusableElements.length - 1) {
			// If we are on the last element, wrap back around to the first element.
			this.index = 0;
		} else if (this.index >= 0) {
			// Move to the next element.
			this.index++;
		}

		// We move the focus to the next element.
		this.setFocusOnElem(this.index);
	};

	/**
	 * openSidebar
	 *
	 * Fade-in the sidebar and optionally execute the callback function.
	 *
	 * @param {boolean} setFocus Set focus on the first item
	 *
	 * @private
	 * @memberof MDFSidebar
	 * @since 1.0.0
	 * @version 1.0.1
	 */
	public openSidebar = (setFocus?: boolean): void => {
		// Store the last active element before we opened the sidebar.
		this.lastActiveElement = document.activeElement as HTMLElement;

		// Set sidebar container as active.
		this.container.addClass(classes.active);
		this.container.removeAttribute(attr.hidden);

		// Move-in the sidebar and fade-in the backdrop.
		setTimeout(() => {
			this.container.addClass(classes.move);
		}, 100);

		// Disable scrolling while the sidebar is open.
		this.scrollbarParent.addClass(classes.disableScrollbar);

		// Set the `aria-modal` attribute for the sidebar.
		this.sidebar.setAttribute(attr.modal, 'true');

		// Set focus on first element (we use a timeout to guarantee that the item can receive focus).
		if (setFocus) {
			setTimeout(this.setFocusOnFirstElement, 100);
		}

		// If we have a callback, execute it.
		if (this.options.onOpen) {
			this.options.onOpen();
		}

		// Add event listeners.
		this.addEvents();

		// Dispatch event letting the user know the sidebar is open.
		this.sidebar.dispatchEvent(new Event(events.opened));
	};

	/**
	 * closeSidebar
	 *
	 * Hide the sidebar and optionally execute the callback function.
	 *
	 * @private
	 * @memberof MDFSidebar
	 * @since 1.0.0
	 * @version 1.0.1
	 */
	public closeSidebar = (): void => {
		// Move the sidebar out of view and fade-out the backdrop.
		this.container.removeClass(classes.move);

		// We wait for the sidebar to finish moving before setting it as inactive.
		const waitForTransition = () => {
			// Set sidebar as inactive.
			this.container.removeClass(classes.active);
			this.container.setAttribute(attr.hidden, 'true');

			// Enable scrolling again once the sidebar is closed.
			this.scrollbarParent.removeClass(classes.disableScrollbar);

			// Remove the sidebar event listener to avoid repeats.
			this.sidebar.removeEventListener('transitionend', waitForTransition);
		};

		// Wait for sidebar transition.
		this.sidebar.addEventListener('transitionend', waitForTransition);

		// Remove the `aria-modal` attribute from the sidebar.
		this.sidebar.removeAttribute(attr.modal);

		// If we have a callback, execute it.
		if (this.options.onClose) {
			this.options.onClose();
		}

		// Remove event listeners.
		this.removeEvents();

		// Dispatch event letting the user know the sidebar is closed.
		this.sidebar.dispatchEvent(new Event(events.closed));
	};

	/**
	 * anchorEvents
	 *
	 * Add event listeners to the anchor element.
	 *
	 * @private
	 * @memberof MDFSidebar
	 * @since 1.0.0
	 */
	private anchorEvents = () => {
		// If the anchor is activated by click, we simply open the sidebar.
		this.anchor.addEventListener('click', () => {
			this.openSidebar();
		});

		// If the anchor is activated by keypress, we open the sidebar and set focus on the first item.
		this.anchor.addEventListener('keydown', (evt: KeyboardEvent) => {
			if (evt.key === 'Enter' || evt.key === ' ') {
				// Prevent default behavior, stops the keypress from emulating a click.
				evt.preventDefault();

				// We open the menu and additionally set focus on the first item.
				this.openSidebar(true);
			}
		});
	};

	/**
	 * clickEvents
	 *
	 * Add click events to all necessary sidebar elements.
	 *
	 * @private
	 * @memberof MDFSidebar
	 * @since 1.0.0
	 */
	private clickEvents = (evt: Event) => {
		// Get the clicked element.
		const _this = evt.target as HTMLElement;

		// Hide the sidebar if the `close` button element was clicked.
		if (_this === this.closeButton) {
			this.closeSidebar();
		}

		// Hide the sidebar if a click is registered outside of it.
		if (this.options.hideOnClick) {
			if (!this.sidebar.contains(_this)) {
				this.closeSidebar();
			}
		}
	};

	/**
	 * keyboardEvents
	 *
	 * Add ARIA-compliant keyboard navigation.
	 *
	 * @param {KeyboardEvent} evt The keyboard event
	 *
	 * @private
	 * @memberof MDFSidebar
	 * @since 1.0.0
	 */
	private keyboardEvents = (evt: KeyboardEvent) => {
		if (evt.key === 'Tab' && evt.shiftKey) {
			evt.preventDefault();

			this.focusPreviousElem();
		} else if (evt.key === 'Tab') {
			evt.preventDefault();

			this.focusNextElem();
		} else if (evt.key === 'Escape') {
			evt.preventDefault();

			this.closeSidebar();
			this.setFocusOnLastActiveElement();
		}
	};

	/**
	 * addEvents
	 *
	 * Add event listeners.
	 *
	 * @private
	 * @memberof MDFSidebar
	 * @since 1.0.0
	 */
	private addEvents = () => {
		this.container.addEventListener('click', this.clickEvents);
		this.container.addEventListener('keydown', this.keyboardEvents);
	};

	/**
	 * removeEvents
	 *
	 * Remove event listeners.
	 *
	 * @private
	 * @memberof MDFSidebar
	 * @since 1.0.0
	 */
	private removeEvents = () => {
		this.container.removeEventListener('click', this.clickEvents);
		this.container.removeEventListener('keydown', this.keyboardEvents);
	};
}
