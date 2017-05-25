
import React from "react";
import unitconverter from "./../helpers/unitconverter.jsx";
import cx from 'classnames';

import BaseComponent from './BaseComponent.jsx';
import Loading from './Loading.jsx';

export default class BudgetGroupTable extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = {
      sort:null,
      sortAsc:false
    };

  }

  doSortBy(field,defAsc){
    if(this.state.sort == field){
      this.setStateWithLoading({sortAsc: !!!this.state.sortAsc });
    }else{
      this.setStateWithLoading({sort:field,sortAsc:defAsc});
    }
  }

  doSearch(){
    var input = React.findDOMNode(this.refs.search).value;
    this.setStateWithLoading({search:input},500);
  }


  _sumSection(budgets,keys){
    if(budgets == null){
      return [];
    }

    var groups = {};

    budgets.forEach((b) => {
      var key_array = [];
      keys.forEach((k) => {
        key_array.push(b[k]);
      });
      var key = key_array.join("");

      groups[key] = groups[key] || {name:"",amount:0,last_amount:0,change:0};

      if(groups[key][keys[0]] == null){ //first init
        keys.forEach((k) => {
          groups[key][k] = b[k];
        });
      }

      if(b.last_amount){
        groups[key].last_amount += parseInt(b.last_amount,10);
      }
      
      groups[key].amount += parseInt(b.amount,10);
      groups[key].change += parseInt(b.change,10);

    });
    
    var sections = [];
    for(var k in groups){
      sections.push(groups[k]);
    }
    return sections;
  }

  componentWillReceiveProps(nextProps) {

    if(nextProps.keys == null || this.props.keys == null){
      return true;
    }

    if(Object.keys(nextProps.keys).length != Object.keys(this.props.keys)){
      this.setState({
        sort:null,
        sortAsc:false
      });
    }

  }


  render(){
    if(this.props.keys == null){
      return null;
    }
    var {search,sort,sortAsc} = this.state;
    var items = this._sumSection(this.props.items,Object.keys(this.props.keys));

    // var hide = {};

    if(search != null && $.trim(search) != ""){
      let newitems = [];
      items.forEach((item) => { 
        for(var k in this.props.keys){
          if(item[k].indexOf(search) != -1){
            newitems.push(item);

            break;
          }
        }
      });
      items = newitems;
    }

    if(sort != null){
      items = items.sort( (a,b) => { 
        return (parseInt(a[sort],10) - parseInt(b[sort],10)) * (sortAsc ? 1 :-1 ); 
      });

    }
    // var {drilldown} = data;
    var s = new Date().getTime();
    var h = (
      <div className='row'>
        <p><input ref='search' onKeyDown={this.bindKeyEnter(this.doSearch)} type='text' /> 
          <button onClick={this.doSearch.bind(this)}>搜尋</button>
          <br />
          <small>(搜尋{Object.keys(this.props.keys).map(key => (
                  "["+this.props.keys[key].name+"]"
                ) )}名稱、模糊比對)</small>
        </p>
        <table className='table table-bordered'>
          <tbody>
            <tr>
              {Object.keys(this.props.keys).map(key => (
                  <td className='col-xs-1' >{this.props.keys[key].name}</td>
                ) )}

              <td style={{cursor:"pointer"}} className='col-xs-2' onClick={this.doSortBy.bind(this,'amount',false)}>金額 &nbsp;
                <i  
                  className={
                    cx({'glyphicon':true,
                      'glyphicon-sort': sort != 'amount',
                      'glyphicon-sort-by-order': (sort =="amount" && sortAsc ),
                      'glyphicon-sort-by-order-alt': (sort =="amount" && !sortAsc )
                    })
                  } />
              </td>
              <td className='col-xs-2'>總預算約</td>
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
            </tr>
            {(this.props.waiting || this.state._waiting ) && 
                <tr><td colSpan={9}><Loading /></td></tr>
            }
            {items.map( b =>
              <tr>
                {
                  Object.keys(this.props.keys).map(key => (
                  <td>{b[key]}</td>
                  ))
                }
                <td style={{"text-align":"right"}}>{b.amount}</td>
                <td style={{"text-align":"right"}}> {unitconverter.convert(b.amount,null,false)} </td>
                <td style={{"text-align":"right"}}> 
                {(
                  b.last_amount != null? 
                    (<div style={{color:(b.change == 0 ? "black" :b.change > 0 ? "green" :"red")}}>
                  {unitconverter.percent(b.change,b.last_amount)}
                  <br />
                  (約差 {unitconverter.convert(b.change, null, true) })
                </div> ):
                    "無之前資料"
                  )} </td>
              </tr>
            )}

          </tbody>
        </table>
      </div>
    );
    // console.log("used:"+(new Date().getTime()-s));
    return h;
  }
}

