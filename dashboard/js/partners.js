function listPartners(svgID, width, height, fname){

	

d3.json("data/"+fname+".json", function(error, json){
	n = json.length;
	var nodes = d3.range(n).map(function(i) {
	  var r = 60, //Math.sqrt(1 / 1 * -Math.log(Math.random())) * maxRadius,
	      	d = {id: i, radius: r, cx: (i%2*width/3)+(width/4), cy: 2*(parseInt(i/2))*(height/n), fname: json[i]};
	  return d;
	});


	var svg = d3.select(svgID).append("svg")
    .attr("id", "svg-" + svgID)
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + 10 + "," + 10 + ")");

svg.append("rect")
		.attr("x", 10)
		.attr("y", 10)
		.attr("width", (width-40))
		.attr("height", (height-20))
		.style("fill", "white")
		.style("stroke", "black")
		.style("opacity", 1.0);

var circle = svg.selectAll(".node")
    .data(nodes);

var enter_circle = circle.enter().append("g")
  	.attr('class', 'node');
    

enter_circle
 .append("image")
      .attr("xflink:href", function(d) {
      	return d.fname;} )
      .attr("x", function(d){return d.cx;})
      .attr("y", function(d){return d.cy;})
      .attr("width", function(d) { return d.radius; })
      .attr("height", function(d) { return d.radius; });

});

}
