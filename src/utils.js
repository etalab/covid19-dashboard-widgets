export const capitalize = function (string) {
  if (string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }
}

export const convertStringToLocaleNumber = function (string) {
  return parseInt(string).toLocaleString()
}

export const convertFloatToHuman = function (float) {
  if (Number.isInteger(parseFloat(float))) {
    return parseInt(float).toLocaleString()
  } else {
    return parseFloat(float).toFixed(1).toLocaleString()
  }
}

export const convertDateToHuman = function (string) {
  const date = new Date(string)
  return date.toLocaleDateString('fr-FR')
}

export const testIfNaN = function (float) {
  return isNaN(parseFloat(float))
}

export const mixin = {
  methods: {
    capitalize,
    convertStringToLocaleNumber,
    convertFloatToHuman,
    convertDateToHuman,
    testIfNaN
  }
}
