import { ok, err } from 'neverthrow'

import { fetchSteamChartsData } from '../services/steamChartsService.js'
import { parseSteamChartsData } from '../parsers/steamChartsParser.js'
import { SteamChartsParsingError } from '../errors/SteamChartsError.js'

/**
 * Получает онлайн-статистику игры из SteamCharts
 * @param {string|number} gameId - ID игры в Steam
 * @returns {Promise<object>} объект с данными об игре
 * @throws {Error} При ошибке запроса или парсинга данных
 */
export async function getGameOnline(gameId) {
  const htmlData = await fetchSteamChartsData(gameId)

  return htmlData.match(
    (data) => ok(parseSteamChartsData(data)),
    (error) => {
      console.error(`Error in getGameOnline for ID ${gameId}:`, error)

      if (error instanceof SteamChartsParsingError) {
        return err(error)
      }

      return err(new Error(`Unable to retrieve game statistics for ID ${gameId}`))
    },
  )
}
