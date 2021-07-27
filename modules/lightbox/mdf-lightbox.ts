import '@miraidesigns/base';
import { getScrollbarParent, isRTL } from '@miraidesigns/utils';
import * as Player from '@vimeo/player/dist/player.js';
import { attr, classes, events, selectors } from './constants';
import { MDFLightboxOptions, MDFLightboxChangedEvent } from './types';

/**
 * MDFLightbox
 *
 * Lightbox creates a modal carousel from a set of media elements such as images or videos.
 *
 * @export
 * @class MDFLightbox
 * @version 1.0.1
 */
export class MDFLightbox {
	public activeItem: HTMLElement;
	public container: HTMLElement;
	public index: number;
	public items: HTMLCollection;
	public itemsContainer: HTMLElement;
	public lightbox: HTMLElement;
	public links: HTMLLinkElement[];
	public readonly options: MDFLightboxOptions;

	private backdrop: HTMLElement;
	private controlClose: HTMLButtonElement;
	private controlPrev: HTMLButtonElement;
	private controlNext: HTMLButtonElement;
	private defaults: MDFLightboxOptions;
	private firstItemCopy: HTMLElement;
	private focusableElements: HTMLElement[];
	private id: string;
	private isRTL: boolean;
	private lastItemCopy: HTMLElement;
	private lastActiveElement: HTMLElement;
	private scrollbarParent: HTMLElement;
	private touchCoords: Record<string, number>;
	private useCopies: boolean;

