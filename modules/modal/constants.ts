const classes = {
	active: 'mdf-modal--active',
	disableScrollbar: 'mdf-scrollbar-hidden',
	fadeIn: 'mdf-modal--fade-in',
	loadingActive: 'mdf-modal__loading--active',
};

const events = {
	closed: 'MDFModal:closed',
	load: 'MDFModal:load',
	open: 'MDFModal:open',
};

const selectors = {
	backdrop: '.mdf-modal__backdrop',
	container: '.mdf-modal',
	close: '.mdf-modal__close',
	content: '.mdf-modal__content',
	focusableElements:
		'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]',
	loading: '.mdf-modal__loading',
};

export { classes, events, selectors };
