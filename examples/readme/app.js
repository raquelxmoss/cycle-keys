import xs from 'xstream';
import {div, p, h1} from '@cycle/dom';

export default function main({DOM, Keys}){
  const colours = ["#F6F792", "#333745", "#77C4D3", "#DAEDE2", "#EA2E49"];

  const isDown$ = Keys.isDown('space')

  const colour$ = Keys.press('enter')
    .map(ev => +1)
    .fold((acc, int) => acc + int, 0)
    .map(int => colours[int % colours.length])

  const state$ = xs.combine(isDown$, colour$)
    .map(([isDown, colour]) => ({isDown, colour}))

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
