import '@miraidesigns/base';
import { attr, classes, events } from './constants';
import { MDFTooltipEvent } from './types';

/**
 * MDFTooltip
 *
 * Tooltips reveal information when users focus or hover over an element.
 *
 * @export
 * @class MDFTooltip
 * @version 1.0.0
 */
export class MDFTooltip {
	public readonly anchors: HTMLElement[];

	private anchor: HTMLElement;
	private docWidth: number;
	private elemRect: Record<string, ClientRect>;
	private tooltip: HTMLElement;

	/**
	 * Creates an instance of MDFTooltip.
	 *
	 * @param {NodeListOf<Element>} anchors The elements we need to show tooltips for
	 *
	 * @memberof MDFTooltip
	 * @since 1.0.0
	 */
	constructor(anchors: NodeListOf<Element>) {
		// If the supplied elements don't exist, abort the script.
		if (!anchors) return;

		// Store a reference to the given elements.
		this.anchors = Array.from(anchors as NodeListOf<HTMLElement>);

		// Get the viewport width.
		this.docWidth = document.documentElement.clientWidth;

		// This object will hold our anchor and tooltip ClientRect data.
		this.elemRect = {};

		// Add events.
		this.addEvents();
	}

	/**
	 * createTooltip
	 *
	 * Create the tooltip element and add it to the DOM.
	 *
	 * @private
	 * @memberof MDFTooltip
	 * @since 1.0.0
	 */
	private createTooltip = () => {
		// Create documentFragment.
		const docFrag = document.createDocumentFragment();

		// Create tooltip element.
		this.tooltip = document.createElement('div');
		this.tooltip.addClass(classes.tooltip);
		this.tooltip.setAttribute(attr.role, 'tooltip');
		this.tooltip.setAttribute(attr.describedBy, this.anchor.id);

		// This element will hold the tooltip text.
		const span = document.createElement('span');
		span.textContent = this.anchor.getAttribute(attr.tooltip);
		this.tooltip.appendChild(span);

		// Add tooltip element to the document fragment.
		docFrag.appendChild(this.tooltip);

		// Append the tooltip to the beginning of our body element.
		document.body.insertBefore(docFrag, document.body.firstChild);
	};

	/**
	 * positionMDFTooltip
	 *
	 * Position the tooltip underneath the anchor element that activated it.
	 *
	 * @private
	 * @memberof MDFTooltip
	 * @since 1.0.0
	 */
	private positionTooltip = () => {
		// Create tooltip ClientRect data.
		this.elemRect.anchor = this.anchor.getBoundingClientRect();
		this.elemRect.tooltip = this.tooltip.getBoundingClientRect();

		// We use these coordinates to position the tooltip element.
		const topDelta = this.elemRect.anchor.top + this.elemRect.anchor.height + 8;
		const leftDelta = (this.elemRect.anchor.width - this.elemRect.tooltip.width) / 2 + this.elemRect.anchor.left;

		// Vertical position of the tooltip. Position it underneath the anchor element with a slight margin.
		this.tooltip.style.top = `${topDelta}px`;

		// Horizontal position of the tooltip. Position it centered with the anchor element.
		this.tooltip.style.left = `${leftDelta}px`;

		// Here we reposition the tooltip should it get cut off or move off-screen.
		if (this.elemRect.anchor.left - this.elemRect.tooltip.width < 0) {
			// MDFTooltip would be cut off on the left.
			this.tooltip.style.left = `${this.elemRect.anchor.left}px`;
		} else if (this.elemRect.anchor.left + this.elemRect.tooltip.width > this.docWidth) {
			// MDFTooltip would be cut off on the right.
			this.tooltip.style.left = `${
				this.elemRect.anchor.left + this.elemRect.anchor.width - this.elemRect.tooltip.width
			}px`;
		}
	};

