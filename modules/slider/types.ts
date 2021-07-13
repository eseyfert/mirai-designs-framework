interface MDFSliderOptions {
	onChange?: () => void;
	defaultSlide?: number;
	navPos?: string;
	enableNavigation?: boolean;
	enableSwipe?: boolean;
	enableDrag?: boolean;
}

interface MDFSliderChangedEvent {
	index: number;
	item: HTMLElement;
}

export { MDFSliderOptions, MDFSliderChangedEvent };
