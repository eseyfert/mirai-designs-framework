const attr = {
	action: 'data-alert-action',
};

const classes = {
	active: 'mdf-alert--active',
	move: 'mdf-alert--move-in',
};

const events = {
	opened: 'MDFAlert:opened',
	closed: 'MDFAlert:closed',
};

const selectors = {
	text: '.mdf-alert__text',
	action: '[data-alert-action]',
};

export { attr, classes, events, selectors };
