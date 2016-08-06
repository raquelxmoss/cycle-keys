import {makeKeysDriver} from '../src/keys-driver';
import xstreamAdapter from '@cycle/xstream-adapter';
import rxAdapter from '@cycle/rx-adapter';

import assert from 'assert';
import simulant from 'simulant';

const subscribe = listener => stream =>
  stream.addListener({
    next:     listener,
    error:    () => {},
    complete: () => {}
  });

describe("makeKeysDriver", () => {
  describe("keysDriver", () => {
    it("is stream library agnostic", () =>  {
      const sources = makeKeysDriver()({}, rxAdapter);

      sources.up('enter').take(1).subscribe(() => done());

      const event = simulant('keyup', {keyCode: 13});

      simulant.fire(document.body, event);
    });
  }),

  describe("press", () => {
    it("returns a stream of all keypresses", () => {
      const sources = makeKeysDriver()({}, xstreamAdapter);

      const keyCodes = [74, 75, 76];
      let keypressEvents;

      sources.press().take(3)
        .fold((x, y) => x.concat(y), [])
        .last()
        .compose(
          subscribe((events) => {
            keypressEvents = events.map(event => event.keyCode);
          })
        );


      keyCodes.forEach(function (keyCode) {
        const event = simulant('keypress', {keyCode});

        simulant.fire(document.body, event);
      });

      assert.deepEqual(keypressEvents, keyCodes, 'keycodes match given keys');
    });

    it("returns a stream of keypress events for the given key", (done) => {
      const sources = makeKeysDriver()({}, xstreamAdapter);

      sources.press('enter').take(1)
        .compose(subscribe(() => done()));

      const event = simulant('keypress', {keyCode: 13});

      simulant.fire(document.body, event);
    });

    it("returns a stream of keyup events for the given key", (done) => {
      const sources = makeKeysDriver()({}, xstreamAdapter);

      sources.up('enter').take(1)
        .compose(subscribe(() => done()));

      const event = simulant('keyup', {keyCode: 13});

      simulant.fire(document.body, event);
    });

    it("returns a stream of keydown events for the given key", (done) => {
      const sources = makeKeysDriver()({}, xstreamAdapter);

      sources.down('enter').take(1)
        .compose(subscribe(() => done()));

      const event = simulant('keydown', {keyCode: 13});

      simulant.fire(document.body, event);
    });

    it("emits events only for the given key", () => {
      const sources = makeKeysDriver()({}, xstreamAdapter);
      let enterPressed = false;

      sources.press('enter')
        .compose(subscribe(() => enterPressed = true));

      const event = simulant('keypress', {keyCode: 8});

      simulant.fire(document.body, event);

      assert.equal(enterPressed, false, 'enter has not been pressed yet');

      const enterEvent = simulant('keypress', {keyCode: 13});

      simulant.fire(document.body, enterEvent);

      assert.equal(enterPressed, true, 'enter has been pressed');
    });

    it("Gives a stream of true/false for key up/down events on a given key", () => {
      const sources = makeKeysDriver()({}, xstreamAdapter);
      let keyIsDown = true;

      sources.isDown('enter')
        .compose(subscribe(() => keyIsDown = !keyIsDown));

      const downEvent = simulant('keydown', {keyCode: 13});

      simulant.fire(document.body, downEvent);

      assert.equal(keyIsDown, true, 'Enter key is down');

      const upEvent = simulant('keyup', {keyCode: 13});

      simulant.fire(document.body, upEvent);

      assert.equal(keyIsDown, false, 'Enter key is up');
    });
  });
});
