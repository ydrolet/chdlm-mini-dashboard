"use strict"

/**
 * Convert spreadsheet column index (starting at zero) to letter notation (e.g. "AC", "BW", etc.)
 *
 * Credit: https://stackoverflow.com/a/21231012
 */
function columnIndexToLetterNotation(columnIndex) {
  let temp, letterNotation = ''

  while (columnIndex > 0) {
    temp = columnIndex % 26
    letterNotation = String.fromCharCode(temp + 65) + letterNotation
    columnIndex = (columnIndex - temp - 1) / 26
  }

  return letterNotation
}


/**
 * Convert spreadsheet letter notation (e.g. "AC", "BW", etc.) to column index (starting at zero)
 *
 * Credit: https://stackoverflow.com/a/21231012
 */
function letterNotationToColumnIndex(letterNotation) {
  let columnIndex = 0

  for (let i = 0; i < letterNotation.length; i++) {
    columnIndex += (letterNotation.toUpperCase().charCodeAt(i) - 64) * Math.pow(26, letterNotation.length - i - 1)
  }

  return columnIndex - 1
}


/**
 * Credit: https://stackoverflow.com/a/14810722
 */
function objectMap(obj, fn) {
  return Object.fromEntries(
    Object.entries(obj).map(
      ([k, v], i) => [k, fn(v, k, i)]
    )
  )
}


function dateReviver(key, value) {
  return typeof value === 'string' && Date.parse(value) !== NaN ? new Date(value) : value
}
