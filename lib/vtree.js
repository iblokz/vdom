'use strict';

const {jsonEqual, biterate, keysOf} = require('./common');
const {select, append, remove, create, replace} = require('./dom');
const {obj} = require('iblokz-data');

const modules = {
	attrs: require('../modules/attrs'),
	class: require('../modules/class'),
	events: require('../modules/events'),
	props: require('../modules/props'),
	style: require('../modules/style')
};

const breakingChanges = (node1, node2) => typeof node1 !== typeof node2
	|| typeof node1 === 'string' && node1 !== node2
	|| node1.tag !== node2.tag;

const applyHooks = (type, node, elm) => (node.hook && obj.switch(type, {
	create: () => node.hook.create && node.hook.create(obj.patch(node, 'elm', elm)),
	insert: () => node.hook.insert && node.hook.insert(obj.patch(node, 'elm', elm))
})(), elm);

const updateChildren = (parent, newChildren, oldChildren, cb) =>
	(newChildren === oldChildren) && []
	|| (newChildren.length === oldChildren.length) && jsonEqual(newChildren, oldChildren) && []
	// different lengths, but contain matching portions -> iterate through the differences
	|| (newChildren.length !== oldChildren.length)
		&& [Math.min(newChildren.length, oldChildren.length)].map(minLength =>
			jsonEqual(newChildren.slice(0, minLength), oldChildren.slice(0, minLength))
			&& biterate(newChildren, oldChildren,
				(n, o, _i) => cb(parent, n, o, _i),
				minLength
			)
		).pop()
	// now iterate through the children (the tag is to indicate that this is a htmlnode)
	|| biterate(newChildren, oldChildren,
			(n, o, _i) => cb(parent, n, o, _i)
		)
	|| [];

const patchNode = (parent, newNode, oldNode, index = 0) =>
	[(newNode && (!oldNode || breakingChanges(newNode, oldNode)))
		? applyHooks('create', newNode, create(newNode))
		: parent.childNodes[index]]
	.map(el => ({
		el,
		changes: // 1. breaking changes
		// if no old node just append the new one
		(!oldNode) && [() => append(parent, el), () => applyHooks('insert', newNode, el)]
		// if no new node remove the old one
		|| (!newNode) && [() => remove(parent, el)]
		// if breaking changes replace old node with new
		|| (breakingChanges(newNode, oldNode))
			&& [(child => () => replace(parent, el, child))(parent.childNodes[index])]
		|| []
	})).pop();

const update = (parent, newNode, oldNode, index = 0) =>
	// (console.log(parent, newNode, oldNode, index), true) &&
	newNode === oldNode && []
	|| [patchNode(parent, newNode, oldNode, index)].map(({el, changes}) =>
		[].concat(
			changes,
			// 2.1 update hooks
			// modules
			(el instanceof HTMLElement && newNode)
				? keysOf(modules).map(mod =>
					modules[mod].update(el, newNode, oldNode)
				).reduce((a, e) => [].concat(a, e), [])
				: [],
			// 2.2 children
			// same length and same contents -> no patches needed
			(newNode && newNode.children || oldNode && oldNode.children || [])
				? updateChildren(el, newNode && newNode.children || [], oldNode && oldNode.children || [], update)
				: []
		)
	).pop();

// apply a new patch to a virtual dom tree or a htmlelement
const patch = (vdom, tree) => {
	// console.log(deepDiff.diff(vdom.tree, tree));
	const el = (vdom instanceof HTMLElement || typeof vdom === 'string')
		? select(vdom) : vdom.el;
	let patches = (vdom instanceof HTMLElement || typeof vdom === 'string')
		? updateChildren(el, tree.children, [], update)
		: updateChildren(vdom.el, tree.children, vdom.tree.children, update);
	console.log(patches);
	patches.forEach(p => p());
	return ({
		el,
		tree
	});
};

// generate hyperscript helpers ul('#list') -> h('ul#list')
module.exports = {
	breakingChanges,
	update,
	patch
};
