import React, { Component, Fragment } from 'react'
import MenuData from './MenuData'

export default class MenuContainer extends Component {
    constructor(props){
      super(props);
      this.state = {
          index: props.index
      }
    }

    setIndex = (index, order) => {
        const tempIndex = this.state.index.slice();
        tempIndex[order] = index;
        if(order == 0) tempIndex[1] = 0;
        console.log(tempIndex);
        this.setState({index: tempIndex});
    }

    passToParent = (flag=false) => {
        if(flag) 
           this.props.setIndex(this.state.index)
        else
           this.props.setIndex()   
    }

    render() {
        const { index } = this.state;
        const listData = MenuData.map(item => (
            {province: item.province, id: item.id}
        ))

        let listData1 = index.length ? MenuData[index[0]].children : []
        return (
             <div style={{width:'100%', height: '150px', display:'flex', position: 'fixed', bottom: 0, background: 'yellowgreen'}}>        
                  <div className="control">
                       <button onClick={() => this.passToParent(true)}>确认</button>
                       <button onClick={() => this.passToParent(false)}>取消</button>
                  </div>
                  <CustomPick listData={listData} index={index[0] || 0} order={0} setIndex={(index) => this.setIndex(index, 0)}/>
                  <CustomPick listData={listData1} index={index[1] || 0} order={1} setIndex={(index) => this.setIndex(index, 1)}/>
             </div>
        )
    }
}

class CustomPick extends Component {
  static defaultProps = {
       numberToRender: 5
  }

  constructor(props){
      super(props);
      this.state = {
          activeIndex: props.index
      }
  }

  componentDidMount() {
       this.setScrollTop(true);
  }

  componentWillReceiveProps(nextProps){
       if(nextProps.index != this.state.index){
           this.setActiveIndex(nextProps.index);
       }
  }    

  setActiveIndex = (index) => {
       if(index == this.state.activeIndex) return;
       this.setState({activeIndex:index}, () => {
            this.setScrollTop();
       });
       this.props.setIndex(index);
  }

  setScrollTop = (flag=false) => {
       const { numberToRender, order } = this.props;
       const { activeIndex } = this.state;
       const maxtop = numberToRender % 2 ? (numberToRender - 1)/2 : numberToRender/2 - 1;
       const minBelow = numberToRender % 2 ? 7 -  (numberToRender - 1)/2 : 7 - (numberToRender/2 - 1);
    //    const container = document.querySelector('.container');
       if(activeIndex <= maxtop){
            $(`.container_${order}`).animate({scrollTop:0}, flag ? 0 : 300, 'swing');
       } else if(activeIndex >= minBelow){
            $(`.container_${order}`).animate({scrollTop:3*30 + 'px'}, flag ? 0 : 300, 'swing');
       } else {
            console.log('哎iaiaiaiiafndnksksk思考思考开始开始看');
            $(`.container_${order}`).animate({scrollTop: (activeIndex - 2)*30+'px'}, flag ? 0 : 300, 'swing');
       }  
  }
   
  renderMenus = () => {
       if(!this.props.listData.length) return null;
       return this.props.listData.map((item, index) => (
           <div key={index} onClick={() => this.setActiveIndex(index)} className={index === this.state.activeIndex ? 'menu-item  active' : 'menu-item'}>
                {item.province || item.city} </div>
       ))
  }

  render() {
    return (
          <div style={{height: '150px', overflow:'auto', flex:1, 'borderRight': '2px solid pink'}} className={`container_${this.props.order}`}>
              <div style={{height:'240px', width:'100%'}}>
                   {this.renderMenus()}
              </div>    
          </div>
    )
  }
}

