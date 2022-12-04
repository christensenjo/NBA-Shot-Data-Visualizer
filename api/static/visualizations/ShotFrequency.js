import * as utils from "./utils.js";
import {D3Chart} from "./D3Chart.js";

export class ShotFrequency extends D3Chart {
    buildAxis = function() {

        this.xDomain = []
        this.yDomain = []

        this.axis.xScale = d3.scaleLinear()
            .domain(this.xDomain)
            .range([0, this.size.height])
        //
        this.axis.yScale = d3.scaleLinear()
            .domain(this.yDomain)
            .range([0, this.size.width])

        this.axis.x = d3.axisBottom(this.axis.xScale)
        this.axis.y = d3.axisLeft(this.axis.yScale)

        // creates the x and y SVG elements
        this.axis.xAxis = this.svg.append("g")
            .attr("transform", `translate(0, ${this.size.height})`)
            .attr("class", "xAxis")
            .call(this.axis.x)

        this.axis.yAxis = this.svg.append("g")
            .attr("class", "yAxis")
            .call(this.axis.y)
    }

    updateAxis = function() {

        this.data.reverse()
        this.data.push({
            seconds: 0,
            count: 0
        })
        this.data.reverse()

        this.data = utils.bucket(this.data, "seconds", 100)
        this.data = utils.groupBy(this.data, "seconds", "count")
        this.data = utils.clean(this.data, "seconds", "count", 100)

        this.xDomain = []
        this.data.forEach(element => this.xDomain.push(parseInt(element['seconds'])))

        this.yDomain = []
        this.data.forEach(element => this.yDomain.push(parseInt(element['count'])))

        this.axis.xScale.domain([0, Math.max(...this.xDomain)])
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
                return xScale(d['seconds'])
            })
            .y(function(d) {
                return yScale(d['count'])
            })

        console.log(this.data)

        this.svg.selectAll(".line").data(this.data)
            .join("path")
            .transition().duration(1000)
            .attr("d", `M0,${this.size.height},${line(this.data)}`)
            .attr("class", "line")
    }
}