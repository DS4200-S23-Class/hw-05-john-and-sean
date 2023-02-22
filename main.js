d3.csv("data/scatter-data.csv", function(data) {

    // Define SVG dimensions and margins
    var svgWidth = 600;
    var svgHeight = 400;
    var margin = {top: 20, right: 20, bottom: 50, left: 70};
  
    // Define scatterplot dimensions
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;
  
    // Create SVG element
    var svg = d3.select("#scatterplot")
                .append("svg")
                .attr("width", svgWidth)
                .attr("height", svgHeight);
  
    // Create x and y scales
    var xScale = d3.scaleLinear()
                   .domain([0, 10])
                   .range([0, width]);
    var yScale = d3.scaleLinear()
                   .domain([0, 10])
                   .range([height, 0]);
  
    // Create x and y axes
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);
  
    // Add x axis to the SVG
    svg.append("g")
       .attr("transform", "translate(" + margin.left + "," + (height + margin.top) + ")")
       .call(xAxis);
  
    // Add y axis to the SVG
    svg.append("g")
       .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
       .call(yAxis);
  
    // Create scatterplot points
    var points = svg.selectAll("circle")
                    .data(data)
                    .enter()
                    .append("circle")
                    .attr("cx", function(d) {
                      return xScale(d.x);
                    })
                    .attr("cy", function(d) {
                      return yScale(d.y);
                    })
                    .attr("r", 5)
                    .attr("fill", "steelblue")
                    .attr("stroke", "white")
                    .attr("stroke-width", 2);
  
    // Define function to highlight a point on hover
    function highlightPoint() {
      d3.select(this)
        .attr("fill", "orange");
    }
  
    // Define function to unhighlight a point on mouseout
    function unhighlightPoint() {
      d3.select(this)
        .attr("fill", "steelblue");
    }
  
    // Define function to toggle a point's border on click
    function toggleBorder() {
      var clickedPoint = d3.select(this);
      if (clickedPoint.attr("stroke") === "white") {
        clickedPoint.attr("stroke", "black");
        var xCoord = clickedPoint.data()[0].x;
        var yCoord = clickedPoint.data()[0].y;
        d3.select("#point-coordinates")
          .text("Selected point coordinates: (" + xCoord + ", " + yCoord + ")");
      } else {
        clickedPoint.attr("stroke", "white");
        d3.select("#point-coordinates")
          .text("");
      }
    }
  
    // Add event listeners to scatterplot points
    points.on("mouseover", highlightPoint)
          .on("mouseout", unhighlightPoint)
          .on("click", toggleBorder);

    function addNewPoint() {
    // Get user input for new point coordinates
    let x = parseInt(document.getElementById("x-coord").value);
    let y = parseInt(document.getElementById("y-coord").value);
    
    // Check that user input is valid
    if (isNaN(x) || isNaN(y) || x < 1 || x > 9 || y < 1 || y > 9) {
        alert("Invalid input. Please enter integers between 1 and 9.");
        return;
    }
    
    // Add new data point to dataset
    let newData = {"x": x, "y": y};
    data.push(newData);
    
    // Update scatterplot with new data
    let circles = svg.selectAll("circle")
        .data(data);
    
    circles.enter().append("circle")
        .attr("cx", function(d) { return xScale(d.x); })
        .attr("cy", function(d) { return yScale(d.y); })
        .attr("r", 5)
        .attr("fill", "blue")
        .on("mouseover", handleMouseOver)
        .on("click", handleClick);
    
    circles.exit().remove();
    
    // Clear user input
    document.getElementById("x-coord").value = "";
    document.getElementById("y-coord").value = "";
    }
}          