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


        let height = this.size.height
        let width = this.size.width

        this.svg.append("text")
            .attr("class", "xlabel")
            .attr("text-anchor", "middle")
            .attr("x", width/2)
            .attr("y", height + 32)
            .text("Distance in Feet");

        this.svg.append("text")
            .attr("class", "ylabel")
            .attr("text-anchor", "middle")
            .attr("x", -height/2)
            .attr("y", -32)
            .attr("transform", "rotate(-90)")
            .text("Count of Shots");

        this.point3 = this.svg.append("text")
            .attr("class", "point3-label")
            .attr("text-anchor", "middle")
            .attr("x", -height/2)
            .attr("y", -32)
            .attr("transform", "rotate(-90)")
            .text("3 Point");


        this.tooltip = d3.select(this.selector).append("div")
            .style("position", "absolute")
//            .style("visibility", "hidden")
            .text("I'm a circle!")
            .attr("class", "line-tooltip")
    }

    updateAxis = function() {

        let data = this.data

        this.axis.xScale.domain([0, d3.max(data, function(d) { return d.distance })])

        let x = this.axis.xScale
        let histogram = d3.histogram()
            .value(function(d) { return d.distance; })   // I need to give the vector of value
            .domain(x.domain())  // then the domain of the graphic
            .thresholds(x.ticks(40)); // then the numbers of bins


        this.bins = histogram(this.data)
        let bins = this.bins

        this.axis.yScale.domain([0, d3.max(bins, function(d) { return d.length; }) + 10])

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

        let tooltip = this.tooltip

        this.svg.selectAll("rect").data(data)
            .join("rect")
//            .transition().duration(1000)
            .attr("x", 1)
            .attr("transform", function(d) { return "translate(" + xScale(d.x0) + "," + (yScale(d.length-2)) + ")"; })
            .attr("width", function(d) { return Math.max(xScale(d.x1) - xScale(d.x0),0); })
            .attr("height", function(d) { return Math.max(height - yScale(d.length-2), 0); })
            .style("fill", "#198754")
            .attr("class", ".bar")
            .attr('data-message', function(d){
                return `Shots: ${(d.length)-2} <br> Distance: ${d.x0}`
            })
            .on("mouseover", function(e) {
                d3.select(this).style("fill", "#157347");
                tooltip.style("display", "initial")
                tooltip.html(e.target.getAttribute('data-message'))
                let rect = e.target.getBoundingClientRect()
                let tooltipRect = tooltip.node().getBoundingClientRect()
                tooltip.style("top", (rect.top-35)+"px").style("left",(rect.left-(tooltipRect.width/2)+(rect.width/2))+"px")
            })
            .on("mouseleave", function(e) {
                d3.select(this).style("fill", "#198754");
                tooltip.style("display", "none")
            })

        let d = [{"distance":22}]

        this.svg.selectAll(".point3").data(d)
            .join("rect")
            .attr("x", 1)
            .attr("transform", function(d) { return "translate(" + xScale(d.distance) + "," + 0 + ")"; })
            .attr("width", function(d) { return 1 })
            .attr("height", function(d) { return height })
            .attr("class", "point3")


        this.svg.selectAll(".point3-label").data(d)
            .attr("y", function(d){return xScale(d.distance)})
            .attr("x",-25)
            .attr("width", function(d) { return 1 })
            .attr("height", function(d) { return height })

    }
}