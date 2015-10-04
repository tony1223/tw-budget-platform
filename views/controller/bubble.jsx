
import React from "react";
import unitconverter from "./../helpers/unitconverter.jsx";
// import rd3 from 'react-d3';

import D3BudgetBubble from './../components/d3BudgetBubble.jsx';

import CommentHelper from './../helpers/comment.jsx';
import Loading from './../components/Loading.jsx';
import FBComment from './../components/fb/FBComment.jsx';

import Util from '../helpers/util';

import BaseComponent from './../components/BaseComponent.jsx';
export default class Bubble extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = {
      infoBudget:null,
      selectedBudget:null
    };

    if(global.window != null){

      Util.requestJSONs(this.props.budget_links).then((datas)=>{
        var res = datas[0];
        if(res.length && datas.length > 1 && res[0].last_amount == null){
          var map = {};
          datas[1].forEach((data)=>{ map[data.code] = data.amount });

          res.forEach((r) => {
            r.last_amount = parseInt(map[r.code] || 0,10);
            r.change = parseInt(r.amount,10) - parseInt(r.last_amount,10) ;
            r.comment = CommentHelper.refine(r.comment);
          });
        }else{
          res.forEach((r) => {
            r.change = parseInt(r.amount,10) - parseInt(r.last_amount,10) ;
            r.comment = CommentHelper.refine(r.comment);
          });
        }

        this.setState({
          last_budget:res,
          waiting:false
        });
      });
      
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


  _name(d) {
    return `${d.topname} > ${d.depname} > ${d.category} > ${d.name} `;
  }

  cancelSelect(){
    this.setState({selectedBudget:null});
    $(document.body).removeClass("modal-open");
  }

  render(){
    // var {data,selectedDrill} = this.state;
    // var {drilldown} = data;
    var {selectedBudget,infoBudget} = this.state;
    return (
      <div className='row'>
        <div className='col-xs-12'>
          {this.state.last_budget && 
            <div className='col-xs-12 col-md-12'>
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
              "padding":selectedBudget ? "30px 10px 10px 10px": "10px",
              "text-align":"center",
              "font-size":'20px',
              "border-radius":"15px 15px 0 0"
            }}>
            {selectedBudget == null && <p className='glyphicon glyphicon-option-horizontal'></p>}


            <div>
              {selectedBudget && <div onClick={this.cancelSelect.bind(this)} 
                style={{float:"right","font-size":"34px",cursor:"pointer"}} 
                className='glyphicon glyphicon-remove-circle'>&nbsp;</div>
              }
              <p>{this._name(infoBudget) } </p>
              <p>本年度預算：{unitconverter.convert(infoBudget.amount,null,false)}</p>
              <p>前一年度預算：{unitconverter.convert(infoBudget.last_amount,null,false)}  
                {infoBudget.change != null && infoBudget.change != 0 && 
                  <span> {unitconverter.percent(infoBudget.change,infoBudget.last_amount)} </span>
                }
              </p>
              <hr style={{clear:"both"}} /> 
            </div>

            {selectedBudget &&<div style={{"height":"90%",'text-align':'left',"padding":"0 0 40px 0","overflow":"auto"}} className="">
              
              詳細資料 
              <hr />            
              <div className='row col-md-8 col-md-offset-2'>
                <div dangerouslySetInnerHTML={{__html: infoBudget.comment}} />
                <br />
                <br />
              </div>
              <hr style={{clear:"both"}} /> 
              網友留言 
              <hr />
              <div className='col-md-12'>
                {
                  this.props.budget_id == 1 ?
                    <FBComment href={"http://tpebudget.tonyq.org/budget/"+infoBudget.code} />
                  : <FBComment href={"http://budget.tonyq.org/bubble/"+this.props.budget_id+"/"+infoBudget.code} />
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

