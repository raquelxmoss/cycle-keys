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
`Keys.isDown(key)` - returns a stream of booleans, `true` if the given key is currently _down_, `false` if the given key is currently _up_. Must be called with a key argument.

All methods take a key argument. Calling a method with a key argument will return a stream of key events filtered to that particular key.

```js
// return a stream of all keypresses
const allKeypresses$ = Keys.press();

// return a stream of keypresses on the escape key
const esc$ = Keys.press('esc');

// return a stream of keypresss on the shift key
const shift$ = Keys.press('shift');

// return a stream of booleans describing whether the enter key is down or up
const isDown$ = Keys.isDown('enter');
```

## Example

In this example, a user can hit 'enter' to change the background colour. The heading text will change depending on whether the space bar is in a down or up position.

[You can try this example out online](http://raquelxmoss.github.io/cycle-keys)

```js
import {run} from '@cycle/core';
import {makeDOMDriver, p, h1, div} from '@cycle/dom';
import {Observable} from 'rx';
import {makeKeysDriver} from 'cycle-keys';
import combineLatestObj from 'rx-combine-latest-obj';

function main({DOM, Keys}){
  const colours = ["#F6F792", "#333745", "#77C4D3", "#DAEDE2", "#EA2E49"];

  const isDown$ = Keys.isDown('space')
    .startWith(false);

  const colour$ = Keys.press('enter')
    .map(ev => +1)
    .scan((acc, int) => acc + int, 0)
    .startWith(0)
    .map(int => colours[int % colours.length]);

  const state$ = combineLatestObj({isDown$, colour$});

  return {
    DOM: state$.map(state => (
      div(
        '.container',
        {style: {background: state.colour}},
        [
          h1(state.isDown ?
            "Oooh fancy!" :
            "Hold down the space bar. Go on, I dare you."
          ),
          p("For additional fun, hit enter")
        ]
      )
    )
   )
  }
}

const drivers = {
  DOM: makeDOMDriver('.app'),
  Keys: makeKeysDriver()
};

run(app, drivers);
```