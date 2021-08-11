import { MDFParallaxOptions } from './types';

/**
 * MDFParallax
 *
 * Add parallax effect to images.
 *
 * @export
 * @class MDFParallax
 * @version 1.0.0
 */
export class MDFParallax {
	public readonly container: HTMLElement;
	public readonly image: HTMLElement;
	public readonly options: MDFParallaxOptions;

	private defaults: MDFParallaxOptions;
	private scale: number;

	/**
	 * Creates an instance of MDFParallax.
	 *
	 * @param {Element} elem The element we are manipulating
	 * @param {MDFParallaxOptions} [options] Object holding user options
	 * @memberof MDFParallax
	 * @since 1.0.0
	 */
	constructor(elem: Element, options?: MDFParallaxOptions) {
		// Abort script if given element doesn't exist.
		if (!elem || !elem.nodeType) return;

		// Container element.
		this.container = elem as HTMLElement;

		// Default options.
		this.defaults = {
			delay: 0,
			direction: 'up',
			easing: 'linear',
			scale: 1.2,
		};

		// Options containing user modified values.
		this.options = Object.assign({}, this.defaults, options);

		// Make sure the `scale` value doesn't drop below the default.
		this.scale = Math.max(this.defaults.scale, this.options.scale);

		// The element we are applying the parallax effect to.
		this.image = this.container.firstElementChild as HTMLElement;

		// Initialize the parallax element.
		this.initElem();
	}

	/**
	 * startIntersectionObserver
	 *
	 * Start an IntersectionObserver to let our script know when the parallax element is visible or not.
	 *
	 * @private
	 * @memberof MDFParallax
	 * @since 1.0.0
	 */
	private startIntersectionObserver = () => {
		// Observer callback.
		const intersectionCallback = (entries: IntersectionObserverEntry[]) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					// If the parallax element is visible, add the scroll events.
					this.addEvents();
				} else {
					// Otherwise remove them.
					this.removeEvents();
				}
			});
		};

		// Observer options.
		const intersectionOptions: IntersectionObserverInit = {
			threshold: 0.1,
		};

		// Start the IntersectionObserver watching our parallax container element.
		new IntersectionObserver(intersectionCallback, intersectionOptions).observe(this.container);
	};

	/**
	 * getScrollDistance
	 *
	 * Calculate the distance we need to scroll the parallax effect by.
	 *
	 * Calculations based on:
	 * https://itnext.io/case-study-create-a-parallax-effect-directly-on-img-tags-with-javascript-35b8daf81471
	 *
	 * @private
	 * @memberof MDFParallax
	 * @since 1.0.0
	 */
	private getScrollDistance = () => {
		// Get the lowest point of the viewport.
		const vpBottom = window.pageYOffset + document.documentElement.clientHeight;

		// Calculate relative position of image to viewport in %, round to 1 decimal.
		const percentage = (
			(vpBottom - this.image.offsetTop) /
			((document.documentElement.clientHeight + this.image.offsetHeight) / 100)
		).toFixed(1);

		// Clamp percentage to not drop below 0 or exceed 100.
		const clampPercentage = Math.min(100, Math.max(0, parseFloat(percentage)));

		// This is the distance the image will scroll by in any given direction.
		return +((clampPercentage / 100) * this.image.offsetHeight - this.image.offsetHeight / 2).toFixed(0);
	};

	/**
	 * getTranslateValues
	 *
	 * Get values for the translateX and translateY properties.
	 *
	 * @private
	 * @param {number} distance The current distance value
	 * @memberof MDFParallax
	 * @since 1.0.0
	 */
	private getTranslateValues = (distance: number) => {
		// Prepare these variables to hold our `translateX` and `translateY` values.
		let translateX = 0;
		let translateY = 0;

		// Set values based on scrolling direction.
		if (this.options.direction === 'up' || this.options.direction === 'down') {
			// Use a positive or negative value to affect scroll direction (either up or down).
			translateY = this.options.direction === 'up' ? distance * -1 : distance;
		} else if (this.options.direction === 'left' || this.options.direction === 'right') {
			// Use a positive or negative value to affect scroll direction (either left or right).
			translateX = this.options.direction === 'left' ? distance * -1 : distance;
		}

		// Return object holding both values.
		return {
			x: translateX,
			y: translateY,
		};
	};

	/**
	 * setTransform
	 *
	 * Apply the transform CSS properties to our parallax element.
	 *
	 * @private
	 * @memberof MDFParallax
	 * @since 1.0.0
	 */
	private setTransform = () => {
		// Get the translate values.
		const translateValues = this.getTranslateValues(this.getScrollDistance());

		// Set transition properties.
		this.image.style.transform = `translate3d(${translateValues.x}px, ${translateValues.y}px, 0) scale(${this.scale})`;
	};

	/**
	 * setCSSProperties
	 *
	 * Apply all necessary CSS properties.
	 *
	 * @private
	 * @memberof MDFParallax
	 * @since 1.0.0
	 */
	private setCSSProperties = () => {
		// Get transform properties.
		this.setTransform();

		// Set transition properties.
		this.image.style.transition = `transform ${this.options.delay}ms ${this.options.easing}`;
		this.image.style.willChange = 'transform';
	};

	/**
	 * initElem
	 *
	 * Initialize our parallax element and set required attributes and properties.
	 *
	 * @private
	 * @memberof MDFParallax
	 * @since 1.00
	 */
	private initElem = () => {
		// This variable will hold the URL to our image.
		let src: string;

		if (this.image.tagName.toLowerCase() === 'picture') {
			// Get the currently applied source inside a `<picture>` tag.
			src = this.image.getElementsByTagName('img')[0].currentSrc;
		} else if (this.image.tagName.toLowerCase() === 'img') {
			// Otherwise use the image source directly.
			src = (this.image as HTMLImageElement).src;
		} else {
			return;
		}

		// Create a new image without adding it to the DOM.
		const img = new Image();
		img.src = src;

		// Wait for it to finish loading.
		img.onload = () => {
			// Now we add the CSS properties.
			this.setCSSProperties();

			// And start our IntersectionObserver.
			this.startIntersectionObserver();
		};
	};

	/**
	 * scrollEvents
	 *
	 * Calculate parallax effect on window scroll.
	 *
	 * @private
	 * @memberof MDFParallax
	 * @since 1.0.0
	 */
	private scrollEvents = () => {
		window.requestAnimationFrame(this.setTransform);
	};

	/**
	 * addEvents
	 *
	 * Add event listeners.
	 *
	 * @private
	 * @memberof MDFParallax
	 * @since 1.0.0
	 */
	private addEvents = () => {
		window.addEventListener('scroll', this.scrollEvents);
	};

	/**
	 * removeEvents
	 *
	 * Remove event listeners.
	 *
	 * @private
	 * @memberof MDFParallax
	 * @since 1.0.0
	 */
	private removeEvents = () => {
		window.removeEventListener('scroll', this.scrollEvents);
	};
}
