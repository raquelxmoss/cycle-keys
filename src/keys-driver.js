import {Observable} from 'rx';
import keycode from 'keycode';

export function makeKeysDriver () {
  return function keysDriver() {
    const methods = {};
    const events = ['keypress', 'keyup', 'keydown'];

    events.forEach(event => {
      const methodName = event.replace('key', '');

      methods[methodName] = (key) => {
        let event$ = Observable.fromEvent(document.body, event);

        if (key) {
          const code = keycode(key);

          event$ = event$.filter(event => event.keyCode === code);
        }

        return event$;
      }
    });

    return methods;
  }
}
