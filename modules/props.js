'use strict';

const {jsonEqual, unique, keysOf, put, del} = require('../lib/common');
// const {applyClasses} = require('../lib/dom');

const update = (el, newNode, oldNode) => [].concat(
	// to be added
	unique(keysOf(newNode.props), keysOf(oldNode.props))
		.map(prop => () => put(el, prop, newNode.props[prop])),
	// to be removed
	unique(keysOf(oldNode.props), keysOf(newNode.props))
		.map(prop => () => del(el, prop)),
	// to be changed
	keysOf(newNode.props).filter(prop => oldNode.props[prop] && oldNode.props[prop] !== newNode.props[prop])
		.map(prop => () => put(el, prop, newNode.props[prop]))
);

module.exports = {
	create: update,
	update: update
};
