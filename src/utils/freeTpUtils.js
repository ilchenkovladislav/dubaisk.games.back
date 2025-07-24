export function extractFreetpGameTitle(input) {
  const regex = /^(.+?)\s+(игра(?:ть)?|по\s+сети)/i
  const match = input.match(regex)
  return match ? match[1].trim() : null
}

export function getDifferenceByTitle(arr1, arr2) {
  const titles2 = new Set(arr2.map((obj) => obj.title))
  return arr1.filter((obj) => !titles2.has(obj.title))
}

export function extractVersion(str) {
  if (!str) return null
  // Удаляем расширение .torrent и лишние пробелы
  const cleanStr = str.replace(/\.torrent$/, '').trim()

  const patterns = [
    // v1.19.e - версии с буквой после точки
    /\bv(\d+\.\d+\.[a-z])\b/i,

    // v1.2.3.4.5 - многосегментные версии с точками
    /\bv(\d+(?:\.\d+){2,})\b/i,

    // v1.2.3 - стандартные версии с точками
    /\bv(\d+\.\d+\.\d+)\b/i,

    // v1.2 - двухсегментные версии
    /\bv(\d+\.\d+)\b/i,

    // v.80H - версии с буквами после точки
    /\bv\.(\d+[A-Z]+)\b/i,

    // #201773 - версии с префиксом #
    /#(\d+)\b/i,

    // b677386 - версии с префиксом b
    /b(\d+)\b/i,

    // v1.0 - простые версии
    /\bv(\d+)\b/i,
  ]

  for (const pattern of patterns) {
    const match = cleanStr.match(pattern)
    if (match) {
      return match[1]
    }
  }

  return null
}
