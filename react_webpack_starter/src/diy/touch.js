import React, { Component, useEffect, useState, memo } from 'react'
import { Observable } from 'rxjs'

let observer;

function isSameSign(n1, n2){
    if(n1 >= 0 && n2 < 0)
       return false
    if(n1 <= 0 && n2 > 0)
       return false
    return true     
}

function getDelta(from, to){
       const fromX = +from.left.replace('rem', '') + .5;
       const fromY = +from.top.replace('rem', '') + .5;
       const toX = +to.left.replace('rem', '') + .5;
       const toY = +to.top.replace('rem', '') + .5;
       const delta = (toY - fromY)/(toX - fromX);
       return delta;
}

export class Touch extends Component {
    state = {
        dotPlace: [],
        hasConnected: [],
        subscriber: null,
        movingDot: null,
        password: [1,3,4,6,5,2],
        restTimes: 3,
        status: 0  // 1 正确  2 错误
    }

    componentWillMount() {
        this.calculateDots();

        const observable = new Observable(subscriber => {
          // console.log('hello')
           this.setState({subscriber})         
        })

        observer = observable.subscribe({
          next(e){console.log('observable1---' + e)},
        })
    }

    componentWillUnmount() {
        observer.unsubscribe();
    }
    
    calculateDots = () => {
        // 5x + 3y = 8  .4 1 2.1
        const dotPlace = Array.from({length: 9}).map((item, index) => (
            {
                left: `${.4 + (index % 3)*3.1}rem`,
                top: `${.4 + (index/3 | 0)*3.1}rem`,
                width: '1rem',
                height: '1rem',
                borderRadius: '50%',
                border: '1px solid yellow',
                position: 'absolute'
            }
        ))
        this.setState({dotPlace})
    }

    getLinePoint = () => {
        const { hasConnected, dotPlace } = this.state;
        let arrs = [];
        let tempConnected = hasConnected.slice();

        if(this.state.movingDot){
            tempConnected.push({
                to: this.state.movingDot
            })
        }    

        if(tempConnected.length >= 2)
            tempConnected.reduce((a ,b) => {
                if(typeof(b) != 'number') {
                    const from = {x: +dotPlace[a].left.replace('rem','') + .5, y: +dotPlace[a].top.replace('rem','') + .5};
                    arrs.push({from, to:  b.to})      
                }

                if(typeof(a) == 'number' && typeof(b) == 'number') {
                    const from = {x: +dotPlace[a].left.replace('rem','') + .5, y: +dotPlace[a].top.replace('rem','') + .5};
                    const to = {x: +dotPlace[b].left.replace('rem','') + .5, y: +dotPlace[b].top.replace('rem','') + .5};
                    arrs.push({from, to})
                } 
                return b
            })
        
        console.log(arrs);
        return arrs;
    }

    addToConnected = (index) => {
        this.setState({hasConnected: [...this.state.hasConnected, index]})
    }

    onTouchMove = (e) => {
        if(!this.state.restTimes) {
            alert('no chance');
            return 
        }

        if(this.state.status != 0)
            return
        const offsetLeft = document.querySelector('.g-container').offsetLeft;
        const offsetTop = document.querySelector('.g-container').offsetTop;

        const movingDot = {
                    x: (e.changedTouches[0].clientX - offsetLeft)/document.body.clientWidth*10,
                    y: (e.changedTouches[0].clientY - offsetTop)/document.body.clientWidth*10
        }
        // 循环比较是否处于dot内
        const { hasConnected, dotPlace } = this.state;
        for(let i = 0; i < dotPlace.length; i++) {
              /**
               *  第一轮  比较movingDot是否落在9个点里面
               */
              const x = +dotPlace[i].left.replace('rem', '') + .5;
              const y = +dotPlace[i].top.replace('rem', '') + .5;
              const disX = (e.changedTouches[0].clientX - offsetLeft) - x/10*document.body.clientWidth;
              const disY = (e.changedTouches[0].clientY - offsetTop) - y/10*document.body.clientWidth;
             
              // 如果movingDot落在点内 就退出循环
              if((disX**2 + disY**2) < (.5/10*document.body.clientWidth)**2){
                  if(this.state.hasConnected.includes(i)) return;
                  //if(this.state.hasConnected.length) {
                  if(!this.checkDrawLine(i)) return;
                  //}
                  console.log(`在洞口${i}里面`);
                  this.setState({hasConnected: [...this.state.hasConnected, i], movingDot: null});
                  return
              }     
        }  

        if(!hasConnected.length) return;

        this.checkHasInOtherDot(movingDot);       
    }

    checkDrawLine = (index) => {
         const { hasConnected, dotPlace } = this.state;

         if(!hasConnected.length) return true;
         const lastDot = hasConnected[hasConnected.length - 1];
         const tempDot = dotPlace[lastDot];
         const checkedDot = dotPlace[index];
         const delta = getDelta(tempDot, checkedDot);
         let num = null;
         for(let i = 0; i < hasConnected.length; i++) {
               if(hasConnected.length - 1 == i)
                  continue
               const toDot = dotPlace[hasConnected[i]];   
               const comparedDelta = getDelta(tempDot, toDot);  
               if(delta == comparedDelta){
                   num = hasConnected[i];
                   break;
               }       
         }
         if(num == null)
            return true
         if((num > lastDot && index > num) || (num < lastDot && index < num))
            return false
         else
            return true   
    }

