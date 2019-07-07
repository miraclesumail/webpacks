import React, { Component } from 'react'
import { Switch, Link, Route } from 'react-router-dom'
import { Motion, spring, presets, StaggeredMotion } from 'react-motion'

class DashBoard extends Component {
  render() {
    return (
      <div>
        <ul>
          <li>
            <Link to="/dashboard">dashboard</Link>
          </li>
          <li>
            <Link to="/dashboard/qq">dashboard-qq</Link>
          </li>
          <li>
            <Link to="/dashboard/ww">dashboard-ww</Link>
          </li>
        </ul>
        <Motion defaultStyle={{left: 30, top: 0}} style={{left: spring(100, presets.wobbly), top:spring(30, presets.gentle)}}>
  {value => <div style={{position:'relative', ...value }}>ff</div>}
</Motion>
        <StaggeredMotion
  defaultStyles={[{h: 10}, {h: 0}, {h: 0}]}
  styles={prevInterpolatedStyles => prevInterpolatedStyles.map((_, i) => {
    return i === 0
      ? {h: spring(100)}
      : {h: spring(prevInterpolatedStyles[i - 1].h)}
  })}>
  {interpolatingStyles =>
    <div>
      {interpolatingStyles.map((style, i) =>
        <div key={i} style={{border: '1px solid', width:'10px', display:'inline-block', height: style.h}} />)
      }
    </div>
  }
</StaggeredMotion>
        <Switch>
             <Route exact path="/dashboard" component={props => (
                 <div>heheheh</div>
             )}/>
             <Route path="/dashboard/qq" component={props => (
                 <div>qqqqq</div>
             )}/>
             <Route path="/dashboard/ww" component={props => (
                 <div>wwwww</div>
             )}/>
        </Switch>
      </div>
    )
  }
}

export default DashBoard
