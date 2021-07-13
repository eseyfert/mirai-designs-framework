const attr = {
	live: 'aria-live',
	message: 'data-snackbar-message',
};

const classes = {
	active: 'mdf-snackbar--active',
};

const events = {
	opened: 'MDFSnackbar:opened',
	closed: 'MDFSnackbar:closed',
};

const selectors = {
	text: '.mdf-snackbar__text',
	action: '[data-snackbar-action="action"]',
	close: '[data-snackbar-action="close"]',
};

export { attr, classes, events, selectors };
