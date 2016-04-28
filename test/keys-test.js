import {makeKeysDriver} from '../src/keys-driver';

import assert from 'assert';
import simulant from 'simulant';

describe("makeKeysDriver", () => {
  describe("presses", () => {
    it("returns a stream of all keypresses", () => {
      const sources = makeKeysDriver()();

      const keyCodes = [74, 75, 76];
      let keypressEvents;

      sources.presses().take(3).toArray().subscribe((events) => {
        keypressEvents = events.map(event => event.keyCode);
      });


      keyCodes.forEach(function (keyCode) {
        const event = simulant('keypress', {keyCode});

        simulant.fire(document.body, event);
      });

      assert.deepEqual(keypressEvents, keyCodes, 'keycodes match given keys');
    });

    it("returns a stream of keypress events for the given key", (done) => {
      const sources = makeKeysDriver()();

      sources.presses('enter').take(1).subscribe(() => done());

      const event = simulant('keypress', {keyCode: 13});

      simulant.fire(document.body, event);
    });

    it("emits events only for the given key", () => {
      const sources = makeKeysDriver()();
      let enterPressed = false;

      sources.presses('enter').subscribe(() => enterPressed = true);

      const event = simulant('keypress', {keyCode: 8});

      simulant.fire(document.body, event);

      assert.equal(enterPressed, false, 'enter has not been pressed yet');

      const enterEvent = simulant('keypress', {keyCode: 13});

      simulant.fire(document.body, enterEvent);

      assert.equal(enterPressed, true, 'enter has been pressed');
    });
  });
})
