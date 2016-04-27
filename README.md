# Cycle Keys
## A Cycle.js driver for keyboard events

This driver for Cycle.js helps you to manage keypress events on the documenteasily.

## Installation

You can install Cycle Keys with npm

```bash
npm install cycle-keys
```

## Usage

1. Install Cycle Keys with npm (see above)

2. Import the driver

```es6
    import {makeKeysDriver} from 'cycle-keys';
```

3. Initialise the driver by calling `makeKeysDriver` in your drivers object

```es6
    const drivers = {
      Keys: makeKeysDriver()
    }
```

4. Add it to your main function's sources

```es6
function main({Keys}) { // Your amazing main function }
```

5. Call `Keys.presses` with the name of the key for which you'd like a stream of presses. Currently, Cycle Keys supports inputting keys as strings only

```es6```
  const esc$ = Keys.presses('esc');
  const shift$ = Keys.presses('shift');
```

**Note** Cycle Keys relies on [keycode](https://github.com/timoxley/keycode), see their documentation for more information about string aliases for keys.

## Example

In this example, our user will input a search term. When they hit enter, an alert will appear showing the search term they typed in.

```es6
import {run} from '@cycle/core';
import {makeDOMDriver, input, p, div} from '@cycle/dom';
import {Observable} from 'rx';
import {makeKeysDriver} from 'cycle-keys';

function main({DOM, Keys}){
  const enter$ = Keys.presses('enter');

  const inputText$ = DOM
    .select('.search')
    .events('input')
    .map(e => e.target.value)

  enter$
    .withLatestFrom(inputText$, (event, text) => text)
    .subscribe(text => alert(text))

  return {
    DOM: Observable.just(
      div('.container', [
        p('.instructions', 'Write in a search term, then hit enter'),
        input('.search')
      ])
  }
}

const drivers = {
  DOM: makeDOMDriver('.app'),
  Keys: makeKeysDriver()
};

run(app, drivers);
```
