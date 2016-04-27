import {run} from '@cycle/core';
import {makeKeysDriver} from '../../src/keys-driver';
import {makeDOMDriver} from '@cycle/dom';
import {Observable} from 'rx';

var app = require('./app').default;

const drivers = {
  DOM: makeDOMDriver('.app'),
  Keys: makeKeysDriver()
};

run(app, drivers);
