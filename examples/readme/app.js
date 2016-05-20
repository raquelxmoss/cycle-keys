import {Observable} from 'rx';
import {div, p, h1, input} from '@cycle/dom';
import combineLatestObj from 'rx-combine-latest-obj';

export default function main({DOM, Keys}){
  const colours = ["#F6F792", "#333745", "#77C4D3", "#DAEDE2", "#EA2E49"];

  const isDown$ = Keys.isDown('space')
    .startWith(false);

  const colour$ = Keys.press('enter')
    .map(ev => +1)
    .scan((acc, int) => acc + int, 0)
    .startWith(0)
    .map(int => colours[int % colours.length]);

  const state$ = combineLatestObj({isDown$, colour$})

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
