export function parseNumber(text, isFloat = false) {
  if (!text || typeof text !== 'string') {
    return 0
  }

  const cleanText = text.replace(/[,\s%]/g, '')
  const parsed = isFloat ? parseFloat(cleanText) : parseInt(cleanText, 10)

  return isNaN(parsed) ? 0 : parsed
}
