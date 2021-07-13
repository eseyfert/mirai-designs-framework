import '@miraidesigns/base';
import { isRTL } from '@miraidesigns/utils';
import { attr, classes, events, selectors } from './constants';
import { MDFSliderOptions, MDFSliderChangedEvent } from './types';

/**
 * MDFSlider
 *
 * Sliders allow you to create a carousel of elements, usually used to display images or other media elements.
 *
 * @export
 * @class MDFSlider
 * @version 1.0.0
 */
export class MDFSlider {
	public readonly content: HTMLElement;
	public readonly options: MDFSliderOptions;
	public readonly slider: HTMLElement;
	public readonly slides: HTMLElement[];

	private containerWidth: number;
	private defaults: MDFSliderOptions;
	private dragCoords: Record<string, number>;
	private firstSlideCopy: HTMLElement;
	private index: number;
	private isDragging: boolean;
	private lastSlideCopy: HTMLElement;
	private nav: HTMLElement;
	private navItems: HTMLCollection;
	private touchCoords: Record<string, number>;
	private useCopies: boolean;

	/**
	 * Creates an instance of Slider.
	 *
	 * @param {Element} slider The slider element we are manipulating
	 * @param {MDFSliderOptions} [options] Object holding user options
	 *
	 * @memberof Slider
	 * @since 1.0.0
	 */
	constructor(slider: Element, options?: MDFSliderOptions) {
		// If the supplied element doesn't exist, abort the script.
		if (!slider) return;

		// Store a reference to the given element.
		this.slider = slider as HTMLElement;

		// Default options.
		this.defaults = {
			onChange: null,
			defaultSlide: 0,
			navPos: 'bottom',
			enableNavigation: true,
			enableSwipe: true,
			enableDrag: true,
		};

		// Options object containing user modified values.
		this.options = Object.assign({}, this.defaults, options);

		// Get the slides container.
		this.content = this.slider.querySelector(selectors.slides);

		// Get a list of all slides.
		this.slides = Array.from(this.slider.querySelectorAll(selectors.slide));

		// Don't continue if we don't have any slides.
		if (!this.slides) return;

		// Get the width of the slider.
		this.containerWidth = this.slider.getBoundingClientRect().width;

		// Set the width of every slide to be the same.
		for (const slide of this.slides) {
			slide.style.width = `${this.containerWidth}px`;
		}

		// Keep track of wether or not we are using copies.
		this.useCopies = false;

		// Create a copy of the first and last slide and put them on the opposite end of the slider.
		if (this.slides.length > 2) {
			this.createSlideCopies();
			this.useCopies = true;
		}

		// Starting slide index, 0 by default.
		this.index = this.options.defaultSlide;

		// We add this attribute to make the script work in RTL layouts.
		if (isRTL()) {
			this.slider.setAttribute(attr.dir, 'ltr');
		}

		// Move the first slide into view.
		this.content.style.transform = `translateX(-${this.slides[this.index].offsetLeft}px)`;

		// If enabled, create the navigation items.
		if (this.options.enableNavigation) {
			this.createNavigation();
		}

		if (this.options.enableSwipe) {
			// Setup touch event coordinates.
			this.touchCoords = {
				touchStartX: 0,
				touchStartY: 0,
				touchMoveX: 0,
				touchMoveY: 0,
				touchEndX: 0,
				touchEndY: 0,
				swipeDistanceX: 0,
			};
		}

		if (this.options.enableDrag) {
			// Track wether or not the slide is being dragged.
			this.isDragging = false;

			// Setup drag event coordinates.
			this.dragCoords = {
				dragStartX: 0,
				dragMoveX: 0,
				dragEndX: 0,
				dragDistanceX: 0,
				transformX: this.slides[this.index].offsetLeft,
			};
		}

		// Add event listeners.
		this.addEvents();
	}

	/**
	 * getCurrentSlide
	 *
	 * Returns the active slide.
	 *
	 * @public
	 * @memberof Slider
	 * @since 1.0.0
	 */
	public getCurrentSlide = (): HTMLElement => {
		return this.slides[this.index];
	};

	/**
	 * getSlide
	 *
	 * Returns the slide with the given index.
	 *
	 * @public
	 * @memberof Slider
	 * @since 1.0.0
	 */
	public getSlide = (index: number): HTMLElement => {
		return this.slides[index];
	};