	/**
	 * Creates an instance of MDFLightbox.
	 *
	 * @param {NodeListOf<Element>} links The link elements we are manipulating
	 * @param {MDFLightboxOptions} [options] Object holding user options
	 * @memberof MDFLightbox
	 * @since 1.0.0
	 * @version 1.0.1
	 */
	constructor(links: NodeListOf<Element>, options?: MDFLightboxOptions) {
		// Get a list of all lightbox links.
		this.links = Array.from(links) as HTMLLinkElement[];

		// Don't continue if there are no lightbox links.
		if (!this.links.length) return;

		// Default values for user options.
		this.defaults = {
			onOpen: null,
			onChange: null,
			onClose: null,
			titlePos: 'bottom',
			titleAlign: 'center',
			controlButtons: true,
			closeButton: true,
			icons: null,
			autoplay: false,
			iframeAddBorder: false,
			sandboxing: false,
			sandboxingRules: null,
			enableSwipe: true,
			hideOnClick: true,
		};

		// Merge defaults and user options.
		this.options = Object.assign({}, this.defaults, options);

		// We expose the id to the entire class.
		this.id = this.links[0].getAttribute(attr.lightbox);

		// Check wether or not the page layout is in RTL mode.
		this.isRTL = isRTL();

		// If enabled, setup touch event coordinates.
		if (this.options.enableSwipe) {
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

		// Setup the lightbox if it does not exist yet.
		if (!this.container) {
			// Create the lightbox container element.
			this.createLightbox();

			// If enabled, create the control elements.
			if (this.options.controlButtons || this.options.closeButton) {
				this.createControls();
			}

			// Create the items
			if (!this.items) {
				this.createItems();
			}

			// Keep track wether or not we are using copied items.
			this.useCopies = false;

			// If we have 3 or more items, create copies of the first and last lightbox item for transition purposes.
			if (this.items.length >= 3) {
				this.createCopies();
				this.useCopies = true;
			}

			// Set the list of keyboard focusable elements.
			this.focusableElements = Array.from(this.container.querySelectorAll(selectors.focus));

			// Add lightbox link event listeners.
			this.linkEvents();
		}
	}

	/**
	 * refresh
	 *
	 * Refresh the lightbox, adding new items without re-creating the entire lightbox element.
	 *
	 * @param {NodeListOf<Element>} links The link elements we are manipulating
	 * @memberof MDFLightbox
	 * @since 1.0.1
	 */
	public refresh = (): void => {
		// Get a list of all lightbox links.
		this.links = Array.from(document.querySelectorAll(`[${attr.lightbox}="${this.id}"]`));

		// Create the lightbox items.
		this.createItems();

		// If we have 3 or more items, create copies of the first and last lightbox item for transition purposes.
		if (this.items.length >= 3) {
			this.createCopies();
			this.useCopies = true;
		}

		// Add lightbox link event listeners.
		this.linkEvents();
	};

	/**
	 * createLightbox
	 *
	 * Create the HTML markup for our lightbox.
	 *
	 * @private
	 * @memberof MDFLightbox
	 * @since 1.0.0
	 */
	private createLightbox = () => {
		// Create document fragment.
		const docFrag = document.createDocumentFragment();

		// Create lightbox container.
		this.container = document.createElement('div');
		this.container.className = classes.container;
		this.container.setAttribute(attr.hidden, 'true');

		// We add this attribute to make the script work in RTL layouts.
		if (this.isRTL) {
			this.container.setAttribute(attr.dir, 'ltr');
		}

		// Create lightbox.
		this.lightbox = document.createElement('section');
		this.lightbox.className = classes.lightbox;
		this.lightbox.id = `lightbox-${this.id}`;
		this.lightbox.setAttribute(attr.roleDescription, 'carousel');
		this.lightbox.setAttribute(attr.label, 'Lightbox slider');

		// Create items container.
		this.itemsContainer = document.createElement('ul');
		this.itemsContainer.className = classes.items;
		this.itemsContainer.id = `lightbox-${this.id}-items`;
		this.itemsContainer.setAttribute(attr.live, 'polite');

		// Create backdrop.
		this.backdrop = document.createElement('div');
		this.backdrop.className = classes.backdrop;

		// Add the elements to the DOM.
		this.lightbox.appendChild(this.itemsContainer);

		this.container.appendChild(this.lightbox);
		this.container.appendChild(this.backdrop);

		docFrag.appendChild(this.container);

		document.body.appendChild(docFrag);
	};

	/**
	 * createControls
	 *
	 * Create the button elements that control the lightbox.
	 *
	 * @private
	 * @memberof MDFLightbox
	 * @since 1.0.0
	 */
	private createControls = () => {
		// Create document fragment.
		const docFrag = document.createDocumentFragment();

		// We will clone this svg element so that we don't have to rewrite it over and over again.
		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svg.classList.add(classes.icon);
		svg.setAttributeNS(null, 'viewBox', '0 0 24 24');
		svg.setAttributeNS(null, attr.hidden, 'true');

		// If enabled, create the `close` button.
		if (this.options.closeButton) {
			// Create close button.
			this.controlClose = document.createElement('button');
			this.controlClose.className = `${classes.control} ${classes.controlClose}`;
			this.controlClose.setAttribute(attr.label, 'Close lightbox');

			// Add the icon element using either a SVG element or HTML markup.
			if (this.options.icons.type === 'svg') {
				// Create the close button svg icon and append it.
				const closeButtonSvg = svg.cloneNode();

				const closeButtonUse = document.createElementNS('http://www.w3.org/2000/svg', 'use');
				closeButtonUse.setAttributeNS('http://www.w3.org/1999/xlink', 'href', this.options.icons.close);

				closeButtonSvg.appendChild(closeButtonUse);

				this.controlClose.appendChild(closeButtonSvg);
			} else if (this.options.icons.type === 'html') {
				// Use the HTML markup to create the icon element.
				this.controlClose.innerHTML = this.options.icons.close;
			}

			// Add the button to the document fragment.
			docFrag.appendChild(this.controlClose);
		}

		// If enabled, we only create `prev` and `next` buttons if we have multiple items.
		if (this.options.controlButtons && this.links.length > 1) {
			// Create prev button.
			this.controlPrev = document.createElement('button');
			this.controlPrev.className = `${classes.control} ${classes.controlPrev}`;
			this.controlPrev.setAttribute(attr.controls, `lightbox-${this.id}-items`);
			this.controlPrev.setAttribute(attr.label, 'Previous slide');

			// Create next button.
			this.controlNext = document.createElement('button');
			this.controlNext.className = `${classes.control} ${classes.controlNext}`;
			this.controlNext.setAttribute(attr.controls, `lightbox-${this.id}-items`);
			this.controlNext.setAttribute(attr.label, 'Next slide');

			// Add the icon elements using either SVG elements or HTML markup.
			if (this.options.icons.type === 'svg') {
				// Create the prev button svg icon and append it.
				const controlPrevSvg = svg.cloneNode();

				const controlPrevUse = document.createElementNS('http://www.w3.org/2000/svg', 'use');
				controlPrevUse.setAttributeNS('http://www.w3.org/1999/xlink', 'href', this.options.icons.control);

				controlPrevSvg.appendChild(controlPrevUse);

				this.controlPrev.appendChild(controlPrevSvg);

				// Create the next button svg icon and append it.
				const controlNextSvg = svg.cloneNode();

				const controlNextUse = document.createElementNS('http://www.w3.org/2000/svg', 'use');
				controlNextUse.setAttributeNS('http://www.w3.org/1999/xlink', 'href', this.options.icons.control);

				controlNextSvg.appendChild(controlNextUse);

				this.controlNext.appendChild(controlNextSvg);
			} else if (this.options.icons.type === 'html') {
				// Use the HTML markup to create the icon elements.
				this.controlPrev.innerHTML = this.options.icons.control;
				this.controlNext.innerHTML = this.options.icons.control;
			}

			// Add the buttons to the document fragment.
			docFrag.appendChild(this.controlPrev);
			docFrag.appendChild(this.controlNext);
		}

		// Add the elements to the DOM.
		this.container.appendChild(docFrag);
	};

	/**
	 * createItems
	 *
	 * Create the HTML markup for the lightbox items.
	 *
	 * @private
	 * @memberof MDFLightbox
	 * @since 1.0.0
	 * @version 1.0.1
	 */
	private createItems = () => {
		// Create document fragment.
		const docFrag = document.createDocumentFragment();

		// We simply use this to count the items.
		let itemCounter = 0;

		for (const link of this.links) {
			// Add to the counter for every item.
			itemCounter++;

			// For every link, we create a item container that will hold the media element.
			const itemContainer = document.createElement('li');
			itemContainer.className = classes.item;
			itemContainer.setAttribute(attr.role, 'group');
			itemContainer.setAttribute(attr.roleDescription, 'slide');
			itemContainer.setAttribute(attr.label, `${itemCounter} of ${this.links.length}`);

			// This variable holds the string of HTML we will insert into the item container.
			let mediaHtml: string;

			if (link.hasAttribute(attr.type)) {
				if (link.getAttribute(attr.type) === 'video') {
					// For YouTube or Vimeo videos this will hold the video id.
					const id = link.href.substring(link.href.lastIndexOf('/') + 1);

					if (link.href.includes('youtu.be')) {
						// YouTube embed.
						mediaHtml = `<div class="${classes.mediaWrapper}">
                        <iframe 
                        class="${classes.media}" 
                        src="https://www.youtube.com/embed/${id}?enablejsapi=1" 
                        ${attr.embed}="youtube" 
                        loading="lazy" 
                        allowscriptaccess="always" 
                        allow="fullscreen">
                        </iframe>
                        </div>`;
					} else if (link.href.includes('vimeo')) {
						// Vimeo embed.
						mediaHtml = `<div class="${classes.mediaWrapper}">
                        <iframe 
                        class="${classes.media}" 
                        src="https://player.vimeo.com/video/${id}" 
                        ${attr.embed}="vimeo" 
                        loading="lazy" 
                        allow="fullscreen">
                        </iframe>
                        </div>`;
					} else {
						// Get the video file type.
						const fileType = link.href.split('.').pop();

						// This markup is for regular videos like .mp4 or .webm files.
						mediaHtml = `<div class="${classes.mediaWrapper}">
                        <video 
                        class="${classes.media}" 
                        src="${link.href}" 
                        type="video/${fileType}" 
                        preload="metadata" 
                        controls>
                        Sorry, your browser doesn't support embedded videos.
                        </video> 
                        </div>`;
					}
				} else if (link.getAttribute(attr.type) === 'embed') {
					// This markup is for embedding other websites.
					if (this.options.sandboxing) {
						mediaHtml = `<div class="${classes.mediaWrapper} ${
							this.options.iframeAddBorder ? classes.mediaWrapperBorder : ''
						}">
                        <iframe 
                        class="${classes.media}" 
                        src="${link.href}" 
                        title="${link.getAttribute(attr.title)}" 
                        sandbox="${this.options.sandboxingRules}" 
                        loading="lazy" 
                        allow="fullscreen">
                        </iframe>
                        </div>`;
					} else {
						mediaHtml = `<div class="${classes.mediaWrapper} ${
							this.options.iframeAddBorder ? classes.mediaWrapperBorder : ''
						}">
                        <iframe 
                        class="${classes.media}" 
                        src="${link.href}" 
                        title="${link.getAttribute(attr.title)}" 
                        loading="lazy" 
                        allow="fullscreen">
                        </iframe>
                        </div>`;
					}
				}
			} else {
				// This is for image elements.
				mediaHtml = `<img 
                class="${classes.media}" 
                src="${link.href}" 
                alt="${link.getAttribute(attr.alt)}">`;
			}

			// Add the media element markup to the item container.
			itemContainer.innerHTML = mediaHtml;

			// If necessary, we create the info container.
			if (link.hasAttribute(attr.title) || link.hasAttribute(attr.description)) {
				// The info container holds the item's title and description.
				const infoContainer = document.createElement('div');
				infoContainer.className = classes.info;

				// Set the info container's position (top or bottom).
				if (this.options.titlePos === 'top') {
					infoContainer.style.top = '0';
				} else {
					infoContainer.style.bottom = '0';
				}

				// Set the info container's text alignment (left, center or right).
				infoContainer.style.textAlign = this.options.titleAlign;

				// If available, add the title to the info container.
				if (link.hasAttribute(attr.title)) {
					infoContainer.insertAdjacentHTML(
						'beforeend',
						`<span class="${classes.title}">${link.getAttribute(attr.title)}</span>`
					);
				}

				// If available, add the description to the info container.
				if (link.hasAttribute(attr.description)) {
					infoContainer.insertAdjacentHTML(
						'beforeend',
						`<p class="${classes.description}">${link.getAttribute(attr.description)}</p>`
					);
				}

				// Add the finalized info container to the content container.
				itemContainer.appendChild(infoContainer);
			}

			// Append the item container to the document fragment.
			docFrag.appendChild(itemContainer);
		}

		// Make sure the ligthbox item container is empty first.
		this.itemsContainer.innerHTML = '';

		// Add items to the lightbox items container.
		this.itemsContainer.appendChild(docFrag);

		// Populate the live list of items.
		this.items = this.itemsContainer.getElementsByTagName('li');
	};

	/**
	 * createCopies
	 *
	 * Create a copy of the first and last item for transition purposes.
	 *
	 * @private
	 * @memberof MDFLightbox
	 * @since 1.0.0
	 */
	private createCopies = () => {
		// Get a NodeList of the available items.
		const items: HTMLCollection = this.container.getElementsByClassName(classes.item);

		// Clone the first and last items.
		this.firstItemCopy = items[0].cloneNode(true) as HTMLElement;
		this.lastItemCopy = items[this.items.length - 1].cloneNode(true) as HTMLElement;

		// We want a11y technologies to ignore the copied items.
		this.firstItemCopy.setAttribute(attr.hidden, 'true');
		this.firstItemCopy.removeAttribute(attr.role);
		this.firstItemCopy.removeAttribute(attr.roleDescription);
		this.firstItemCopy.removeAttribute(attr.label);

		this.lastItemCopy.setAttribute(attr.hidden, 'true');
		this.lastItemCopy.removeAttribute(attr.role);
		this.lastItemCopy.removeAttribute(attr.roleDescription);
		this.lastItemCopy.removeAttribute(attr.label);

		// Insert them at opposite ends.
		this.itemsContainer.insertAdjacentElement('beforeend', this.firstItemCopy);
		this.itemsContainer.insertAdjacentElement('afterbegin', this.lastItemCopy);
	};

	/**
	 * setFocusOnFirstElement
	 *
	 * Set focus on the first element in the list of focusable elements.
	 *
	 * @private
	 * @memberof MDFLightbox
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
	 * @memberof MDFLightbox
	 * @since 1.0.0
	 */
	private setFocusOnElem = (index: number) => {
		this.focusableElements[index].focus();
	};

	/**
	 * setFocusOnLastActiveElement
	 *
	 * Set focus on the last element that had focus before we opened the lightbox.
	 *
	 * @private
	 * @memberof MDFLightbox
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
	 * @memberof MDFLightbox
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
	 * @memberof Dialog
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
	 * getVideoType
	 *
	 * Determine wether the displayed video is a hosted video file or embedded stream.
	 *
	 * @param {HTMLElement} elem The element we are testing
	 *
	 * @returns 'video', 'youtube' or 'vimeo'
	 *
	 * @private
	 * @memberof MDFLightbox
	 * @since 1.0.0
	 */
	private getVideoType = (elem: HTMLElement) => {
		if (elem.hasAttribute('type')) {
			// Regular <video> file, no stream embed.
			return 'video';
		} else if (elem.hasAttribute(attr.embed)) {
			// Working with a embedded stream (youtube or vimeo).
			return elem.getAttribute(attr.embed);
		}
	};

	/**
	 * pauseVideo
	 *
	 * Pause the current video.
	 *
	 * @private
	 * @memberof MDFLightbox
	 * @since 1.0.0
	 */
	private pauseVideo = () => {
		// Get the media element of the currently active lightbox item.
		const mediaElement: HTMLElement = this.activeItem.querySelector(selectors.media);

		// Check the media element's type.
		const videoType = this.getVideoType(mediaElement);

		if (videoType === 'youtube') {
			// Pause the YouTube video.
			(mediaElement as HTMLIFrameElement).contentWindow.postMessage(
				'{"event":"command","func":"pauseVideo","args":""}',
				'*'
			);
		} else if (videoType === 'vimeo') {
			// Setup Vimeo player controls.
			// eslint-disable-next-line
			const player = new Player(mediaElement);

			// Pause the Vimeo video.
			// eslint-disable-next-line
			void player.pause();
		} else if (videoType === 'video') {
			// Pause the video file.
			void (mediaElement as HTMLVideoElement).pause();
		}
	};

	/**
	 * playVideo
	 *
	 * Play/resume the current video.
	 *
	 * @private
	 * @memberof MDFLightbox
	 * @since 1.0.0
	 */
	private playVideo = () => {
		// Get the media element of the currently active lightbox item.
		const mediaElement: HTMLElement = this.activeItem.querySelector(selectors.media);

		// Check the media element's type.
		const videoType = this.getVideoType(mediaElement);

		if (videoType === 'youtube') {
			// Play the YouTube video.
			(mediaElement as HTMLIFrameElement).contentWindow.postMessage(
				'{"event":"command","func":"playVideo","args":""}',
				'*'
			);
		} else if (videoType === 'vimeo') {
			// Setup Vimeo player controls.
			// eslint-disable-next-line
			const player = new Player(mediaElement);

			// Play the Vimeo video.
			// eslint-disable-next-line
			void player.play();
		} else if (videoType === 'video') {
			// Play the video file.
			void (mediaElement as HTMLVideoElement).play();
		}
	};

	/**
	 * openLightbox
	 *
	 * Open the lightbox.
	 *
	 * @param {boolean} setFocus Wether to set focus on the first focusable element
	 *
	 * @private
	 * @memberof MDFLightbox
	 * @since 1.0.0
	 */
	private openLightbox = (setFocus?: boolean) => {
		// Activate the lightbox container without making it visible yet.
		this.container.addClass(classes.containerActive);

		// We disable transitions while we initially move the item into place.
		this.itemsContainer.addClass(classes.disableTransitions);

		// Move the lightbox item into place.
		this.itemsContainer.style.transform = `translateX(-${this.activeItem.offsetLeft}px)`;

		// Force repaint to make sure that the transform looks right.
		this.itemsContainer.getBoundingClientRect();

		// Enable transitions again.
		this.itemsContainer.removeClass(classes.disableTransitions);

		// Find the closest parent with a scrollbar and temporarily disable it.
		this.scrollbarParent.addClass(classes.disableScrollbar);

		// Fade-in the lightbox element once the container is ready.
		this.container.addClass(classes.containerFadeIn);

		// Animation where the media element grows to its final size.
		const growMedia = () => {
			this.itemsContainer.removeClass(classes.itemGrow);
			this.itemsContainer.removeEventListener('animationend', growMedia);
		};

		this.itemsContainer.addEventListener('animationend', growMedia);
		this.itemsContainer.addClass(classes.itemGrow);

		// Set `aria-modal` attribute for assistive technologies.
		this.lightbox.setAttribute(attr.modal, 'true');

		// If enabled, play the video once moved into view.
		if (this.options.autoplay) {
			this.playVideo();
		}

		// If needed, put focus on the first focusable element.
		if (setFocus) {
			// We first store the last active element before we opened the lightbox.
			this.lastActiveElement = document.activeElement as HTMLElement;

			// Now we set focus to the first element that can receive focus.
			this.setFocusOnFirstElement();
		}

		// Tell a11y technologies the container is ready.
		this.container.removeAttribute(attr.hidden);

		// If available, execute the callback function for opening the lightbox.
		if (this.options.onOpen) {
			this.options.onOpen();
		}

		// Add lightbox event listeners.
		this.addEvents();

		// Dispatch event letting the user know the lightbox is open.
		this.container.dispatchEvent(new Event(events.opened, { bubbles: true }));
	};

	/**
	 * closeLightbox
	 *
	 * Fade-out the lightbox.
	 *
	 * @private
	 * @memberof MDFLightbox
	 * @since 1.0.0
	 */
	private closeLightbox = () => {
		// Pause the currently playing video before fading out the lightbox.
		this.pauseVideo();

		// Fade-out the container without deactivating it yet.
		this.container.removeClass(classes.containerFadeIn);

		// After the successful fade-out, deactivate the container.
		const afterFadeOut = () => {
			this.container.removeClass(classes.containerActive);
			this.container.setAttribute(attr.hidden, 'true');

			this.container.removeEventListener('transitionend', afterFadeOut);
		};

		// Add the `transitionend` event to know when the fade-out is complete.
		this.container.addEventListener('transitionend', afterFadeOut);

		// Remove the `aria-modal` attribute for a11y technologies.
		this.lightbox.removeAttribute(attr.modal);

		// Restore the scrollbars we hid.
		this.scrollbarParent.removeClass(classes.disableScrollbar);

		// If available, execute the callback function for closing the lightbox.
		if (this.options.onClose) {
			this.options.onClose();
		}

		// Remove event listeners.
		this.removeEvents();

		// Dispatch event letting the user know the lightbox is closed.
		this.container.dispatchEvent(new Event(events.closed, { bubbles: true }));
	};

	/**
	 * changeItem
	 *
	 * Change to the item with the given index.
	 *
	 * @param {boolean} index Item index
	 *
	 * @private
	 * @memberof MDFLightbox
	 * @since 1.0.0
	 */
	private changeItem = (index: number) => {
		// Update the active item.
		this.activeItem = this.items[index] as HTMLLIElement;

		// Move the item into view.
		this.itemsContainer.style.transform = `translateX(-${this.activeItem.offsetLeft}px)`;

		// If enabled, play the video once moved into view.
		if (this.options.autoplay) {
			this.playVideo();
		}

		// If available, execute the callback function for changing the lightbox item.
		if (this.options.onChange) {
			this.options.onChange();
		}

		// Dispatch event letting the user know the active lightbox item changed.
		this.container.dispatchEvent(
			new CustomEvent<MDFLightboxChangedEvent>(events.changed, {
				bubbles: true,
				detail: {
					index: index,
					item: this.activeItem,
				},
			})
		);
	};

	/**
	 * changeItemFromCopy
	 *
	 * Change to the item with the given index starting from a copied item.
	 *
	 * @private
	 * @memberof MDFLightbox
	 * @since 1.0.0
	 */
	private changeItemFromCopy = () => {
		// We temporarily disable transitions.
		this.itemsContainer.addClass(classes.disableTransitions);

		// We show the actual first slide and update our index.
		this.changeItem(this.index);

		// Force repaint, otherwise the transform will not work properly.
		this.itemsContainer.getBoundingClientRect();

		// We use a timeout to make sure that no transition is happening and the slide is in place, before enabling transitions again.
		this.itemsContainer.removeClass(classes.disableTransitions);

		// Remove the event listener again so it does not trigger again.
		this.itemsContainer.removeEventListener('transitionend', this.changeItemFromCopy);
	};

	/**
	 * prevItem
	 *
	 * Switch to the previous item in the lightbox.
	 *
	 * @private
	 * @memberof MDFLightbox
	 * @since 1.0.0
	 *
	 */
	private prevItem = () => {
		if (this.useCopies && this.index === 1) {
			// Update the index (we use `-2` to skip the copied item at the end of the list).
			this.index = this.items.length - 2;

			// Pause the currently playing video before changing the displayed item.
			this.pauseVideo();

			// Move the copy of the last item into view.
			this.itemsContainer.style.transform = `translateX(-${this.lastItemCopy.offsetLeft}px)`;

			// After the transition is over, we replace the copy with the actual item.
			this.itemsContainer.addEventListener('transitionend', this.changeItemFromCopy);
		} else {
			if (this.index >= 1) {
				// Show to the previous item.
				this.index--;
			} else if (this.index === 0) {
				// If we are on the first item, wrap back around to the last item.
				this.index = this.items.length - 1;
			}

			// Pause the currently playing video before changing the displayed item.
			this.pauseVideo();

			// Change the item.
			this.changeItem(this.index);
		}
	};

	/**
	 * nextItem
	 *
	 * Switch to the next item in the lightbox.
	 *
	 * @private
	 * @memberof MDFLightbox
	 * @since 1.0.0
	 *
	 */
	private nextItem = () => {
		if (this.useCopies && this.index === this.items.length - 2) {
			// Update the index (we use `1` to skip the copied item at the start of the list).
			this.index = 1;

			// Pause the currently playing video before changing the displayed item.
			this.pauseVideo();

			// Move the copy of the last item into view.
			this.itemsContainer.style.transform = `translateX(-${this.firstItemCopy.offsetLeft}px)`;

			// After the transition is over, we replace the copy with the actual slide.
			this.itemsContainer.addEventListener('transitionend', this.changeItemFromCopy);
		} else {
			if (this.index === this.items.length - 1) {
				// If we are on the last item, wrap back around to the first item.
				this.index = 0;
			} else if (this.index >= 0) {
				// Show the next item.
				this.index++;
			}

			// Pause the currently playing video before changing the displayed item.
			this.pauseVideo();

			// Change the item.
			this.changeItem(this.index);
		}
	};

	/**
	 * clickLink
	 *
	 * Handle click events on lightbox links.
	 *
	 * @private
	 * @memberof MDFLightbox
	 * @since 1.0.0
	 */
	private clickLink = (evt: MouseEvent) => {
		// Prevent default link behavior.
		evt.preventDefault();

		// Get the clicked lightbox link.
		const _this = evt.currentTarget as HTMLLinkElement;

		// Update the index.
		if (this.useCopies) {
			// We add `+1` if we are using copies to select the correct item.
			this.index = this.links.indexOf(_this) + 1;
		} else {
			this.index = this.links.indexOf(_this);
		}

		// Update the active item.
		this.activeItem = this.items[this.index] as HTMLLIElement;

		// Get the parent element that currently has a scrollbar present.
		this.scrollbarParent = getScrollbarParent(document.activeElement as HTMLElement);

		// Open the lightbox.
		this.openLightbox();
	};

	/**
	 * activateLink
	 *
	 * Handle keyboard events on lightbox links.
	 *
	 * @private
	 * @memberof MDFLightbox
	 */
	private activateLink = (evt: KeyboardEvent) => {
		if (evt.key === 'Enter' || evt.key === ' ') {
			// Prevent default link behavior.
			evt.preventDefault();

			// Get the activated lightbox link.
			const _this = evt.currentTarget as HTMLLinkElement;

			// Update the index.
			if (this.useCopies) {
				// We add `+1` if we are using copies to select the correct item.
				this.index = this.links.indexOf(_this) + 1;
			} else {
				this.index = this.links.indexOf(_this);
			}

			// Update the active item (we add `+1` to compensate for the copies).
			this.activeItem = this.items[this.index] as HTMLLIElement;

			// Get the parent element that currently has a scrollbar present.
			this.scrollbarParent = getScrollbarParent(document.activeElement as HTMLElement);

			// Open the lightbox and set focus on the first focusable element.
			this.openLightbox(true);
		}
	};

	/**
	 * linkEvents
	 *
	 * Add event listeners to the lightbox links.
	 *
	 * @private
	 * @memberof MDFLightbox
	 * @since 1.0.0
	 */
	private linkEvents = () => {
		for (const link of this.links) {
			link.addEventListener('click', this.clickLink);
			link.addEventListener('keydown', this.activateLink);
		}
	};

	/**
	 * clickEvents
	 *
	 * Mouse controls for switching the displayed lightbox item or closing the lightbox.
	 *
	 * @private
	 * @memberof MDFLightbox
	 * @since 1.0.0
	 */
	private clickEvents = (evt: MouseEvent) => {
		// Get the clicked element.
		const _this = evt.target as HTMLElement;

		if (_this.matches(selectors.controlClose)) {
			// Close button: Close the lightbox.
			this.closeLightbox();
		} else if (_this.matches(selectors.controlPrev)) {
			// Prev button: Show the previous item.
			this.prevItem();
		} else if (_this.matches(selectors.controlNext)) {
			// Next button: Show the next item.
			this.nextItem();
		}

		// Close the lightbox if a click is registered outside the media element.
		if (this.options.hideOnClick) {
			if (
				!_this.matches(selectors.media) &&
				!_this.matches(selectors.controlPrev) &&
				!_this.matches(selectors.controlNext) &&
				!_this.matches(selectors.controlClose)
			) {
				this.closeLightbox();
			}
		}
	};

	/**
	 * keyboardEvents
	 *
	 * Add a11y keyboard navigation.
	 *
	 * @private
	 * @memberof MDFLightbox
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

			this.closeLightbox();
			this.setFocusOnLastActiveElement();
		}
	};

	/**
	 * swipeStart
	 *
	 * Start of the touch event.
	 *
	 * @private
	 * @memberof MDFLightbox
	 * @since 1.0.0
	 */
	private swipeStart = (evt: TouchEvent) => {
		if ((evt.target as HTMLElement).matches(selectors.media)) {
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
	 * @memberof MDFLightbox
	 * @since 1.0.0
	 */
	private swipeMove = (evt: TouchEvent) => {
		if ((evt.target as HTMLElement).matches(selectors.media)) {
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
	 * @memberof MDFLightbox
	 * @since 1.0.0
	 */
	private swipeEnd = (evt: TouchEvent) => {
		if ((evt.target as HTMLElement).matches(selectors.media)) {
			evt.stopPropagation();
			evt.preventDefault();

			// Store the coordinates of the swipe stopping points.
			this.touchCoords.touchEndX = evt.changedTouches[0].clientX;
			this.touchCoords.touchEndY = evt.changedTouches[0].clientY;

			// We use these ratios to check wether or not the user is swiping horizontally or vertically.
			const ratioX = Math.abs(
				(this.touchCoords.touchMoveX - this.touchCoords.touchStartX) /
					(this.touchCoords.touchMoveY - this.touchCoords.touchStartY)
			);
			const ratioY = Math.abs(
				(this.touchCoords.touchMoveY - this.touchCoords.touchStartY) /
					(this.touchCoords.touchMoveX - this.touchCoords.touchStartX)
			);

			if (Math.abs(ratioX) > Math.abs(ratioY)) {
				// Only continue if the swipe distance threshold is met.
				if (this.touchCoords.swipeDistanceX > 100) {
					if (this.touchCoords.touchEndX < this.touchCoords.touchStartX) {
						// Swiping left shows the next item.
						this.nextItem();
					} else if (this.touchCoords.touchEndX > this.touchCoords.touchStartX) {
						// Swiping right shows the previous item.
						this.prevItem();
					}
				}

				// We reset the touch coordinates at the end.
				this.touchCoords.touchStartX = 0;
				this.touchCoords.touchStartY = 0;
				this.touchCoords.touchMoveX = 0;
				this.touchCoords.touchMoveY = 0;
				this.touchCoords.touchEndX = 0;
				this.touchCoords.touchEndY = 0;
				this.touchCoords.swipeDistanceX = 0;
			}
		}
	};

	/**
	 * addSwipeEvents
	 *
	 * Add events that allow to switch between items swiping left or right on a touch device.
	 *
	 * @private
	 * @memberof MDFLightbox
	 * @since 1.0.0
	 */
	private addSwipeEvents = () => {
		this.lightbox.addEventListener('touchstart', this.swipeStart);
		this.lightbox.addEventListener('touchmove', this.swipeMove);
		this.lightbox.addEventListener('touchend', this.swipeEnd);
	};

	/**
	 * removeSwipeEvents
	 *
	 * Remove touch events.
	 *
	 * @private
	 * @memberof MDFLightbox
	 * @since 1.0.0
	 */
	private removeSwipeEvents = () => {
		this.lightbox.removeEventListener('touchstart', this.swipeStart);
		this.lightbox.removeEventListener('touchmove', this.swipeMove);
		this.lightbox.removeEventListener('touchend', this.swipeEnd);
	};

	/**
	 * addEvents
	 *
	 * Add event listeners.
	 *
	 * @private
	 * @memberof MDFLightbox
	 * @since 1.0.0
	 */
	private addEvents = () => {
		// Click events and keyboard controls.
		this.container.addEventListener('click', this.clickEvents);
		document.addEventListener('keydown', this.keyboardEvents);

		// If enabled, touch controls.
		if (this.options.enableSwipe) {
			this.addSwipeEvents();
		}
	};

	/**
	 * removeEvents
	 *
	 * Remove event listeners.
	 *
	 * @private
	 * @memberof MDFLightbox
	 * @since 1.0.0
	 */
	private removeEvents = () => {
		// Click events and keyboard controls.
		this.container.removeEventListener('click', this.clickEvents);
		document.removeEventListener('keydown', this.keyboardEvents);

		// If enabled, touch controls.
		if (this.options.enableSwipe) {
			this.removeSwipeEvents();
		}
	};
}
