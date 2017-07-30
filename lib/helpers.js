'use strict';

const htmlTags = require('html-tags');
const {h} = require('./h');

const helpers = htmlTags.reduce(
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
	},
	{h} // add original hyperscript function
);

module.exports = helpers;