	/**
	 * createSlideCopies
	 *
	 * Create a copy of the first and last slide for transition purposes.
	 *
	 * @private
	 * @memberof Slider
	 * @since 1.0.0
	 */
	private createSlideCopies = () => {
		// Clone the first and last slide.
		this.firstSlideCopy = this.slides[0].cloneNode(true) as HTMLElement;
		this.lastSlideCopy = this.slides[this.slides.length - 1].cloneNode(true) as HTMLElement;

		// We want assistive technologies to ignore the copied slides.
		this.firstSlideCopy.setAttribute(attr.hidden, 'true');
		this.firstSlideCopy.removeAttribute(attr.role);
		this.firstSlideCopy.removeAttribute(attr.description);
		this.firstSlideCopy.removeAttribute(attr.label);

		this.lastSlideCopy.setAttribute(attr.hidden, 'true');
		this.lastSlideCopy.removeAttribute(attr.role);
		this.lastSlideCopy.removeAttribute(attr.description);
		this.lastSlideCopy.removeAttribute(attr.label);

		// Insert them at opposite ends.
		this.content.insertAdjacentElement('beforeend', this.firstSlideCopy);
		this.content.insertAdjacentElement('afterbegin', this.lastSlideCopy);
	};

	/**
	 * changeSlide
	 *
	 * Show slide with given index.
	 *
	 * @param {number} index Slide index
	 *
	 * @private
	 * @memberof Slider
	 * @since 1.0.0
	 */
	private changeSlide = (index: number) => {
		// Move the slide into view.
		this.content.style.transform = `translateX(-${this.slides[index].offsetLeft}px)`;

		// If available, execute callback function when a slide is changing.
		if (this.options.onChange) {
			this.options.onChange();
		}

		// If enabled, we update our drag coordinates with the latest `translateX` value for the drag move transition.
		if (this.options.enableDrag) {
			// Extract just the number from the `translateX` string.
			const regex = /\d+/;
			const translateX = regex.exec(this.content.style.transform)
				? +regex.exec(this.content.style.transform)[0]
				: 0;

			// Update the drag coordinates.
			this.dragCoords.transformX = translateX;
		}

		// Dispatch event letting the user know that the active slide changed.
		this.content.dispatchEvent(
			new CustomEvent<MDFSliderChangedEvent>(events.changed, {
				bubbles: true,
				detail: {
					index: index,
					item: this.slides[index],
				},
			})
		);
	};

	/**
	 * changeSlideFromCopy
	 *
	 * Change to the item with the given index starting from a copied slide.
	 *
	 * @private
	 * @memberof Lightbox
	 * @since 1.0.0
	 */
	private changeSlideFromCopy = () => {
		// We temporarily disable transitions.
		this.content.addClass(classes.disableTransitions);

		// We show the actual first slide and update our index.
		this.changeSlide(this.index);

		// Force repaint, otherwise the transform will not work properly.
		this.content.getBoundingClientRect();

		// We use a timeout to make sure that no transition is happening and the slide is in place, before enabling transitions again.
		this.content.removeClass(classes.disableTransitions);

		// Remove the event listener again so it does not trigger again.
		this.content.removeEventListener('transitionend', this.changeSlideFromCopy);
	};

	/**
	 * prevSlide
	 *
	 * Show the previous slide.
	 *
	 * @private
	 * @memberof Slider
	 * @since 1.0.0
	 */
	private prevSlide = () => {
		if (this.useCopies && this.index === 0) {
			// If we are on the first slide, wrap back around to the last slide.
			this.index = this.slides.length - 1;

			// Move the copy of the last item into view.
			this.content.style.transform = `translateX(-${this.lastSlideCopy.offsetLeft}px)`;

			// After the transition is over, we replace the copy with the actual item.
			this.content.addEventListener('transitionend', this.changeSlideFromCopy);
		} else {
			if (this.index >= 1) {
				// Show to the previous slide.
				this.index--;
			} else if (this.index === 0) {
				// If we are on the first slide, wrap back around to the last slide.
				this.index = this.slides.length - 1;
			}

			// Change the slide.
			this.changeSlide(this.index);
		}

		// And update the navigation if enabled.
		if (this.options.enableNavigation) {
			this.changeNavigationItem(this.index);
		}
	};

