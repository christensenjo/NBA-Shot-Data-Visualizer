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
    let heatmapSVG = d3.select("#heatmap").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

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
        let courtWidth = 56;
        let courtHeight = 34;

        let threePointLine = "M" + (width * (3/courtWidth)) + " "
                                 + (height) + " "
                           + "L" + (width * (3/courtWidth)) + " "
                                 + (height * ((courtHeight-14)/courtHeight)) + " "
                           + "A" + ((23.75/courtWidth) * width) + " "
                                 + ((23.75/courtHeight) * height) + " "
                                 + "0 0 1 "
                                 + (width * (47/courtWidth)) + " "
                                 + (height * ((courtHeight-14)/courtHeight))
                           + "L" + (width * (47/courtWidth)) + " "
                                 + (height)
                            + "M0 " + height + " "
                            + "L" + width + " " + height;

        let keyOutline =  "M" + (width * (17/courtWidth)) + " "
                            + height + " "
                            + "L" + (width * (17/courtWidth)) + " "
                            + (height * ((courtHeight - 18) / courtHeight)) + " "
                            + "L" + (width * (33/courtWidth)) + " "
                            + (height * ((courtHeight - 18) / courtHeight)) + " "
                            + "L" + (width * (33/courtWidth)) + " "
                            + height;

        let insideKeyLines = "M" + (width * (20/courtWidth)) + " "
                            + height + " "
                            + "L" + (width * (20/courtWidth)) + " "
                            + (height * ((courtHeight - 18) / courtHeight)) + " "
                            + "M" + (width * (30/courtWidth)) + " "
                            + height + " "
                            + "L" + (width * (30/courtWidth)) + " "
                            + (height * ((courtHeight - 18) / courtHeight));

        let topFtCircle = "M" + (width * (20/courtWidth)) + " "
                             + (height * ((courtHeight - 18) / courtHeight)) + " "
                             + "A" + ((6/courtWidth) * width) + " "
                             + ((6/courtHeight) * height) + " "
                             + "0 0 1 "
                             + (width * (30/courtWidth)) + " "
                             + (height * ((courtHeight - 18) / courtHeight));

        let bottomFtCircle = "M" + (width * (20/courtWidth)) + " "
            + (height * ((courtHeight - 18) / courtHeight)) + " "
            + "A" + ((6/courtWidth) * width) + " "
            + ((6/courtHeight) * height) + " "
            + "0 0 0 "
            + (width * (30/courtWidth)) + " "
            + (height * ((courtHeight - 18) / courtHeight));


        heatmapSVG.append("path")
            .attr("d", threePointLine)
            .style("stroke","black")
            .style("stroke-width", "2")
            .style("fill", "#393d4f")
            .style("opacity", "60%");
        heatmapSVG.append("path")
            .attr("d", keyOutline)
            .style("stroke", "black")
            .style("stroke-width", "2")
            .style("fill", "#616785")
            .style("opacity", "60%");
        heatmapSVG.append("path")
            .attr("d", insideKeyLines)
            .style("stroke", "black")
            .style("stroke-width", "2")
            .style("fill", "none");
        heatmapSVG.append("path")
            .attr("d", topFtCircle)
            .style("stroke", "black")
            .style("stroke-width", "2")
            .style("fill", "#616785")
            .style("opacity", "60%");
        heatmapSVG.append("path")
            .attr("d", bottomFtCircle)
            .style("stroke", "black")
            .style("stroke-width", "2")
            .style("fill", "none")
            .style("stroke-dasharray", ("3, 3"));


        //Free Throw

        //Other


    }

    initCourt();

}