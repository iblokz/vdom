'use strict';

// comparing 2 simple json structures by stringifying them
const jsonEqual = (a, b) =>
	JSON.stringify(a) === JSON.stringify(b);

// create an array of integers
const take = num => Array.apply(null, {length: num}).map(Number.call, Number);

// iterate through 2 arrays
const biterate = (a, b, cb) => take(Math.max(a.length, b.length))
	.map(index => cb(a[index], b[index], index))
	.reduce((arr, el) => [].concat(arr, el), []);

const unique = (c1, c2) => c1.filter(el => c2.indexOf(el) === -1);

const keysOf = o => o instanceof Object && Object.keys(o) || [];

const put = (o, k, v) => ((o[k] = v), o);

const del = (o, k) => ((delete o[k]), o);

module.exports = {
	jsonEqual,
	take,
	biterate,
	unique,
	keysOf,
	put,
	del
};