	/**
	 * showTooltip
	 *
	 * Will create and position the tooltip element if necessary before showing it.
	 *
	 * @private
	 * @memberof MDFTooltip
	 * @since 1.0.0
	 */
	private showTooltip = () => {
		if (!this.tooltip) {
			// If no tooltip element has been created yet, we do so now.
			this.createTooltip();
		} else {
			// Otherwise we make sure to update the tooltip text.
			this.tooltip.firstElementChild.textContent = this.anchor.getAttribute(attr.tooltip);
		}

		// We only update the tooltips position if we have no available ClientRect data.
		if (this.elemRect.tooltip === null) {
			this.positionTooltip();
		}

		// Add the `scale` class after positioning the tooltip.
		this.tooltip.addClass(classes.scale);

		// Show tooltip (add a slight delay so that the transform applies properly).
		setTimeout(() => this.tooltip.addClass(classes.active), 10);

		// Remove the `aria-hidden` attribute.
		this.tooltip.removeAttribute(attr.hidden);

		// Dispatch event letting the user know the tooltip is visible.
		this.anchor.dispatchEvent(
			new CustomEvent<MDFTooltipEvent>(events.active, {
				bubbles: true,
				detail: {
					anchor: this.anchor,
					tooltip: this.tooltip,
				},
			})
		);
	};

	/**
	 * hideTooltip
	 *
	 * Hide the tooltip element.
	 *
	 * @private
	 * @memberof MDFTooltip
	 * @since 1.0.0
	 */
	private hideTooltip = () => {
		// Hide the tooltip visually.
		this.tooltip.removeClass(classes.active);
		this.tooltip.removeClass(classes.scale);

		// Set the `aria-hidden` attribute to `true`.
		this.tooltip.setAttribute(attr.hidden, 'true');

		// Dispatch event letting the user know the tooltip is hidden.
		this.anchor.dispatchEvent(
			new CustomEvent<MDFTooltipEvent>(events.hidden, {
				bubbles: true,
				detail: {
					anchor: this.anchor,
					tooltip: this.tooltip,
				},
			})
		);
	};

	/**
	 * anchorEvents
	 *
	 * Add events when focusing or hovering over anchor elements.
	 *
	 * @private
	 * @memberof MDFTooltip
	 * @since 1.0.0
	 */
	private anchorEvents = (evt: Event) => {
		// The anchor element we are hovering the mouse over.
		const _this = evt.target as HTMLElement;

		// Whenever we hover over a new anchor, we reset the tooltip ClientRect data.
		if (_this !== this.anchor) {
			this.elemRect.tooltip = null;
		}

		// Cache the current anchor element.
		this.anchor = _this;

		// Display the tooltip.
		this.showTooltip();
	};

	/**
	 * keyboardEvents
	 *
	 * Add ARIA-compliant keyboard events.
	 * Module is not finalized yet, see: https://www.w3.org/TR/wai-aria-practices/#tooltip
	 *
	 * @private
	 * @memberof MDFTooltip
	 * @since 1.0.0
	 */
	private keyboardEvents = (evt: KeyboardEvent) => {
		// Hide the tooltip if the `Escape` key is pressed.
		if (evt.key === 'Escape' && this.tooltip.hasClass(classes.active)) {
			this.hideTooltip();
		}
	};

	/**
	 * addEvents
	 *
	 * Add event listeners.
	 *
	 * @private
	 * @memberof MDFTooltip
	 * @since 1.0.0
	 */
	private addEvents = () => {
		// Loop through list of anchor elements.
		for (const anchor of this.anchors) {
			// Add events if the 'data-tooltip' attribute is available and not empty.
			if (anchor.getAttribute(attr.tooltip) !== '') {
				anchor.addEventListener('mouseover', this.anchorEvents);
				anchor.addEventListener('focus', this.anchorEvents);
				anchor.addEventListener('keydown', this.keyboardEvents);
				anchor.addEventListener('mouseout', this.hideTooltip);
				anchor.addEventListener('blur', this.hideTooltip);
			}
		}
	};
}
