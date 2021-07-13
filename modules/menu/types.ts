interface MDFMenuOptions {
	anchor: Element;
	posX?: string;
	posY?: string;
	origin?: string;
	callbacks?: Record<string, () => void>;
	onOpen?: () => void;
	onClose?: () => void;
	hideOnClick?: boolean;
}

interface MDFMenuActivatedEvent {
	callback: string;
	index: number;
	item: HTMLElement;
}

export { MDFMenuOptions, MDFMenuActivatedEvent };
