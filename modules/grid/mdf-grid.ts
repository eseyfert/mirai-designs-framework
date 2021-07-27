import '@miraidesigns/base';
import { imageLoaded } from '@miraidesigns/utils';
import { classes, selectors } from './constants';

/**
 * MDFGrid
 *
 * Create a masonry style grid.
 *
 * @export
 * @class MDFGrid
 * @version 1.0.4
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
	 * @version 1.0.4
	 */
	constructor(elem: Element) {
		// If the supplied element doesn't exist, abort the script.
		if (!elem || typeof elem != 'object' || !elem.nodeType) return;

		// Store a reference to the given element.
		this.container = elem as HTMLElement;

		// Get all grid items.
		this.items = Array.from(this.container.querySelectorAll(selectors.item));

		// If we have no grid items, abort the script.
		if (!this.items) return;

		// Get CSSStyle properties for the grid.
		this.autoRows = parseInt(window.getComputedStyle(this.container).getPropertyValue('grid-auto-rows'));
		this.rowGap = parseInt(window.getComputedStyle(this.container).getPropertyValue('grid-row-gap'));
	}

	/**
	 * resize
	 *
	 * Loop through all grid items and resize them.
	 *
	 * @memberof MDFGrid
	 * @since 1.0.0
	 * @version 1.0.4
	 */
	public resize = (): void => {
		for (const item of this.items) {
			this.resizeItem(item);
		}
	};

	/**
	 * addItem
	 *
	 * Add additional item to the grid and resize it.
	 *
	 * @param {Element} elem The item we are adding
	 * @param {boolean} fadeIn Whether to fade-in the item
	 * @memberof MDFGrid
	 * @since 1.0.4
	 */
	public addItem = (item: Element, fadeIn?: boolean): void => {
		this.items.push(item as HTMLElement);
		this.resizeItem(item as HTMLElement, fadeIn);
	};

	/**
	 * calcSpan
	 *
	 * Calculate the span height for the given grid item.
	 *
	 * @private
	 * @param {HTMLElement} item The element we are calculating the span value for
	 * @memberof MDFGrid
	 * @since 1.0.1
	 */
	private calcSpan = (item: HTMLElement) => {
		return Math.ceil(
			(item.firstElementChild.getBoundingClientRect().height + this.rowGap) / (this.rowGap + this.autoRows)
		);
	};

	/**
	 * resizeItem
	 *
	 * Resize the given grid item.
	 *
	 * @private
	 * @param {HTMLElement} item The item we are resizing
	 * @memberof MDFGrid
	 * @since 1.0.0
	 * @version 1.0.4
	 */
	private resizeItem = (item: HTMLElement, fadeIn?: boolean) => {
		// Make sure the item has the content wrapper element in place.
		if (item.firstElementChild.matches(selectors.itemContent)) {
			// Resize the item.
			const resize = () => {
				// Calculate span.
				const span = this.calcSpan(item);

				// Set the span (height) of the grid item.
				item.style.gridRowEnd = `span ${span}`;

				// If enabled, fade-in the item after.
				if (fadeIn) {
					item.addClass(classes.fadeIn);
				}
			};

			// See if we have an image inside the item.
			const images = item.getElementsByTagName('img');

			if (images.length) {
				// Wait for the image to be loaded.
				const resizeAfterLoad = async () => {
					// Will resolve once image is ready.
					const loaded = await imageLoaded(images[0]);

					// Once resolved, resize the item.
					if (loaded) {
						resize();
					}
				};

				// Resize the item after the image is done loading.
				void resizeAfterLoad();
			} else {
				// Resize the grid item.
				resize();
			}
		}
	};
}
