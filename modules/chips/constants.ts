const attr = {
	hidden: 'aria-hidden',
	index: 'tabindex',
	label: 'aria-label',
	role: 'role',
};

const classes = {
	chip: 'mdf-chips__chip',
	text: 'mdf-chips__text',
	action: 'mdf-chips__action',
	icon: 'mdf-icon',
	active: 'mdf-chips--active',
};

const events = {
	added: 'MDFChips:added',
	deleted: 'MDFChips:deleted',
};

const selectors = {
	grid: '.mdf-chips__grid',
	text: '.mdf-chips__text',
	action: '.mdf-chips__action',
	input: '.mdf-chips__input',
	live: '[aria-live]',
	row: '[role="row"]',
	cell: '[role="gridcell"]',
	focus: '.mdf-chips__text, .mdf-chips__action',
};

export { attr, classes, events, selectors };
