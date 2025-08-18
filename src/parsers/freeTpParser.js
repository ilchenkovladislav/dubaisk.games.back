import * as cheerio from 'cheerio'

function extractGameVersion(text) {
  const versionRegex = new RegExp(
    '([\\s_]v[\\d\\.]+[a-zA-Z\\d]*)' + // Формат vX.X.X...
      '|' +
      '(b\\d+[a-zA-Z]*)' + // Формат bXXXX...
      '|' +
      '(Update \\d+)' + // Формат "Update X"
      '|' +
      '(\\d{2}\\.\\d{2}\\.\\d{4})' + // Формат ДД.ММ.ГГГГ
      '|' +
      '(\\d{4}\\.\\d{2}\\.\\d{2})' + // Формат ГГГГ.ММ.ДД
      '|' +
      '(build[\\s_]\\d+)' + // Формат "build X"
      '|' +
      '((?<![a-zA-Z])\\d+\\.\\d+[\\.\\d+a-zA-Z]*)' + // Формат X.X... без букв перед ним
      '|' +
      '(release build \\d+)' + // Формат "release build X"
      '|' +
      '(build-\\d+)' + // Формат "build-X"
      '|' +
      '(v\\d{2})', // Формат vXX (для Lethal Company v72)
    'i',
  ) // 'i' для регистронезависимого поиска

  const match = text.match(versionRegex)

  if (match) {
    // Находим первую непустую группу в результате
    for (let i = 1; i < match.length; i++) {
      if (match[i]) {
        // Удаляем лишние символы, такие как 'v', '_' или пробелы в начале
        return match[i]
          .trim()
          .replace(/^[v_ ]+/i, '')
          .replace('.torrent', '')
      }
    }
  }

  return null // Возвращаем null, если версия не найдена
}

export function parseFreeTpVersionGame(htmlData) {
  const $ = cheerio.load(htmlData)
  let elements = $("img[src = '//freetp.org/templates/freetp2/images/download.png'] + a").toArray()

  if (!elements.length) {
    elements = $('.attachment a').toArray()
  }

  return extractGameVersion($(elements[0]).prop('textContent'))
}
