const attr = {
	active: 'aria-activedescendant',
	expanded: 'aria-expanded',
	selected: 'aria-selected',
	value: 'data-value',
};

const classes = {
	buttonFocus: 'mdf-select__button--focus',
	labelFloating: 'mdf-select__label--floating',
	labelFocus: 'mdf-select__label--focus',
	listItemSelected: 'mdf-list__item--selected',
	menuActive: 'mdf-menu--active',
	selectOpen: 'mdf-select--open',
};

const events = {
	changed: 'MDFSelect:changed',
	closed: 'MDFSelect:closed',
	opened: 'MDFSelect:opened',
};

const selectors = {
	button: '.mdf-select__button',
	label: '.mdf-select__label',
	text: '.mdf-select__text',
	menu: '.mdf-select__menu',
	list: '.mdf-list',
	listItem: '.mdf-list__item',
	listItemSelected: '.mdf-list__item--selected',
	input: '.mdf-select__input',
};

export { attr, classes, events, selectors };
