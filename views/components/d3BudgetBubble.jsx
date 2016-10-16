
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

export default class D3BudgetBubble1 extends BaseComponent {

  constructor(props){
    super(props);
    // {
    //   root: this.state.sampleData
    // }
    // {
    //   width: width - 15,
    //   height: height,
    //   // height: 1000,
    //   onOverBudget:(d) =>{
    //     this.setState({selectedDrill:d});
    //   }
    // }

    // {
    //   width: width - 15,
    //   height: height,
    //   // height: 1000,
    //   onOverBudget:(d) =>{
    //     this.setState({selectedDrill:d});
    //   }
    // }

    
  }

  componentDidMount() {
    this._draw();
    d3util._drawScaleReference(d3.select(React.findDOMNode(this.refs.scale)));
  }

  getCenters(items,varname){
    var centers = {};
    items.forEach((item)=>{
      var center = centers[item[varname]] = centers[item[varname]] || {
        name:item[varname],
        d:item,
        items:0,
        amount:0
      };

      if(centers[item[varname]].d.amount < item.amount){
        center.d = item;
      }
      centers[item[varname]].items ++;
      centers[item[varname]].amount += item.amount;
    });

    return centers;
  }

  // getCenter(item,varname,clusters){
  //   return clusters[item[varname]];
  // }

  onBudgetClick(d,cluster){
    this.props.onBudgetClick && this.props.onBudgetClick(d,cluster);
  }

  onBudgetOver(d,cluster){
    this.props.onBudgetOver && this.props.onBudgetOver(d,cluster);
  }

