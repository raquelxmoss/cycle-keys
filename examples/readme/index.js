import {run} from '@cycle/xstream-run';
import {makeKeysDriver} from '../../src/keys-driver';
import {makeDOMDriver} from '@cycle/dom';

var app = require('./app').default;

const drivers = {
  DOM: makeDOMDriver('.app'),
  Keys: makeKeysDriver()
};

run(app, drivers);
