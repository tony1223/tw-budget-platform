
import d3 from 'd3';
import _ from 'underscore';
import React from "react";
import BaseComponent from './BaseComponent.jsx';
import unitconverter from "./../helpers/unitconverter.jsx";
import d3util from "./../helpers/d3.jsx";

import Loading from './Loading.jsx';

// Reference
// http://www.delimited.io/blog/2013/12/19/force-bubble-charts-in-d3

// Reference2
// http://bl.ocks.org/mbostock/7882658

export default class D3Radar extends BaseComponent {

  constructor(props){
    super(props);
    this.state={};
  }

  componentDidMount() {
    this._draw();
    if(this.props && this.props.data){
      this._update(this.props.data);
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps && nextProps.data){
      this._update(nextProps.data);
    }
  }

  _draw(){
    var el = React.findDOMNode(this.refs.svg);
    var chart = RadarChart.chart();
    this.chart = chart;
    var cfg = chart.config(); // retrieve default config
    this.cfg = cfg;

    var width = 300;

    if(this.props.width != null){
      width = parseInt(this.props.width,10);
    }
    
    var height = 150;

    if(this.props.height != null){
      height = parseInt(this.props.height,10);
    }

    var svg = d3.select(el)
      .attr('width', width)
      .attr('height', height);
    // many radars
    chart.config({w:  width -100 , h: height-100, 
      axisText: true, levels: 4, circles: true});
    cfg = chart.config();

  }

  _update(datas){
    var el = React.findDOMNode(this.refs.svg);
    var cfg = this.cfg;
    var game = d3.select(el).selectAll('g.game').data(datas);
    game.enter().append('g').classed('game', 1);
    game.attr('transform', function(d, i) { return 
      'translate('+((cfg.w * 4) + 50 + (i * cfg.w))+','+ (cfg.h * 1.3) +')'; })
        .call(this.chart);    
  }

  render (){
    return <svg ref="svg"></svg>;
  }


}


