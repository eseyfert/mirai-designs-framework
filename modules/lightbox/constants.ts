const attr = {
	alt: 'data-lightbox-alt',
	controls: 'aria-controls',
	description: 'data-lightbox-description',
	dir: 'dir',
	embed: 'data-lightbox-embed',
	hidden: 'aria-hidden',
	label: 'aria-label',
	lightbox: 'data-lightbox',
	live: 'aria-live',
	modal: 'aria-modal',
	role: 'role',
	roleDescription: 'aria-roledescription',
	title: 'data-lightbox-title',
	type: 'data-lightbox-type',
};

const classes = {
	disableTransitions: 'mdf-disable-transitions',
	disableScrollbar: 'mdf-scrollbar-hidden',
	icon: 'mdf-icon',
	container: 'mdf-lightbox-container',
	containerActive: 'mdf-lightbox-container--active',
	containerFadeIn: 'mdf-lightbox-container--fade-in',
	lightbox: 'mdf-lightbox',
	items: 'mdf-lightbox__items',
	item: 'mdf-lightbox__item',
	itemGrow: 'mdf-lightbox__item--grow',
	info: 'mdf-lightbox__info',
	title: 'mdf-lightbox__title',
	description: 'mdf-lightbox__description',
	mediaWrapper: 'mdf-lightbox__media-wrapper',
	mediaWrapperBorder: 'mdf-lightbox__media-wrapper--bordered',
	media: 'mdf-lightbox__media',
	video: 'mdf-lightbox__media--video',
	control: 'mdf-lightbox__control',
	controlClose: 'mdf-lightbox__control--close',
	controlPrev: 'mdf-lightbox__control--prev',
	controlNext: 'mdf-lightbox__control--next',
	backdrop: 'mdf-lightbox-backdrop',
};

const events = {
	changed: 'MDFLightbox:changed',
	closed: 'MDFLightbox:closed',
	opened: 'MDFLightbox:opened',
};

const selectors = {
	controlClose: '.mdf-lightbox__control--close',
	controlPrev: '.mdf-lightbox__control--prev',
	controlNext: '.mdf-lightbox__control--next',
	focus: 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe:not([tabindex^="-"]), [tabindex]:not([tabindex^="-"])',
	media: '.mdf-lightbox__media',
};

export { attr, classes, events, selectors };
