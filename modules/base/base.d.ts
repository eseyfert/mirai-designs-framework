export {};

declare global {
	interface Element {
		addClass(...classes: string[]): void;
		removeClass(...classes: string[]): void;
		removeClassByPrefix(prefix: string): void;
		toggleClass(className: string, condition?: boolean): void;
		replaceClass(oldClass: string, newClass: string): void;
		hasClass(className: string): boolean;
		show(): void;
		hide(): void;
	}

	interface String {
		truncate(limit: number): string;
	}
}
