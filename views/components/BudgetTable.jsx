
import React from "react";
import unitconverter from "./../helpers/unitconverter.jsx";
import cx from 'classnames';


class BudgetTableRow extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      item:props.item
    };

  }


  onMoreDetail(b){

    // if(this.state.explored[b.code]){
    //   $(React.findDOMNode(this.refs['detail-'+b.code])).show();
    // }else{
    //   $(React.findDOMNode(this.refs['detail-'+b.code])).hide();
    // }
    this.props.onMoreDetail(b);

  }

  shouldComponentUpdate(){
    return false;
  }


  render(){
    var b = this.state.item;
    return (
      <tr>
        <td>{b.year}</td>
        <td>{b.code.split("-")[1]}</td>
        <td>{b.topname}</td>
        <td>{b.depname}</td>
        <td>{b.category}</td>
        <td>{b.name}</td>
        <td>{unitconverter.convert(parseInt(b.amount,10), null, true)}</td>
        <td>
          <div style={{color:(b.change == 0 ? "black" :b.change > 0 ? "red" :"green")}}>
            {b.change >0 ? "+" :""}
            {parseInt( (b.change/b.last_amount) *100 * 100,10)/100 +"%"}
            <br />
            (約差 {unitconverter.convert(b.change, null, true) })
          </div>
        </td>
        <td><button onClick={this.props.onMoreDetail.bind(this,b)}>看更多細節</button></td>
      </tr>
    );
  }
}


export default class BudgetTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      items:props.items,
      sort:null,
      sortAsc:false
    };

  }


  onMoreDetail(b){

    // if(this.state.explored[b.code]){
    //   $(React.findDOMNode(this.refs['detail-'+b.code])).show();
    // }else{
    //   $(React.findDOMNode(this.refs['detail-'+b.code])).hide();
    // }

    var obj = {};
    obj["explore-"+b.code] = !!! this.state["explore-"+b.code]

    this.setState(obj);
  }

  doSortBy(field,defAsc){
    if(this.state.sort == field){
      this.setState({sortAsc: !!!this.state.sortAsc });
    }else{
      this.setState({sort:field,sortAsc:defAsc});
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    var items = this.state.items || [];
    if(items.length != (nextState.items ||[] ).length){
      return true;
    }

    for(var k in this.state){
      if(k.indexOf("explore-") == -1){
        return true;
      }
      if(this.state[k] != nextState[k]){
        return true;
      }
    }

    console.log(arguments);
    return false;
  }

  render(){
    var {items,sort,sortAsc} = this.state;

    if(sort != null){
      items = items.sort( (a,b) => { return (a[sort] - b[sort]) * (sortAsc ? 1 :-1 ); } )
    }
    // var {drilldown} = data;
    var s = new Date().getTime();
    var h = (
      <div className='row'>
        <table className='table table-bordered'>
          <tbody>
            <tr>
              <td className='col-xs-1'>年份</td>
              <td className='col-xs-1'>代碼</td>
              <td className='col-xs-1'>款</td>
              <td className='col-xs-1'>項</td>
              <td className='col-xs-1'>目</td>
              <td className='col-xs-2'>名稱</td>
              <td style={{cursor:"pointer"}} className='col-xs-1' onClick={this.doSortBy.bind(this,'amount',false)}>金額 &nbsp;
                <i  
                  className={
                    cx({'glyphicon':true,
                      'glyphicon-sort': sort != 'amount',
                      'glyphicon-sort-by-order': (sort =="amount" && sortAsc ),
                      'glyphicon-sort-by-order-alt': (sort =="amount" && !sortAsc )
                    })
                  } />
              </td>
              <td style={{cursor:"pointer"}} className='col-xs-2'  onClick={this.doSortBy.bind(this,'change',false)}>
                前一年差額 &nbsp;
                <i 
                  className={
                    cx({'glyphicon':true,
                      'glyphicon-sort': sort != 'change',
                      'glyphicon-sort-by-order': (sort =="change" && sortAsc ),
                      'glyphicon-sort-by-order-alt': (sort =="change" && !sortAsc )
                    })
                  } />
              </td>
              <td className='col-xs-2'>細節
                
              </td>
            </tr>
          </tbody>
          {items && items.map((b)=>{
            return <tbody key={b.code} >
              <BudgetTableRow onMoreDetail={this.onMoreDetail.bind(this,b)} key={b.code+"-row"} item={b} /> 
              <tr ref={'detail-'+b.code} style={{display:this.state["explore-"+b.code] ?"":"none" }} >
                <td></td>
                <td colSpan={9} dangerouslySetInnerHTML={{__html:b.comment}}>
                </td>
               </tr>
            </tbody>;
          })}
        </table>
      </div>
    );
    console.log("used:"+(new Date().getTime()-s));
    return h;
  }
}