	/**
	 * nextSlide
	 *
	 * Show the next slide.
	 *
	 * @private
	 * @memberof Slider
	 * @since 1.0.0
	 */
	private nextSlide = () => {
		if (this.useCopies && this.index === this.slides.length - 1) {
			// If we are on the last slide, wrap back around to the first slide.
			this.index = 0;

			// Move the copy of the last slide into view.
			this.content.style.transform = `translateX(-${this.firstSlideCopy.offsetLeft}px)`;

			// After the transition is over, we replace the copy with the actual slide.
			this.content.addEventListener('transitionend', this.changeSlideFromCopy);
		} else {
			if (this.index === this.slides.length - 1) {
				// If we are on the last slide, wrap back around to the first slide.
				this.index = 0;
			} else if (this.index >= 0) {
				// Show the next slide.
				this.index++;
			}

			// Change the slide.
			this.changeSlide(this.index);
		}

		// And update the navigation if enabled.
		if (this.options.enableNavigation) {
			this.changeNavigationItem(this.index);
		}
	};

	/**
	 * createNavigation
	 *
	 * Create the HTML markup for slider navigation based on the amount of slides we have.
	 *
	 * @private
	 * @memberof Slider
	 * @since 1.0.0
	 */
	private createNavigation = () => {
		// Document fragment that will hold the navigation items.
		const docFrag = document.createDocumentFragment();

		// Create the navigation container.
		this.nav = document.createElement('div');
		this.nav.addClass(classes.nav);

		// Create the navigation items based on how many slides we have.
		for (let i = 0; i < this.slides.length; i++) {
			const div = document.createElement('div');
			div.className = classes.navItem;
			div.setAttribute(attr.index, i.toString());

			docFrag.appendChild(div);
		}

		// Add the navigation items to the navigation container.
		this.nav.appendChild(docFrag);

		// Insert the navigation after the slider.
		if (this.options.navPos === 'top') {
			this.slider.insertAdjacentElement('beforebegin', this.nav);
			this.nav.addClass(classes.navTop);
		} else {
			this.slider.insertAdjacentElement('afterend', this.nav);
		}

		// Cache the newly created navigation items for script use.
		this.navItems = this.nav.children;

		// Set the first navigation item as active.
		setTimeout(() => {
			this.navItems[this.index].addClass(classes.navItemActive);
		}, 10);
	};

	/**
	 * changeNavigationItem
	 *
	 * Change the active navigation item based on the slide index provided.
	 *
	 * @param {number} index Index number.
	 *
	 * @private
	 * @memberof Slider
	 * @since 1.0.0
	 */
	private changeNavigationItem = (index: number) => {
		// Set all items as inactive.
		for (const item of this.navItems) {
			item.removeClass(classes.navItemActive);
		}

		// Set the needed item as active.
		this.navItems[index].addClass(classes.navItemActive);
	};

	/**
	 * controlEvents
	 *
	 * Change slides using the `control` button elements.
	 *
	 * @private
	 * @memberof Slider
	 * @since 1.0.0
	 */
	private controlEvents = (evt: Event) => {
		// The clicked element.
		const _this = evt.target as HTMLElement;

		if (_this.matches(selectors.prev)) {
			// Clicked the `previous` button, showing the previous slide.
			this.prevSlide();
		} else if (_this.matches(selectors.next)) {
			// Clicked the `next` button, showing the next slide.
			this.nextSlide();
		}
	};

	/**
	 * navigationEvents
	 *
	 * Change slides using the navigation items.
	 *
	 * @private
	 * @memberof Slider
	 * @since 1.0.0
	 */
	private navigationEvents = (evt: Event) => {
		// The clicked element.
		const _this = evt.target as HTMLElement;

		if (_this.matches(selectors.navItem)) {
			// Get the index of the clicked navigation item.
			this.index = +_this.getAttribute(attr.index);

			// Use the index to change slides and update the navigation.
			this.changeSlide(this.index);
			this.changeNavigationItem(this.index);
		}
	};

	/**
	 * swipeStart
	 *
	 * Start of the touch event.
	 *
	 * @private
	 * @memberof Slider
	 * @since 1.0.0
	 */
	private swipeStart = (evt: TouchEvent) => {
		if ((evt.target as HTMLElement).matches(selectors.slide)) {
			evt.stopPropagation();
			evt.preventDefault();

			// Starting coordinates of the touch motion.
			this.touchCoords.touchStartX = evt.changedTouches[0].clientX;
			this.touchCoords.touchStartY = evt.changedTouches[0].clientY;
		}
	};

