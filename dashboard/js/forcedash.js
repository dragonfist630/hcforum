 function createDashboard(selected, counter, datum, size, offset){
        console.log(datum);
        //console.log(d3.select(selected).select("rect").style("y"));
        var selcolor = d3.select(selected).select("rect").style("fill");
        var container = d3.select("#mainCanvas");
        var yoffset = 140;
        var card = container.append("div")
                .attr("class", "dashboard")
                .attr("id", "draw-area-"+counter)
                .style("position", "absolute")
                .style("margin-left", offset+"px")
                .style("margin-top", yoffset+"px")
                .style("min-width",size+"px")
                .style("width",size+"px")
                .style("min-height", size+"px")
                .style("height", (size+50)+"px")
                .style("background-image",'linear-gradient('+ selcolor+',grey)')
                .style("border", "none")
                .style("border-radius", 5)
                .style("z-index", 100)
                .style("opacity", 1.0);

              //drawCircles("#draw-area-"+counter, counter, datum.name, size);
              drawRadial("#draw-area-"+counter, 500, 500, datum.name+"-tree");
           
      }

  function killDashboard(){

    d3.selectAll(".dashboard").remove(); 

  }

     