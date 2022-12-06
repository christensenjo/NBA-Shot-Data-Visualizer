

// Returns the percentile from the data.
function getPercentileRank(array, value) {
    let count = 0
    for (element of array) {
        if (element <= value) {
            count++
        }
    }
    return count / array.length
}

// The 2D array contains five separate arrays for points, rebounds, salary, height, and weight.
// The 1D array contains five corresponding values.
// The function returns five percentile values.
function getMultiplePercentileRanks(twoDArray, oneDArray) {
    let percentRanks = []
    for (let i = 0; i < twoDArray.length; i++) {
        let percentRank = getPercentileRank(twoDArray[i], oneDArray[i])
        percentRanks.push(percentRank)
    }
    return percentRanks
}

function percentileIsInRange(percentile) {
    return percentile >= 0 & percentile <= 1
}

// Returns a data point given a percentile and data.
function getPercentile(array, percentile) {
    console.assert(percentileIsInRange(percentile), 'Input should be between 0 and 1')

    // The function argument is needed for numeric sort.
    array.sort(
        (a,b) => {
            return a - b
        }
    )
    // console.log('sorted', array)
    let index = percentile * (array.length - 1)
    // console.log(index)
    index = Math.round(index)
    // console.log(index)
    return array[index]
}

