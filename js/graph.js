
function graph(color){
  const svg = d3.select("#graph"),
      width = +svg.attr("width"),
      height = +svg.attr("height");

  const simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(d => d.id))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(10))
        .on("tick", ticked);

  let link = svg.append("g")
      .attr("class", "links")
    .selectAll("line");

  let node = svg.append("g")
      .attr("class", "nodes")
    .selectAll("circle");

  const t = d3.transition()
    .duration(750);

  function restart(data){

    // Apply the general update pattern to the nodes.
    node = node.data(data.nodes, d => d.id);
    node.exit().transition(t)
        .style("opacity", 0).remove();
    var newNode = node.enter().append("circle")
        .attr("r", 10)
        .style("opacity", 0)
        .attr("fill", d => color(d.group))
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    newNode.transition(t)
        .style("opacity", 1);

    node = newNode.merge(node);

    newNode.append("title")
        .text(d => d.id+' ('+d.group+')');

    // Apply the general update pattern to the links.
    link = link.data(data.links, d => d.source.id + "-" + d.target.id);
    link.exit().remove();
    link = link.enter().append("line").attr("stroke-width", d => Math.sqrt(d.value)).merge(link);

    // Update and restart the simulation.
    simulation.nodes(data.nodes);
    simulation.force("link").links(data.links);
    simulation.alpha(1).restart();

  }

  function ticked() {
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
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

  return {
    restart: restart
  }

}
