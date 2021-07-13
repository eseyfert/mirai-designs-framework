# Tables

Tables display data across a set of columns and rows.\
May require the [Checkbox](https://github.com/miraidesigns/mirai-designs-framework/tree/master/modules/checkbox), [Select](https://github.com/miraidesigns/mirai-designs-framework/tree/master/modules/select) or [Textfield](https://github.com/miraidesigns/mirai-designs-framework/tree/master/modules/textfield) module.

---

### HTML

```html
<div class="mdf-table">
    <table class="mdf-table__table" role="grid" aria-rowcount="3">
        <thead>
            <tr class="mdf-table__row mdf-table__row--header">
                <th class="mdf-table__header">Header 1</th>
                <th class="mdf-table__header">Header 2</th>
                <th class="mdf-table__header">Header 3</th>
            </tr>
        </thead>
        <tbody class="mdf-table__content">
            <tr class="mdf-table__row" aria-rowindex="1">
                <td class="mdf-table__cell">Cell A1</td>
                <td class="mdf-table__cell">Cell B1</td>
                <td class="mdf-table__cell">Cell C1</td>
            </tr>
            <tr class="mdf-table__row" aria-rowindex="2">
                <td class="mdf-table__cell">Cell A2</td>
                <td class="mdf-table__cell">Cell B2</td>
                <td class="mdf-table__cell">Cell C2</td>
            </tr>
            <tr class="mdf-table__row" aria-rowindex="3">
                <td class="mdf-table__cell">Cell A3</td>
                <td class="mdf-table__cell">Cell B3</td>
                <td class="mdf-table__cell">Cell C3</td>
            </tr>
        </tbody>
    </table>
</div>
```

### Sass

```scss
// Include default styles without configuration
@forward '@miraidesigns/table/styles';
```

```scss
// Configure appearance
@use '@miraidesigns/table' with (
    $variable: value
);

@include table.styles();
```

---

## Examples

### Sorting

Sort table data naturally in ascending or descending order, aware of strings, numbers and dates.

```html
<div class="mdf-table">
    <table class="mdf-table__table" role="grid" aria-rowcount="1">
        <thead>
            <tr class="mdf-table__row mdf-table__row--header">
                <th class="mdf-table__header mdf-table__header--sortable">Name</th>
                <th class="mdf-table__header mdf-table__header--sortable">Age</th>
                <th class="mdf-table__header mdf-table__header--sortable" data-column-type="Date">Date</th>
            </tr>
        </thead>
        
        <tbody class="mdf-table__content">
            <tr class="mdf-table__row" aria-rowindex="1">
                <td class="mdf-table__cell">John</td>
                <td class="mdf-table__cell">55</td>
                <td class="mdf-table__cell" data-date-format="MDY">06/24/1966</td>
            </tr>
        </tbody>
    </table>
</div>
```

```ts
import { MDFTable } from '@miraidesigns/table';

new MDFTable(document.querySelector('.mdf-table'), {
    sortable: true,
});
```

### Pagination

Pagination can be used to separate table data into multiple pages.

```html
<div class="mdf-table">
    <table class="mdf-table__table" role="grid" aria-rowcount="1">
        <thead>
            <tr class="mdf-table__row mdf-table__row--header">
                <th class="mdf-table__header">Header 1</th>
                <th class="mdf-table__header">Header 2</th>
                <th class="mdf-table__header">Header 3</th>
            </tr>
        </thead>

        <tbody class="mdf-table__content">
            <tr class="mdf-table__row" aria-rowindex="1">
                <td class="mdf-table__cell">Cell A1</td>
                <td class="mdf-table__cell">Cell B1</td>
                <td class="mdf-table__cell">Cell C1</td>
            </tr>
        </tbody>
    </table>

    <div class="mdf-table__pagination">
        <span id="table-pagination-label" class="mdf-table__pagination-label">Rows per page</span>

        <div class="mdf-select mdf-table__pagination-select">
            <button class="mdf-select__button" aria-haspopup="listbox" aria-labelledby="table-pagination-label select-text">
                <span id="select-text" class="mdf-select__text"></span>

                <span class="mdf-select__icon">
                    <svg class="mdf-icon" viewBox="0 0 24 24" aria-hidden="true">
                        <use href="icons.svg#arrow-keyboard"></use>
                    </svg>
                </span>
            </button>

            <div class="mdf-select__menu mdf-menu">
                <ul class="mdf-list" role="listbox" aria-labelledby="table-pagination-label" tabindex="-1">
                    <li class="mdf-list__item" role="option" data-value="10">10</li>
                    <li class="mdf-list__item mdf-list__item--selected" role="option" data-value="25">25</li>
                    <li class="mdf-list__item" role="option" data-value="50">50</li>
                </ul>

                <input class="mdf-select__input" type="hidden" name="option" />
            </div>
        </div>

        <span class="mdf-table__pagination-stats"></span>

        <button class="mdf-table__pagination-control mdf-table__pagination-control--prev" data-pagination-action="prev" aria-label="Previous page">
            <svg class="mdf-icon" viewBox="0 0 24 24" aria-hidden="true">
                <use href="icons.svg#arrow-keyboard"></use>
            </svg>
        </button>

        <button class="mdf-table__pagination-control mdf-table__pagination-control--next" data-pagination-action="next" aria-label="Next page">
            <svg class="mdf-icon" viewBox="0 0 24 24" aria-hidden="true">
                <use href="icons.svg#arrow-keyboard"></use>
            </svg>
        </button>
    </div>
</div>
```

```ts
import { MDFTable } from '@miraidesigns/table';

const table = new MDFTable(document.querySelector('.mdf-table'), {
    paginate: true,
    itemsPerPage: 25,
});

// Get the MDFSelect module we created within our table script.
const select = table.getSelectModule();

// Listen for changes on the select container element.
select.container.addEventListener('MDFSelect:changed', () => {
    // Paginate the table with the selected value.
    table.paginate(+select.value);
});
```

### Filters

Filter table data by text input.

```html
<div id="table-filter-textfield" class="mdf-textfield mdf-textfield--icon-leading">
    <label for="table-filter-input" class="mdf-textfield__label">Filter</label>
    <input id="table-filter-input" class="mdf-textfield__input" type="text">

    <svg class="mdf-textfield__icon" viewBox="0 0 24 24">
        <use href="icons.svg#search"></use>
    </svg>
</div>

<div class="mdf-table">
    <table class="mdf-table__table" role="grid" aria-rowcount="1">
        <thead>
            <tr class="mdf-table__row mdf-table__row--header">
                <th class="mdf-table__header">Header 1</th>
                <th class="mdf-table__header">Header 2</th>
                <th class="mdf-table__header">Header 3</th>
            </tr>
        </thead>
        
        <tbody class="mdf-table__content">
            <tr class="mdf-table__row" aria-rowindex="1">
                <td class="mdf-table__cell">Cell A1</td>
                <td class="mdf-table__cell">Cell B1</td>
                <td class="mdf-table__cell">Cell C1</td>
            </tr>
        </tbody>
    </table>
</div>
```

```ts
import { MDFTable } from '@miraidesigns/table';
import { MDFTextfield } from '@miraidesigns/textfield';

const table = new MDFTable(document.querySelector('.mdf-table'));
const textfield = new MDFTextfield(document.getElementById('table-filter-textfield'));

// Filter table using the input value.
textfield.input.addEventListener('input', () => table.filter(textfield.value));
```

### Checkboxes

Checkboxes can be used to select table row elements for scripting purposes.

```html
<div class="mdf-table">
    <table class="mdf-table__table mdf-table__table--fixed" role="grid" aria-rowcount="1">
        <thead>
            <tr class="mdf-table__row mdf-table__row--header">
                <th class="mdf-table__header mdf-table__header--checkbox">
                    <div class="mdf-checkbox">
                        <input class="mdf-checkbox__input" type="checkbox">
                
                        <div class="mdf-checkbox__box">
                            <svg class="mdf-checkbox__indeterminate" viewBox="0 0 24 24" aria-hidden="true">
                                <use href="icons.svg#checkbox-indeterminate"></use>
                            </svg>
        
                            <svg class="mdf-checkbox__check" viewBox="0 0 24 24" aria-hidden="true">
                                <use href="icons.svg#checkbox"></use>
                            </svg>
                        </div>
                    </div>
                </th>
                <th class="mdf-table__header">Header 1</th>
                <th class="mdf-table__header">Header 2</th>
                <th class="mdf-table__header">Header 3</th>
            </tr>
        </thead>
        
        <tbody class="mdf-table__content">
            <tr class="mdf-table__row" aria-rowindex="1">
                <td class="mdf-table__cell">
                    <div class="mdf-checkbox">
                        <input class="mdf-checkbox__input" type="checkbox">
                
                        <div class="mdf-checkbox__box">                                       
                            <svg class="mdf-checkbox__check" viewBox="0 0 24 24" aria-hidden="true">
                                <use href="icons.svg#checkbox"></use>
                            </svg>
                        </div>
                    </div>
                </td>
                <td class="mdf-table__cell">Cell A1</td>
                <td class="mdf-table__cell">Cell B1</td>
                <td class="mdf-table__cell">Cell C1</td>
            </tr>
        </tbody>
    </table>
</div>
```

```ts
import { MDFTable } from '@miraidesigns/table';

new MDFTable(document.querySelector('.mdf-table'));
```

---

## Implementation

### Attributes

Please see the [WAI-ARIA](https://www.w3.org/TR/wai-aria-practices-1.1/#table) page for attributes and best practices regarding tables.

| Name                            | Element    | Description                                                                |
| ------------------------------- | ---------- | -------------------------------------------------------------------------- |
| `data-column-type="Date"`       | `<th>`     | Lets the script know that this table column will hold dates                |
| `data-date-format`              | `<td>`     | Date format for sorting purposes. Valid values are `DMY` `MDY` `YMD` `YDM` |
| `data-pagination-action="prev"` | `<button>` | Pagination action. Go to the previous page                                 |
| `data-pagination-action="next"` | `<button>` | Pagination action. Go to the next page                                     |

### Classes

| Name                            | Type           | Description                                                                            |
| ------------------------------- | -------------- | -------------------------------------------------------------------------------------- |
| `mdf-table`                     | Parent         | Contains the table element. Provides scrolling for smaller devices if necessary        |
| `mdf-table__table`              | Parent / Child | The table element                                                                      |
| `mdf-table__table--condensed`   | Modifier       | Reduces the height of table row elements                                               |
| `mdf-table__table--fixed`       | Modifier       | Set the table layout to fixed. Use with checkboxes                                     |
| `mdf-table__table--bordered`    | Modifier       | Adds borders around table cell elements                                                |
| `mdf-table__table--striped`     | Modifier       | Adds zebra striping to the table rows                                                  |
| `mdf-table__content`            | Parent / Child | Contains the main table row elements. Child to `.mdf-table__table`                     |
| `mdf-table__row`                | Child          | Contains the table cells. Child to `.mdf-table__table`                                 |
| `mdf-table__row--header`        | Modifier       | Styling for table header rows                                                          |
| `mdf-table__row--selected`      | Modifier       | Highlight checkbox selected table row elements                                         |
| `mdf-table__header`             | Child          | Table header cell element. Child to `.mdf-table__row`                                  |
| `mdf-table__header--sortable`   | Modifier       | Lets the script know that this column can be sorted                                    |
| `mdf-table__header--active`     | Modifier       | Highlight active header                                                                |
| `mdf-table__header--sort-asc`   | Modifier       | Styling for ascending order sorting                                                    |
| `mdf-table__header--sort-desc`  | Modifier       | Styling for descending order sorting                                                   |
| `mdf-table__header--checkbox`   | Modifier       | Adjust appearance for headers that contain checkboxes                                  |
| `mdf-table__cell`               | Child          | Table body cell element. Child to `.mdf-table__row`                                    |
| `mdf-table__pagination`         | Parent / Child | Contains the pagination elements. `Child to .mdf-table`                                |
| `mdf-table__pagination-select`  | Child          | Items per page select element. Child to `.mdf-table__pagination`                       |
| `mdf-table__pagination-label`   | Child          | Label for the select element. Child to `.mdf-table__pagination`                        |
| `mdf-table__pagination-stats`   | Child          | Displays the pagination stats. Child to `.mdf-table__pagination`                       |
| `mdf-table__pagination-control` | Child          | Control element to select the previous or next page. Child to `.mdf-table__pagination` |

### Events

| Name                 | Data                                               | Description                                                                                      |
| -------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `MDFTable:paginated` | `{currPage: number, items: HTMLTableRowElement[]}` | Fires when table data gets paginated. Includes the current page and the table rows for that page |
| `MDFTable:sorted`    | `{column: number, direction: string}`              | Fires when a table column gets sorted. Includes the column and sorting direction                 |

### Properties

| Name                      | Type                        | Description                                                            |
| ------------------------- | --------------------------- | ---------------------------------------------------------------------- |
| `.body`                   | `HTMLTableSectionElement`   | Returns the table body element                                         |
| `.container`              | `HTMLElement`               | Returns the table container element                                    |
| `.head`                   | `HTMLTableSectionElement`   | Returns the table head element                                         |
| `.pagination`             | `HTMLElement`               | Returns the table pagination container element                         |
| `.rows`                   | `HTMLTableRowElement[]`     | Returns an `Array` with all table rows                                 |
| `.table`                  | `HTMLTableElement`          | Returns the table element                                              |
| `.getSelectedRows()`      | `(): HTMLTableRowElement[]` | Returns an `Array` with all currently selected table rows              |
| `.getFilteredRows`        | `(): HTMLTableRowElement[]` | Returns an `Array` with the filtered table rows                        |
| `.getSelectModule()`      | `(): MDFSelect`             | Returns the created `MDFSelect` module                                 |
| `.hasBeenSorted()`        | `(): boolean`               | Returns wether or not the table has been sorted yet.                   |
| `.getSortingOrder()`      | `(): string`                | Returns the table's sorting order. Either `ASC` or `DESC`.             |
| `.getPages()`             | `(): number`                | Returns the number of pages available.                                 |
| `.getCurrentPage()`       | `(): number`                | Returns the current page number.                                       |
| `.getItemsPerPage()`      | `(): number`                | Returns the current items per page limit.                              |
| `.toggleSpacing()`        | `(): void`                  | Toggle between `regular` and `condensed` spacing.                      |
| `.filter(value, column?)` | `(string, number): void`    | Filter table with the given value, optionally filter a specific column |
| `.paginate(limit)`        | `(number): void`            | Paginate table with the given items per page limit                     |

### Options

| Name               | Type      | Default | Description                                                             |
| ------------------ | --------- | ------- | ----------------------------------------------------------------------- |
| `sortable`         | `boolean` | `false` | Enable sorting                                                          |
| `sortOnLoad`       | `boolean` | `false` | Sort table on page load                                                 |
| `sortColumn`       | `number`  | `0`     | Index of column to sort on page load                                    |
| `order`            | `string`  | `ASC`   | Default sorting order. Valid value are `ASC` or `DESC`                  |
| `setAriaCount`     | `boolean` | `false` | Add `aria-rowcount` and `aria-rowindex` attributes where needed         |
| `truncateHeaders`  | `boolean` | `false` | Truncate table header text at specific cutoff                           |
| `headersCharLimit` | `number`  | `0`     | Character limit before header text is cut off                           |
| `paginate`         | `boolean` | `false` | Enable pagination                                                       |
| `itemsPerPage`     | `number`  | `50`    | Number of table rows per page                                           |
| `scrollIntoView`   | `boolean` | `false` | Wether or not to scroll the table element into view when changing pages |
| `savePreferences`  | `boolean` | `false` | Enable saving user preferences to `localStorage`                        |