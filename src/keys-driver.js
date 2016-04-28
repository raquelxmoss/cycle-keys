import {Observable} from 'rx';
import keycode from 'keycode';

export function makeKeysDriver () {
  return function keysDriver() {
    return {
      presses (key) {
        let keypress$ = Observable.fromEvent(document.body, 'keypress');

        if (key) {
          const code = keycode(key);

          keypress$ = keypress$.filter(event => event.keyCode === code);
        }

        return keypress$;
      }
    }
  }
}
