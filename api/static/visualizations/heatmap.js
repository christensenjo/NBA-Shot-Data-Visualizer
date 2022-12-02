function heatMap(){
    // SVG Setup Details
    let margin = {"top": 20, "bottom": 0, "left": 60, "right": 20};

    let width = document.getElementById("heatmapPane").offsetWidth - margin.left - margin.right;
    width = width - (.24 * width); // Account for padding on heatmap court svg
    let height = document.getElementById("heatmapPane").offsetHeight - margin.top - margin.bottom - document.getElementById("heatmapTitle").offsetHeight;
    let dataset = [];

    // Color Scaling Details
    let colors = ["#80000F", "#BF0071", "#FF05FF", "#BC44FF",
        "#A488FF"];
    let fillRange = [];
    let legendWidth = width / 5;
    let legendHeight = 30;

    for(let i = 0; i <= colors.length; i++){
        fillRange.push(legendWidth/colors.length * i);
    }

    let fill = d3.scaleQuantile().range(colors);
    let axisScale = d3.scaleQuantile().range(fillRange);

    // SVG Implementation
    let heatmapSVG = d3.select("#court");

    // Implement with Data
    // console.log(data);

    function createLegend(max, min){
        let diff = (max - min)/colors.length;
        let LegendScale = [];
        for(let i = 0;i <= colors.length;i++){
            LegendScale.push(diff * (i + 1) + min);
        }

        axisScale.domain(LegendScale);

        let legendAxis = d3.axisBottom(axisScale).tickFormat(x=>  x.toFixed(1) + "%");

        let legend = heatmapSVG.selectAll(".legend")
            .data(colors)
            .enter().append("g")
            .attr("transform", "translate(" + (width / 2 - legendWidth / 2) + ", " + height + ")");

        legend.append("rect")
            .attr("width", legendWidth/colors.length)
            .attr("height", legendHeight)
            .style("fill", d=>d)
            .attr("x", (d,i)=> legendWidth/colors.length * i);

        heatmapSVG.append("g").attr("class", "axis")
            .attr("transform", "translate(" + (width / 2 - legendWidth/2) + ", " + (height - legendHeight + 60) + ")")
            .call(legendAxis);
    }

    function init(){
        // NBA Court Dimension Setup (Halfcourt only)
        let courtWidth = 50;
        let courtHeight = 40;

        let courtH = document.getElementById("heatmap").offsetHeight;
        console.log(courtH);
        // Make heatmap grid
        for(let i = 0; i < 10; i++){
            for(let j = 0; j < 10; j++){
                console.log("height is " + height);
                console.log("rect h is " + (.10 * height));

                heatmapSVG.append("rect")
                    .attr("width", .10 * width)
                    .attr("height", .10 * height)
                    .style("fill", "red")
                    .attr("x", ((i/10) * width))
                    .attr("y", ((j/10) * height));
            }
        }
    }

    init();
}