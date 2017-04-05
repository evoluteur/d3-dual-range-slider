

function setupSlider(updateGraph, color){

var sliderRange=[0, 10],
    svg = d3.select("svg"),
    margin = 50,
    width = 400;

var x = d3.scaleLinear()
    .domain([0, 10])
    .range([0, width])
    .clamp(true);

var xMin=x(0),
    xMax=x(10)

var slider = svg.append("g")
    .attr("class", "slider")
    .attr("transform", "translate(" + margin + ",20)");

slider.append("line")
    .attr("class", "track")
    .attr("x1", x.range()[0])
    .attr("x2", x.range()[1])

slider.insert("g", ".track-overlay")
    .attr("class", "ticks")
    .attr("transform", "translate(0,20)")
  .selectAll("text")
  .data(x.ticks(10))
  .enter().append("text")
    .attr("x", x)
    .attr("text-anchor", "middle")
    .style('font-weight', 'bold')
    .style("fill", function(x){return color(x)})
    .text(function(d) { return d; });

var t = d3.transition()
    .duration(60)
    .ease(d3.easeLinear);

var handle = slider.selectAll("circle")
  .data([0, 1])
  .enter().append("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("r", 9)
    .attr("id", function(d) { return d; })
    .attr("cx", function(d) { return x(sliderRange[d]); })
    .call(
        d3.drag()
          .on("start", startDrag)
          .on("drag", drag)
          .on("end", endDrag)
    );

function startDrag(){
  d3.select(this).raise().classed("active", true);
}

function drag(){
  var x=d3.event.x;
  if(x>xMax){
    x=xMax
  }else if(x<xMin){
    x=xMin
  }
  d3.select(this).attr("cx", x);
}

function endDrag(d){
  var v=Math.round(x.invert(d3.event.x))
  var elem=d3.select(this)
  elem.classed("active", false)
    .transition(t)
    .attr("cx", x(v));
  sliderRange[d] = v
  updateGraph(Math.min(sliderRange[0], sliderRange[1]), Math.max(sliderRange[0], sliderRange[1])); 
}

}
