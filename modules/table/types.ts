interface MDFTableSortedEvent {
	column: number;
	direction: string;
}

interface MDFTablePaginatedEvent {
	currPage: number;
	items: HTMLTableRowElement[];
}

interface MDFTableOptions {
	sortable?: boolean;
	sortOnLoad?: boolean;
	sortColumn?: number;
	order?: string;
	setAriaCount?: boolean;
	truncateHeaders?: boolean;
	headersCharLimit?: number;
	paginate?: boolean;
	itemsPerPage?: number;
	scrollIntoView?: boolean;
	savePreferences?: boolean;
}

export { MDFTablePaginatedEvent, MDFTableSortedEvent, MDFTableOptions };
