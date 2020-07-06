var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
d3.select("body").append("div").attr("class","toolitp").style("opacity", 0)
// Import Data
d3.csv("assets/data/data.csv").then(function(healthdata) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    healthdata.forEach(function(data) {
      data.obesity = +data.obesity;
      data.age = +data.age;
      data.smokes = +data.smokes;
      data.healthcare = +data.healthcare;
      data.poverty = +data.poverty;
      data.income = +data.income;
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([8, d3.max(healthdata, d => d.poverty*1.1)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([2, d3.max(healthdata, d => d.healthcare*1.1)])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(healthdata)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .attr("fill", "pink")
    .attr("stroke-width", "1")
    .attr("opacity", ".5")
    // .on("mouseout", function(data, index) {
    //   toolTip.hide(data);
    // });
    
    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (abbr + '%');
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("click", function(data) {
      toolTip.show(data);
    })
      // onmouseout event
      .on("mouseout", function(data) {
        toolTip.hide(data);
      });
    // chartGroup.select("g")
    // .selectAll("circle")
    // .data(healthdata)
    // .enter()
    // .append("text")
    // .text(d => d.abbr)
    // .attr("x", d => xLinearScale(d.poverty))
    // .attr("y", d => yLinearScale(d.healthcare))
    // .attr("dy",-395)
    // .attr("text-anchor", "middle")
    // .attr("font-size", "12px")
    // .attr("fill", "black");
    //  console.log(healthdata);

    // Create axes labels
    chartGroup.append("text")
    .style("font-size", "10px")
    .selectAll("tspan")
    .data(healthdata)
    .enter()
    .append("tspan")
    .attr("x", function(data) {
      return xLinearScale(data.poverty-0.15);
      })
  .attr("y", function(data) {
      return yLinearScale(data.healthcare-0.3);
      })
    .text(function(data){
      return data.abbr
      });

    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Healthcare");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Poverty");
  }).catch(function(error) {
    console.log(error);
  });
