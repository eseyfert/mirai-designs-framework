import '@miraidesigns/base';
import { isRTL } from '@miraidesigns/utils';
import { MDFCheckbox } from '@miraidesigns/checkbox';
import { MDFSelect } from '@miraidesigns/select';
import { attr, classes, events, selectors, strings } from './constants';
import { MDFTableOptions, MDFTablePaginatedEvent, MDFTableSortedEvent } from './types';

/**
 * MDFTable
 *
 * Allows for manipulation of tabular data such as sorting, filtering and paginating.
 *
 * @export
 * @class MDFTable
 * @version 1.0.0
 */
export class MDFTable {
	public readonly body: HTMLTableSectionElement;
	public readonly container: HTMLElement;
	public readonly head: HTMLTableSectionElement;
	public readonly options: MDFTableOptions;
	public readonly pagination: HTMLElement;
	public readonly rows: HTMLTableRowElement[];
	public readonly table: HTMLTableElement;

	private currPage: number;
	private defaults: MDFTableOptions;
	private headers: NodeListOf<HTMLTableCellElement>;
	private checkboxes: NodeListOf<HTMLInputElement>;
	private checkboxHeader: MDFCheckbox;
	private filteredRows: HTMLTableRowElement[];
	private itemsPerPage: number;
	private isSorted: boolean;
	private pages: number;
	private paginationPrev: HTMLElement;
	private paginationNext: HTMLElement;
	private paginationStats: HTMLElement;
	private paginationSelect: MDFSelect;
	private selectedRows: number;
	private sortASC: boolean;

	/**
	 * Creates an instance of Table.
	 *
	 * @param {Element} container The table container element
	 * @param {MDFTableOptions} [options] Object holding user options
	 *
	 * @memberof MDFTable
	 * @since 1.0.0
	 */
	constructor(container: Element, options?: MDFTableOptions) {
		// If the supplied element doesn't exist, abort the script.
		if (!container) return;

		// Store a reference to the given element.
		this.container = container as HTMLElement;

		// Get the table element.
		this.table = this.container.querySelector(selectors.table);

		// Don't continue if the table element doesn't exist.
		if (!this.table) return;

		// Default options values.
		this.defaults = {
			sortable: false,
			sortOnLoad: false,
			sortColumn: 0,
			order: 'ASC',
			setAriaCount: false,
			truncateHeaders: false,
			headersCharLimit: 0,
			paginate: false,
			itemsPerPage: 50,
			scrollIntoView: false,
			savePreferences: false,
		};

		// Merge defaults with user specified options.
		this.options = Object.assign({}, this.defaults, options);

		// Get the table head and body.
		this.head = this.table.getElementsByTagName('thead')[0];
		this.body = this.table.getElementsByTagName('tbody')[0];

		// Get a list of available table header elements.
		this.headers = this.head.querySelectorAll(selectors.header);

		// Create an array of the available table row elements for easier sorting and filtering.
		this.rows = Array.from(this.body.getElementsByTagName('tr'));

		// Check if we have checkboxes present in the table.
		this.checkboxes = this.table.querySelectorAll(selectors.checkboxInput);

		// If available, cache the checkbox in the table headers. We will use it later in the script.
		if (this.checkboxes) {
			// Get the header checkbox and initiate it with our `MDFCheckbox` module.
			this.checkboxHeader = new MDFCheckbox(document.querySelector(selectors.checkbox));

			// We use this variable to keep count of how many rows are selected.
			this.selectedRows = 0;
		}

		// We use this to decide initial sorting and to keep track of sorting order.
		this.sortASC = this.options.order === 'ASC' ? true : false;

		// Keep track of wether or not the table has been sorted yet.
		this.isSorted = false;

		// If enabled, set `aria-rowcount` and `aria-rowindex` for assistive technologies.
		if (this.options.setAriaCount) {
			this.ariaRowCount();
		}

		// If enabled, truncate table header text.
		if (this.options.truncateHeaders) {
			this.truncateHeaders(this.options.headersCharLimit);
		}

		// If enabled, set the table spacing saved in localStorage.
		if (this.options.savePreferences && localStorage.getItem(strings.spacing)) {
			this.applySpacing();
		}

		// If enabled, sort the table on page load.
		if (this.options.sortOnLoad) {
			this.sortColumn(this.options.sortColumn);

			// Get the header that belongs to the column.
			const header = this.headers[this.options.sortColumn];

			// Set the header as active.
			header.addClass(classes.headerActive);

			// Add the sorting attr we need.
			if (this.sortASC) {
				header.addClass(classes.sortASC);
				header.setAttribute(attr.sort, 'ascending');
			} else {
				header.addClass(classes.sortDESC);
				header.setAttribute(attr.sort, 'descending');
			}

			// Update the table `isSorted` state.
			this.isSorted = true;
		}

		// If enabled, paginate the table data.
		if (this.options.paginate) {
			// Get the pagination element.
			this.pagination = this.container.querySelector(selectors.pagination);

			// Don't continue if the pagination element doesn't exist.
			if (!this.pagination) return;

			// We use this element to display the pagination stats.
			this.paginationStats = this.container.querySelector(selectors.paginationStats);

			// Here we check wether or not the page is being displayed RTL (right to left).
			if (isRTL) {
				// We create a bdi element to wrap our pagination stats. This element helps display the numbers in correct order.
				const bdi = document.createElement('bdi');

				// We add the new bdi element on top of our pagination stats.
				this.paginationStats.parentNode.insertBefore(bdi, this.paginationStats);

				// And then we move the stats inside the newly created bdi element.
				bdi.appendChild(this.paginationStats);
			}

			// Go to the previous or next page using these elements.
			this.paginationPrev = this.container.querySelector(selectors.paginationPrev);
			this.paginationNext = this.container.querySelector(selectors.paginationNext);

			// If available, get the stored user preference for the page limit, otherwise use the value set in options.
			this.itemsPerPage = localStorage.getItem(strings.itemsPerPage)
				? +localStorage.getItem(strings.itemsPerPage)
				: this.options.itemsPerPage;

			// Make sure the select element exists.
			if (this.container.querySelector(selectors.paginationSelect)) {
				// Create a new instance of our MDFSelect class.
				this.paginationSelect = new MDFSelect(this.container.querySelector(selectors.paginationSelect));

				// Update the displayed text and value.
				this.paginationSelect.text = this.itemsPerPage.toString();
				this.paginationSelect.value = this.itemsPerPage.toString();

				// Set the corresponding element as selected.
				this.paginationSelect.setSelectedElem(
					document.querySelector(`${selectors.paginationSelect} [data-value="${this.itemsPerPage}"]`)
				);
			}

			// Paginate the table data.
			this.paginate(this.itemsPerPage);
		}

		// Add event listeners.
		this.addEvents();
	}

