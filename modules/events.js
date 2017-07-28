'use strict';

const {jsonEqual, unique, keysOf, put, del} = require('../lib/common');
const {on, off} = require('../lib/dom');

const update = (el, newNode, oldNode) =>
	[].concat(
		// to be added
		unique(keysOf(newNode.on), keysOf(oldNode.on))
			.map(event =>
				() => on(el, event, newNode.on[event])
			),
		// to be removed
		unique(keysOf(oldNode.on), keysOf(newNode.on))
			.map(event =>
				() => off(el, event, oldNode.on[event])
			),
		// to be changed
		keysOf(newNode.on).filter(event =>
			oldNode.on[event] && oldNode.on[event] !== newNode.on[event])
			.map(event => [
				() => off(el, event, oldNode.on[event]),
				() => on(el, event, newNode.on[event])
			])
			.reduce((a, e) => [].concat(a, e), [])
	);

module.exports = {
	create: update,
	update: update
};
