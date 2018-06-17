const vtree = require('./lib/vtree');
const common = require('./lib/common');
const dom = require('./lib/dom');
const {h} = require('./lib/h');
const helpers = require('./lib/helpers');

module.exports = Object.assign({},
	vtree,
	{
		common,
		dom,
		h
	},
	helpers
);
