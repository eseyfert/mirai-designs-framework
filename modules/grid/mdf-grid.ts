import '@miraidesigns/base';
import { selectors } from './constants';

/**
 * MDFGrid
 *
 * Create a masonry style grid.
 *
 * @export
 * @class MDFGrid
 * @version 1.0.3
 */
export class MDFGrid {
	public readonly container: HTMLElement;
	public readonly items: HTMLElement[];

	private autoRows: number;
	private images: HTMLCollection;
	private rowGap: number;

	/**
	 * Creates an instance of MDFGrid.
	 *
	 * @param {Element} elem The element we are manipulating
	 * @memberof MDFGrid
	 * @since 1.0.0
	 * @version 1.0.3
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

		// Get all images inside our .
		this.images = this.container.getElementsByTagName('img');

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
	 * @version 1.0.3
	 */
	public resize = async (): Promise<void> => {
		// Check wether or not we have images in our grid.
		if (this.images.length) {
			// We temporarily hide the grid while we wait for the images to finish loading.
			this.container.style.opacity = '0';

			// Status of our images.
			const imagesLoaded = await this.waitForImages();

			if (imagesLoaded) {
				// Once the images are loaded, we resize our items.
				for (const item of this.items) {
					this.resizeItem(item);
				}

				// And we make our grid visible again.
				this.container.style.opacity = '1';
			}
		} else {
			for (const item of this.items) {
				this.resizeItem(item);
			}
		}
	};

	/**
	 * waitForImages
	 *
	 * Wait for all images inside the grid to load.
	 *
	 * @private
	 * @memberof MDFGrid
	 * @since 1.0.3
	 */
	private waitForImages = () => {
		return new Promise<boolean>((resolve) => {
			// We use this later in our resolve to let the script know the images have been loaded.
			let isLoaded = false;

			// We use this value to keep track of how many images have been loaded.
			let imageCount = 0;

			// Loop through all images.
			for (const image of this.images) {
				// Create a clone of the current image without adding it to the DOM.
				const clone = new Image();
				clone.src = (image as HTMLImageElement).src;

				// Wait for the cloned image to be fully loaded.
				void clone.decode().then(() => {
					// Increase the images loaded counter.
					imageCount++;

					// Once the counter is equal to the amount of images, we resolve the promise.
					if (imageCount === this.images.length) {
						isLoaded = true;
						resolve(isLoaded);
					}
				});
			}
		});
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
	 * @version 1.0.3
	 */
	private resizeItem = (item: HTMLElement) => {
		// Make sure the item has the content wrapper element in place.
		if (item.firstElementChild.matches(selectors.itemContent)) {
			// Calculate span.
			const span = this.calcSpan(item);

			// Set the span (height) of the grid item.
			item.style.gridRowEnd = `span ${span}`;
		}
	};
}
