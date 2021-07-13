const attr = {
	callback: 'data-menu-callback',
	expanded: 'aria-expanded',
	hidden: 'aria-hidden',
	menu: 'data-menu',
	role: 'role',
};

const classes = {
	active: 'mdf-menu--active',
	disabled: 'mdf-list__item--disabled',
	item: 'mdf-list__item',
	transitions: 'mdf-disable-transitions',
};

const events = {
	activated: 'MDFMenu:activated',
	closed: 'MDFMenu:closed',
	opened: 'MDFMenu:opened',
};

const selectors = {
	anchor: '[data-menu]',
	item: '[role="menuitem"]',
	list: '[role="menu"]',
	menu: '.mdf-menu',
	quickAnchor: '.mdf-quick-menu button',
	quickContainer: '.mdf-quick-menu',
	quickItem: '.mdf-quick-menu .mdf-menu__item',
	quickMenu: '.mdf-quick-menu .mdf-menu',
};

export { attr, classes, events, selectors };
