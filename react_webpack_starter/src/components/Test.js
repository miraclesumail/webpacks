import React, { Component, useCallback, memo } from 'react'
import memoizeOne from 'memoize-one';

function say(){
    console.log('this is say')
}

class Test extends Component {
  state = {
      count: 1
  }

  
  componentDidMount() {
      const timer = setInterval(() => {
          if(this.state.count == 5) {clearInterval(timer);return}
          this.setState({count: this.state.count + 1});
      }, 1000)
  }
  
  say = () => {
     console.log('this is say')
  }
//   say = memoizeOne(
//     () => {
//       console.log('this is say')
//     }
//   )

  render() {
              console.log('render啊啊啊');

    return (
      <div>
         <Child say={this.say}/>
      </div>
    )
  }
}


class Child extends Component {
    componentDidMount() {
        console.log('dddd')
    }
    

    shouldComponentUpdate(nextProps, nextState) {
        // console.log(this.props.say === nextProps.say);
        // if(this.props.say === nextProps.say) {
        //     return false;
        // }
    }

    render() {
        return (
            <div>chilcdssd</div>
        )
    }
}

export default Test
