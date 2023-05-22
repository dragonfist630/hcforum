 
 var margin = {
        top: 10,
        right: 30,
        bottom: 160,
        left: 10
      };

 var drawAreaW = d3.select("#mainCard").style("width"),
      drawAreaH = d3.select("#mainCard").style("height");
    
var width = parseInt(drawAreaW) - margin.left - margin.right,
      height = parseInt(drawAreaH) - margin.top - margin.bottom;

var clickcounter = 1; 
    var formatNumber = d3.format(",.0f"),
      format = function(d) {
        return formatNumber(d) + " TWh";
      },
       color = d3.scale.linear().domain([1,14])
      .interpolate(d3.interpolateHcl)
      .range([d3.rgb("#ffff99"), d3.rgb('#2b8cbe')]);

     //color = d3.scale.category20c();
    var svg = d3.select("#draw-area-1").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var sankey = d3.sankey()
      .nodeWidth(15)
      .nodePadding(10)
      .size([width, height]);

    var path = sankey.link();

    d3.json("data/energy.json", function(energy) {

      sankey
        .nodes(energy.nodes)
        .links(energy.links)
        .layout(32);



      function setDash(d) {
        var d3this = d3.select(this);
        var totalLength = d3this.node().getTotalLength();
        d3this
          .attr('stroke-dasharray', totalLength + ' ' + totalLength)
          .attr('stroke-dashoffset', totalLength)
      }

      function branchAnimate(nodeData) {
        var links = svg.selectAll(".gradient-link")
          .filter(function(gradientD) {
            return nodeData.sourceLinks.indexOf(gradientD) > -1
          });
        var nextLayerNodeData = [];
        links.each(function(d) {
          nextLayerNodeData.push(d.target);
        });
        var nodesOnPath = [];
        nextLayerNodeData.forEach(function(d){
          nodesOnPath.push(d.name);
        });
        d3.selectAll("text")
          .style("fill", function(d){
             return "black";
            /*var currentcol = d3.select(this).style("fill");
            if(nodesOnPath.indexOf(d.name) >=0)
              return "white";
            else 
              return currentcol;*/
            
          });

        links
          .style("opacity", null)
          .transition()
          .duration(700)
          .ease('linear')
          .attr('stroke-dashoffset', 0)
          .each("end", function() {
            nextLayerNodeData.forEach(function(d) {
              //branchAnimate(d);
            });
          });
      } //end branchAnimate

      var gradientLink = svg.append("g").selectAll(".gradient-link")
        .data(energy.links)
        .enter().append("path")
        .attr("class", "gradient-link")
        .attr("d", path)
        .style("stroke-width", function(d) {
          return Math.max(1, d.dy);
        })
        .sort(function(a, b) {
          return b.dy - a.dy;
        })
        .each(setDash)
        .style('stroke', function(d) {
          var src = d.source.name.replace(/ .*/, "");
          //var sourceColor = color(d.source.name.replace(/ .*/, "")).replace("#", "");
          //var targetColor = color(d.target.name.replace(/ .*/, "")).replace("#", "");
          var sourceColor = color(d.source.level).replace("#", "");
          var targetColor = color(d.target.level).replace("#", "");
          var id = 'c-' + sourceColor + '-to-' + targetColor;
          if (!svg.select(id)[0][0]) {
            //append the gradient def
            //append a gradient
            var gradient = svg.append('defs')
              .append('linearGradient')
              .attr('id', id)
              .attr('x1', '0%')
              .attr('y1', '0%')
              .attr('x2', '100%')
              .attr('y2', '0%')
              .attr('spreadMethod', 'pad');

            gradient.append('stop')
              .attr('offset', '0%')
              .attr('stop-color', "#" + sourceColor)
              .attr('stop-opacity', 1);

            gradient.append('stop')
              .attr('offset', '100%')
              .attr('stop-color', "#" + targetColor)
              .attr('stop-opacity', 1);
          }
          return "url(#" + id + ")";
        });

      var link = svg.append("g").selectAll(".link")
        .data(energy.links)
        .enter().append("path")
        .attr("class", "link")
        .attr("d", path)
        .style("stroke-width", function(d) {
          return Math.max(1, d.dy);
        })
        .sort(function(a, b) {
          return b.dy - a.dy;
        });

     
      var node = svg.append("g").selectAll(".node")
        .data(energy.nodes)
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")";
        })
        .on("contextmenu", function(d){
            d3.event.preventDefault();
          killDashboard();
          clickcounter++;
          var expandables = ["Digital Divide", "Programming Skills", "Impacts of Computing", "Characterisation"];
          if(expandables.indexOf(d.name) >=0)
            createDashboard(this, clickcounter, d, 500 ,1175);
        })
        .on("click", function(d){
            d3.selectAll(".mini-dash").remove();
          var expandedW = 460; 
          var expandedH = 510;
          console.log(d3.select(this));
          var curwidth, curheight;

          var nodesel = d3.select(this);

          d3.select(this)
          .selectAll("rect")
            .attr("expanded", function(d){
             var e = d3.select(this).attr("expanded");
             if(e === "false")
               {
                curwidth = nodesel.select("rect").attr("width");
                nodesel.select("rect").attr("curwidth", curwidth);
                curheight = nodesel.select("rect").attr("height");
                nodesel.select("rect").attr("curheight", curheight);
                d3.selectAll("rect").style("opacity", 0.01);
                d3.selectAll("text").style("opacity", 0.1);
                return true;
               }
             else 
              { 
                d3.selectAll("rect").style("opacity", 1.0);
                d3.selectAll("text").style("opacity", 1.0);
                return false; }
              })
            .style("opacity", 1.0)
            .transition()
            .duration(800)
              .attr("width", function(d){
                  var w = d3.select(this).attr("curwidth");
                  if(curwidth !== w) 
                    return w; 
                  else 
                    return expandedW; 
              })
              .attr("height", function(d){
                  var h = d3.select(this).attr("curheight");
                  if(curheight !== h) 
                    return h; 
                  else 
                    return expandedH;
              }).style("fill-opacity", 1.0).style("z-index", 1000000);

            var exp = d3.select(this).selectAll("rect").attr("expanded");
            if(exp === "true"){
              var container = d3.select("#mainCard");
             
              var miniDash = container.append("div")
                          .attr("class", "mini-dash")
                          .attr("id", "calendar")
                           .style("position", "absolute")
                          .style("margin-left", (margin.left + d.x+ 20)+"px")
                          .style("margin-top", (margin.top + d.y + 40)+"px")
                          .style("width", 0)
                          .style("height",0)
                          .transition()
                          .duration(900)
                          .style("min-width",(expandedW-40)+"px")
                          .style("width",(expandedW-40)+"px")
                          .style("min-height", (expandedH-40)+"px")
                          .style("height", (expandedH-40)+"px")
                          .style("background-color",'white')
                          .style("border", "black")
                          .style("border-radius", 5)
                          .style("z-index", 100)
                          .style("opacity", 1.0);

             var calendar = new Calendar('#calendar', d);

             /* d3.select(this).append("div")
                            .attr("x", 20)
                            .attr("y", 20)
                            .attr("width", 0)
                            .attr("height", 0)
                            .transition().duration(900)
                            .attr("width", expandedW - 40)
                            .attr("height", expandedH - 40)
                            .style("fill", "white");*/
            }
            else{
              d3.select("#calendar").remove();
              d3.select(".mini-dash").remove();
            }
           //branchAnimate(d);
        })
        .on("mouseout", function() {
          //cancel all transitions by making a new one
          /*gradientLink.transition();
          gradientLink
            .style("opacity", 0)
            .each(function(d) {
              setDash.call(this, d);
            });*/
        });


      node.append("rect")
        .attr("height", function(d) {
          return d.dy;
        })
        .attr("expanded", false)
        .attr("width", sankey.nodeWidth())
        .style("fill", function(d) {
          //return d.color = color(d.name.replace(/ .*/, ""));
          return d.color = color(d.level);
        });
       // .append("title")
       // .text(function(d) {
        //  return d.name + "\n" + format(d.value);
        //});

      node.append("text")
        .attr("class", "sankey-text")
        .attr("x", -6)
        .attr("y", function(d) {
          return d.dy / 2;
        })
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .attr("transform", null)
        .text(function(d) {
          return d.name;
        })
        .attr("transform", function(d){
          if(d.x >= (width-100)){
            d3.select(this).style("fill", "white");
            //d3.select(this).style("font-size", "30pt");
            return "translate(280,150) rotate(90)";
          }
          return null; 
        })
        .style("fill", function(d){
            if(d.x >= (width-100))
              return "white";
            else return "black";
        })
        .style("font-size", function(d){
           if(d.x >= (width-100)){
            return "18pt";
           }
           else return "14pt";
        })
        .filter(function(d) {
          return d.x < width -100;
        })
        .attr("x", 6 + sankey.nodeWidth())
        .attr("text-anchor", "start");

    });