

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function getRandomIntegerArray(min, max, n) {
    let randomArray = []
    for (let i = 0; i < n; i++) {
        let int = getRandomInteger(min, max)
        randomArray.push(int)
    }
    return randomArray
}

// The shape entered in should be like [rows, columns].
function getRandomIntegerMatrix(min, max, shape) {
    let matrix = []
    for (let i = 0; i < shape[0]; i++) {
        let array = getRandomIntegerArray(min, max, shape[1])
        matrix.push(array)
    }
    return matrix
}