	/**
	 * getSelectedRows
	 *
	 * Returns an Array of all selected table row elements.
	 *
	 * @returns {Array}
	 * @memberof MDFTable
	 * @since 1.0.0
	 */
	public getSelectedRows = (): HTMLTableRowElement[] => {
		return Array.from(this.table.querySelectorAll(selectors.selectedRows));
	};

	/**
	 * getFilteredRows
	 *
	 * Returns an Array of all filtered table row elements.
	 *
	 * @returns {Array}
	 * @memberof MDFTable
	 * @since 1.0.0
	 */
	public getFilteredRows = (): HTMLTableRowElement[] => {
		return this.filteredRows;
	};

	/**
	 * getSelectModule
	 *
	 * Returns the instance of the MDFSelect module.
	 *
	 * @returns {MDFSelect}
	 * @memberof MDFTable
	 * @since 1.0.0
	 */
	public getSelectModule = (): MDFSelect => {
		if (this.paginationSelect) {
			return this.paginationSelect;
		}
	};

	/**
	 * hasBeenSorted
	 *
	 * Returns wether or not the table has been sorted yet.
	 *
	 * @memberof MDFTable
	 * @since 1.0.0
	 */
	public hasBeenSorted = (): boolean => {
		return this.isSorted;
	};

	/**
	 * getSortingOrder
	 *
	 * Returns the table's sorting order. Either `ASC` or `DESC`.
	 *
	 * @returns {string}
	 * @memberof MDFTable
	 * @since 1.0.0
	 */
	public getSortingOrder = (): string => {
		return this.sortASC ? 'ASC' : 'DESC';
	};

