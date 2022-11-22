

class LeagueCompBarChart {
    constructor(width, height, divElementName) {
        // The data fed in should contain the percentiles (not sure how many).
        this.width = width
        this.height = height
        this.divElementName = divElementName
        this.yLabels = ['Points', 'Rebounds', 'Salary', 'Height', 'Weight'];
        this.initialize()
    }

    initialize = () => {
        this.setAxesStartAndEnd()
        this.createSVGInstance(this.divElementName)
        this.createXScale()
        this.createYScale()
        this.createXAxisLabel()
        this.drawGrayBars()
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

    drawGrayBars = () => {
        let spacing = this.getYAxisSpacing()
        for (let yLabel of this.yLabels) {
            let y = this.yScale(yLabel)
            let length = this.xAxisEnd - this.xAxisStart
            this.drawRect(this.xAxisStart, y+spacing, length, 30, 'lightgray')
        }
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

    drawGreenBars = (percentRankArray) => {
        let spacing = this.getYAxisSpacing()
        for (let i = 0; i < percentRankArray.length; i++) {
            let x = this.xScale(percentRankArray[i])
            let y = this.yScale(this.yLabels[i])
            this.drawSmallRect(x, y+spacing, 'green', 'green')
        }
    }

    drawSmallRect = (x, y, color, cssClass) => {
        this.drawRect(x, y, 3, 30, color, cssClass)
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

    drawBars = () => {
        // Calculate the y-axis height of each bar based on the data.
        let range = yScale.range()
        let barHeight = (range[1] - range[0]) / scores.length;

        for (let i = 0; i < scores.length; i++) {
            let endingXValue = xScale(scores[i])
            let barWidth = endingXValue - xAxisStart;
            let y = yScale(yLabels[i])
            svg.append('rect').attr('x', xAxisStart).attr('y', y).attr('width', barWidth).attr('height', barHeight);
        }
    }

    createInteraction = () => {
        d3.selectAll('.bar').on('mouseover', mouseOverBar).on('mouseleave', mouseLeaveBar)
    }

    static mouseOverBar() {
        d3.select(this).style('fill', 'red');
    }

    static mouseLeaveBar() {
        d3.select(this).style('fill', '#1e99e7');
    }

}

function drawPlot(width, height, divElementName, twoDArray, oneDArray) {
    let percentiles = getMultiplePercentileRanks(twoDArray, oneDArray)
    let barChart = new LeagueCompBarChart(width, height, divElementName, percentiles)
}

