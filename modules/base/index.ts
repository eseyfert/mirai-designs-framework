/**
 * Base
 *
 * Contains declarations, types and extends native HTML objects.
 *
 * @version 1.0.0
 */

// Declare Vimeo player module.
declare module '@vimeo/player/dist/player.js';

// Extend Element prototype typing.
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

// Extend String prototype typing.
/* eslint @typescript-eslint/no-unused-vars: off */
interface String {
	truncate(limit: number): string;
	empty(): boolean;
}

/**
 * addClass
 *
 * Add single class or set of classes to the element.
 *
 * @param {string[]} classes Name of class(es) to add
 * @since 1.0.0
 */
Element.prototype.addClass = function (this: Element, ...classes: string[]): void {
	this.classList.add(...classes);
};

/**
 * removeClass
 *
 * Remove single class or set of classes from the element.
 *
 * @param {string[]} classes Name of class(es) to remove
 * @since 1.0.0
 */
Element.prototype.removeClass = function (this: Element, ...classes: string[]): void {
	this.classList.remove(...classes);
};

/**
 * removeClassByPrefix
 *
 * Remove class with the given prefix from the element.
 *
 * @param {string} prefix The prefix to test against
 * @since 1.0.0
 */
Element.prototype.removeClassByPrefix = function (this: Element, prefix: string): void {
	const prefixCheck = new RegExp(`\\b${prefix}.*?\\b`, 'g');

	[...this.classList].map((className) => {
		if (prefixCheck.test(className)) {
			this.classList.remove(className);
		}
	});
};

/**
 * toggleClass
 *
 * Either add or remove class from the given element.
 * Optionally with condition.
 *
 * @param {string} className The class to toggle
 * @param {boolean} condition Add class when `true`, remove class when `false`
 * @since 1.0.0
 */
Element.prototype.toggleClass = function (this: Element, className: string, condition?: boolean): void {
	if (condition === true) {
		this.classList.add(className);
	} else if (condition === false) {
		this.classList.remove(className);
	} else {
		this.classList.toggle(className);
	}
};

/**
 * replaceClass
 *
 * Replace one class with another
 *
 * @param {string} oldClass The class to remove
 * @param {string} newClass The class to add
 * @since 1.0.0
 */
Element.prototype.replaceClass = function (this: Element, oldClass: string, newClass: string): void {
	this.classList.remove(oldClass);
	this.classList.add(newClass);
};

/**
 * hasClass
 *
 * Check if the element has the given class
 *
 * @param {string} className The class to check against
 * @returns {boolean}
 * @since 1.0.0
 */
Element.prototype.hasClass = function (this: Element, className: string): boolean {
	return this.classList.contains(className);
};

/**
 * hide
 *
 * Hide the given element by adding the `mdf-hidden` class.
 *
 * @since 1.0.0
 */
Element.prototype.hide = function (this: HTMLElement): void {
	this.classList.add('mdf-hidden');
};

/**
 * show
 *
 * Show the given element by removing the `mdf-hidden` class.
 *
 * @since 1.0.0
 */
Element.prototype.show = function (this: HTMLElement): void {
	this.classList.remove('mdf-hidden');
};

/**
 * truncate
 *
 * Limit string to the given character limit and append ellipses.
 *
 * @param {number} limit Character limit
 * @since 1.0.0
 */
String.prototype.truncate = function (this: string, limit: number): string {
	return this.length > limit ? `${this.substr(0, limit - 1)}...` : this;
};
