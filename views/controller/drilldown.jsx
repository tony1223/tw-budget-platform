
import React from "react";
import unitconverter from "./../helpers/unitconverter.jsx";
// import rd3 from 'react-d3';

import BudgetTreeMap from './../components/d3BudgetTreemap.jsx';

import sample from './../helpers/sampledata.jsx';

export default class Index extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      sampleData: sample.treemap_real,
      selectedDrill:sample.treemap_real
    };
  }
  
  doFocusDrill(drill){
    this.setState({selectedDrill:drill});
  }

  componentDidMount() {
    var el = React.findDOMNode(this.refs.chart);
    this.chart = new BudgetTreeMap(el, {
      width: 600,
      height: 500,
      onOverBudget:(d) =>{
        this.setState({selectedDrill:d});
      }
    }, this.getChartState());
  }

  componentDidUpdate() {
    var el = React.findDOMNode(this.refs.chart);
    // this.chart.update(el, this.getChartState());
  }

  getChartState() {
    return {
      root: this.state.sampleData
    };
  }

  componentWillUnmount() {
    var el = React.findDOMNode(this.refs.chart);
    this.chart.destroy(el);
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
      <div>
        <div className='col-md-9'>
          <h1></h1>
          <div ref="chart" className="Chart"></div>

          <div>
            
          </div>
        </div>
        <div className='col-md-3'>
          <p>
            <i style={{"margin-top":"2px"}} className="icon-big-info-sign"></i>
            { selectedDrill && this._drillName(selectedDrill) }
          </p>
          <p>
            <span className="budget-amount-title">
              { selectedDrill && unitconverter.convert(selectedDrill.value,null,false) }
            </span>
          </p>
          <p> (即為{ selectedDrill && unitconverter.convert(selectedDrill.value,-1,true) }) </p>

          <p> 
            還有 { selectedDrill && selectedDrill._children.length } 個子預算類別，
            總計 { selectedDrill && this._drillSections(selectedDrill) } 個預算科目。
          </p>
        </div>
      </div>
    );
  }
}


if(global.window != null){
  React.render(React.createElement(Index), document.getElementById("react-root"));
}

