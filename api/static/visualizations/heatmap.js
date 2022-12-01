function heatMap(){
    // SVG Setup Details
    let margin = {"top": 20, "bottom": 0, "left": 60, "right": 20};

    let width = document.getElementById("heatmap").offsetWidth - margin.left - margin.right;
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
    // let heatmapSVG = d3.select("#heatmap").append("svg")
    //     .attr("width", width + margin.left + margin.right)
    //     .attr("height", height + margin.top + margin.bottom)
    //     .append("g")
    //     .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

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

        let legend = svg.selectAll(".legend")
            .data(colors)
            .enter().append("g")
            .attr("transform", "translate(" + (width / 2 - legendWidth / 2) + ", " + height + ")");

        legend.append("rect")
            .attr("width", legendWidth/colors.length)
            .attr("height", legendHeight)
            .style("fill", d=>d)
            .attr("x", (d,i)=> legendWidth/colors.length * i);

        svg.append("g").attr("class", "axis")
            .attr("transform", "translate(" + (width / 2 - legendWidth/2) + ", " + (height - legendHeight + 60) + ")")
            .call(legendAxis);
    }

    function initCourt(){
        // Visualize the court

        // NBA Court Dimension Setup (Halfcourt only)
        let courtWidth = 50;
        let courtHeight = 40;


        //Free Throw

        //Other


    }

    initCourt();

}