function heatMap(data){
    // SVG Setup Details
    let margin = {"top": 20, "bottom": 0, "left": 60, "right": 20};

    let width = document.getElementById("heatmapPane").offsetWidth - margin.left - margin.right;
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
    let heatmapSVG = d3.select("#court").append("g");

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

    function init(data){
        //Data Transformation and Handling
        let shotGrid = [];
        for(let i = 0; i < 10; i++){
            shotGrid[i] = new Array(10);
        }
        console.log("empty shotGrid init:")
        console.log(shotGrid);
        console.log((20/25) / 0.2)

        count = 0;
        data.forEach(function(d){
            let x = d['location_x'];
            let xGrid = getXGrid(x);

            let y = d['location_y'];
            let yGrid = getYGrid(y);

            let made = d['is_made'];
            // TODO: handle dict instantiation prior to update
            let currentAttempts = shotGrid[xGrid][yGrid]['attempts'];
            let currentMade = shotGrid[xGrid][yGrid]['made'];
            if(made){
                shotGrid[xGrid][yGrid] = {'attempts': currentAttempts + 1,
                                            'made': currentMade + 1,
                                            'fg%': ((currentMade + 1)/(currentAttempts + 1)) };
            }else{
                shotGrid[xGrid][yGrid] = {'attempts': currentAttempts + 1,
                                            'made': currentMade,
                                            'fg%': (currentMade/(currentAttempts + 1)) };
            }

            //printing for debug purposes
            count++;
            if(count < 10){
               console.log(d);
               console.log(x, y, made);
           }
        });

        // TODO: remove
        for(let i = 0; i < 10; i++){
            for(let j = 0; j < 10; j++){

            }
        }


        // TODO: use join-update to create grid based on data
        updateHeatMap(shotGrid);

    }

    function getXGrid(x){
        x = x / 250;

        if(x < -0.8){
            return 1;
        }else if(x < -0.6 && x > -0.8){
            return 2;
        }else if(x < -0.4 && x > -0.6){
            return 3;
        }else if(x < -0.2 && x > -0.4){
            return 4;
        }else if(x < 0 && x > -0.2){
            return 5;
        }else if(x < 0.2 && x > 0){
            return 6;
        }else if(x < 0.4 && x > 0.2){
            return 7;
        }else if(x < 0.6 && x > 0.4){
            return 8;
        }else if(x < 0.8 && x > 0.6){
            return 9;
        }else if(x < 1 && x > 0.8){
            return 10;
        }
    }

    function getYGrid(y){
        y = y / 10;
        // grid positions from left-top corner
        // start from higher distances
        if(y > 35.475){
            yGrid = 1;
        }else if(y > 30.95 && y < 35.475){
            yGrid = 2;
        }else if(y > 26.425 && y < 30.95){
            yGrid = 3;
        }else if(y > 21.9 && y < 26.425){
            yGrid = 4;
        }else if(y > 17.375 && y < 21.9){
            yGrid = 5;
        }else if(y > 12.85 && y < 17.375){
            yGrid = 6;
        }else if(y > 8.325 && y < 12.85){
            yGrid = 7;
        }else if(y > 3.8 && y < 8.325){
            yGrid = 8;
        }else if(y > -0.725 && y < 3.8){
            yGrid = 9;
        }else if(y < -0.725){
            yGrid = 10;
        }
    }

    function updateHeatMap(shotGrid){
        // TODO: Get min and max rates from the shotGrid

        // Create the legend
        createLegend(max, min);
        fill.domain([min, max]);

        width = 700;
        height = 559;

        heatmapSVG.selectAll(".heatRects")
            .data(shotGrid)
            .join(
                function (enter){
                    return enter.append("rect")
                        .attr("width", .10 * width)
                        .attr("height", .10 * height)
                        .style("fill", function(d){
                            // TODO: code initial scale fill?
                            return "red";
                        })
                        .attr("x", ((i/10) * width))
                        .attr("y", ((j/10) * height))
                        .style("opacity", "0%")
                        .attr("class", "heatRect");
                },
                function (update){
                    return update
                        .style("opacity", "50%")
                        .style("fill", function(d){
                            //TODO: code fill function using scale based on fg%
                            // return fill(d['fg%']);
                            return "red";
                        })
                },
                function (exit){
                    exit.remove();
                }
            );

    }


    init(data);
}