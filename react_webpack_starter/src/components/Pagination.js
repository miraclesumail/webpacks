import React, { Component, Fragment } from 'react'

class Pagination extends Component {
//   static defaultProps = {
//        pageMiddleNumber: 5
//   }
  constructor(props) {
       super(props);
       this.state = {
            nowPage: 1,
            arrPage: [] // 记录中间显示的页数
       }
  }

  componentWillMount() {
       this.renderMiddleTab();
  }

  renderMiddleTab = () => {
       const { totalPage , pageMiddleNumber } = this.props;
       const { nowPage } = this.state;
       let arrPage;
       if(totalPage <= 2) {
           return null
       } else if(totalPage <= 2 + pageMiddleNumber) {
           arrPage = Array.from({length: totalPage - 2}, (item, index) => index + 2)
       } else {
           arrPage = this.getArrPage();
       } 
       this.setState({arrPage})
  }

  getArrPage = (nowPage = null) => {
           const { totalPage , pageMiddleNumber } = this.props;
           nowPage = nowPage ? nowPage : this.state.nowPage;
           let arrPage;
           if(nowPage - (pageMiddleNumber - 1)/2 <= 2) {
              arrPage = Array.from({length: pageMiddleNumber}, (item, index) => index + 2);
              console.log(arrPage, '哈哈哈哈哈');
           } else if(nowPage + (pageMiddleNumber - 1)/2 >= totalPage - 1) {
              arrPage = Array.from({length: pageMiddleNumber}, (item, index) => totalPage - pageMiddleNumber + index)  
           } else {
              arrPage = Array.from({length: pageMiddleNumber}, (item, index) => nowPage + index - 2)
           }
           return arrPage;
  }

  pageSelectFn = (nowPage) => {
       const { totalPage , pageMiddleNumber } = this.props;
       //let arrPage;
    //    if(nowPage - (pageMiddleNumber - 1)/2 <= 2) {
    //           arrPage = Array.from({length: pageMiddleNumber}, (item, index) => index + 2);
    //           console.log(arrPage, '哈哈哈哈哈');
    //        } else if(nowPage + (pageMiddleNumber - 1)/2 >= totalPage - 1) {
    //           arrPage = Array.from({length: pageMiddleNumber}, (item, index) => totalPage - pageMiddleNumber + index)  
    //        } else {
    //           arrPage = Array.from({length: pageMiddleNumber}, (item, index) => nowPage + index - 2)
    //        }
      this.setState({nowPage, arrPage: this.getArrPage(nowPage)});

      this.props.pageSelectFn(nowPage);
  }

  handleDotClick = (number) => {
      let { arrPage } = this.state;
      const { pageMiddleNumber, totalPage } = this.props;
      let arrNew;
      if(number < 0 ){
           arrNew = arrPage[0] - pageMiddleNumber <=2 ? Array.from({length: pageMiddleNumber}, (item, index) => 2 + index) : 
              arrPage.map(item => item - pageMiddleNumber );
      } else {
           arrNew = arrPage[pageMiddleNumber - 1] + 5 >= totalPage - 1 ? Array.from({length: pageMiddleNumber}, (item, index) => totalPage - pageMiddleNumber + index) :
              arrPage.map(item => item + pageMiddleNumber)
      } 
      this.setState({arrPage: arrNew, nowPage: arrNew[(pageMiddleNumber - 1)/2]})
  }

  render() {
    const { nowPage, arrPage } = this.state;
    const { pageMiddleNumber, totalPage } = this.props;
    let prevPage = nowPage == 1 ? 'operation disabled' : 'operation';  
    let nextPage = nowPage == totalPage ? 'operation disabled' : 'operation';  

    const showLeftDot = nowPage - (pageMiddleNumber - 1)/2 > 2;
    const showRightDot = nowPage + (pageMiddleNumber - 1)/2 < totalPage - 1;
    return (
      <div style={{display: 'flex', height: '30px'}}>
           <div className={prevPage}>上一页</div>
           <div className={1 == nowPage ? "active page":"page"} onClick={() => this.pageSelectFn(1)}>1</div>
           {showLeftDot ? <div onClick={() => this.handleDotClick(-1)}>...</div> : null}
           {<Fragment> 
                 {
                    arrPage.map(item => (<div className={item == this.state.nowPage ? "active page": "page"} onClick={() => this.pageSelectFn(item)}>{item}</div>))
                 }
              </Fragment> }
           {showRightDot ? <div onClick={() => this.handleDotClick(1)}>...</div> : null}
           <div className={totalPage == nowPage ? "active page":"page"} onClick={() => this.pageSelectFn(totalPage)}>{totalPage}</div>
           <div className={nextPage}>下一页</div>
      </div>
    )
  }
}

export default Pagination
