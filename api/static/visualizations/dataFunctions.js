/*
    This function is the onClick event for the data selection widget
 */

function getShots() {
    fetch('http://' + window.location.host + '/shots/get/?player=' + document.getElementById('player').value + '&start_date=' + document.getElementById('start_date').value + '&end_date=' + document.getElementById('end_date').value)
        .then(response => response.json())
        .then(data => {

            //Pane 1 - League Comparison

            //Pane 2 - Heatmap
            heatMap(data)

            //Pane 3 - Shot Distance Histogram
            //TODO: move all of the below code into generateHistogram and replace it with a call to the function
            //TODO: get dynamic width and height
            let width = 500;
            let height = 500;
            let svg = d3.select('#shotDistanceHistogram')
                .append('svg')
                .attr('width', width)
                .attr('height', height);

            var x = d3.scaleLinear()
                .domain([0, d3.max(data, function(d) { return d.distance })])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
                .range([0, width]);

            svg.append("g")
                .attr("transform", "translate(40," + (height - 20) + ")")
                .call(d3.axisBottom(x));

            // set the parameters for the histogram
            var histogram = d3.histogram()
                .value(function(d) { return d.distance; })   // I need to give the vector of value
                .domain(x.domain())  // then the domain of the graphic
                .thresholds(x.ticks(40)); // then the numbers of bins

            // And apply this function to data to get the bins
            var bins = histogram(data);

            // Y-axis: scale and draw:
            var y = d3.scaleLinear()
                .range([height, 0])
                .domain([0, d3.max(bins, function(d) { return d.length; }) + 50]);   // d3.hist has to be called before the Y axis obviously

            svg.append("g")
                .attr("transform", "translate(40,-20)")
                .call(d3.axisLeft(y));

            // append the bar rectangles to the svg element
            svg.selectAll("rect")
                .data(bins)
                .enter()
                .append("rect")
                .attr("x", 1 + 40)
                .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + (y(d.length) - 20) + ")"; })
                .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
                .attr("height", function(d) { return height - y(d.length); })
                .style("fill", "#198754")
                .on("mouseover", function(d) {
                    d3.select(this)
                        .style("fill", "#157347");
                })
                .on("mouseleave", function(d) {
                    d3.select(this)
                        .style("fill", "#198754");
                });

            //Pane 4 - Clutch Shots Line Chart


        });
}

let players = fetch('http://' + window.location.host + '/players/get')
    .then(response => response.json())
    .then(data => {
        let players = data.players;
        let playerList = document.getElementById('players')
        players.forEach(player => {
            let option = document.createElement('option')
            option.value = player
            playerList.appendChild(option)
        })
    });

