class HeatMap {
    constructor(selector, dataPath){
        this.selector = selector;
        this.dataPath = dataPath;
        this.data = [];
        this.shotGrid = [];
        this.gridSquares = [];
        this.height = 559;
        this.width = 700;
        this.svg = d3.select(selector).append("g");

        // Legend Setup Members
        this.colors = ["#80000F", "#BF0071", "#FF05FF", "#BC44FF",
            "#A488FF"];
        this.fillRange = [];
        this.legendWidth = this.width / 5;
        this.legendHeight = 30;
        this.max = 0;
        this.min = 100000000;
        for(let i = 0; i <= this.colors.length; i++){
            this.fillRange.push(this.legendWidth/this.colors.length * i);
        }
        this.fill = d3.scaleQuantile().range(this.colors);
        this.axisScale = d3.scaleQuantile().range(this.fillRange);
    }

    updateLegend(){
        console.log("Implement Legend");
    }

    updateChart(){
        this.fill.domain([this.min, this.max]);
        this.gridSquares = [].concat(...this.shotGrid);

        this.svg.selectAll(".heatRects")
            .data(this.gridSquares)
            .join(
                enter => enter.append("rect")
                    .attr("width", .10 * this.width)
                    .attr("height", .10 * this.height)
                    .style("fill", function(d, i){
                        if(d['fg%'] === undefined){
                            return "none";
                        }
                        return this.fill(d['fg%']);
                    })
                    .style("opacity", "50%")
                    .attr("class", "heatRect")
                    .attr("y", function(d){
                        return d['y']/10 * height;
                    })
                    .attr("x", function(d){
                        return d['x']/10 * width;
                    }),
                update => update
                    .style("opacity", "50%")
                    .style("fill", function(d){
                        if(d['fg%'] === undefined){
                            return "none";
                        }
                        return this.fill(d['fg%']);
                    }),
                exit => exit.remove()
            );
    }

    async fetchData(){
        fetch('http://' + window.location.host + '/shots/get/?player=' + document.getElementById('player').value + '&start_date=' + document.getElementById('start_date').value + '&end_date=' + document.getElementById('end_date').value)
            .then(response => response.json())
            .then(data => {
                    this.data = data;
                }
            );

        // TODO: implement post data fetch to replace above get fetch
        // if(!this.dataPath){
        //     this.data = [];
        //     return;
        // }
        // this.data = await d3.json(this.dataPath, function(data){
        //     return data;
        // });

        //Data Transformation and Handling
        for(let i = 0; i < 10; i++){
            this.shotGrid[i] = new Array(10);

            for(let j = 0; j < 10; j++){
                this.shotGrid[i][j] = {"x": i, "y": j};
            }
        }

        this.data.forEach(function(d){
            let x = d['location_x'];
            let xGrid = getXGrid(x);

            let y = d['location_y'];
            let yGrid = getYGrid(y);

            let made = d['is_made'];
            let currentAttempts;
            if('attempts' in this.shotGrid[xGrid][yGrid]){
                currentAttempts = this.shotGrid[xGrid][yGrid]['attempts'];
            }else{
                currentAttempts = 0;
            }
            let currentMade;
            if('made' in this.shotGrid[xGrid][yGrid]){
                currentMade = this.shotGrid[xGrid][yGrid]['made'];
            }else{
                currentMade = 0;
            }
            let newFG = ((currentMade + 1)/(currentAttempts + 1));
            if(newFG > this.max){
                this.max = newFG;
            }
            if(newFG < this.min){
                this.min = newFG;
            }
            if(made){
                this.shotGrid[xGrid][yGrid]['attempts'] = currentAttempts + 1;
                this.shotGrid[xGrid][yGrid]['made']  = currentMade + 1;
                this.shotGrid[xGrid][yGrid]['fg%'] = newFG;
            }else{
                this.shotGrid[xGrid][yGrid]['attempts'] = currentAttempts + 1;
                this.shotGrid[xGrid][yGrid]['made']  = currentMade;
                this.shotGrid[xGrid][yGrid]['fg%'] = newFG;
            }
        });
    }

    getXGrid(x){
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

    getYGrid(y){
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

    async update(){
        await this.fetchData();
        this.updateLegend();
        this.updateChart();
    }

}