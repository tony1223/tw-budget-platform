
import d3 from 'd3';

//Reference
//http://bost.ocks.org/mike/treemap/
import unitconverter from "./../helpers/unitconverter.jsx";

export default class D3BudgetTreeMap{

  constructor(el,props,state){

    var defaultProps = {width:960,height:500};

    for(var k in defaultProps){
      if(props[k] == null){
        props[k] = defaultProps[k];
      }
    }

    this.props = props;

    this.current_level = 0;

    var margin = {top: 40, right: 0, bottom: 0, left: 0},
        width = props.width,
        height = props.height - margin.top - margin.bottom;

    this.transitioning = null;

    var svg = this.svg = d3.select(el).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.bottom + margin.top)
        .style("margin-left", -margin.left + "px")
        .style("margin.right", -margin.right + "px")
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .style("shape-rendering", "crispEdges");    

    var dataScale = d3.scale.linear()
      .domain([1000000,
           100000000]);
    dataScale.range([0,100]);

    var treemap = this.treemap = d3.layout.treemap()
        .children(function(d, depth) { return depth ? null : d._children; })
        .sort(function(a, b) { return a.value - b.value; })
        .ratio( (height / width) * 0.5 * (0.5 + Math.sqrt(5)))
        // .mode("dice")
        .round(false);

    var grandparent = this.grandparent = svg.append("g")
        .attr("class", "grandparent");

    grandparent.append("rect")
        .attr("y", -margin.top)
        .attr("width", width)
        .attr("height", margin.top);

    grandparent.append("text")
        .attr("x", 6)
        .attr("y", 6 - margin.top)
        .attr("dy", ".75em");

    grandparent.on("mouseover", ()=>{
      this.onOver(this.currentDrill || this.root);
    });

