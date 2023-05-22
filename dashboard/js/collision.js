function createCollision(svgID, width, height, fname){
 
 var padding = -10,
    min_padding = 0,
    max_padding = 1,
    maxRadius = 1,
    n;

d3.json("data/"+fname+".json", function(error, json){

	n = json.length;
	var nodes = d3.range(n).map(function(i) {
	  var r = 60, //Math.sqrt(1 / 1 * -Math.log(Math.random())) * maxRadius,
	      	d = {id: i, radius: r, cx: width/2+Math.random()-(n*3), cy: height/2+Math.random()+(n*4), fname: json[i]};
	  return d;
	});

nodes.forEach(function(d) { d.x = d.cx; d.y = d.cy; });
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

	//.attr("r", function(d) { return d.radius; })
	//.attr("cx", function(d) { return d.cx; })
   // .attr("cy", function(d) { return d.cy; });
   
var force = d3.layout.force()
    .nodes(nodes)
    .size([width, height])
    linkStrength(0.1)
    .friction(0.9)
    .linkDistance(20)
    .charge(-30)
    .gravity(0.1)
    //.gravity(.02)
    //.charge(50)
    .on("tick", tick)
    .start();

force.alpha(.05);

function tick(e) {
	//force.alpha(.01);

  	circle
		.each(gravity(.2 * e.alpha))
		.each(collide(.5))
    .attr("transform", function(d) { return "translate(" + (d.x-200) + "," + (d.y-300) + ")"; });
	//	.attr("cx", function(d) { return d.x; })
	//	.attr("cy", function(d) { return d.y; });
}


function brushed() {
	var value = brush.extent()[0];

	if (d3.event.sourceEvent) {
		value = x.invert(d3.mouse(this)[0]);
		brush.extent([value, value]);

		force.alpha(.01);
	}

	handle.attr("cx", x(value));

	padding = value;
}

// Resolve collisions between nodes.
function collide(alpha) {
  var quadtree = d3.geom.quadtree(nodes);
  return function(d) {
    var r = d.radius/2 + maxRadius + padding,
        nx1 = d.x - r,
        nx2 = d.x + r,
        ny1 = d.y - r,
        ny2 = d.y + r;
    quadtree.visit(function(quad, x1, y1, x2, y2) {
      if (quad.point && (quad.point !== d)) {
        var x = d.x - quad.point.x,
            y = d.y - quad.point.y,
            l = Math.sqrt(x * x + y * y),
            r = d.radius + quad.point.radius + padding;
        if (l < r) {
          l = (l - r) / l * alpha;
          d.x -= x *= l;
          d.y -= y *= l;
          quad.point.x += x;
          quad.point.y += y;
        }
      }
      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
    });
  };
}

//	Move nodes toward cluster focus.
function gravity(alpha) {
	return function(d) {
		d.y += (d.cy - d.y) * alpha;
		d.x += (d.cx - d.x) * alpha;
	};
}
 });
}