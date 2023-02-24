console.log("running")
// Create Scatterplot dimensions
const h = 400
const w = 400
const margin = {top: 20, left: 20};
innerWidth = w - 2* margin.left
innerHeight = h - 2*margin.top

const scatter_frame = d3.select("#scatterplot")
    .append("svg")
    .attr("height", h)
    .attr("width", w)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data/scatter-data.csv").then((scatter_data)=> {
    console.log("data loaded")
    // create scaling
    const x_scale = d3.scaleLinear()
        .domain([0,10])
        .range([0,innerWidth])
    const y_scale = d3.scaleLinear()
        .domain([0,10])
        .range([innerHeight,0])
    
    // x axis
    scatter_frame.append("g")
    .attr("transform", "translate(" + 0 + 
               "," + innerHeight + ")") 
    .call(d3.axisBottom(x_scale));

    // y axis
    scatter_frame.append("g")
    .call(d3.axisLeft(y_scale).ticks(10));

    scatter_frame.selectAll("circle")
    .data(scatter_data)
    .enter().append("circle")
        .attr("cx", d => x_scale(d.x))
        .attr("cy", d => y_scale(d.y))
        .attr("r", 10)
        .attr("class", "circle")

    function on_hover(){
        d3.select(this).style("fill", "pink")
    };

    function off_hover(){
        d3.select(this).style("fill", "blue")
    };

    // event listeners
    scatter_frame.selectAll("circle")
    .on("mouseover", on_hover)
    .on("mouseleave", off_hover)
    .on("click", function() {
        clicked = d3.select(this)
        clicked_x = Math.round(x_scale.invert(clicked.attr("cx")))
        clicked_y = Math.round(y_scale.invert(clicked.attr("cy")))
        document.getElementById("clicked-div").innerHTML = "Last point clicked:  (" + clicked_x + ", "+ clicked_y + ")"

        if(clicked.attr("stroke") === "black") {
            d3.select(this).attr("stroke", null)
        }
        else {
            d3.select(this)
            .attr("stroke", "black")
            .attr("stroke-width", "3")
        }
    });

    function add_point() {
        const new_x = d3.select("#x-coord").property("value")
        const new_y =d3.select("#y-coord").property("value")

        scatter_frame.append("circle")
        .attr("cx", d => x_scale(new_x))
        .attr("cy", d => y_scale(new_y))
        .attr("r", 10)
        .attr("class", "circle")
        .on("mouseover", on_hover)
        .on("mouseleave", off_hover)
        .on("click", function() {               
        clicked = d3.select(this)
        clicked_x = Math.round(x_scale.invert(clicked.attr("cx")))
        clicked_y = Math.round(y_scale.invert(clicked.attr("cy")))
        document.getElementById("clicked-div").innerHTML = "Last point clicked:  (" + clicked_x + ", "+ clicked_y + ")"

        if(clicked.attr("stroke") === "black") {
            d3.select(this).attr("stroke", null)
        }
        else {
            d3.select(this)
            .attr("stroke", "black")
            .attr("stroke-width", "3")
        }
    })
    };

    d3.select("#submit-btn")
        .on("click", add_point);
});

const bar_frame = d3.select("#barchart").append("svg")
  .attr("height", h)
  .attr("width", w);

// Create a group element and translate it to the margin position
const g = bar_frame.append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Load the csv data and create a bar chart
d3.csv("data/bar-data.csv", d => ({
  name: d.name,
  value: parseInt(d.value)
})).then(data => {
  // Create the scales for the x and y axis
  const x = d3.scaleBand()
    .domain(data.map(d => d.name))
    .range([0, innerWidth])
    .padding(0.1);

  const y = d3.scaleLinear()
    .domain([0, 100])
    .range([innerHeight, 0]);

  // Create the x and y axis
  const xAxis = d3.axisBottom(x);
  const yAxis = d3.axisLeft(y);

  // Append the x and y axis to the chart
  g.append("g")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(xAxis)
    .attr("font-size", "20px");

  g.append("g")
    .call(yAxis.ticks(10));

  // Create the bars and bind the data
  g.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", d => x(d.name))
    .attr("y", d => y(d.value))
    .attr("width", x.bandwidth())
    .attr("height", (d) => {return innerHeight - y(d.amount)}) //cannot determine why this is producing an error
    .attr("fill", "steelblue");

    const tooltip = d3.select("#barchart")
                        .append("div")
                          .attr("class", "tool-tip")
                          .style("opacity", 0);
    
    function hover(){
        d3.select(this)
        .style("fill", "yellow")

        tooltip.style("opacity", "1")
    }
    function leave(){
        d3.select("this")
        .style("fill", "steelblue");
    }

    function tooltipHov() {
        tooltip.html("Category" + d.category + "amount" + d.amount)
    };

    g.selectAll("bar")
    .on("mouseover", hover)
    .on("mouseleave", leave)
    .on("mousemove", tooltipHov)

});