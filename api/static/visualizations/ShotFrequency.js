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
    }

    updateAxis = function() {

        console.log(this.data)

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
        console.log(this.data)
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

        this.svg.selectAll(".total").data(this.data)
            .join("path")
            .transition().duration(1000)
            .attr("d", `${line(this.data)},${this.size.height},${this.size.height-1},1,${this.size.height-1}`)
            .attr("class", "line total")

        this.svg.selectAll(".made").data(this.data)
            .join("path")
            .transition().duration(1000)
            .attr("d", `${made_line(this.data)},${this.size.height},${this.size.height-1},1,${this.size.height-1}`)
            .attr("class", "line made")
    }
}