    this.update(el, state);
  }

  update(el,state){
    var props = this.props;
    var margin = {top: 40, right: 0, bottom: 0, left: 0},
        width = props.width,
        height = props.height - margin.top - margin.bottom;

    var grandparent = this.grandparent ;

    var svg = this.svg;

    var root = state.root;
    this.root = root;

    this.root = root;
    var x = d3.scale.linear()
        .domain([0, width])
        .range([0, width]);

    var y = d3.scale.linear()
        .domain([0, height])
        .range([0, height]);

    this.scales = {x,y};

    root = this._initialize(root);
    this._accumulate(root);
    this._layout(this.treemap,root);
    this._display(this.grandparent,root);

  }


  _accumulate(d) {
    // if children exist , sum all children value
    if(d._children = d.children){
        return d.value = d.children.reduce((p, v) => { 
          var val = this._accumulate(v);
          if(isNaN(val)){
            return p;
          }
          return p + val 
        }, 0);
    }else{
      if(isNaN(d.value)){
        return 0;
      }
      return d.value;
    }
  }

  onOver(d){
    this.props.onOverBudget && this.props.onOverBudget(d);
    return true;
  }

  onSelect(d){
    this.currentDrill = d;
    this.props.onSelect && this.props.onSelect(d);
    return true;
  }

  _display(grandparent,d) {
    this.curret_drill = d;
    var formatNumber = d3.format(",d");

    var g1 = this.svg.insert("g", ".grandparent")
        .datum(d)
        .attr("class", "depth");

    grandparent
        .datum(d.parent)
        .on("click", (d) => {
          this.onSelect(d);
          this._transition(g1,d);
        })
      .select("text")
        .text(this._name(d));

    var g = g1.selectAll("g")
        .data(d._children)
      .enter().append("g");

    g.filter(function(d) { return d._children; })
        .classed("children", true)
        .on("click", (d) => {
          this.onSelect(d);          
          this._transition(g1,d);
          this.onOver(d);
        })
        .on("mouseover", this.onOver.bind(this))
        .on("mouseout",() => {

          this.onOver.apply(this,
            [
              this.currentDrill || this.root
            ]);
      });

    g.selectAll(".child")
        .data(function(d) { return d._children || [d]; })
      .enter()
      .append("rect")
        .attr("class", "child")
        .call(this._rect.bind(this));

    g.append("rect")
        .attr("class", "parent")
        .call(this._rect.bind(this))
      .append("title")
        .text(function(d) { return formatNumber(d.value); });


    g.append("text")
        .attr("dy", ".75em")
        .text((d) =>{ 
          var {x,y} = this.scales;   
          // if((x(d.x + d.dx) - x(d.x) ) < 100 ){
          //   return "";
          // }
          return d.name.replace(/[ \t\n\r]+/,""); 
        })
        .call(this._text.bind(this));

    g.append("text")
        .attr("dy", "1.95em")
        .text((d) => { 
          var {x,y} = this.scales;   
          // if((x(d.x + d.dx) - x(d.x) ) < 100 ){
          //   return "";
          // }
          return unitconverter.convert(d.value,null) ; 
        })
        .call(this._text.bind(this));
        
    g.append("text")
        .attr("dy",(d)=>{
          return "3.15em";
        } )
        .text((d) => { 
          var {x,y} = this.scales;   
          // if((x(d.x + d.dx) - x(d.x) ) < 50 ){
          //   return "";
          // }
          return ""+ (parseInt((d.value / this.root.value )* 10000,10)/100) +"%";; 
        })
        .call(this._text.bind(this));

    return g;
  }

  _transition(g1,d) {

    if (this.transitioning || !d) return;
    this.transitioning = true;

    var g2 = this._display(this.grandparent,d),
        t1 = g1.transition().duration(750),
        t2 = g2.transition().duration(750);

    // Update the domain only after entering new elements.
    this.scales.x.domain([d.x, d.x + d.dx]);
    this.scales.y.domain([d.y, d.y + d.dy]);

    // Enable anti-aliasing during the transition.
    this.svg.style("shape-rendering", null);

    // Draw child nodes on top of parent nodes.
    this.svg.selectAll(".depth").sort(function(a, b) { return a.depth - b.depth; });

    // Fade-in entering text.
    g2.selectAll("text").style("fill-opacity", 0);

    // Transition to the new view.
    t1.selectAll("text").call(this._text.bind(this)).style("fill-opacity", 0);
    t2.selectAll("text").call(this._text.bind(this)).style("fill-opacity", 1);
    t1.selectAll("rect").call(this._rect.bind(this));
    t2.selectAll("rect").call(this._rect.bind(this));

    // Remove the old node when the transition is finished.
    t1.remove().each("end", () => {
      this.svg.style("shape-rendering", "crispEdges");
      this.transitioning = false;
    });
  }


    // Aggregate the values for internal nodes. This is normally done by the
    // treemap layout, but not here because of our custom implementation.
    // We also take a snapshot of the original children (_children) to avoid
    // the children being overwritten when when layout is computed.
  _initialize(root) {
    root.x = root.y = 0;
    root.dx = this.props.width;
    root.dy = this.props.height;
    root.depth = 0;
    return root;
  }

    // Compute the treemap layout recursively such that each group of siblings
    // uses the same size (1×1) rather than the dimensions of the parent cell.
    // This optimizes the layout for the current zoom state. Note that a wrapper
    // object is created for the parent node for each group of siblings so that
    // the parent’s dimensions are not discarded as we recurse. Since each group
    // of sibling was laid out in 1×1, we must rescale to fit using absolute
    // coordinates. This lets us use a viewport to zoom.
  _layout(treemap,d) {
    if (d._children) {
      treemap.nodes({_children: d._children});
      d._children.forEach((c) =>{
        c.x = d.x + c.x * d.dx ;
        c.y = d.y + c.y * d.dy;
        c.dx *= d.dx;
        c.dy *= d.dy;
        c.parent = d;
        this._layout(treemap,c);
      });
    }
  }

  _text(text) {
    var {x,y} = this.scales;
    text.attr("x", function(d) { return x(d.x) + 6; })
        .attr("y", function(d) { return y(d.y) + 6; });
  }

  _rect(rect) {
    var {x,y} = this.scales;
      rect.attr("x", function(d) { return x(d.x); })
          .attr("y", function(d) { return y(d.y); })
          .attr("width", function(d) { return x(d.x + d.dx) - x(d.x); })
          .attr("height", function(d) { return y(d.y + d.dy) - y(d.y); });
  }

  _name(d,last) {

    var back = "";
    if(last == null && d.parent){
      back = " > 回上一層" ;
    }
    if(d.parent ){
      return this._name(d.parent,d) + " > " + d.name +" " + unitconverter.convert(d.value,null,false) +back;
    }
    return d.name + back;
  }


  destroy(el){

  }
}
