// Initialize variables
function generateHistogram(data) {
    //TODO: combine/replace this code with the code currently in getShots() that generates the histogram

    let svg = d3.select("#shotDistanceHistogram");

    let allData = [];
    for (let i = 0; i < 50; i++) {
        allData.push({"Distance": i, "Frequency": 0});
    }
    let width = 550;
    let height = 480;

    data.forEach(shot => {
        allData[shot.distance].Frequency += 1;
    });

    data = allData;
    console.log("data", data);

    let x = d3.scaleLinear()
        .domain([0, 50])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
        .range([0, width]);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));


    //TODO: implement an update function rather than always adding a new chart with additional clicks

    // set the parameters for the histogram
    let histogram = d3.histogram()
        .value(function(d) {
            return d.price; })   // I need to give the vector of value
        .domain(x.domain())  // then the domain of the graphic
        .thresholds(x.ticks(70)); // then the numbers of bins
    //TODO: add vertical markers on the chart showing important distance benchmarks -- eg ft line, 3pt line

}