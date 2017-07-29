'use strict';

const {jsonEqual, unique, keysOf, put, del} = require('../lib/common');
const {set, unset} = require('../lib/dom');

const update = (el, newNode, oldNode = {attrs: []}) => [].concat(
	// to be added
	unique(keysOf(newNode.attrs), keysOf(oldNode.attrs))
		.map(attr => () => set(el, attr, newNode.attrs[attr])),
	// to be removed
	unique(keysOf(oldNode.attrs), keysOf(newNode.attrs))
		.map(attr => () => unset(el, attr)),
	// to be changed
	keysOf(newNode.attrs).filter(attr => oldNode.attrs[attr] && oldNode.attrs[attr] !== newNode.attrs[attr])
		.map(attr => () => set(el, attr, newNode.attrs[attr]))
);

module.exports = {
	create: update,
	update: update
};
