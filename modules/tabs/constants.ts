const attr = {
	index: 'tabindex',
	selected: 'aria-selected',
};

const classes = {
	panel: 'mdf-tabs__panel',
	panelActive: 'mdf-tabs__panel--active',
	selectionActive: 'mdf-tabs__selection--active',
	stopTransitions: 'mdf-disable-transitions',
	tab: 'mdf-tabs__tab',
	tabSelected: 'mdf-tabs__tab--selected',
};

const events = {
	changed: 'MDFTabs:changed',
};

const selectors = {
	bar: '.mdf-tabs__bar',
	container: '.mdf-tabs',
	panel: '.mdf-tabs__panel',
	panelActive: '.mdf-tabs__panel--active',
	selection: '.mdf-tabs__selection',
	selectionBar: '.mdf-tabs__selection-bar',
	tab: '.mdf-tabs__tab',
	tabSelected: '.mdf-tabs__tab--selected',
};

export { attr, classes, events, selectors };
