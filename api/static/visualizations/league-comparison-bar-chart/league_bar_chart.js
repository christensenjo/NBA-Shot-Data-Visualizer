/*
File Summary: Complete implementation of the league-comparison-bar-chart in JavaScript and D3.
 */

function getTranslateString(x, y) {
    return 'translate(' + x + ', ' + y + ')'
}

class LeagueCompBarChart {
    constructor(width, height, divElementName, yLabels=['Points', 'Rebounds', 'Salary', 'Height', 'Weight']) {
        // The data fed in should contain the percentiles (not sure how many).
        this.width = width
        this.height = height
        this.divElementName = divElementName
        this.yLabels = yLabels;
        this.barSpacing = 15
        this.initialize()
    }

    initialize = () => {
        this.setAxesStartAndEnd()
        this.createSVGInstance(this.divElementName)
        this.createXScale()
        this.createYScale()
        this.createXAxisLabel()
        this.drawGrayBars()
        this.setGrayBarInteractions()
        this.drawWhiteQuartileLines()
    }

    updateChart = (twoDArray, oneDArray) => {
        let percentRanks = getMultiplePercentileRanks(twoDArray, oneDArray)
        this.updateGreenBars(percentRanks)
    }

    updateGreenBars = (percentRanks) => {
        this.deleteGreenBars()
        this.drawGreenBars(percentRanks)
    }

    deleteGreenBars = () => {
        d3.selectAll('.green').remove()
    }

    getYAxisSpacing = () => {
        return (this.yAxisStart - this.yAxisEnd) / this.yLabels.length / 4
    }

    drawLine = (x1, x2, y1, y2, color) => {
        this.svg.append('line').attr('x1', x1).attr('x2', x2).attr('y1', y1).attr('y2', y2).style('stroke', color)
    }

    drawWhiteQuartileLines = () => {
        let quartiles = [0.25, 0.5, 0.75]
        for (let val of quartiles) {
            let x = this.xScale(val)
            this.drawLine(x, x, this.yAxisStart, this.yAxisEnd, 'white')
        }
    }

    getBarStartingYLocation = (yLabel) => {
        return this.yScale(yLabel) + (this.barSpacing / 2)  // Centering the bar in its range.
    }

    drawGrayBars = () => {
        let barLength = this.xAxisEnd - this.xAxisStart // Gray bars span the full x-axis
        for (let yLabel of this.yLabels) {
            let y = this.getBarStartingYLocation(yLabel)
            this.drawRect(this.xAxisStart, y, barLength, this.barWidth, 'lightgray', 'gray-bar')
        }
    }

    drawGreenBars = (percentRankArray) => {
        let spacing = this.getYAxisSpacing()
        for (let i = 0; i < percentRankArray.length; i++) {
            let x = this.xScale(percentRankArray[i])
            let y = this.getBarStartingYLocation(this.yLabels[i])
            this.drawRect(x, y, 3, this.barWidth, 'green', 'green-bar')
        }
        this.setGreenBarInteractions()
    }

    setAxesStartAndEnd = () => {
        this.xAxisStart = 60;
        this.xAxisEnd = this.width - 10;
        this.yAxisStart = this.height - 40;
        this.yAxisEnd = 0;
    }

    createSVGInstance = (divElement) => {
        this.svg = d3.select(divElement).append("svg").attr("width", this.width).attr("height", this.height);
    }

    createXScale = () => {
        // Percentiles mean a domain of 0 to 1.
        this.xScale = d3.scaleLinear().domain([0, 1]).range([this.xAxisStart, this.xAxisEnd]).nice();
        this.xAxis = d3.axisBottom(this.xScale);
        this.svg.append('g').attr('transform', getTranslateString(0, this.yAxisStart)).call(this.xAxis);
    }

    createYScale = () => {
        this.yScale = d3.scaleBand().domain(this.yLabels).range([this.yAxisEnd, this.yAxisStart]);
        this.yAxis = d3.axisLeft(this.yScale);
        this.svg.append('g').attr('transform', getTranslateString(this.xAxisStart, 0)).call(this.yAxis);
        this.barWidth = this.yScale.bandwidth() - this.barSpacing // Bar width based on spacing
    }

    createLabel = (x, y, label, fontsize) => {
        this.svg.append('text').attr('x', x).attr('y', y).text(label).attr('font-size', fontsize)
    }

    createXAxisLabel = () => {
        this.createLabel(this.xAxisEnd / 2, this.yAxisStart + 32, 'Percentile', 12)
    }

    drawRect = (x, y, width, height, color, cssClass) => {
        this.svg.append('rect').attr('x', x).attr('y', y).attr('width', width).attr('height', height).style('fill', color).attr('class', cssClass);
    }

    setGreenBarInteractions = () => {
        d3.selectAll('.green-bar').on('mouseover', mouseEnterGreenBar).on('mouseleave', mouseLeaveGreenBar)

        function mouseEnterGreenBar() {
            d3.select(this).style('fill', 'gold');
        }

        function mouseLeaveGreenBar() {
            d3.select(this).style('fill', 'green');
        }
    }

    setGrayBarInteractions = () => {
        d3.selectAll('.gray-bar').on('mouseover', mouseEnterGrayBar).on('mouseleave', mouseLeaveGrayBar)

        function mouseEnterGrayBar() {
            d3.select(this).style('fill', 'red');
        }

        function mouseLeaveGrayBar() {
            d3.select(this).style('fill', 'lightgray');
        }
    }

}

