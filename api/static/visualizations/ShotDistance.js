import * as utils from "./utils.js";
import {D3Chart} from "./D3Chart.js";

export class ShotDistance extends D3Chart {
    buildAxis = function() {

        this.xDomain = []
        this.yDomain = []

        this.axis.xScale = d3.scaleLinear()
            .domain(this.xDomain)  // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
            .range([0, this.size.width]);
        //
        this.axis.yScale = d3.scaleLinear()
            .domain(this.yDomain)
            .range([this.size.height, 0])

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

        console.log(this.data)
        let data = this.data

        this.axis.xScale.domain([0, d3.max(data, function(d) { return d.distance })])

        let x = this.axis.xScale
        let histogram = d3.histogram()
            .value(function(d) { return d.distance; })   // I need to give the vector of value
            .domain(x.domain())  // then the domain of the graphic
            .thresholds(x.ticks(40)); // then the numbers of bins


        this.bins = histogram(this.data)
        let bins = this.bins

        this.axis.yScale.domain([0, d3.max(bins, function(d) { return d.length; }) + 50])

    }

    // The bulk of the logic. It actually takes the data in
    // It should set all things into the axis object
    updateChart = function() {
        let xScale = this.axis.xScale
        let yScale = this.axis.yScale

        let height = this.size.height

        this.axis.xAxis.transition().duration(1000).call(this.axis.x)
        this.axis.yAxis.transition().duration(1000).call(this.axis.y)

        let data = this.bins

        console.log(data)

        this.svg.selectAll("rect").data(data)
            .join("rect")
            .attr("x", 1)
            .attr("transform", function(d) { return "translate(" + xScale(d.x0) + "," + (yScale(d.length)) + ")"; })
            .attr("width", function(d) { return xScale(d.x1) - xScale(d.x0) -1 ; })
            .attr("height", function(d) { return height - yScale(d.length); })
            .style("fill", "#198754")
            .on("mouseover", function(d) {
                d3.select(this)
                    .style("fill", "#157347");
            })
            .on("mouseleave", function(d) {
                d3.select(this)
                    .style("fill", "#198754");
            });

    }
}