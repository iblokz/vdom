'use strict';

const expect = require('chai').expect;

const common = require('../lib/common');

describe('lib/common', () =>
  describe('jsonEqual', () =>
    it('Returns true if the stringified versions of 2 objects match', () =>
			expect(common.jsonEqual({a: 1}, {a: 1})).to.equal(true))
		&&
		it('Returns false if the stringified versions of 2 objects do not match', () =>
			expect(common.jsonEqual({a: 1}, {b: 3})).to.equal(false))
	)
  &&
	describe('take', () =>
    it('Creates an ascending array of integers with n length starting from 0', () =>
			expect(common.take(5)).to.to.deep.equal([0, 1, 2, 3, 4]))
		&&
		it('Returns an empty array if no number specified', () =>
			expect(common.take()).to.to.deep.equal([]))
	)
  &&
	describe('unique', () =>
    it('Returns unique elements from array a that do not exist in array b', () =>
			expect(common.unique([1, 2, 3, 4], [2, 3])).to.to.deep.equal([1, 4]))
		&&
		it('Returns all elements if array b is empty', () =>
			expect(common.unique([1, 2, 3, 4], [])).to.to.deep.equal([1, 2, 3, 4]))
	)
	&&
	describe('keysOf', () =>
    it('Returns list of keys for an Object', () =>
			expect(common.keysOf({a: 1, c: 3})).to.to.deep.equal(Object.keys({a: 1, c: 3})))
	)
	&&
	describe('put', () =>
    it('Adds property to object', () =>
			expect(common.put({a: 1}, 'c', 3)).to.to.deep.equal({a: 1, c: 3}))
	)
	&&
	describe('del', () =>
    it('Removes property from object', () =>
			expect(common.put({a: 1, c: 3}, 'c')).to.to.deep.equal({a: 1, c: undefined}))
	)
);
