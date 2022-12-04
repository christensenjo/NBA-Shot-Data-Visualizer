function heatMap(data){
    // SVG Setup Details
    let margin = {"top": 20, "bottom": 0, "left": 60, "right": 20};
    let width = 700;
    let height = 559;

    // Color Scaling Details
    let colors = ["#80000F", "#BF0071", "#FF05FF", "#BC44FF",
        "#A488FF"];
    let fillRange = [];
    let legendWidth = width / 5;
    let legendHeight = 30;
    let max;
    let min;
    for(let i = 0; i <= colors.length; i++){
        fillRange.push(legendWidth/colors.length * i);
    }
    let fill = d3.scaleQuantile().range(colors);
    let axisScale = d3.scaleQuantile().range(fillRange);

    // SVG Implementation
    let heatmapSVG = d3.select("#court")
        .append("g");

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
        // console.log("WIDTH is " + width);
        // console.log("HEIGHT is " + height);
        let shotGrid = [];
        for(let i = 0; i < 10; i++){
            shotGrid[i] = new Array(10);

            for(let j = 0; j < 10; j++){
                shotGrid[i][j] = {"x": i, "y": j};

                //Create initial grid rects
                // heatmapSVG.append("rect")
                // .attr("width", .10 * width)
                // .attr("height", .10 * height)
                // .style("fill", "none")
                // .attr("x", ((i/10) * width))
                // .attr("y", ((j/10) * height))
                // .style("opacity", "0%")
                // .attr("class", "heatRect");

            }
        }
        console.log("empty shotGrid init:")
        console.log(shotGrid);

        let count = 0;
        data.forEach(function(d){
            let x = d['location_x'];
            let xGrid = getXGrid(x);

            let y = d['location_y'];
            let yGrid = getYGrid(y);

            let made = d['is_made'];
            let currentAttempts;
            // console.log(xGrid);
            // console.log("y is " + (y/ 10));
            // console.log(yGrid);
            // console.log(shotGrid);
            if('attempts' in shotGrid[xGrid][yGrid]){
                currentAttempts = shotGrid[xGrid][yGrid]['attempts'];
            }else{
                currentAttempts = 0;
            }
            let currentMade;
            if('made' in shotGrid[xGrid][yGrid]){
                currentMade = shotGrid[xGrid][yGrid]['made'];
            }else{
                currentMade = 0;
            }
            let newFG = ((currentMade + 1)/(currentAttempts + 1));
            if(newFG > max){
                max = newFG;
            }
            if(newFG < min){
                min = newFG;
            }
            if(made){
                shotGrid[xGrid][yGrid]['attempts'] = currentAttempts + 1;
                shotGrid[xGrid][yGrid]['made']  = currentMade + 1;
                shotGrid[xGrid][yGrid]['fg%'] = newFG;
            }else{
                shotGrid[xGrid][yGrid]['attempts'] = currentAttempts + 1;
                shotGrid[xGrid][yGrid]['made']  = currentMade;
                shotGrid[xGrid][yGrid]['fg%'] = newFG;
            }

            //printing for debug purposes
            count++;
            if(count < 10){
               console.log(d);
               console.log(x, y, made);
           }
        });

        updateHeatMap(shotGrid);

    }

    function getXGrid(x){
        x = x / 250;

        if(x <= -0.8){
            return 0;
        }else if(x <= -0.6 && x > -0.8){
            return 1;
        }else if(x <= -0.4 && x > -0.6){
            return 2;
        }else if(x <= -0.2 && x > -0.4){
            return 3;
        }else if(x <= 0 && x > -0.2){
            return 4;
        }else if(x <= 0.2 && x > 0){
            return 5;
        }else if(x <= 0.4 && x > 0.2){
            return 6;
        }else if(x <= 0.6 && x > 0.4){
            return 7;
        }else if(x <= 0.8 && x > 0.6){
            return 8;
        }else if(x <= 1 && x > 0.8){
            return 9;
        }else{
            console.log(x);
        }
    }

    function getYGrid(y){
        y = y / 10;
        // grid positions from left-top corner
        // start from higher distances
        if(y >= 35.475){
            return 0;
        }else if(y >= 30.95 && y < 35.475){
            return 1;
        }else if(y >= 26.425 && y < 30.95){
            return 2;
        }else if(y >= 21.9 && y < 26.425){
            return 3;
        }else if(y >= 17.375 && y < 21.9){
            return 4;
        }else if(y >= 12.85 && y < 17.375){
            return 5;
        }else if(y >= 8.325 && y < 12.85){
            return 6;
        }else if(y >= 3.8 && y < 8.325){
            return 7;
        }else if(y >= -0.725 && y < 3.8){
            return 8;
        }else if(y < -0.725){
            return 9;
        }
    }

    function updateHeatMap(shotGrid){
        // Create the legend
        createLegend(max, min);
        fill.domain([min, max]);

        width = 700;
        height = 559;
        gridSquares = [].concat(...shotGrid);
        // console.log("HERE");
        // console.log(gridSquares);

        heatmapSVG.selectAll(".heatRects")
            .data(gridSquares)
            .join(
                function (enter){
                    return enter.append("rect")
                        .attr("width", .10 * width)
                        .attr("height", .10 * height)
                        .style("fill", function(d, i){
                            return fill(d['fg%']);
                        })
                        .style("opacity", "50%")
                        .attr("class", "heatRect")
                        .attr("y", function(d){
                            return d['y']/10 * height;
                        })
                        .attr("x", function(d){
                            return d['x']/10 * width;
                        });

                },
                function (update){
                    return update
                        .style("opacity", "50%")
                        .style("fill", function(d){
                            return fill(d['fg%']);
                        })
                },
                function (exit){
                    exit.remove();
                }
            );

    }


    init(data);
}