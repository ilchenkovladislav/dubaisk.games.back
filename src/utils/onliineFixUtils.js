export function extractGameVersion(str) {
  const prefix = 'Версия игры:'
  const index = str.indexOf(prefix)

  if (index === -1) {
    return null // Если не найдено
  }

  return str.substring(index + prefix.length).trim()
}
