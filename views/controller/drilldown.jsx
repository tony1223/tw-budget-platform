
import React from "react";
import unitconverter from "./../helpers/unitconverter.jsx";
// import rd3 from 'react-d3';

import BudgetTreeMap from './../components/d3BudgetTreemap.jsx';
import CommentHelper from './../helpers/comment.jsx';

import Util from '../helpers/util';

import BaseComponent from './../components/BaseComponent.jsx';
export default class Drilldown extends BaseComponent {

  constructor(props) {
    super(props);
    if(global.window != null){
      Util.getBudgetInfos(this.props.budget_file_type,this.props.budget_links).then((res)=>{
        var data = this._dimensions(res,'topname','depname','category','name');
        this.setState({
          sampleData: data,
          selectedDrill:data
        });
        var el = React.findDOMNode(this.refs.chart);

        var width = Math.min($(el).width(),$(window).width());
        var height = 500;

        this.chart = new BudgetTreeMap(el, {
          width: width - 15,
          height: height,
          // height: 1000,
          onOverBudget:(d) =>{
            this.setState({selectedDrill:d});
          }
        }, {root:data});
      });
      
    }

    this.state = {};

  }
  
  doFocusDrill(drill){
    this.setState({selectedDrill:drill});
  }

  componentDidMount() {

  }

  componentDidUpdate() {
    var el = React.findDOMNode(this.refs.chart);
    // this.chart.update(el, this.getChartState());
  }

  componentWillUnmount() {
    var el = React.findDOMNode(this.refs.chart);
    this.chart.destroy(el);
  }



  _dimension(items,item,key,pipe){
    var groups = {};

    var newchild = function(name,children){
      return { 
        name:name,
        children:children || []
      };
    }
    items.forEach(function(b){
      groups[b[key]] = groups[b[key]] || newchild(b[key]);
      groups[b[key]].children.push(b);
    });

    var childs = [];
    for(var k in groups){
      childs.push(newchild(k,groups[k].children));
    }


    item.children = childs;
    item.children.forEach(function(child){
        pipe && pipe(child);
    });
    
    return item;
    
  }

  _dimensions(items,k1,k2,k3,k4){

    var newmap = {
      name:"總預算",
      children:[]
    };
    var value = 0;
    this._dimension(items,newmap,k1,(item) => {
      this._dimension(item.children,item,k2,(item)=>{
      
        this._dimension(item.children,item,k3,(item)=>{
          item.children.forEach(function(item){
            item.value = parseInt(item.amount,10);
            value += item.value ;
          });
      //     return dimension(item.children,item,k4,(item)=>{
      //       var items = item.children;
      //       delete items.children;
      //       for(var k in items[0]){
      //         item[k]= items[0][k];
      //       }
      //       delete item["comment"];
      //       // item.children = null
      //     });
        });
      });
    });
    newmap._children = newmap.children;
    newmap.value = value;
    newmap.name = " 總預算 " + unitconverter.convert(value,null,false)+ " ";
    return newmap;
  }

  _drillName(drill,ignoreParent){
    if(ignoreParent != true && drill.parent ){
      return this._drillName(drill.parent) + " > " + drill.name ;
    }
    return drill.name ;
  }

  _drillSections(drill){
    if(drill._children){
      var i = 0 ;
      drill._children.forEach((d) =>{
        i += this._drillSections(d);
      });
      return i;
    }
    return 1;
  }

  render(){
    var {data,selectedDrill} = this.state;
    // var {drilldown} = data;
    return (
      <div className='row'>
        <div className='col-md-8'>
          <div ref="chart" className="Chart"></div>

          <div>
            
          </div>
        </div>
        <div className='col-md-4'>
          <table className='table table-bordered'>
            <tbody>
              <tr>
                <td className='col-xs-3'>預算</td>
                <td className='col-xs-9'> { selectedDrill && this._drillName(selectedDrill) } </td>
              </tr>
              <tr>
                <td>金額</td>
                <td> 
                  <p>
                    <span className="budget-amount-title">
                      { selectedDrill && unitconverter.convert(selectedDrill.value,null,false) }
                    </span>
                  </p>
                  <p> (即為{ selectedDrill && unitconverter.convert(selectedDrill.value,-1,true) }) </p>
                </td>
              </tr>
              <tr>
                <td>佔總預算比例</td>
                <td> 
                  <p>
                    <span>
                      { selectedDrill && ( parseInt(selectedDrill.value/this.state.sampleData.value *10000 ,10)/100+"%") } 
                    </span>
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  子項目資料
                </td>
                <td>
                  還有 { selectedDrill && selectedDrill._children.length } 個子預算類別，
                  總計 { selectedDrill && this._drillSections(selectedDrill) } 個預算科目。
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

if(global.window != null){
  React.render(React.createElement(Drilldown,window.react_data), document.getElementById("react-root"));
}