	/**
	 * getPages
	 *
	 * Returns the number of pages available.
	 *
	 * @returns {number}
	 * @memberof MDFTable
	 * @since 1.0.0
	 */
	public getPages = (): number => {
		return this.pages;
	};

	/**
	 * getCurrentPage
	 *
	 * Returns the current page number.
	 *
	 * @returns {number}
	 * @memberof MDFTable
	 * @since 1.0.0
	 */
	public getCurrentPage = (): number => {
		return this.currPage;
	};

	/**
	 * getItemsPerPage
	 *
	 * Returns the current items per page limit.
	 *
	 * @returns {number}
	 * @memberof MDFTable
	 * @since 1.0.0
	 */
	public getItemsPerPage = (): number => {
		if (localStorage.getItem(strings.itemsPerPage)) {
			return +localStorage.getItem(strings.itemsPerPage);
		} else {
			return this.itemsPerPage;
		}
	};

	/**
	 * filter
	 *
	 * Filter table with the supplied value.
	 *
	 * @param {string} value Input value to filter the data by
	 * @param {number} column Only filter a specific column
	 * @memberof MDFTable
	 * @since 1.0.0
	 */
	public filter = (value: string, column?: number): void => {
		// Create array of filtered results to use in other functions.
		this.filteredRows = this.rows.filter((el) => {
			if (column) {
				return el.cells[column].textContent.toUpperCase().includes(value.toUpperCase());
			} else {
				return el.textContent.toUpperCase().includes(value.toUpperCase());
			}
		});

		// Hide all table row elements.
		for (const row of this.rows) {
			row.hide();
		}

		// Show the row elements that match the input value.
		for (const row of this.filteredRows) {
			row.show();
		}
	};

	/**
	 * toggleSpacing
	 *
	 * Toggle between `regular` and `condensed` spacing.
	 * Optionally, save preference in localStorage.
	 *
	 * @memberof MDFTable
	 * @since 1.0.0
	 */
	public toggleSpacing = (): void => {
		// Toggle the `condensed` class.
		this.container.toggleClass(classes.condensed);

		// If enabled, we will update the user preference in localStorage.
		if (this.options.savePreferences) {
			window.addEventListener('unload', () => this.updateSpacing);
		}
	};

	/**
	 * paginate
	 *
	 * Paginate table data limiting the number of table rows displayed per page.
	 *
	 * @param {number} limit Number of table rows per page
	 *
	 * @memberof MDFTable
	 * @since 1.0.0
	 */
	public paginate = (limit: number): void => {
		// Update the page limit.
		this.itemsPerPage = limit;

		// If enabled, we will update the user preference in localStorage.
		if (this.options.savePreferences) {
			this.updatePageLimit();
		}

		// At the beginning, we always make sure that all rows are visible.
		const rowsToShow = this.filteredRows ? this.filteredRows : this.rows;

		for (const row of rowsToShow) {
			row.show();
		}

		// Keep track of what page we are on. We always start on page 1.
		this.currPage = 1;

		// Total amount of rows available.
		const rowsTotal = this.filteredRows ? this.filteredRows.length : this.rows.length;

		// Array of row elements that we will hide.
		const rowsToHide = this.filteredRows
			? this.filteredRows.slice(this.itemsPerPage)
			: this.rows.slice(this.itemsPerPage);

		// Total number of pages we have.
		this.pages = Math.ceil(rowsTotal / this.itemsPerPage);

		if (this.pages > 1) {
			// The starting and end range of our pagination.
			const paginateFrom = this.itemsPerPage * (this.currPage - 1);
			const paginateTo = paginateFrom + this.itemsPerPage;

			// Set the stats text.
			this.paginationStats.textContent = `${(paginateFrom + 1).toString()}-${paginateTo} of ${rowsTotal}`;

			// Hide the table row elements that move to the next page.
			for (const row of rowsToHide) {
				row.hide();
			}

			// We add the event listeners for our `previous` and `next` actions.
			this.paginationPrev.addEventListener('click', this.prevPage);
			this.paginationNext.addEventListener('click', this.nextPage);

			// Disable the `previous` control if we are on the first page.
			this.paginationPrev.addClass(classes.paginationControlDisabled);

			// And make sure the `next` control is enabled.
			this.paginationNext.removeClass(classes.paginationControlDisabled);
		} else {
			// If we have only one page to display, we simply show all available table row elements.
			const rowsToShow = this.filteredRows ? this.filteredRows : this.rows;

			for (const row of rowsToShow) {
				row.show();
			}

			// Set the stats text.
			this.paginationStats.textContent = `1-${rowsTotal} of ${rowsTotal}`;

			// And we make sure to disable the action elements.
			this.paginationPrev.addClass('click', classes.paginationControlDisabled);
			this.paginationNext.addClass('click', classes.paginationControlDisabled);
		}

		// Dispatch custom event with pagination details.
		this.pagination.dispatchEvent(
			new CustomEvent<MDFTablePaginatedEvent>(events.paginated, {
				bubbles: true,
				detail: {
					currPage: this.currPage,
					items: rowsToShow,
				},
			})
		);
	};