	/**
	 * swipeMove
	 *
	 * Capture and handle movement during the touch event.
	 *
	 * @private
	 * @memberof Slider
	 * @since 1.0.0
	 */
	private swipeMove = (evt: TouchEvent) => {
		if ((evt.target as HTMLElement).matches(selectors.slide)) {
			evt.stopPropagation();
			evt.preventDefault();

			// Current touch position.
			this.touchCoords.touchMoveX = evt.changedTouches[0].clientX;
			this.touchCoords.touchMoveY = evt.changedTouches[0].clientY;

			// Keep track of how far we swiped.
			this.touchCoords.swipeDistanceX = Math.abs(this.touchCoords.touchMoveX - this.touchCoords.touchStartX);
		}
	};

	/**
	 * swipeEnd
	 *
	 * The end of the touch event.
	 *
	 * @private
	 * @memberof Slider
	 * @since 1.0.0
	 */
	private swipeEnd = (evt: TouchEvent) => {
		if ((evt.target as HTMLElement).matches(selectors.slide)) {
			evt.stopPropagation();
			evt.preventDefault();

			// Store the coordinates of the swipe stopping points.
			this.touchCoords.touchEndX = evt.changedTouches[0].clientX;
			this.touchCoords.touchEndY = evt.changedTouches[0].clientY;

			// Only continue if the swipe distance threshold is met.
			if (this.touchCoords.swipeDistanceX > 100) {
				if (this.touchCoords.touchEndX < this.touchCoords.touchStartX) {
					// Show the next slide.
					this.nextSlide();
				} else if (this.touchCoords.touchEndX > this.touchCoords.touchStartX) {
					// Show the previous slide.
					this.prevSlide();
				}
			}

			// Once we are done with the swipe motion, we reset all touch coordinates.
			Object.keys(this.touchCoords).forEach((val) => (this.touchCoords[val] = 0));
		}
	};

	/**
	 * swipeEvents
	 *
	 * Change slides swiping left/right on touch devices.
	 *
	 * @private
	 * @memberof Slider
	 * @since 1.0.0
	 */
	private swipeEvents = () => {
		this.slider.addEventListener('touchstart', this.swipeStart);
		this.slider.addEventListener('touchmove', this.swipeMove);
		this.slider.addEventListener('touchend', this.swipeEnd);
	};

	/**
	 * dragStart
	 *
	 * Start of the mouse drag event.
	 *
	 * @private
	 * @memberof Slider
	 * @since 1.0.0
	 */
	private dragStart = (evt: MouseEvent) => {
		// The clicked target.
		const _this = evt.target as HTMLElement;

		// We only continue if the mouse is dragging on top of a slide.
		if (_this.matches(selectors.media) && evt.button === 0) {
			// Prevent default mouse `drag` behavior.
			evt.preventDefault();

			// This boolean starts the dragging events.
			this.isDragging = true;

			// Starting coordinates of the dragging motion.
			this.dragCoords.dragStartX = evt.clientX;

			// Add this class to the slider to change the mouse cursor appearance.
			this.slider.addClass(classes.dragging);

			// Add the drag events for moving and stopping the cursor.
			document.addEventListener('mousemove', this.dragMove);
			document.addEventListener('mouseup', this.dragEnd);
		}
	};

	/**
	 * dragMove
	 *
	 * Capture and handle mouse movement during the drag event.
	 *
	 * @private
	 * @memberof Slider
	 * @since 1.0.0
	 */
	private dragMove = (evt: MouseEvent) => {
		if (this.isDragging) {
			// Current slide.
			const currSlide = this.slides[this.index];

			// Current mouse cursor position.
			this.dragCoords.dragMoveX = evt.clientX;

			// Keep track of how far we dragged the cursor.
			this.dragCoords.dragDistanceX = Math.abs(this.dragCoords.dragMoveX - this.dragCoords.dragStartX);

			// Set the distance a slide will travel for and what direction.
			const leftDelta = Math.abs(this.dragCoords.dragStartX - this.dragCoords.dragMoveX);

			if (this.dragCoords.dragMoveX < this.dragCoords.dragStartX) {
				// Dragging left, show next slide.
				if (currSlide.offsetLeft > 0) {
					this.content.style.transform = `translateX(-${
						currSlide.offsetLeft + Math.min(leftDelta, this.containerWidth)
					}px)`;
				} else {
					// Moving from the copy of the last slide (starts at offsetLeft 0).
					this.content.style.transform = `translateX(-${Math.min(leftDelta, this.containerWidth)}px)`;
				}
			} else if (this.dragCoords.dragMoveX > this.dragCoords.dragStartX) {
				// Dragging right, show previous slide.
				if (currSlide.offsetLeft > 0) {
					this.content.style.transform = `translateX(-${
						currSlide.offsetLeft - Math.min(leftDelta, this.containerWidth)
					}px)`;
				} else {
					this.content.style.transform = `translateX(${Math.min(leftDelta, this.containerWidth)}px)`;
				}
			}
		}
	};

