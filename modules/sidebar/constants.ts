const attr = {
	hidden: 'aria-hidden',
	modal: 'aria-modal',
};

const classes = {
	active: 'mdf-sidebar-container--active',
	move: 'mdf-sidebar-container--move-in',
};

const events = {
	closed: 'MDFSidebar:closed',
	opened: 'MDFSidebar:opened',
};

const selectors = {
	container: '.mdf-sidebar-container',
	backdrop: '.mdf-sidebar-backdrop',
	content: '.mdf-sidebar__content',
	closeButton: '.mdf-sidebar__close',
	focus: 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe:not([tabindex^="-"]), [tabindex]:not([tabindex^="-"])',
};

export { attr, classes, events, selectors };
