const vdom = require('./lib');
const common = require('./lib/common');
const dom = require('./lib/dom');

module.exports = Object.assign({},
	vdom,
	{
		common,
		dom
	}
);
