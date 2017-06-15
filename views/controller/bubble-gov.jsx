
import React from "react";
import unitconverter from "./../helpers/unitconverter.jsx";
// import rd3 from 'react-d3';

import D3BudgetBubble from './../components/d3BudgetBubble.jsx';

import CommentHelper from './../helpers/comment.jsx';
import Loading from './../components/Loading.jsx';
import FBComment from './../components/fb/FBComment.jsx';
var ReactDisqusThread = require('react-disqus-thread');

import cx from 'classnames';
import Util from '../helpers/util';
import Promise from "bluebird";

import BaseComponent from './../components/BaseComponent.jsx';
export default class Bubble extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = {
      infoBudget:null,
      selectedBudget:null,
      groupKey:"topname",
      info_state:1
    };

    if(global.window != null){
      Promise.all([
        Util.getBudgetInfos(this.props.budget_file_type,this.props.budget_links),
        Util.process_gov_type(this.props.budget_meta_links)
      ]).then(([res,gov_types])=>{
        var last_res = res;
        if(gov_types){
          var typeMap = {};
          gov_types.forEach(function(type){
            typeMap[type["代碼"]] = type;
          });
          last_res = res.map((r)=>{
            var gov_key = $.trim(r.code).substring(0,2);
            r.gov_type = typeMap[gov_key] && typeMap[gov_key]["名稱"];
            r.gov_summary_type = typeMap[gov_key] && typeMap[gov_key]["大政式分類"] || r.gov_type;
            return r;
          });
        }


        this.setState({
          all_budget:last_res,
          last_budget:this.get_budget_data(this.state.groupKey,last_res),
          waiting:false
        });
      });
      
    }
  }
  
  get_budget_data(groupKey,datas){
    if(groupKey=="topname"){
      var data = datas.reduce(function(now,next){
        var {year,code,amount,last_amount,name,topname,depname,depcat,
          category,ref,change,gov_type} = next;

        now[topname+"-"+depname] = now[topname+"-"+depname]  || {
          year,
          code:"00"+code.substring(2,6)+"0000",
          amount:0,
          last_amount:0,
          name:null,
          topname,
          depname,
          depcat:null,
          category:null,ref,change:0,gov_type
        };

        now[topname+"-"+depname].amount += amount;
        now[topname+"-"+depname].last_amount += last_amount;
        now[topname+"-"+depname].change += change;
        return now;
      },{});

      return Object.keys(data).map((k)=> data[k] );
    }else if(groupKey == "gov_type"){
      var data = datas.reduce(function(now,next){

        var {year,code,amount,last_amount,name,topname,depname,depcat,
          category,ref,change,gov_type,gov_summary_type} = next;

          if(code.substring(0,2)=="00"){
            return now;
          }

        var nowkey = gov_summary_type+"-"+gov_type;
        now[nowkey] = now[nowkey]  || {
          year,
          code:code.substring(0,2)+"00000000",
          amount:0,
          last_amount:0,
          name:null,
          topname:gov_summary_type,
          depname:gov_type,
          depcat:null,
          category:null,
          ref,
          change:0,
          gov_type,
          gov_summary_type
        };

        now[nowkey].amount += amount;
        now[nowkey].last_amount += last_amount;
        now[nowkey].change += change;
        return now;
      },{});

      return Object.keys(data).map((k)=> data[k] );
    }
  }

  componentDidMount() {
    
  }

  componentDidUpdate() {
    
  }


  componentWillUnmount() {
  }

  onBudgetClick(d,cluster){
    this.setState({selectedBudget:d});
    $(document.body).addClass("modal-open");
    // console.log(d,cluster);
  }

  onBudgetOver(d,cluster){
    this.setState({infoBudget:d});
    // console.log(d,cluster);
  }

  onChangeGroupKey(type){
    // console.log(type);
    this.setState({groupKey:type,
      last_budget:this.get_budget_data(type,this.state.all_budget)
    });
  }

  toogle_info_state(state){
    this.setState({info_state:this.state.info_state == 1 ? 0 : 1});
  }

  _name(d) {
    var out = [];
    if(d.topname){
      out.push(d.topname);
    }
    if(d.depname){
      out.push(d.depname);
    }
    if(d.category){
      out.push(d.category);
    }
    if(d.name){
      out.push(d.name);
    }

    return out.join(" > ");
  }

  cancelSelect(){
    this.setState({selectedBudget:null});
    $(document.body).removeClass("modal-open");
  }

  render(){
    // var {data,selectedDrill} = this.state;
    // var {drilldown} = data;
    var {selectedBudget,infoBudget} = this.state;

    var budgetComments = null;
    if(selectedBudget){    
      if(this.props.budget_id == 1){
        budgetComments = <FBComment href={"http://tpebudget.tonyq.org/budget/"+infoBudget.code} />;
      }else if(this.props.budget_id <= 6){
        budgetComments = <FBComment href={"http://budget.tonyq.org/bubble/"+this.props.budget_id+"/"+infoBudget.code} />
      }else{
        budgetComments = <ReactDisqusThread
                shortname="budget-tonyq-org"
                identifier={this.props.budget_id+"/"+infoBudget.code}
                title=""
                url={"http://budget.tonyq.org/bubble/"+this.props.budget_id+"/"+infoBudget.code}
                category_id=""
                onNewComment={this.handleNewComment } />;
      }
    } 

    return (
      <div className='row'>
        <div className='col-xs-12'>
          {this.state.last_budget && 
            <div className='col-xs-12 col-md-12' style={{"margin-bottom":"200px"}}>
              <div class="btn-group" role="group" aria-label="機關政事別切換">
                <button onClick={this.onChangeGroupKey.bind(this,"topname")} type="button" className={cx({"btn":true,"btn-default":true,"btn-primary":this.state.groupKey == "topname"})}>機關別</button>
                {this.state.last_budget && this.state.last_budget[0].gov_type &&
                    (<button onClick={this.onChangeGroupKey.bind(this,"gov_type")} type="button" className={cx({"btn":true,"btn-default":true,"btn-primary":this.state.groupKey == "gov_type"})}>政事別</button>)}
              </div>
              <D3BudgetBubble onBudgetOver={this.onBudgetOver.bind(this)}
                onBudgetClick={this.onBudgetClick.bind(this)} groupKey="topname" items={this.state.last_budget} />
            </div>
          }
          {this.state.last_budget == null && <Loading show={true} />}
        </div>
        {
          infoBudget && 
          <div style={{
              position:'fixed',
              bottom:0,
              left:"5%",
              'width':"90%",
              height:selectedBudget ? "100%":"auto",
              background:"gray",
              color:"white",

              "padding":selectedBudget ? "30px 10px 10px 10px": 
                this.state.info_state == 1 ? "10px" :"10px 0 0 0 ",
              "text-align":"center",
              "font-size":'20px',
              "border-radius":"15px 15px 0 0"
            }}>
            {selectedBudget == null && 
              <p 
                style={{cursor:"pointer",float: "right","right": "27px"}}
                onClick={this.toogle_info_state.bind(this)} 
                className='glyphicon glyphicon-option-horizontal'></p>
            }


            <div>
              {selectedBudget && <div onClick={this.cancelSelect.bind(this)} 
                style={{float:"right","font-size":"34px",cursor:"pointer"}} 
                className='glyphicon glyphicon-remove-circle'>&nbsp;</div>
              }
              <p>{this._name(infoBudget) } </p>
              {(this.state.info_state ==1 ||selectedBudget) && (<div>
                
                <p>科目代碼：{infoBudget.code} </p>
                <p>本年度預算：{unitconverter.convert(infoBudget.amount,null,false)}</p>
                <p>前一年度預算：{unitconverter.convert(infoBudget.last_amount,null,false)}  
                  {infoBudget.change != null && infoBudget.change != 0 && 
                    <span> {unitconverter.percent(infoBudget.change,infoBudget.last_amount)} </span>
                  }
                </p>
                <hr style={{clear:"both"}} /> 
              </div>)}
              
            </div>

            {selectedBudget &&<div style={{"height":"90%",'text-align':'left',"padding":"0 0 40px 0","overflow":"auto"}} className="">
              
              {infoBudget.comment && <div>
                詳細資料 
                <hr />            
                <div className='row col-md-8 col-md-offset-2'>
                  <div dangerouslySetInnerHTML={{__html: infoBudget.comment}} />
                  <br />
                  <br />
                </div>
                <hr style={{clear:"both"}} /> 

              </div>}
              網友留言 
              <hr />
              <div className='col-md-12'>
                {
                  budgetComments
                }
              </div>
            </div>}
            
          </div>
        }
      </div>
    );
  }
}


if(global.window != null){
  React.render(React.createElement(Bubble,window.react_data), document.getElementById("react-root"));
}

