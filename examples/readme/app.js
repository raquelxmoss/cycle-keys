import {Observable} from 'rx';
import {div, p, input} from '@cycle/dom';

export default function main({DOM, Keys}){
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
    )
  }
}
