const classes = {
	disabled: 'mdf-textfield--disabled',
	labelFloating: 'mdf-textfield__label--floating',
	labelFocus: 'mdf-textfield__label--focus',
	labelShake: 'mdf-textfield__label--shake',
	stateSuccess: 'mdf-textfield--state-success',
	stateWarning: 'mdf-textfield--state-warning',
	stateError: 'mdf-textfield--state-error',
	textarea: 'mdf-textfield--textarea',
};

const selectors = {
	container: '.mdf-textfield',
	counter: '.mdf-textfield__helper--counter',
	helper: '.mdf-textfield__helper:not(.mdf-textfield__helper--counter)',
	input: '.mdf-textfield__input',
	label: '.mdf-textfield__label',
	labelNotFloating: '.mdf-textfield__label:not(.mdf-textfield__label--floating)',
	leadingIcon: '.mdf-textfield--icon-leading',
	prefix: '.mdf-textfield__prefix:not(.mdf-textfield__prefix--suffix)',
	suffix: '.mdf-textfield__prefix--suffix',
	toggle: '.mdf-textfield__button--toggle',
	trailingIcon: '.mdf-textfield--icon-trailing',
};

const strings = {
	alwaysFloat: ['date', 'datetime-local', 'month', 'range', 'time', 'week'],
	statePrefix: 'mdf-textfield--state-',
};

export { classes, selectors, strings };
