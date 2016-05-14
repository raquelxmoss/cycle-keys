# [Cycle Keys](http://raquelxmoss.github.io/cycle-keys)
## A Cycle.js driver for keyboard events

This driver for Cycle.js helps you to manage key events on the document easily.

## Installation

You can install Cycle Keys with npm

```bash
$ npm install cycle-keys --save
```

## Usage

- Install Cycle Keys with npm (see above)

- Import the driver

```js
import {makeKeysDriver} from 'cycle-keys';
```

- Initialise the driver by calling `makeKeysDriver` in your drivers object

```js
const drivers = {
  Keys: makeKeysDriver()
}
```

- Add it to your main function's sources

```js
function main({Keys}) { /* Your amazing main function */ }
```

- Call `Keys.press` (or any of the methods below) without any arguments to get a stream of all keypresses. You can also call `press` with the name of a key to only get keypresses for that key. Currently, Cycle Keys supports inputting keys as strings only

**Note** Cycle Keys relies on [keycode](https://github.com/timoxley/keycode), see their documentation for more information about string aliases for keys.

## Methods

`Keys.down()` - returns a stream of keydown events.

`Keys.up()` - returns a stream of keyup events.

`Keys.press()` - returns a stream of keypress events.

All methods take an optional key argument. Calling a method with a key argument will return a stream of key events filtered to that particular key.

```js
// return a stream of all keypresses
const allKeypresses$ = Keys.press();

// return a stream of keypresses on the escape key
const esc$ = Keys.press('esc');

// return a stream of keypresss on the shift key
const shift$ = Keys.press('shift');
```

## Example

In this example, our user will input a search term. When they hit enter, an alert will appear showing the search term they typed in.

[You can try this example out online](http://raquelxmoss.github.io/cycle-keys)

```js
import {run} from '@cycle/core';
import {makeDOMDriver, input, p, div} from '@cycle/dom';
import {Observable} from 'rx';
import {makeKeysDriver} from 'cycle-keys';

function main({DOM, Keys}){
  const enter$ = Keys.press('enter');

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
    )
  }
}

const drivers = {
  DOM: makeDOMDriver('.app'),
  Keys: makeKeysDriver()
};

run(app, drivers);
```