    checkHasInOtherDot = (movingDot) => {
         const { hasConnected, dotPlace } = this.state;
         const tempCompared = dotPlace[hasConnected[hasConnected.length - 1]];
         const x = +tempCompared.left.replace('rem', '') + .5;
         const y = +tempCompared.top.replace('rem', '') + .5;

         // 移动的点和上一个点的正切值
         const tanVal = Math.abs((movingDot.y - y)/(movingDot.x - x));
         const angle = Math.atan(tanVal);

         
         for(let i = 0; i < dotPlace.length; i++) {
              if(hasConnected.includes(i)) continue;

              const comparedPoint = {
                    x: +dotPlace[i].left.replace('rem', '') + .5,
                    y: +dotPlace[i].top.replace('rem', '') + .5
              }
              if(!isSameSign(movingDot.y - y, comparedPoint.y - y) || !isSameSign(movingDot.x - x, comparedPoint.x - x)) continue;

              // 这里是比较有没有交叉点存在
              let deltaAngle;
              if(i == hasConnected[hasConnected.length - 1])
                    continue;

              const distance = Math.sqrt((x - comparedPoint.x)**2 + (y - comparedPoint.y)**2);     
                
              if(x == comparedPoint.x)
                    deltaAngle = Math.PI/2

              if(y == comparedPoint.y)
                    deltaAngle = 0
                
              if(x != comparedPoint.x && y != comparedPoint.y) {
                    const tanVal1 = Math.abs((y - comparedPoint.y)/(x - comparedPoint.x));
                    deltaAngle = Math.atan(tanVal1);
              } 
              
              const verticalDis = distance*Math.sin(Math.abs(deltaAngle - angle)); 
              const lineLength = Math.sqrt((movingDot.y - y)**2 + (movingDot.x - x)**2);
              const lineMinLength = Math.sqrt(distance**2 - verticalDis**2);

              // 存在交叉点  需要往hasconnected里面push 一个i
              if(verticalDis < 0.5 && lineLength >= lineMinLength){ 
                    if(!this.checkDrawLine(i)) return
                    this.setState({hasConnected: [...this.state.hasConnected, i], movingDot});
                    return
              }             
         }
         this.setState({movingDot})
    }

    onTouchEnd = (e) => {
         const { hasConnected, password } = this.state;
         if(JSON.stringify(hasConnected) == JSON.stringify(password)){
             alert('密码正确');
             this.setState({status: 1}, () => {
                  setTimeout(() => {
                     this.setState({hasConnected: [], movingDot: null, status: 0})
                  }, 1000);
             })
         } else {
             alert('密码错误');
             this.setState({status: 2, restTimes: this.state.restTimes - 1}, () => {
                  setTimeout(() => {
                     this.setState({hasConnected: [], movingDot: null, status: 0})
                  }, 1000);
             })
         }
    }

    render() {
        const { hasConnected, status } = this.state;
        const lineArrs = this.getLinePoint();
        //onTouchStart={(e) => console.log(e.changedTouches[0])}
        return (  
              <div className="g-container" onTouchMove={this.onTouchMove} onTouchEnd={this.onTouchEnd}>
                   {
                       this.state.dotPlace.map((style, index) => (
                           <div style={hasConnected.includes(index) ? {...style, border: '1px solid red'} : style} onClick={() => this.addToConnected(index)}>
                                {hasConnected.includes(index) ? <div className="inner"></div> : null}
                           </div>
                       ))
                   }   
                   {
                       lineArrs.length ? lineArrs.map((item, index) => (
                           <Line key={index} {...item} status={status}/>
                       )) : null
                   }
              </div>     
        )
    }
}

// 使用memo减少不必要渲染
const Line = memo(({from, to, status}) => {
    console.log('我我我人嫩');
    // 线长
    const lineLength = Math.sqrt((to.x - from.x)**2 + (to.y - from.y)**2);
    const left = from.x - .5*(lineLength - to.x + from.x) + 'rem';
    const top = from.y + .5*(to.y - from.y) + 'rem';
    const angle = Math.atan((to.y - from.y)/(to.x - from.x))/(2*Math.PI)*360;
    let background;
    switch (status) {
        case 0:
            background = 'yellowgreen'
            break;
        case 1:
            background = 'blue';
            break;
        case 2:
            background = 'grey';
            break;    
        default:
            break;
    }
    const style = {
          position: 'absolute',
          width: lineLength + 'rem',
          left,
          top,
          transform: `rotate(${angle}deg)`,
          height: '2px',
          background
    }

    return <div style={style}></div>
}, ({from, to, status}, {from:from1, to:to1, status:status1}) => {
    //console.log(from, from1);
    const flag = JSON.stringify(from) == JSON.stringify(from1) && JSON.stringify(to) == JSON.stringify(to1) && JSON.stringify(status) == JSON.stringify(status1)
    //console.log(flag);
    return flag;
})

export default Touch