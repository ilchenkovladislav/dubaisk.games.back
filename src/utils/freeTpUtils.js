export function extractFreetpGameTitle(input) {
  const regex = /^(.+?)\s+(игра(?:ть)?|по\s+сети)/i
  const match = input.match(regex)
  return match ? match[1].trim() : null
}

export function getDifferenceByTitle(arr1, arr2) {
  const titles2 = new Set(arr2.map((obj) => obj.title))
  return arr1.filter((obj) => !titles2.has(obj.title))
}
