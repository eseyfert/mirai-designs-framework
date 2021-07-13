const attr = {
	hidden: 'aria-hidden',
	modal: 'aria-modal',
};

const classes = {
	active: 'mdf-dialog-container--active',
	fadeIn: 'mdf-dialog-container--fade-in',
	transition: 'mdf-dialog--transition',
};

const events = {
	opened: 'MDFDialog:opened',
	closed: 'MDFDialog:closed',
};

const selectors = {
	container: '.mdf-dialog-container',
	content: '.mdf-dialog__content',
	text: '.mdf-dialog__text',
	focus: 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe:not([tabindex^="-"]), [tabindex]:not([tabindex^="-"])',
	closeButton: '.mdf-dialog__close',
	cancelButton: '[data-dialog-action="cancel"]',
	confirmButton: '[data-dialog-action="confirm"]',
};

export { attr, classes, events, selectors };
