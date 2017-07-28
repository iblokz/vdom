'use strict';

const htmlTags = require('html-tags');
const {obj} = require('iblokz-data');

const {jsonEqual, take, biterate, unique, keysOf, put, del} = require('./common');
const {select, on, off, set, unset, get, applyClasses, append, remove, create, replace} = require('./dom');

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

let update;
const updateChildren = (parent, newChildren, oldChildren) =>
	(newChildren === oldChildren) && []
	|| (newChildren.length === oldChildren.length) && jsonEqual(newChildren, oldChildren) && []
	// different lengths, but contain matching portions -> iterate through the differences
	|| (newChildren.length !== oldChildren.length)
		&& [Math.min(newChildren.length, oldChildren.length)].map(minLength =>
			jsonEqual(newChildren.slice(0, minLength), oldChildren.slice(0, minLength))
			&& biterate(newChildren, oldChildren,
				(n, o, _i) => update(parent, n, o, _i),
				minLength
			)
		).pop()
	// now iterate through the children (the tag is to indicate that this is a htmlnode)
	|| biterate(newChildren, oldChildren,
			(n, o, _i) => update(parent, n, o, _i)
		)
	|| [];

update = (parent, newNode, oldNode, index = 0) =>
	// 1. breaking changes
	// if no old node just append the new one
	(!oldNode) && [() => append(parent, create(newNode))]
	// if no new node remove the old one
	|| (!newNode) && [(child => () => remove(parent, child))(parent.childNodes[index])]
	// if no change no patches
	|| newNode === oldNode && []
	// if breaking changes replace old node with new
	|| (breakingChanges(newNode, oldNode))
		&& [(child => () => replace(parent, create(newNode), child))(parent.childNodes[index])]
	// 2. no breaking changes
	|| [].concat(
		// 2.1 update hooks
		// modules
		keysOf(modules).map(mod =>
			modules[mod].update(parent.childNodes[index], newNode, oldNode)
		).reduce((a, e) => [].concat(a, e), []),
		// 2.2 children
		// same length and same contents -> no patches needed
		updateChildren(parent.childNodes[index], newNode.children, oldNode.children)
	);

const processSelector = selector => ({
	tag: (selector.match(/^([a-zA-Z0-9]+)/ig) || ['div']).shift(),
	class: (selector.match(/(\.[a-zA-Z0-9\-_]+)/ig) || []).map(cls => cls.replace('.', '')),
	id: (selector.match(/(#[a-zA-Z0-9\-_]+)/ig) || []).map(cls => cls.replace('#', '')).shift()
});

const processData = (node, data = {}) => Object.assign({}, node, {
	on: data.on || {},
	style: data.style || {},
	props: data.props || {},
	attrs: Object.assign({},
		keysOf(data.attrs)
			.filter(attr => typeof data.attrs[attr] !== 'boolean' || data.attrs[attr] === true)
			.reduce((o, attr) => obj.patch(o, attr, data.attrs[attr]), {}),
		node.id ? {id: node.id} : {}
	),
	class: [].concat(
		node.class,
		Object.keys(data.class || {}).filter(cls => data.class[cls])
	)
});

const processChildren = children =>
	children && children.length === 1 && children[0] instanceof Array
		&& children[0]
		|| children;

// our h (hyperscript) function
const h = (selector, data, ...children) => [processSelector(selector)].map(
	node => Object.assign(
		{},
		node,
		processData(node, (data && !data.tag) ? data : {}),
		{
			children: processChildren([].concat(
				data && (typeof data === 'string' || data.tag || data instanceof Array) ? data : [],
				children && children || []
			))
		}
	)
).pop();

// attach an apply a virtual dom tree to an element
const attach = (selector, tree) => ({
	el: append(
		select(selector), tree.children.map(create)
	),
	tree
});
/*
const attach = (selector, tree) => [select(selector)].map(oldEl => ({
	el: replace(oldEl.parentNode, create(tree), oldEl),
	tree
})).pop();
*/

// apply a new patch to a virtual dom tree
const patch = (vdom, tree) => {
	// console.log(deepDiff.diff(vdom.tree, tree));
	let patches = updateChildren(vdom.el, tree.children, vdom.tree.children);
	console.log(patches);
	patches.forEach(p => p());
	return ({
		el: vdom.el,
		tree
	});
};

// generate hyperscript helpers ul('#list') -> h('ul#list')
const hyperHelpers = htmlTags.reduce(
	(o, tag) => {
		o[tag] = function() {
			return [Array.from(arguments)]
				// .map(processAttrs)
				.map(args => (
					// is the first argument a selector
					args[0] && typeof args[0] === 'string' && args[0].match(/^(\.|#)[a-zA-Z\-_0-9]+/ig))
						? [].concat(tag + args[0], args.slice(1))
						: [tag].concat(args))
				.map(args => h.apply(this, args))
				.pop();
		};
		return o;
	}, {}
);

console.log(hyperHelpers);

module.exports = Object.assign(
	{
		breakingChanges,
		update,
		attach,
		patch,
		h
	},
	hyperHelpers
);