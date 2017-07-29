'use strict';

// following loosly: https://medium.com/@deathmood/how-to-write-your-own-virtual-dom-ee74acc13060

// lib
const Rx = require('rx');
const $ = Rx.Observable;

//
const {obj} = require('iblokz-data');

const {attach, patch, h} = require('../../../../lib');

const ui = require('./ui');

// actions
const actions$ = new Rx.Subject();
const actions = {
	set: (path, value) => actions$.onNext(
		state => obj.patch(state, path, value)
	),
	toggle: () => actions$.onNext(
		state => Object.assign({}, state, {toggled: !state.toggled})
	),
	initial: {itemsCount: 3, itemsType: 'number', toggled: false}
};

// reducing the stream of actions to the app state
const state$ = actions$
	.startWith(() => actions.initial)
	.scan((state, reducer) => reducer(state), {})
	.map(state => (console.log(state), state))
	.share();

let vdom = '#ui'; // patch('#ui', ui({state: actions.initial, actions}));

console.log(vdom);

// mapping the state to the ui
const ui$ = state$.map(state => ui({state, actions}));

ui$.subscribe(vtree => {
	vdom = patch(vdom, vtree);
});
