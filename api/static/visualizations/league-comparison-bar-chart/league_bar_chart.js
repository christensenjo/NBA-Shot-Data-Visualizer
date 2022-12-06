/*
File Summary: Complete implementation of the league-comparison-bar-chart in JavaScript and D3.
 */

function getTranslateString(x, y) {
    return 'translate(' + x + ', ' + y + ')'
}

function valueIsInRange(val, minVal, maxVal) {
    return val >= minVal & val <= maxVal
}

twoNumbersAreEqual = (num1, num2) => {
    return Math.abs(num1 - num2) < Number.EPSILON;
}

threeNumbersAreEqual = (num1, num2, num3) => {
    return twoNumbersAreEqual(num1, num2) & twoNumbersAreEqual(num2, num3)
}

modifyHtmlIdForm = (id) => {
    return '#' + id
}

class LeagueCompBarChart {
    constructor(width, height, divElementName, yLabels=['Points', 'Rebounds', 'Salary', 'Height', 'Weight']) {
        // The data fed in should contain the percentiles (not sure how many).
        this.initialize(width, height, divElementName, yLabels)
    }

    initialize = (width, height, divElementName, yLabels) => {
        this.width = width
        this.height = height
        this.divElementName = divElementName
        this.yLabels = yLabels;
        this.barSpacing = 15

        this.percentileTextId = 'percentile-text'
        this.actualValueTextId = 'actual-value-text'

        this.setAxesStartAndEnd()
        this.createSVGInstance(this.divElementName)
        this.createXScale()
        this.createYScale()
        this.createXAxisLabel()
        this.drawGrayBars()
        this.setGrayBarInteractions()
        this.drawWhiteQuartileLines()
        this.createInitialPercentileTextElement()
        this.createInitialActualValueTextElement()
        this.updateTextOnMouseMovement()
        this.makeDataRequest()
    }

    makeDataRequest = async () => {
        // /players/getPlayerData/playerName
        // let endpoint = 'http://' + window.location.host + '/players/getPlayerData/?playerName=' + document.getElementById('player').value + '&start_date=' + document.getElementById('start_date').value + '&end_date=' + document.getElementById('end_date').value
        let endpoint = 'http://' + window.location.host + '/players/getPlayerData/' + document.getElementById('player').value
        console.log('endpoint', endpoint)
        await fetch(endpoint)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                this.data = data;
                // console.log(this.data);
            })
    }

    createInitialPercentileTextElement = () => {
        let xRange = this.xAxisEnd - this.xAxisStart
        let x1 = xRange / 4 + this.xAxisStart
        this.createText(x1, 25, 15, this.percentileTextId, 'Percentile:')
    }

    createInitialActualValueTextElement = () => {
        let xRange = this.xAxisEnd - this.xAxisStart
        let x2 = xRange / 1.8 + this.xAxisStart
        this.createText(x2, 25, 15, this.actualValueTextId, 'Actual Value:')
    }

    createText = (x, y, fontSize, id, text) => {
        this.svg.append('text').attr('x', x).attr('y', y).attr('font-size', fontSize).attr('id', id).text(text)
    }

    getActualValueFromPercentileAndYLabel = (percentile, yLabel) => {
        let index = this.yLabels.indexOf(yLabel)
        let array = this.twoDArray[index]
        return getPercentile(array, percentile)
    }

    updateTextOnMouseMovement = () => {
        d3.select('svg').on('mousemove', (event) => {

            // Get the current x and y location of the mouse.
            let pointer = d3.pointer(event)
            let x = pointer[0]
            let y = pointer[1]

            // Locate the percentile and the actual value.
            let percentile = this.xScale.invert(x).toFixed(3)
            let yLabel = this.getYLabelBarThatMouseIsIn(y)

            // If the mouse isn't in a bar or the percentile exceeds its range, we don't include values.
            let percentileInRange = valueIsInRange(percentile, 0, 1)
            let percentileText
            let actualValueText
            if (yLabel === undefined || !percentileInRange) {
                percentileText = `Percentile:`
                actualValueText = `Actual Value:`
            }

            // Otherwise, we use actual values.
            else {
                let actualValue = this.getActualValueFromPercentileAndYLabel(percentile, yLabel)
                percentileText = `Percentile: ${percentile}`
                actualValueText = `Actual Value: ${actualValue}`
            }

            // Set the HTML elements.
            d3.select(modifyHtmlIdForm(this.percentileTextId)).text(percentileText)
            d3.select(modifyHtmlIdForm(this.actualValueTextId)).text(actualValueText)
            }
        )
    }

    updateChart = (twoDArray, oneDArray) => {
        // These are saved so that the tooltip can access them later.
        this.twoDArray = twoDArray
        this.oneDArray = oneDArray
        console.assert(threeNumbersAreEqual(this.twoDArray.length, this.oneDArray.length, this.yLabels.length), 'The numbers must be equal')
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

    // Returns the boundaries of the bars as a nested list of [top, bottom].
    getBarYCoordinateBoundaries = () => {
        let locations = []
        for (let yLabel of this.yLabels) {
            let startY = this.getBarStartingYLocation(yLabel)
            let endY = startY + this.barWidth
            locations.push([startY, endY])
        }
        return locations
    }

    // Note: This function will return undefined if the mouse is not in a bar.
    getYLabelBarThatMouseIsIn = (mouseY) => {
        let boundaries = this.getBarYCoordinateBoundaries()
        for (let i = 0; i < boundaries.length; i++) {
            let boundary = boundaries[i]
            let inRange = valueIsInRange(mouseY, boundary[0], boundary[1])
            if (inRange) {
                return this.yLabels[i]
            }
        }
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
        this.yAxisEnd = 30;
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

    createXAxisLabel = () => {
        this.createText(this.xAxisEnd / 2, this.yAxisStart + 32, 12, 'percentile', 'Percentile')
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

