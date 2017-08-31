'use strict';

const {obj} = require('iblokz-data');
const {keysOf} = require('./common');

const cssAttrRegEx = new RegExp(/\[([a-zA-Z\-_0-9]+)='?"?([a-zA-Z\-_0-9]+)'?"?\]/, 'ig');

const processSelector = selector => ({
	tag: (selector.match(/^([a-zA-Z0-9]+)/ig) || ['div']).shift(),
	class: (selector.match(/(\.[a-zA-Z0-9\-_]+)/ig) || []).map(cls => cls.replace('.', '')),
	id: (selector.match(/(#[a-zA-Z0-9\-_]+)/ig) || []).map(cls => cls.replace('#', '')).shift(),
	attrs: (selector.match(cssAttrRegEx) || [])
		.map(m => [].concat(cssAttrRegEx.exec(selector) || []))
		.map(m => (console.log(m), m))
		.filter(m => m !== null && m.length > 0)
		.reduce((attrs, m) => obj.patch(attrs, m[1], m[2]), {})
});

const processData = (node, data = {}) => Object.assign({}, node, {
	hook: data.hook || {},
	on: data.on || {},
	style: data.style || {},
	props: data.props || {},
	attrs: Object.assign({},
		node.attrs,
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

module.exports = {
	processData,
	processSelector,
	processChildren,
	h
};
