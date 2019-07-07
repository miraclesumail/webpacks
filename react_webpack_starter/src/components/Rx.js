import { Observable, BehaviorSubject, interval, of, fromEvent } from 'rxjs'
import { map, skip, delay, first, take, filter, switchMap } from 'rxjs/operators';

import React, { Component } from 'react'

let observer, observer1;

function createSubscriber(time) {
    time = 5 + Math.random()*time | 0;
    return subscriber => {
         setTimeout(function() {
             subscriber.next('this is a random sub haha');
         }, time*1000);
    }
}

function createPs(m) {
    return new Promise((resolve, reject) => {
           setTimeout(function() {
               resolve('你是上司等你等你地');
           }, m*1000);
    })
}

class Test extends Component {
  constructor(props) {
      super(props);
      this.state = {
            subscriber: '',
            count: 1
      }
  }  
  
  componentDidMount() {
     // this is async wont stop next execution 
     const observable = new Observable( subscriber => {
          // console.log('hello');
           subscriber.next(1);
           subscriber.next('1111');
           setTimeout(() => {
               subscriber.next(2);
               this.setState({subscriber})
               // observable 是immutable的 不能改变
               //observable = createSubscriber(5);
           }, 1000);
     })

     of(1, 2, 3).pipe(map(x => x * x), first()).subscribe((v) => console.log(`value: ${v}`));
     interval(1000).pipe(take(5), map(x => x + 1), filter(x => x%2)).subscribe(x => console.log('Next: ', x));
     //console.log('this is the begining');


     const switched = of(1, 2, 3).pipe(switchMap((x) => of(x, x ** 2)));
     switched.subscribe(x => console.log('switchMapswitchMap' + x));

     const clicks = fromEvent(document.querySelector('.aa'), 'click');
     const result = clicks.pipe(switchMap((ev) => interval(1000)));
     result.subscribe(x => console.log('querySelectorquerySelector' + x));
     setInterval(() => {
           this.setState({count: this.state.count + 1})
     }, 10000)

     // Which proves the subscription of foo was entirely synchronous, just like a function.
     observer = observable.subscribe({
          next(e){console.log('observable1---' + e)},
          complete() { console.log('done'); }
     })

    //  console.log('prove sync ooo');
    //  observer1 = observable.subscribe({
    //       next(e){console.log('this is obsever1 from call + e')}
    //  })

    //  observer.add(observer1);

    let subject = new BehaviorSubject('hello world');
    subject.subscribe({
        next(e){console.log('subject 111' + e)}
    })

    subject.next('ddddddd1111');
    subject.next('ddddddd1111');
    subject.next('ddddddd211221');

    subject.subscribe({
       // next(e){console.log('subject 222' + e)}
    })
    subject.next('axibababab');

    const observable11 = new Observable( subscriber => {
          // console.log('hello');
            subscriber.next(1);
            subscriber.next(2);
            subscriber.next(3);
    }).pipe(
        map(x => x * 5),
        skip(1),
        delay(3000)
    )       

    observable11.subscribe({
        next(e){console.log('operator----' + e)
    }
    })
  }  

  componentWillUpdate(nextProps, nextState) {
          if(this.state.subscriber) 
             createPs(5).then(res => {
                 if(nextState.count == 3) 
                    this.state.subscriber.complete()
                 else   
                    this.state.subscriber.next(res)
             })
  }

  componentWillUnmount() {
           observer.unsubscribe();
  }
  
  
  render() {
           console.log('this is say')

    return (
      <div className="aa">
          this is just a test for rxjs
      </div>
    )
  }
}

export default Test
