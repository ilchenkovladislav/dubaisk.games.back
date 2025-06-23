export function extractFreetpGameTitle(input) {
  const regex = /^(.+?)\s+(игра(?:ть)?|по\s+сети)/i
  const match = input.match(regex)
  return match ? match[1].trim() : null
}
