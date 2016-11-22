
import React from "react";
import unitconverter from "./../helpers/unitconverter.jsx";
// import rd3 from 'react-d3';
import BudgetTable from './../components/BudgetTable.jsx';

import BudgetTreeMap from './../components/d3BudgetTreemap.jsx';
import CommentHelper from './../helpers/comment.jsx';

import Util from '../helpers/util';

import BaseComponent from './../components/BaseComponent.jsx';
import BarChart from 'react-bar-chart';


export default class Drilldown extends BaseComponent {

  constructor(props) {
    super(props);
    if(global.window != null){
      Promise.all(
        [
          Util.getBudgetInfos(
            this.props.budget_file_type,
            this.props.budget_links),
          Util.process_meta_link(this.props.budget_meta_links)
        ]).then(([res,meta])=>{
        var data = this._dimensions(res,'topname','depname','category','name');
        this.setState({
          last_budget:res,
          sampleData: data,
          selectedDrill:data,
          codeMetas:meta
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
          },
          onSelect:(d)=>{
            this.setState({currentDrill:d});
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
            if(!isNaN(item.value)){
              value += item.value ;
            }
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

  _lookup_child_purpose(drill,codeMetas){
    var ret = {};
    var purposes = [];
    var childrens = drill._children || drill.children;
    if(childrens && childrens.length){
      childrens.forEach((child)=>{
        if(child.code != null){
          // debugger;
        }
        if(child.code && codeMetas[child.code]){
          purposes.push(codeMetas[child.code]["purpose"]);
        }else{
          purposes.push(this._lookup_child_purpose(child,codeMetas));
        }
      });
    }
    if(drill.code && codeMetas[drill.code]){
      purposes.push(codeMetas[drill.code]["purpose"]);
    }
    purposes.forEach(function(purpose){
      var ignorefield=["款","項","目","節","科目名稱","預算科目編號"];
      for(var k in purpose){

        if(ignorefield.filter((item)=> item == k).length ==0){
          ret[k] = (ret[k] || 0) + (parseInt(purpose[k],10));
        }
      }
    });
    return ret;
  }

  _find_meta_details(drill,codeMetas){
    if(codeMetas == null){
      return null;
    }
    if(drill == null){
      return null;
    }

    var metas = this._lookup_child_purpose(drill,codeMetas);
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
  _drill_names(drill,ignoreParent){
    if(drill == null){
      return [];
    }
    //ignore root
    if(drill.parent == null){
      return [];
    }
    if(ignoreParent != true && drill.parent ){
      var d = drill;
      var out = [];
      while(d.parent){
        out.unshift(d.name);
        d=d.parent;
      }
      return out;
    }
    return [drill.name] ;
  }

  render(){
    var {data,codeMetas,selectedDrill,last_budget,currentDrill} = this.state;
    var meta_info = this._find_meta_details(selectedDrill,codeMetas);
    // var {drilldown} = data;
    return (
      <div>
        <div className='row'>
          <div className='col-md-7'>
            <div ref="chart" className="Chart"></div>

            <div>
              
            </div>
          </div>
          <div className='col-md-5'>
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
                { meta_info && (
                  <tr>
                    <td>用途別資料</td>
                    <td> 
                      {meta_info.map((data)=><div>
                          <p>{data.name}: 
                            
                            <span dangerouslySetInnerHTML={{__html:Util.refine_amount(data.value)}}>
                            </span>
                          </p>
                        </div>)}
                    </td>
                  </tr>
                )}
                <tr>
                  <td>
                    子項目資料
                  </td>
                  <td>
                    還有 { selectedDrill && selectedDrill._children.length } 個子預算類別，
                    總計展開後有 { selectedDrill && this._drillSections(selectedDrill) } 個子預算項目。
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <hr />
        <BudgetTable  codeMetas={codeMetas}  filter={this._drill_names(currentDrill)} waiting={false}  items={last_budget} />  
      </div>
    );
  }
}

if(global.window != null){
  React.render(React.createElement(Drilldown,window.react_data), document.getElementById("react-root"));
}