	/**
	 * prevPage
	 *
	 * Change to the previous page of table data.
	 *
	 * @private
	 * @memberof MDFTable
	 * @since 1.0.0
	 */
	private prevPage = () => {
		// Don't continue if we can't go back any further.
		if (this.currPage < 2) return;

		// Go back to the previous page.
		--this.currPage;

		// The starting and end range of our pagination.
		const paginateFrom = this.itemsPerPage * (this.currPage - 1);
		const paginateTo = paginateFrom + this.itemsPerPage;

		// The table row elements that will be shown for this page.
		const rowsToShow = this.filteredRows
			? this.filteredRows.slice(paginateFrom, paginateTo)
			: this.rows.slice(paginateFrom, paginateTo);

		// Hide all table row elements first.
		for (const row of this.rows) {
			row.hide();
		}

		// Then display the rows we need.
		for (const row of rowsToShow) {
			row.show();
		}

		// Total amount of rows available.
		const rowsTotal = this.filteredRows ? this.filteredRows.length : this.rows.length;

		// Set the stats text.
		this.paginationStats.textContent = `${(paginateFrom + 1).toString()}-${paginateTo} of ${rowsTotal}`;

		// Only do this if we landed on the first page.
		if (this.currPage === 1) {
			// Disable the `previous` control element.
			this.paginationPrev.addClass(classes.paginationControlDisabled);
		}

		// Make sure the `next` control is enabled.
		this.paginationNext.removeClass(classes.paginationControlDisabled);

		// If enabled, scroll to the top of the table when selecting a new page.
		if (this.options.scrollIntoView) {
			this.container.scrollIntoView({
				behavior: 'smooth',
			});
		}

		// Dispatch custom event with pagination details.
		this.pagination.dispatchEvent(
			new CustomEvent<MDFTablePaginatedEvent>(events.paginated, {
				bubbles: true,
				detail: {
					currPage: this.currPage,
					items: rowsToShow,
				},
			})
		);
	};

	/**
	 * nextPage
	 *
	 * Change to the next page of table data.
	 *
	 * @private
	 * @memberof MDFTable
	 * @since 1.0.0
	 */
	private nextPage = () => {
		// Don't continue if we can't go forwards any further.
		if (this.currPage === this.pages) return;

		// Go forwards to the next page.
		++this.currPage;

		// The starting and end range of our pagination.
		const paginateFrom = this.itemsPerPage * (this.currPage - 1);
		const paginateTo = paginateFrom + this.itemsPerPage;

		// The table row elements that will be shown for this page.
		const rowsToShow = this.filteredRows
			? this.filteredRows.slice(paginateFrom, paginateTo)
			: this.rows.slice(paginateFrom, paginateTo);

		// Hide all table row elements first.
		for (const row of this.rows) {
			row.hide();
		}

		// Then display the rows we need.
		for (const row of rowsToShow) {
			row.show();
		}

		// Total amount of rows available.
		const rowsTotal = this.filteredRows ? this.filteredRows.length : this.rows.length;

		// Set the stats text.
		this.paginationStats.textContent = `${(paginateFrom + 1).toString()}-${
			this.currPage === this.pages ? rowsTotal : paginateTo
		} of ${rowsTotal}`;

		// Disable the `next` control if we landed on the last page.
		if (this.currPage === this.pages) {
			this.paginationNext.addClass(classes.paginationControlDisabled);
		}

		// Make sure the `previous` control is enabled.
		this.paginationPrev.removeClass(classes.paginationControlDisabled);

		// If enabled, scroll to the top of the table when selecting a new page.
		if (this.options.scrollIntoView) {
			this.container.scrollIntoView({
				behavior: 'smooth',
			});
		}

		// Dispatch custom event with pagination details.
		this.pagination.dispatchEvent(
			new CustomEvent<MDFTablePaginatedEvent>(events.paginated, {
				bubbles: true,
				detail: {
					currPage: this.currPage,
					items: rowsToShow,
				},
			})
		);
	};

