# Dialogs

Dialogs inform users about a task or action they need to take.

---

### HTML

Make sure to put this as high in your `<body>` element as possible.

```html
<div class="mdf-dialog-container" aria-hidden="true">
	<div class="mdf-dialog" role="dialog" aria-labelledby="dialog-title" aria-describedby="dialog-desc">
		<div class="mdf-dialog__header">
			<h2 id="dialog-title" class="mdf-dialog__title">Dialog title</h2>

			<button class="mdf-dialog__close" aria-label="Close dialog">
				<svg class="mdf-icon" viewBox="0 0 24 24" aria-hidden="true">
					<use href="icons.svg#clear"></use>
				</svg>
			</button>
		</div>

		<div class="mdf-dialog__content">
			<p id="dialog-desc">Dialog description further explaining the actions.</p>
		</div>

		<div class="mdf-dialog__actions">
			<button class="mdf-button" data-dialog-action="cancel">Cancel</button>
			<button class="mdf-button" data-dialog-action="confirm">Confirm</button>
		</div>
	</div>

	<div class="mdf-dialog-backdrop"></div>
</div>
```

### Sass

```scss
// Include default styles without configuration
@forward '@miraidesigns/dialog/styles';
```

```scss
// Configure appearance
@use '@miraidesigns/dialog' with (
    $variable: value
);

@include dialog.styles();
```

### TypeScript

```ts
import { MDFDialog } from '@miraidesigns/dialog';

const dialog = new MDFDialog(document.querySelector('.mdf-dialog'));
dialog.openDialog();
```

---

## Implementation

### Attributes

Please see the [WAI-ARIA](https://www.w3.org/TR/wai-aria-practices-1.1/#dialog_modal) page for attributes and best practices regarding dialogs.

| Name                           | Element    | Description                                                       |
| ------------------------------ | ---------- | ----------------------------------------------------------------- |
| `data-dialog-action="cancel"`  | `<button>` | Will execute the `onCancel` function when this button is clicked  |
| `data-dialog-action="confirm"` | `<button>` | Will execute the `onConfirm` function when this button is clicked |

### Classes

| Name                   | Type           | Description                                                                     |
| ---------------------- | -------------- | ------------------------------------------------------------------------------- |
| `mdf-dialog-container` | Parent         | Contains the dialog element. Creates the backdrop and centers the dialog        |
| `mdf-dialog--active`   | Modifier       | 1. Prepares the dialog to be visible                                            |
| `mdf-dialog--fade-in`  | Modifier       | 2. Fades-in the dialog and allows for interaction                               |
| `mdf-dialog`           | Parent / Child | Contains the dialog elements. Child to `.mdf-dialog-container`                  |
| `mdf-dialog__header`   | Parent / Child | Contains the dialog title. Child to `.mdf-dialog`                               |
| `mdf-dialog__close`    | Child          | Closes the dialog. Child to `.mdf-dialog__header`                               |
| `mdf-dialog__title`    | Child          | Title element. Child to `.mdf-dialog__header`                                   |
| `mdf-dialog__content`  | Parent / Child | Contains the text description or other kinds of content. Child to `.mdf-dialog` |
| `mdf-dialog__actions`  | Parent / Child | Contains the user actions. Child to `.mdf-dialog`                               |
| `mdf-dialog-backdrop`  | Child          | Dialog backdrop. Child to `.mdf-dialog-container`                               |

### Events

| Name               | Data   | Description                  |
| ------------------ | ------ | ---------------------------- |
| `MDFDialog:opened` | `null` | Fires when the dialog opens  |
| `MDFDialog:closed` | `null` | Fires when the dialog closes |

### Properties

| Name                               | Type                       | Description                                                             |
| ---------------------------------- | -------------------------- | ----------------------------------------------------------------------- |
| `.container`                       | `(): HTMLElement`          | Returns the dialog container element                                    |
| `.dialog`                          | `(): HTMLElement`          | Returns the dialog element                                              |
| `.content`                         | `(): HTMLElement`          | Returns the content element                                             |
| `.text`                            | `(): HTMLParagraphElement` | Returns the text element                                                |
| `.openDialog(message?, setFocus?)` | `(string, boolean): void`  | Open the dialog window (set displayed message, set focus on first item) |
| `.closeDialog(confirmed?)`         | `(boolean): void`          | Close the dialog window (run confirm or cancel callback)                |

### Options

| Name          | Type         | Default | Description                                                     |
| ------------- | ------------ | ------- | --------------------------------------------------------------- |
| `onOpen`      | `() => void` | `null`  | Function will run when the dialog is opened                     |
| `onConfirm`   | `() => void` | `null`  | Function will run when the dialog window is confirmed           |
| `onCancel`    | `() => void` | `null`  | Function will run when the dialog window is closed or cancelled |
| `hideOnClick` | `boolean`    | `true`  | Dialog will be hidden when clicked outside of it's content      |
