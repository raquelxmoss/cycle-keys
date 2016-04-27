import {Observable} from 'rx';
import keycode from 'keycode';

export function makeKeysDriver () {
  return function keysDriver() {
    return {
      presses (key) {
        const code = keycode(key);

        return Observable
          .fromEvent(document.body, 'keypress')
          .filter(ev => ev.keyCode === code);
      }
    }
  }
}
