interface MDFLightboxOptionsIcons {
	type?: string;
	close?: string;
	control?: string;
}

interface MDFLightboxOptions {
	onOpen?: () => void;
	onChange?: () => void;
	onClose?: () => void;
	titlePos?: string;
	titleAlign?: string;
	controlButtons?: boolean;
	closeButton?: boolean;
	icons?: MDFLightboxOptionsIcons;
	autoplay?: boolean;
	iframeAddBorder?: boolean;
	sandboxing?: boolean;
	sandboxingRules?: string;
	enableSwipe?: boolean;
	hideOnClick?: boolean;
}

interface MDFLightboxChangedEvent {
	index: number;
	item: HTMLElement;
}

export { MDFLightboxOptions, MDFLightboxChangedEvent };
