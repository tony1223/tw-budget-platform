
import React from "react";
import unitconverter from "./../helpers/unitconverter.jsx";
import cx from 'classnames';

import BaseComponent from './BaseComponent.jsx';
import Loading from './Loading.jsx';
import Util from '../helpers/util';


class BudgetTableRow extends BaseComponent {

  constructor(props) {
    super(props);
    this.state ={open:false};
  }


  onMoreDetail(b){

    // if(this.state.explored[b.code]){
    //   $(React.findDOMNode(this.refs['detail-'+b.code])).show();
    // }else{
    //   $(React.findDOMNode(this.refs['detail-'+b.code])).hide();
    // }
    this.setState({open:!!!this.state.open});

  }

  // shouldComponentUpdate(){
  //   return false;
  // }
  _code(code){
    if(code.indexOf("-") == -1){
      return code;
    }
    return code.split("-")[1];
  }


  _find_meta_details(){
    if(this.props.codeMetas == null){
      return null;
    }
    
    var codeMetas = this.props.codeMetas;

    var metas = codeMetas[this.props.item.code] && codeMetas[this.props.item.code]["purpose"];
    if(!metas){
      return null;
    }
    var ignorefield=["款","項","目","節","科目名稱","預算科目編號"];
    ignorefield.forEach((key)=>{
      if(metas[key]){
        delete metas[key];
      }
    });

    var sortnum = function(name){
      if(name.indexOf("_資") != -1){
        return 2;
      }
      if(name.indexOf("_經") != -1){
        return 3;
      }
      if(name.indexOf("小計") != -1){
        return 4;
      }
      if(name.indexOf("合計") != -1){
        return 5;
      }
      return 1;
    };
    var okeys = Object.keys(metas).sort(function(n1,n2){
      return sortnum(n1) - sortnum(n2);
    });

    return okeys.map((key)=>{
      return {name:key,value:metas[key] * 1000};
    }).filter(k=>k.value > 0);
  }

  render(){
    var b = this.props.item;
    var meta_purpose_info = null;

    if(this.state.open){
      meta_purpose_info = this._find_meta_details();
    }
    return (
      <tbody stlye={{display: this.props.show? '':'none'}}>
        <tr>
          <td>{b.year}</td>
          <td>{this._code(b.code)}</td>
          <td>{b.topname}</td>
          <td>{b.depname}</td>
          <td>{b.category}</td>
          <td>{b.name}</td>
          <td>{unitconverter.convert(parseInt(b.amount,10), null, true)}</td>
          <td>
            <div style={{color:(b.change == 0 ? "black" :b.change > 0 ? "green" :"red")}}>
              {unitconverter.percent(b.change,b.last_amount)}
              <br />
              (約差 {unitconverter.convert(b.change, null, true) })
            </div>
          </td>
          <td><button onClick={this.onMoreDetail.bind(this,b)}>看更多細節</button></td>
        </tr>
        <tr style={{display:this.state.open ?"":"none" }} >
          <td></td>
          <td colSpan={9} dangerouslySetInnerHTML={{__html:
            b.comment
          }}>
          </td>

        </tr>
        { meta_purpose_info && (
          <tr style={{display:this.state.open ?"":"none" }} >
            <td></td>
            <td colSpan={9} >
              {meta_purpose_info.map((data)=><div>
                  <p>{data.name}: 
                    
                    <span dangerouslySetInnerHTML={{__html:Util.refine_amount(data.value)}}>
                    </span>
                  </p>
                </div>)}
            </td>
          </tr>
        )}
      </tbody>

    );
  }
}


export default class BudgetTable extends BaseComponent {

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

  render(){
    var {search,sort,sortAsc} = this.state;
    var _items = this.props.items || [];
    var items = _items;
    var steps = ["topname","depname","category","name"];

    var filter = this.props.filter;
    if(filter){
      items = [];
      _items.forEach((item)=>{ 
        var matchs = steps.filter((key,ind) =>{
          if(ind >= filter.length){ return true; }
          if(item[key] == filter[ind]){
            return true;
          }else{
            return false;
          }
        });
        if(matchs.length == steps.length ){
          items.push(item);
        }
      });
    }
    var hide = {};

    if(search != null && $.trim(search) != ""){
      let newitems = [];
      items.forEach((item)=>{ 
        var matchs = steps.filter((key) => item[key].indexOf(search) != -1);
        if(matchs.length > 0 ){
          newitems.push(item);
        }else{
          hide[item.code] = 1;
        }
      });
      items = newitems;
    }
    if(sort != null){
      items = items.sort( (a,b) => { return (a[sort] - b[sort]) * (sortAsc ? 1 :-1 ); } )
    }
    // var {drilldown} = data;
    var s = new Date().getTime();
    var h = (
      <div className='row'>
        <p><input ref='search' onKeyDown={this.bindKeyEnter(this.doSearch)} type='text' /> 
          <button onClick={this.doSearch.bind(this)}>搜尋</button>
          <br />
          <small>(搜尋款項目名稱、模糊比對)</small>
        </p>
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
          {(this.props.waiting || this.state._waiting ) && 
              <tr><td colSpan={9}><Loading /></td></tr>
          }
          { !(this.props.waiting || this.state._waiting ) && items && items.map((b)=>{
            return <BudgetTableRow codeMetas={this.props.codeMetas} show={!!!hide[b.code]} item={b} key={b.code} /> 
          })}
        </table>
      </div>
    );
    // console.log("used:"+(new Date().getTime()-s));
    return h;
  }
}