  _draw(){

    var that = this;
    var el = React.findDOMNode(this);

    var width = $(el).width(),
        maxRadius = 40,
        minRadius = 6,
        padding = 10, // separation between same-color nodes
        clusterPadding = 10;

    var nodes = this.props.items;
    var clusters = this.getCenters(nodes,this.props.groupKey);

    var grid_height = Math.max(500,d3.max(Object.keys(clusters),
      (c)=> (clusters[c].items) / 10) * 20);
    var grid_width = Math.min(width,250); 


    var horizonal = Math.floor(width / grid_width);
    if(horizonal <= 1 ){
      horizonal = 1;
      grid_width = width;
    }

    var margin = {top:grid_height/2 + 100,left:Math.max(120,grid_width/2) };


    // var nodes = d3.range(n).map(function(ind) {
    //   var i = Math.floor(Math.random() * m),
    //       r = Math.sqrt((i + 1) / m * -Math.log(Math.random())) * maxRadius,
    //       d = {cluster: i, radius: r };
    //   if (!clusters[i] || (r > clusters[i].radius)){
    //     clusters[i] = d;
    //   }
    //   return d;
    // });



    var cluster_array = [];

    for(var k in clusters){
      let clu = clusters[k];
      cluster_array.push(clu);
    }
    cluster_array = cluster_array.sort((a,b) => b.amount - a.amount);

    cluster_array.forEach((cluster,ind)=>{
      cluster.cluterIndex = ind;
      cluster.d.fixed = true;
      cluster.d.x =  margin.left + grid_width * (cluster.cluterIndex % horizonal) ;
      cluster.d.y =  margin.top  + grid_height * (Math.floor(cluster.cluterIndex / horizonal));   
    })

    // var color = d3.scale.category10()
    //     .domain(d3.range(ind));
    
    var scaleR = d3.scale.pow().exponent(0.5).domain(
        [d3.min(nodes,n => n.amount ),d3.max(nodes,n=> n.amount )]
    ).range([minRadius, maxRadius]);  


    // var scaleR = d3.scale.linear().
    //   domain([d3.min(nodes,n => n.amount ),d3.max(nodes,n=> n.amount )])
    //   .range([5, maxRadius]);

    nodes.forEach(d =>{
      if(d.fixed){
        return true;
      }

      var cluster = clusters[d[this.props.groupKey]];
      d.gx = cluster.cluterIndex % horizonal;
      d.gy = (Math.floor(cluster.cluterIndex / horizonal));
      d.x =  margin.left + grid_width * d.gx + ( grid_width/2);

      if(d.change == null){
        d.y =  margin.top + grid_height * d.gy ;
      }else if(d.change == 0 ){
        d.y =  margin.top + grid_height * d.gy;
      }else{
        d.y =  margin.top + grid_height * d.gy + (d.change > 0 ?(grid_height/2) : -1* (grid_height/2)) ;
      }

      // d.px = d.x;
      // d.py = d.y;
      // cluster.x = 100;
      // cluster.y = 150;
      return;
    });

    var height =  grid_height * (Math.ceil(cluster_array.length / horizonal)) ;


    // Use the pack layout to initialize node positions.
    // d3.layout.pack()
    //     .sort(null)
    //     .size([width, height])
    //     .children(function(d) { return scaleR(parseInt(d.amount,10)); })
    //     .value(function(d) { return scaleR(parseInt(d.amount,10)); })
    //     .nodes({values: 
    //       d3.nest().key(function(d) { return d[that.props.groupKey]; }).entries(nodes)
    //     });

    var svg = d3.select(React.findDOMNode(this.refs.svg))
        .attr("width", width)
        .attr("height", height);

    var color_scale = d3util.getChangeColorScale();

    var labels = svg.selectAll(".label")
        .data(cluster_array).enter();

    labels.append("text")
      .style("font-size", "20px")        
      .text(function (d) { return d.name })
      .attr("x",function({d}){ 
        return d.x - this.getComputedTextLength() /2 ;
      })
      .attr("y",({d}) => d.y - (grid_height/2) )
      .attr("class", "label");

    labels.append("text")
      .style("font-size", "20px")        
      .text(function (d) { return unitconverter.convert(d.amount,null,false) })
      .attr("x",function({d}){ 
        return d.x - this.getComputedTextLength() /2 ;
      })
      .attr("y",({d}) => d.y - (grid_height/2) + 30 )
      .attr("class", "label");

    
    var lines = svg.selectAll(".lines").data(cluster_array).enter();
    lines
      .append("line")
      .attr("x1",cluster => cluster.d.x - grid_width/2 + 20) 
      .attr("y1",cluster => cluster.d.y - grid_height/2 + 50)
      .attr("x2",cluster => cluster.d.x + grid_width/2 - 20) 
      .attr("y2",cluster => cluster.d.y - grid_height/2 + 50)
      .style("stroke","black")
      .style("stroke-width","2")
      .attr("class", "lines");

    lines
      .append("line")
      .attr("x1",cluster => cluster.d.x - grid_width/2 + 20) 
      .attr("y1",cluster => cluster.d.y - grid_height/2 - 30)
      .attr("x2",cluster => cluster.d.x + grid_width/2 - 20) 
      .attr("y2",cluster => cluster.d.y - grid_height/2 - 30)
      .style("stroke","black")
      .style("stroke-width","2")
      .attr("class", "lines");


    var node = svg.selectAll("circle")
        .data(nodes)
      .enter().append("circle")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("stroke-width",1)
        // .attr("stroke",(d)=>color(clusters[d[this.props.groupKey]].cluterIndex))
        .attr("stroke","#a87f98")
        .attr("class", "budget-circle")
        .attr("r", d => scaleR(d.amount) )
        .style("fill", (d) => { 
          if(d.last_amount == null){
            return color_scale(.25);
          }

          return color_scale(unitconverter._percent(d.change,d.last_amount));
        })
        .on("click",(d)=>{ this.onBudgetClick(d,clusters[d[that.props.groupKey]]); })
        .on("mouseover",(d)=>{ this.onBudgetOver(d,clusters[d[that.props.groupKey]]); });


    // return true;
    var force = d3.layout.force()
        .nodes(nodes)
        .size([width, height])
        .gravity(.000003)
        .charge(0)
        // .alpha(2)
        .on("tick", tick);
    force.start();
    var safe = 0;
    while(force.alpha() > 0.01){
      force.tick();
      safe ++;
      if(safe > 1000){
        break;
      }
    }

    function tick(e) {
      node
          .each(cluster(5 * e.alpha * e.alpha))
          .each(collide(.05))
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
    }

    // Move d to be adjacent to the cluster node.

    function cluster(alpha) {
      return function(d) {
        var cluster = clusters[d[that.props.groupKey]];

        var x = d.x - cluster.d.x,
            y = d.y - cluster.d.y,
            l = Math.sqrt(x * x + y * y),
            r = scaleR(d.amount) + scaleR(cluster.d.amount);

        // if(Math.abs(x) > 100 || Math.abs(y) > 100){
        //   alpha = 50;
        // }

        if (l != r && l != 0) {
          l = (l - r) / l * alpha;
          d.x -= x *= l;
          d.y -= y *= l;
          cluster.d.x += x;
          cluster.d.y += y;
        }
      };
    }

    // Resolves collisions between d and all other circles.
    function collide(alpha) {
      var quadtree = d3.geom.quadtree(nodes);
      return function(d) {
        var r = scaleR(d.amount) + maxRadius + Math.max(padding, clusterPadding),
            nx1 = d.x - r,
            nx2 = d.x + r,
            ny1 = d.y - r,
            ny2 = d.y + r;
        quadtree.visit(function(quad, x1, y1, x2, y2) {
          if (quad.point && (quad.point !== d)) {
            var cluster = clusters[d[that.props.groupKey]];
            var x = d.x - quad.point.x,
                y = d.y - quad.point.y,
                l = Math.sqrt(x * x + y * y),
                r = scaleR(d.amount) + scaleR(quad.point.amount) + 
                  (cluster.d === quad.point ? padding : clusterPadding);

            if(d.change != null && d.change != 0 ){
              if(d.change > 0 ){
                y += 15 ;
              }else{
                y -= 15;
              }
            }
            if (l < r) {
              l = (l - r) / l * alpha;
              d.x -= x *= l;
              d.y -= y *= l;

              d.x = Math.max(Math.max(d.x,cluster.d.x - grid_width/2),20);
              d.x = Math.min(d.x,cluster.d.x + grid_width/2);
              quad.point.x += x;
              quad.point.y += y;
            }
          }
          return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        });
      };
    }


  }

  render (){
    return <div>
      <svg ref='scale' height='50' width='350' 
        style={{position:'fixed','background':'white','opacity':0.9}}>
      </svg>
      <svg ref='svg'></svg>
    </div>;
  }


}


