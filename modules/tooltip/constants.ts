const attr = {
	describedBy: 'aria-describedby',
	hidden: 'aria-hidden',
	position: 'data-tooltip-pos',
	role: 'aria-role',
	tooltip: 'data-tooltip',
};

const classes = {
	tooltip: 'mdf-tooltip',
	scale: 'mdf-tooltip--scale',
	active: 'mdf-tooltip--active',
};

const events = {
	active: 'MDFTooltip:active',
	hidden: 'MDFTooltip:hidden',
};

export { attr, classes, events };
