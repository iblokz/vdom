'use strict';

const {jsonEqual, unique, keysOf, put, del} = require('../lib/common');
const {applyClasses} = require('../lib/dom');

const update = (el, newNode, oldNode) => !jsonEqual(newNode.class, oldNode.class)
	? [() => applyClasses(el, newNode.class)]
	: [];

module.exports = {
	create: update,
	update: update
};