	/**
	 * ariaRowCount
	 *
	 * Count total amount of table rows available and set necessary `aria-` attr.
	 *
	 * @private
	 * @memberof MDFTable
	 */
	private ariaRowCount = () => {
		// Get all available table row elements.
		const rows = this.table.getElementsByTagName('tr');

		// Inform assistive technologies about the total number of rows available.
		this.table.setAttribute(attr.rowCount, rows.length.toString());

		// Table row count.
		let counter = 0;

		// Loop through all table rows and set their index.
		for (const row of rows) {
			// Increase the counter for each row counted.
			counter++;

			// Set the row index for assistive technologies.
			row.setAttribute(attr.rowIndex, counter.toString());
		}
	};

	/**
	 * truncateHeaders
	 *
	 * Will truncate header text and add a tooltip attribute containing the original string.
	 *
	 * @param {number} charLimit Character limit for table header text
	 *
	 * @private
	 * @memberof MDFTable
	 * @since 1.0.0
	 */
	private truncateHeaders = (charLimit: number) => {
		// Make sure the headers character limit is higher than 0.
		if (charLimit > 0) {
			// Loop through the list of table header elements.
			for (const header of this.headers) {
				// Save the original header text string.
				const origStr = header.textContent;

				if (header.textContent.length > charLimit) {
					// Replace header text with shortened version.
					header.textContent = origStr.truncate(charLimit);

					// Add original header text to tooltip attribute.
					header.setAttribute(attr.tooltip, origStr);
				}
			}
		}
	};

	/**
	 * updatePageLimit
	 *
	 * Set or update the page limit value in localStorage.
	 *
	 * @private
	 * @memberof MDFTable
	 * @since 1.0.0
	 */
	private updatePageLimit = () => {
		localStorage.setItem(strings.itemsPerPage, this.itemsPerPage.toString());
	};

	/**
	 * updateSpacing
	 *
	 * Set or update the table spacing value in localStorage.
	 *
	 * @private
	 * @memberof MDFTable
	 * @since 1.0.0
	 */
	private updateSpacing = () => {
		if (this.container.hasClass(classes.condensed)) {
			localStorage.setItem(strings.spacing, 'condensed');
		} else {
			localStorage.setItem(strings.spacing, 'regular');
		}
	};

	/**
	 * applySpacing
	 *
	 * Applies the table spacing value saved in localStorage on page load.
	 *
	 * @private
	 * @memberof MDFTable
	 * @since 1.0.0
	 */
	private applySpacing = () => {
		switch (localStorage.getItem(strings.spacing)) {
			case 'regular':
				this.container.removeClass(classes.condensed);
				break;
			case 'condensed':
				this.container.addClass(classes.condensed);
				break;
		}
	};

	/**
	 * convertStringToDate
	 *
	 * Convert string to Date object with the proper format.
	 *
	 * @param {string} date The string containing the date
	 * @param {string} format The date's format (DMY, MDY, YMD, YDM)
	 *
	 * @example this.convertStringToDate('01/01/2020', 'MDY')
	 */
	private convertStringToDate = (date: string, format: string) => {
		// Split the string at the delimiter.
		const splitDate = date.split(/[.-/]/);

		// This variable will hold our new Date object.
		let finalDate;

		switch (format) {
			case 'DMY':
				// Create Date object with day/month/year format.
				finalDate = new Date(+splitDate[2], +splitDate[1], +splitDate[0]);
				break;
			case 'MDY':
				// Create Date object with month/day/year format.
				finalDate = new Date(+splitDate[2], +splitDate[0], +splitDate[1]);
				break;
			case 'YMD':
				// Create Date object with year/month/day format.
				finalDate = new Date(+splitDate[0], +splitDate[1], +splitDate[2]);
				break;
			case 'YDM':
				// Create Date object with year/day/month format.
				finalDate = new Date(+splitDate[0], +splitDate[2], +splitDate[1]);
				break;
		}

		// Return the Date object for use in the `sortColumn` script.
		return finalDate;
	};

