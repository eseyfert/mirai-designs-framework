import '@miraidesigns/base';
import { MDFDialogOptions } from './types';
import { attr, classes, events, selectors } from './constants';

/**
 * MDFDialog
 *
 * Dialogs inform users about a task or action they need to take.
 *
 * @export
 * @class MDFDialog
 * @version 1.0.0
 */
export class MDFDialog {
	public readonly container: HTMLElement;
	public readonly content: HTMLElement;
	public readonly dialog: HTMLElement;
	public readonly options: MDFDialogOptions;
	public readonly text: HTMLParagraphElement;

	private cancelButton: HTMLButtonElement;
	private closeButton: HTMLButtonElement;
	private confirmButton: HTMLButtonElement;
	private defaults: MDFDialogOptions;
	private focusableElements: HTMLElement[];
	private lastActiveElement: HTMLElement;
	private index: number;

	/**
	 * Creates an instance of MDFDialog.
	 *
	 * @param {HTMLElement} dialog The element we are manipulating
	 * @param {MDFDialogOptions} [options] Object holding user options
	 * @memberof MDFDialog
	 * @since 1.0.0
	 */
	constructor(dialog: Element, options?: MDFDialogOptions) {
		// If the supplied element doesn't exist, abort the script.
		if (!dialog) return;

		// Store a reference to the given element.
		this.dialog = dialog as HTMLElement;

		// Dialog container element.
		this.container = this.dialog.parentElement;

		// Don't continue if the dialog container element does not exist.
		if (!this.container.matches(selectors.container)) return;

		// Default options.
		this.defaults = {
			onOpen: null,
			onConfirm: null,
			onCancel: null,
			hideOnClick: true,
		};

		// Options containing user modified values.
		this.options = Object.assign({}, this.defaults, options);

		// Get the dialog content container.
		this.content = this.dialog.querySelector(selectors.content);

		// Get the dialog text element.
		this.text = this.content.querySelector(selectors.text);

		// Close button (same function as the cancel button)
		this.closeButton = this.dialog.querySelector(selectors.closeButton);

		// Get the two elements corresponding to the `cancel` and `confirm` action.
		this.cancelButton = this.dialog.querySelector(selectors.cancelButton);
		this.confirmButton = this.dialog.querySelector(selectors.confirmButton);

		// Get list of all focusable elements.
		this.focusableElements = Array.from(this.container.querySelectorAll(selectors.focus));

		// Index of the current item in focus. We always start at 0;
		this.index = 0;
	}

	/**
	 * setFocusOnFirstElement
	 *
	 * Set focus on the first element in the list of focusable elements.
	 *
	 * @private
	 * @memberof MDFDialog
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
	 * @memberof MDFDialog
	 * @since 1.0.0
	 */
	private setFocusOnElem = (index: number) => {
		this.focusableElements[index].focus();
	};

	/**
	 * setFocusOnLastActiveElement
	 *
	 * Set focus on the last element that had focus before we opened the dialog.
	 *
	 * @private
	 * @memberof MDFDialog
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
	 * @memberof MDFDialog
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
	 * @memberof MDFDialog
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
	 * openDialog
	 *
	 * Fade-in the dialog window.
	 *
	 * @param {boolean} setFocus Wether or not to set focus on the first item
	 *
	 * @public
	 * @memberof MDFDialog
	 * @since 1.0.0
	 */
	public openDialog = (message?: string, setFocus?: boolean): void => {
		// Store the last active element before we opened the dialog.
		this.lastActiveElement = document.activeElement as HTMLElement;

		// Activate the dialog container without making it visible yet.
		this.container.addClass(classes.active);

		// Fade-in the dialog element once the container is ready.
		this.container.addClass(classes.fadeIn);
		this.container.removeAttribute(attr.hidden);

		// Set the `aria-modal` attribute for the dialog.
		this.dialog.setAttribute(attr.modal, 'true');

		// Start the dialog animation.
		this.dialog.addClass(classes.transition);

		// After the animation is done playing, we remove the class to avoid repeats.
		this.dialog.addEventListener('animationend', () => this.dialog.removeClass(classes.transition));

		// Set focus on first element (we use a timeout to guarantee that the item can receive focus).
		if (setFocus) {
			setTimeout(this.setFocusOnFirstElement, 100);
		}

		// If supplied, change the displayed text message.
		if (message) {
			this.text.textContent = message;
		}

		// If we have a callback, execute it.
		if (this.options.onOpen) {
			this.options.onOpen();
		}

		// Add event listeners.
		this.addEvents();

		// Dispatch event letting user know the dialog is open.
		this.dialog.dispatchEvent(new Event(events.opened, { bubbles: true }));
	};

	/**
	 * closeDialog
	 *
	 * Hide the dialog window and optionally execute callback function.
	 *
	 * @param {boolean} confirmed Wether to call the cancel or confirm callback
	 *
	 * @public
	 * @memberof MDFDialog
	 * @since 1.0.0
	 */
	public closeDialog = (confirmed?: boolean): void => {
		// Fade-out the container without deactivating it yet.
		this.container.removeClass(classes.fadeIn);

		// After the successful fade-out, deactivate the container.
		const afterFadeOut = () => {
			this.container.removeClass(classes.active);
			this.container.setAttribute(attr.hidden, 'true');

			this.container.removeEventListener('transitionend', afterFadeOut);
		};

		// Add the `transitionend` event to know when the fade-out is complete.
		this.container.addEventListener('transitionend', afterFadeOut);

		// Remove the `aria-modal` attribute from the dialog.
		this.dialog.removeAttribute(attr.modal);

		// Get the cancel action callback.
		const callback = confirmed ? this.options.onConfirm : this.options.onCancel;

		// If we have one, execute it.
		if (callback) {
			callback();
		}

		// Remove event listeners.
		this.removeEvents();

		// Dispatch event letting user know the dialog is closed.
		this.dialog.dispatchEvent(new Event(events.closed, { bubbles: true }));
	};

	/**
	 * clickEvents
	 *
	 * Add click events to all necessary dialog elements.
	 *
	 * @private
	 * @memberof MDFDialog
	 * @since 1.0.0
	 */
	private clickEvents = (evt: MouseEvent) => {
		const _this = evt.target as HTMLElement;

		switch (_this) {
			case this.closeButton:
				this.closeDialog();
				break;
			case this.cancelButton:
				this.closeDialog();
				break;
			case this.confirmButton:
				this.closeDialog(true);
				break;
		}

		// If the dialog is visible and a click is registered outside of it, close it.
		if (this.options.hideOnClick) {
			if (this.container.hasClass(classes.active) && !this.dialog.contains(_this)) {
				this.closeDialog();
			}
		}
	};

	/**
	 * keyboardEvents
	 *
	 * Add ARIA compliant keyboard navigation.
	 *
	 * @param {KeyboardEvent} evt The keyboard event
	 *
	 * @private
	 * @memberof MDFDialog
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

			this.closeDialog();
			this.setFocusOnLastActiveElement();
		}
	};

	/**
	 * addEvents
	 *
	 * Add event listeners.
	 *
	 * @private
	 * @memberof MDFDialog
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
	 * @memberof MDFDialog
	 * @since 1.0.0
	 */
	private removeEvents = () => {
		this.container.removeEventListener('click', this.clickEvents);
		this.container.removeEventListener('keydown', this.keyboardEvents);
	};
}
