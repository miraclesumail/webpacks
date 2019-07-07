import { Route, Switch, Link } from "react-router-dom";
import React, { Component } from 'react'
import Snake from './Snake'
import Touch from '../diy/gesture'
import DashBoard from '../diy/dashboard'
import Common from '../diy/common'
import App from './App'

class Myapp extends Component {
      render() {
          return (
            <div>
                 <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/snake">snake</Link>
          </li>
          <li>
            <Link to="/touch">touch</Link>
          </li>
          <li>
            <Link to="/dashboard">dashboard</Link>
          </li>
        </ul>
              <Switch>
                 
                      <Route exact path="/" component={props => {
                            return <App/>
                      }}/>
                      <Route exact path="/snake" component={props => {
                            return <Snake/>
                      }}/>
                      <Route path="/touch" component={Touch}/>
                      <Route path="/dashboard" component={DashBoard}/>
                      <Common>
                         <Route exact path='/common/qwe' component={props => {
                            return <div>common/qwe</div>
                         }}/>
                         <Route exact path='/common/asd' component={props => {
                            return <div>common/asd</div>
                         }}/>   
                      </Common>
              </Switch>
            </div>
          )         
      }
}

export default Myapp
