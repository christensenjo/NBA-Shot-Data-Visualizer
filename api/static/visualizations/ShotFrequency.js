import * as utils from "./utils.js";
import {D3Chart} from "./D3Chart.js";

export class ShotFrequency extends D3Chart {
    buildAxis = function() {

        this.xDomain = []
        this.yDomain = []

        this.axis.xScale = d3.scaleLinear()
            .domain(this.xDomain)
            .range([1, this.size.width])
        //
        this.axis.yScale = d3.scaleLinear()
            .domain(this.yDomain)
            .range([0, this.size.height])

        this.axis.x = d3.axisBottom(this.axis.xScale).ticks(4)
        this.axis.y = d3.axisLeft(this.axis.yScale)

        // creates the x and y SVG elements
        this.axis.xAxis = this.svg.append("g")
            .attr("transform", `translate(0, ${this.size.height})`)
            .attr("class", "xAxis")
            .call(this.axis.x)

        this.axis.yAxis = this.svg.append("g")
            .attr("class", "yAxis")
            .call(this.axis.y)

        let height = this.size.height
        let width = this.size.width

        this.svg.append("text")
            .attr("class", "xlabel")
            .attr("text-anchor", "middle")
            .attr("x", width/2)
            .attr("y", height + 32)
            .text("Period");

        this.svg.append("text")
            .attr("class", "ylabel")
            .attr("text-anchor", "middle")
            .attr("x", -height/2)
            .attr("y", -32)
            .attr("transform", "rotate(-90)")
            .text("Count of Shots");

        let data = [{"title":"Made", "color":"#b2edb2"},{"title":"Missed", "color":"#ffa5a5"}]
        var size = 20
        this.svg.selectAll("mydots")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", -100)
            .attr("y", function(d,i){ return (height - 50) + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("width", size)
            .attr("height", size)
            .style("fill", function(d){ return d["color"]})

        // Add one dot in the legend for each name.
        this.svg.selectAll("mylabels")
            .data(data)
            .enter()
            .append("text")
            .attr("x", -100 + size*1.2)
            .attr("y", function(d,i){ return (height - 50) + i*(size+5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
            .style("fill", function(d){ return d["color"]})
            .text(function(d){ return d["title"]})
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")


        this.tooltip = d3.select(this.selector).append("div")
            .style("position", "absolute")
//            .style("visibility", "hidden")
            .text("I'm a circle!")
            .attr("class", "line-tooltip")
    }

    updateAxis = function() {

        this.xDomain = []
        this.data.forEach(element => this.xDomain.push(parseInt(element['period'])))

        this.yDomain = []
        this.data.forEach(element => this.yDomain.push(parseInt(element['count'])))

        this.axis.xScale.domain([1, Math.max(...this.xDomain)])
        this.axis.yScale.domain([Math.max(...this.yDomain), 0])

    }

    // The bulk of the logic. It actually takes the data in
    // It should set all things into the axis object
    updateChart = function() {
        let xScale = this.axis.xScale
        let yScale = this.axis.yScale

        this.axis.xAxis.transition().duration(1000).call(this.axis.x)
        this.axis.yAxis.transition().duration(1000).call(this.axis.y)

        var line = d3.line()
            .x(function(d) {
                return xScale(d['period'])
            })
            .y(function(d) {
                return yScale(d['count'])
            })

        var made_line = d3.line()
            .x(function(d) {
                return xScale(d['period'])
            })
            .y(function(d) {
                return yScale(d['made_count'])
            })

        let data = this.data
        this.svg.selectAll(".total").data([{}])
            .join("path")
            .transition().duration(1000)
            .attr("d", `${line(this.data)},${this.size.height},${this.size.height-1},1,${this.size.height-1}`)
            .attr("class", "line total")
            .attr("pointer-events", "auto")

        let tooltip = this.tooltip
        this.svg.selectAll(".made").data([{}])
            .join("path")
            .transition().duration(1000)
            .attr("d", `${made_line(this.data)},${this.size.height},${this.size.height-1},1,${this.size.height-1}`)
            .attr("class", "line made")
            .attr("pointer-events", "auto")

        this.svg.selectAll(".dots").data(this.data)
            .join("circle")
            .attr('data-message', function(d){
                return `Period: ${d.period} <br> Shots: ${d.count}<br> Made: ${d.made_count}<br> Missed: ${d.missed_count}<br>`
            })
            .on("mouseover", function(e){
                tooltip.style("display", "initial")
                console.log(e.target.getAttribute('data-message'))
                tooltip.html(e.target.getAttribute('data-message'))
            })
            .on("mousemove", function(event){return tooltip.style("top", (event.pageY-25)+"px").style("left",(event.pageX+5)+"px");})
            .on("mouseout", function(){return tooltip.style("display", "none");})
            .transition().duration(1000)
            .attr("class", "dots")
            .attr("pointer-events", "auto")
            .attr("cx", function(d) {
                return xScale(d.period)
            })
            .attr("cy", function(d) {
                return yScale(d.count)
            })
            .attr("r", 6)



    }
}