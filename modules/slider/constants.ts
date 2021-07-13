const attr = {
	description: 'aria-roledescription',
	dir: 'dir',
	hidden: 'aria-hidden',
	index: 'data-slider-nav-index',
	label: 'aria-label',
	role: 'role',
};

const classes = {
	disableTransitions: 'mdf-disable-transitions',
	dragging: 'mdf-slider--is-dragging',
	nav: 'mdf-slider-nav',
	navTop: 'mdf-slider-nav--top',
	navItem: 'mdf-slider-nav__item',
	navItemActive: 'mdf-slider-nav__item--active',
};

const events = {
	changed: 'MDFSlider:changed',
};

const selectors = {
	container: '.mdf-slider',
	slides: '.mdf-slider__slides',
	slide: '.mdf-slider__slide',
	media: '.mdf-slider__media',
	nav: '.mdf-slider-nav',
	navItem: '.mdf-slider-nav__item',
	prev: '[data-slider-action="prev"]',
	next: '[data-slider-action="next"]',
};

export { attr, classes, events, selectors };
