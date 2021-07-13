interface MDFDialogOptions {
	onOpen?: () => void;
	onConfirm?: () => void;
	onCancel?: () => void;
	hideOnClick?: boolean;
}

export { MDFDialogOptions };
