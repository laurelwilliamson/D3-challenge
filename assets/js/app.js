// @TODO: YOUR CODE HERE!
//define variables


var svgArea = d3.select('body').select('svg');


var svgWidth = 960;
var svgHeight = 500;

var margin= {
    top: 25,
    right: 25,
    bottom: 80,
    left: 100
};


var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

var svg = d3
    .select("#scatter")
    .append('svg')
    .attr('width',svgWidth)
    .attr('height', svgHeight);

var chartGroup = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)
    .classed('chart',true)

//initial params
var chosenxAxis = 'age'
var yAxis = 'smokers'

// // function used for updating x-scale var upon click on axis label
function xScale(censusData, chosenxAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(censusData, d => d[chosenxAxis]) * 0.8,
        d3.max(censusData, d => d[chosenxAxis]) * 1.2
      ])
      .range([0, chartWidth]);
  
    return xLinearScale;
  
  }

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }
  
  

// new circles
function renderCircles(circlesGroup, newXScale, chosenxAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenxAxis]));
  
    return circlesGroup;
  }
  
// function used for updating circles group with new tooltip
function updateToolTip(chosenxAxis, circlesGroup) {

    var label;
  
    if (chosenxAxis === "age") {
      label = "age:";
    }
    else {
      label = "smokes:";
    }
  
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.age}<br>${label} ${d[chosenxAxis]}`);
      });
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
    return circlesGroup;
  }
  
      

    //left off but order diff


    // Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(censusData, err) {
    if (err) throw err;
  
    // parse data
    censusData.forEach(function(data) {
      data.age = +data.age;
      data.smokes = +data.smokes;
    });
  
    // xLinearScale function above csv import
    var xLinearScale = xScale(censusData, chosenxAxis);
  
    // Create y scale function
    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(censusData, d => d.smokes)])
      .range([chartHeight, 0]);
  
    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
  var xAxis = chartGroup.append("g")
  .classed("x-axis", true)
  .attr("transform", `translate(0, ${chartHeight})`)
  .call(bottomAxis);

// append y axis
chartGroup.append("g")
  .call(leftAxis);


// append initial circles
var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenxAxis]))
    .attr("cy", d => yLinearScale(d.smokes))
    .attr("r", 10)
    .attr("fill", "pink")
    .attr("opacity", ".6");

// Create group for two x-axis labels
var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);

var ageLabel = labelsGroup.append("text")
    .attr("id", "age")
    .attr("y", 20)
    .attr("value", "age") // value to grab for event listener
    .classed("active", true)
    .text("age");

// var albumsLabel = labelsGroup.append("text")
//     .attr("x", 0)
//     .attr("y", 40)
//     .attr("value", "smokes") // value to grab for event listener
//     .classed("inactive", true)
//     .text("Smoking Percentage");


  // append y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (chartHeight / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Percent Smokers");


    //8888//
    var circlesGroup = updateToolTip(chosenxAxis, circlesGroup);

  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenxAxis) {

        // replaces chosenXAxis with value
        chosenxAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(censusData, chosenxAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenxAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenxAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenxAxis === "age") {
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
        }
        else {
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });
}).catch(function(error) {
  console.log(error);
});

  

