'use strict';

const {jsonEqual, unique, keysOf, put, del} = require('../lib/common');
const {on, off} = require('../lib/dom');

const update = (el, newNode, oldNode) => [].concat(
	// to be added
	unique(keysOf(newNode.style), keysOf(oldNode.style))
		.map(k => () => put(el.style, k, newNode.style[k])),
	// to be removed
	unique(keysOf(oldNode.style), keysOf(newNode.style))
		.map(k => () => del(el.style, k)),
	// to be changed
	keysOf(newNode.style).filter(k => oldNode.style[k] && oldNode.style[k] !== newNode.style[k])
		.map(k => () => put(el.style, k, newNode.style[k]))
);

module.exports = {
	create: update,
	update: update
};