	/**
	 * sortColumn
	 *
	 * Sort the supplied column in either ASC or DESC order.
	 *
	 * @param {number} column Table column index
	 *
	 * @private
	 * @memberof MDFTable
	 * @since 1.0.0
	 */
	private sortColumn = (column: number) => {
		// Get the table header element associated with the column.
		const header = this.headers[column];

		// We check to see if we are expecting dates inside the column.
		if (header.hasAttribute(attr.type) && header.getAttribute(attr.type) === 'Date') {
			// We sort through the table row elements by comparing two cells and switch their position if necessary.
			this.rows.sort((a, b) => {
				// We get the two cells we will be comparing.
				const d1 = a.cells[column];
				const d2 = b.cells[column];

				// We make sure both cells have a specified date format.
				if (d1.hasAttribute(attr.format) && d2.hasAttribute(attr.format)) {
					// We convert the table cell data to proper Date objects we can sort.
					const s1 = this.convertStringToDate(d1.textContent, d1.getAttribute(attr.format));
					const s2 = this.convertStringToDate(d2.textContent, d2.getAttribute(attr.format));

					if (this.sortASC) {
						// Sort with ASC order.
						return s1 < s2 ? -1 : s1 > s2 ? 1 : 0;
					} else {
						// Sort with DESC order.
						return s2 < s1 ? -1 : s2 > s1 ? 1 : 0;
					}
				} else {
					throw new Error(`Make sure table cells have the ${attr.format} attribute`);
				}
			});
		} else {
			// We use the Collator object to compare the strings for sorting. It will follow a natural order aware of text and numbers.
			const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

			// We sort through the table row elements by comparing two cells and switch their position if necessary.
			this.rows.sort((a, b) => {
				// Get the text contents of the two cells we will compare.
				const s1 = a.cells[column].textContent;
				const s2 = b.cells[column].textContent;

				if (this.sortASC) {
					// Sort with ASC order.
					return collator.compare(s1, s2);
				} else {
					// Sort with DESC order.
					return collator.compare(s2, s1);
				}
			});
		}

		// We then append the sorted list of table row elements to the table body.
		for (const row of this.rows) {
			this.body.appendChild(row);
		}

		// Dispatch custom event with the current sorting direction.
		this.body.dispatchEvent(
			new CustomEvent<MDFTableSortedEvent>(events.sorted, {
				bubbles: true,
				detail: {
					column: column,
					direction: this.getSortingOrder(),
				},
			})
		);
	};

	/**
	 * sortOnClick
	 *
	 * Sort table column by clicking its header.
	 *
	 * @private
	 * @memberof MDFTable
	 * @since 1.0.0
	 */
	private sortOnClick = (evt: MouseEvent) => {
		// The clicked element.
		const _this = evt.target as HTMLTableCellElement;

		// We make sure a sortable table header was clicked.
		if (_this.matches(selectors.sortable)) {
			// Get the index of the header for the `sortColumn` function.
			const index = [...this.headers].indexOf(_this);

			// Set sorting order to ASC or DESC.
			this.sortASC = this.sortASC ? false : true;

			// Classes we need to remove.
			const removeClasses = [classes.headerActive, classes.sortASC, classes.sortDESC];

			// Loop through all table header elements.
			for (const header of this.headers) {
				// Remove all necessary classes.
				header.removeClass(...removeClasses);

				// Let assistive technologies know that the column is no longer sorted.
				header.removeAttribute(attr.sort);
			}

			// Set the clicked header as `active`
			_this.addClass(classes.headerActive);

			if (this.sortASC) {
				// Column is sorted in ASC order.
				_this.addClass(classes.sortASC);
				_this.setAttribute(attr.sort, 'ascending');
			} else {
				// Column is sorted in DESC order.
				_this.addClass(classes.sortDESC);
				_this.setAttribute(attr.sort, 'descending');
			}

			// Sort the column.
			this.sortColumn(index);

			// We make sure that paginated data is displayed correctly.
			if (this.options.paginate) {
				// Get all row elements.
				const rows = this.filteredRows ? this.filteredRows : this.rows;

				// Hide them.
				for (const row of rows) {
					row.hide();
				}

				// Because the array basically gets reversed when sorting in DESC order , we have to get the new updated range of row elements.
				const paginateFrom = this.itemsPerPage * (this.currPage - 1);
				const paginateTo = paginateFrom + this.itemsPerPage;
				const rowsToShow = rows.slice(paginateFrom, paginateTo);

				// Show those rows.
				for (const row of rowsToShow) {
					row.show();
				}
			}
		}
	};

