import '@miraidesigns/base';
import { classes, selectors } from './constants';

/**
 * MDFGrid
 * 
 * Create a masonry style grid.
 *
 * @export
 * @class MDFGrid
 * @version 1.0.0
 */
export class MDFGrid {
	public readonly container: HTMLElement;
	public readonly items: HTMLElement[];

	private autoRows: number;
	private rowGap: number;

	/**
	 * Creates an instance of MDFGrid.
     * 
	 * @param {Element} elem The element we are manipulating
	 * @memberof MDFGrid
     * @since 1.0.0
	 */
	constructor(elem: Element) {
		// If the supplied element doesn't exist, abort the script.
		if (!elem) return;

		// Store a reference to the given element.
		this.container = elem as HTMLElement;

		// Get all grid items.
		this.items = Array.from(this.container.querySelectorAll(selectors.item));

		// If we have no grid items, abort the script.
		if (!this.items) return;

		// Get CSSStyle properties for the grid.
		this.autoRows = parseInt(window.getComputedStyle(this.container).getPropertyValue('grid-auto-rows'));
		this.rowGap = parseInt(window.getComputedStyle(this.container).getPropertyValue('grid-row-gap'));

		// Set the initial state of our elements.
		this.setInitialState();
	}

    /**
     * resize
     * 
     * Loop through all grid items and resize them.
     *
     * @memberof MDFGrid
     * @since 1.0.0
     */
    public resize = (): void => {
		for (const item of this.items) {
			this.resizeItem(item);
		}
    }

	/**
	 * resizeItem
	 *
	 * Resize the given grid item.
     * 
	 * @private
	 * @param {HTMLElement} item The item we are resizing
	 * @memberof MDFGrid
	 * @since 1.0.0
	 */
	private resizeItem = (item: HTMLElement) => {
		// Make sure the item has the content wrapper element in place.
		if (item.firstElementChild.matches(selectors.itemContent)) {
			// Calculate the actual item height.
			const calcSpan = Math.ceil(
				(item.firstElementChild.getBoundingClientRect().height + this.rowGap) / (this.autoRows + this.rowGap)
			);

			// Set the span (height) of the grid item.
			item.style.gridRowEnd = `span ${calcSpan}`;
		}
	};

	/**
	 * setInitialState
	 *
	 * Make sure the grid has the proper attributes on page load.
	 *
	 * @private
	 * @memberof MDFGrid
	 * @since 1.0.0
	 */
	private setInitialState = () => {
		// Make sure the grid has the masonry class.
		this.container.addClass(classes.masonry);
	};
}
