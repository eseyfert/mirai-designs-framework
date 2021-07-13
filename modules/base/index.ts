declare module '@vimeo/player/dist/player.js';

Element.prototype.addClass = function (this: Element, ...classes: string[]) {
	this.classList.add(...classes);
};

Element.prototype.removeClass = function (this: Element, ...classes: string[]) {
	this.classList.remove(...classes);
};

Element.prototype.removeClassByPrefix = function (this: Element, prefix: string) {
	const prefixCheck = new RegExp(`\\b${prefix}.*?\\b`, 'g');

	[...this.classList].map((className) => {
		if (prefixCheck.test(className)) {
			this.classList.remove(className);
		}
	});
};

Element.prototype.toggleClass = function (this: Element, className: string, condition?: boolean) {
	if (condition === true) {
		this.classList.add(className);
	} else if (condition === false) {
		this.classList.remove(className);
	} else {
		this.classList.toggle(className);
	}
};

Element.prototype.replaceClass = function (this: Element, oldClass: string, newClass: string) {
	this.classList.remove(oldClass);
	this.classList.add(newClass);
};

Element.prototype.hasClass = function (this: Element, className: string) {
	return this.classList.contains(className);
};

Element.prototype.show = function (this: HTMLElement) {
	this.classList.remove('mdf-hidden');
};

Element.prototype.hide = function (this: HTMLElement) {
	this.classList.add('mdf-hidden');
};

String.prototype.truncate = function (this: string, limit: number): string {
	return this.length > limit ? `${this.substr(0, limit - 1)}...` : this;
};
