export function bucket(data, key, bucket) {
    let newData = []
    data.forEach(function(d) {
        let currentVal = d
        currentVal[key] = Math.floor(currentVal[key] / bucket) * bucket
        newData.push(currentVal)
    });
    return newData
}

export function groupBy(data, grouper, key) {

    let result = data.reduce(function(acc, obj) {
        if (acc.map.hasOwnProperty(obj[grouper])) {
            acc.map[obj[grouper]][key] += +obj[key];
        } else {
            var newObj = Object.assign({}, obj);
            acc.map[obj[grouper]] = newObj;
            acc.data.push(newObj);
        }
        return acc;
    }, {
        data: [],
        map: {}
    }).data;
    return result;
}

export function clean(data, grouper, key, step) {
    let result = []
    let i = 0
    let max = Math.max(...data.map(o => o[grouper]))
    data.forEach(function(d) {
        while(i < d[grouper]) {
            let newData = {}
            newData[grouper] = i
            newData[key] = 0
            result.push(newData)
            i += step
        }
        result.push(d)
    });
    return result
}