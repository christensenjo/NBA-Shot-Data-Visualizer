

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