	/**
	 * checkboxEvents
	 *
	 * Add checkbox control logic.
	 * Select either single rows by themselves or select all/none.
	 *
	 * @private
	 * @memberof MDFTable
	 * @since 1.0.0
	 */
	private checkboxEvents = (evt: InputEvent) => {
		// The clicked checkbox element.
		const _this = evt.target as HTMLInputElement;

		if (_this === this.checkboxHeader.input) {
			// We make sure that no matter what, the indeterminate state is removed.
			this.checkboxHeader.indeterminate = false;

			if (_this.checked) {
				// Loop through all checkboxes and set them as checked.
				for (const checkbox of this.checkboxes) {
					// We make sure to skip the checkbox in the table header.
					if (checkbox !== this.checkboxHeader.input) {
						checkbox.checked = true;
					}
				}

				// Loop through all table row elements.
				for (const row of this.rows) {
					// Highlight the table row element that belongs to the checkbox.
					row.addClass(classes.rowSelected);
				}

				// Set the table row counter to total amount of table row elements.
				this.selectedRows = this.rows.length;
			} else {
				// Loop through all checkboxes and uncheck them.
				for (const checkbox of this.checkboxes) {
					// We make sure to skip the checkbox in the table header.
					if (checkbox !== this.checkboxHeader.input) {
						checkbox.checked = false;
					}
				}

				// Loop through all table row elements.
				for (const row of this.rows) {
					// Remove the highlight from the table row element.
					row.removeClass(classes.rowSelected);
				}

				// Reset the table row counter.
				this.selectedRows = 0;
			}
		} else if (_this.matches(selectors.checkboxInput)) {
			// Get the table row element that belongs to the checkbox.
			const row = _this.closest(selectors.row);

			if (_this.checked) {
				// If a checkbox was checked, add to the counter.
				this.selectedRows++;

				// Highlight the table row element that belongs to the checkbox.
				row.addClass(classes.rowSelected);
			} else {
				// Otherwise subtract from it.
				this.selectedRows--;

				// And remove the highlight from the table row element.
				row.removeClass(classes.rowSelected);
			}

			// Set the proper styling and attr for the checkbox header.
			if (this.selectedRows <= 0) {
				// No rows are selected, uncheck the header checkbox.
				this.checkboxHeader.checked = false;
				this.checkboxHeader.indeterminate = false;
			} else if (this.selectedRows > 0 && this.selectedRows < this.rows.length) {
				// Some rows are selected, set the header checkbox as indeterminate.
				this.checkboxHeader.checked = false;
				this.checkboxHeader.indeterminate = true;
			} else if (this.selectedRows === this.rows.length) {
				// All rows are selected, check the header checkbox.
				this.checkboxHeader.checked = true;
				this.checkboxHeader.indeterminate = false;
			}
		}
	};

	/**
	 * addEvents
	 *
	 * Add event listeners.
	 *
	 * @private
	 * @memberof MDFTable
	 * @since 1.0.0
	 */
	private addEvents = () => {
		// If enabled, we allow to sort the table by clicking the table header elements.
		if (this.options.sortable) {
			this.container.addEventListener('click', this.sortOnClick);
		}

		// If available, enable the use of checkboxes to select table row elements.
		if (this.checkboxes) {
			this.table.addEventListener('input', this.checkboxEvents);
		}
	};
}
