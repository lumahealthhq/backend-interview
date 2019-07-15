//normalize a value between min and max to a given minAllowed and maxAllowed
exports.scaleBetween = function (unscaledNum, minAllowed, maxAllowed, min, max) {
  return (maxAllowed - minAllowed) * (unscaledNum - min) / (max - min) + minAllowed;
}

//find min and max value of a property in an array of objects
exports.findMinMax = function (arr, propertyName) {
  let min = arr[0][propertyName], max = arr[0][propertyName];

  for (let i = 1, len=arr.length; i < len; i++) {
      let value = arr[i][propertyName];
      min = (value < min) ? value : min;
      max = (value > max) ? value : max;
  }

  return [min, max];
}