	/**
	 * dragEnd
	 *
	 * The end of the drag event.
	 *
	 * @private
	 * @memberof Slider
	 * @since 1.0.0
	 */
	private dragEnd = (evt: MouseEvent) => {
		// We only continue if the distance threshold is met.
		if (this.dragCoords.dragDistanceX > 200) {
			// Store the coordinates of the drag stopping point.
			this.dragCoords.dragEndX = evt.clientX;

			// Determine dragging direction.
			if (this.dragCoords.dragEndX < this.dragCoords.dragStartX) {
				if (this.index === this.slides.length - 1) {
					// If we are on the last slide, wrap back around to the first slide.
					this.index = 0;

					// Move the copy of the last slide into view.
					this.content.style.transform = `translateX(-${this.firstSlideCopy.offsetLeft}px)`;

					// After the transition is over, we replace the copy with the actual slide.
					this.content.addEventListener('transitionend', this.changeSlideFromCopy);

					// And update the navigation if enabled.
					if (this.options.enableNavigation) {
						this.changeNavigationItem(this.index);
					}
				} else {
					// Dragging left shows the next slide.
					this.nextSlide();
				}
			} else if (this.dragCoords.dragEndX > this.dragCoords.dragStartX) {
				if (this.useCopies && this.index === 0) {
					// If we are on the first slide, wrap back around to the last slide.
					this.index = this.slides.length - 1;

					// Move the copy of the last item into view.
					this.content.style.transform = `translateX(-${this.lastSlideCopy.offsetLeft}px)`;

					// After the transition is over, we replace the copy with the actual item.
					this.content.addEventListener('transitionend', this.changeSlideFromCopy);

					// And update the navigation if enabled.
					if (this.options.enableNavigation) {
						this.changeNavigationItem(this.index);
					}
				} else {
					// Dragging right shows the previous slide.
					this.prevSlide();
				}
			}
		} else {
			this.content.style.transform = `translateX(-${this.dragCoords.transformX}px)`;
		}

		// We reset the drag coordinates at the end.
		this.dragCoords.dragStartX = 0;
		this.dragCoords.dragMoveX = 0;
		this.dragCoords.dragEndX = 0;
		this.dragCoords.dragDistanceX = 0;

		// And stop the dragging event.
		this.isDragging = false;

		// Remove the dragging cursor appearance.
		this.slider.removeClass(classes.dragging);

		// Remove the leftover dragging events.
		document.removeEventListener('mousemove', this.dragMove);
		document.removeEventListener('mouseup', this.dragEnd);
	};

	/**
	 * dragEvents
	 *
	 * Change slides dragging the mouse to the left or right.
	 *
	 * @private
	 * @memberof Slider
	 * @since 1.0.0
	 */
	private dragEvents = () => {
		document.addEventListener('mousedown', this.dragStart);
	};

	/**
	 * addEvents
	 *
	 * Add event listeners.
	 *
	 * @private
	 * @memberof Slider
	 */
	private addEvents = () => {
		// Control the slider by clicking the `previous` and `next` buttons.
		this.slider.addEventListener('click', this.controlEvents);

		// If enabled, control the slider by clicking the navigation items.
		if (this.options.enableNavigation) {
			this.nav.addEventListener('click', this.navigationEvents);
		}

		// If enabled, control the slider by swiping left/right on a touch device.
		if (this.options.enableSwipe) {
			this.swipeEvents();
		}

		// If enabled, control the slider by dragging the mouse left/right.
		if (this.options.enableDrag) {
			this.dragEvents();
		}
	};
}
