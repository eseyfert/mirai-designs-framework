const attr = {
	checked: 'aria-checked',
	format: 'data-date-format',
	sort: 'aria-sort',
	rowCount: 'aria-rowcount',
	rowIndex: 'aria-rowindex',
	tooltip: 'data-tooltip',
	type: 'data-column-type',
};

const classes = {
	condensed: 'mdf-table--condensed',
	headerActive: 'mdf-table__header--active',
	sortASC: 'mdf-table__header--sort-asc',
	sortDESC: 'mdf-table__header--sort-desc',
	checkboxChecked: 'mdf-checkbox--checked',
	checkboxIntermediate: 'mdf-checkbox--indeterminate',
	rowSelected: 'mdf-table__row--selected',
	paginationControlDisabled: 'mdf-table__pagination-control--disabled',
};

const events = {
	paginated: 'MDFTable:paginated',
	sorted: 'MDFTable:sorted',
};

const selectors = {
	checkbox: '.mdf-checkbox',
	checkboxInput: '.mdf-checkbox__input',
	container: '.mdf-table',
	header: '.mdf-table__header',
	pagination: '.mdf-table__pagination',
	paginationSelect: '.mdf-table__pagination-select',
	paginationStats: '.mdf-table__pagination-stats',
	paginationPrev: '[data-pagination-action="prev"]',
	paginationNext: '[data-pagination-action="next"]',
	selectedRows: '.mdf-table__row--selected',
	sortable: '.mdf-table__header--sortable',
	row: '.mdf-table__row',
	table: '.mdf-table__table',
};

const strings = {
	spacing: 'mirai-table-spacing',
	itemsPerPage: 'mirai-table-page-limit',
};

export { attr, classes, events, selectors, strings };
