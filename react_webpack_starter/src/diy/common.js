import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class Common extends Component {
  render() {
    return (
      <div>
         common
         <ul>
          <li>
            <Link to="/common/qwe">common-qwe</Link>
          </li>
          <li>
            <Link to="/common/asd">common-asd</Link>
          </li>
         </ul>
         {this.props.children}
      </div>
    )
  }
}

export default Common
