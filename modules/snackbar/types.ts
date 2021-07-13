interface MDFSnackbarOptions {
	delay?: number;
	onOpen?: () => void;
	onAction?: () => void;
	onClose?: () => void;
	hideOnESC?: boolean;
}

export { MDFSnackbarOptions };
