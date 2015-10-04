import d3 from 'd3';

export default {
  getChangeColorScale(){

    // var colors = ['black','#C51B7D', '#DE77AE', '#F1B6DA', '#FDE0EF', 'gray', '#B8E186', '#7FBC41', '#4D9221'];
    var color_domain = [-1, -0.25, -0.1, -0.02, 0, 0.02, 0.1, 0.25];
    var colors = ["black", "#C51B7D", '#DE77AE', '#F1B6DA', '#FDE0EF', "#E6F5D0", "#B8E186" , "#7FBC41", '#4D9221'];

    return d3.scale.quantile().domain(color_domain)
      .range(colors);

  },
  _drawScaleReference(svg){

    // var colors = ['black','#C51B7D', '#DE77AE', '#F1B6DA', '#FDE0EF', 'gray', '#B8E186', '#7FBC41', '#4D9221'];

    var colorScale = this.getChangeColorScale();

    var xColorScale = d3.scale.ordinal().rangeRoundBands([200, 0], 0.1).domain(colorScale.domain());
    // var yColorScale = d3.scale.ordinal().rangeRoundBands([200, 0], 0.1).domain(colors);      
    
    var marign ={left: 10,top:0};

    var nodes = svg.selectAll('.change-lenged').data(colorScale.domain());
        nodes.enter().append('rect').attr('class', 'change-legend').attr('x', function(it){
          return marign.left + xColorScale(it) * 1.55;
        }).attr('y', 20).attr('width', function(){
          return xColorScale.rangeBand();
        }).attr('height', function(){
          return 30;
        }).style('fill', function(it){
          if(isNaN(it)){
            return "black";
          }
          return colorScale(it);
        }).attr('stroke', 'none');
        nodes.enter().append('text').text(function(it){

          if(it == -1){
            return "刪除";
          }
          return (it * 100) +"%";

        }).attr('x', function(it){
          return (marign.left + 5 - this.getComputedTextLength()) + (isNaN(it)
            ? xColorScale.rangeBand() / 2
            : xColorScale.rangeBand()) + xColorScale(it) * 1.55;
        }).attr('y', 15).attr('text-anchor', 'right');

    return colorScale;
  }
};