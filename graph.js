
window.onload = function(e){ 

var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var color = d3.scaleOrdinal(d3.schemeCategory20);
for(var i=0;i<11;i++){
  color(i);
}

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, 10 + height / 2))
      .on("tick", ticked);

  var link = svg.append("g")
      .attr("class", "links")
    .selectAll("line")

  var node = svg.append("g")
      .attr("class", "nodes")
    .selectAll("circle")/*
    .data(graph.nodes)
    .enter().append("circle")*/

function restart(graph){

  // Apply the general update pattern to the nodes.
  node = node.data(graph.nodes, function(d) { return d.id;});
  node.exit().remove();
  var newNode = node.enter().append("circle")
      .attr("r", 6)
      .attr("fill", function(d) { return color(d.group); })
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));
  node = newNode.merge(node);

  newNode.append("title")
      .text(function(d) { return d.id+' ('+d.group+')'; });

  // Apply the general update pattern to the links.
  link = link.data(graph.links, function(d) { return d.source.id + "-" + d.target.id; });
  link.exit().remove();
  link = link.enter().append("line").attr("stroke-width", function(d) { return Math.sqrt(d.value); }).merge(link);

  // Update and restart the simulation.
  simulation.nodes(graph.nodes);
  simulation.force("link").links(graph.links);
  simulation.alpha(1).restart();

}

  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  }


function dragstarted(d) {
  if (!d3.event.active) {
    simulation.alphaTarget(0.3).restart();
  }
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) {
    simulation.alphaTarget(0);
  } 
  d.fx = null;
  d.fy = null;
}

function updateGraph(min, max){
    //debugger 
  restart(getData(min, max))
  console.log(min+'='+max)
}

setupSlider(updateGraph, color);


restart(getData(0, 10));

}
