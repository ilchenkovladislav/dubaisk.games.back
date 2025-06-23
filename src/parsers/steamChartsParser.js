import * as cheerio from 'cheerio'
import { SELECTORS, APP_STATS_INDICES, MONTHLY_STATS_INDICES } from '../constants/selectors.js'
import { SteamChartsParsingError } from '../errors/SteamChartsError.js'
import { parseNumber } from '../utils/numberParser.js'

/**
 * Извлекает статистику приложения из DOM
 * @param {CheerioAPI} $ - Cheerio instance
 * @returns {Object} Объект со статистикой приложения
 */
export function extractAppStats($) {
  const elements = $(SELECTORS.APP_STATS).toArray()

  if (elements.length < 3) {
    throw new SteamChartsParsingError(
      `Expected 3 app stat elements, got ${elements.length}`,
      SELECTORS.APP_STATS,
    )
  }

  const texts = elements.map((el) => $(el).text().trim())

  return {
    playersOnline: parseNumber(texts[APP_STATS_INDICES.PLAYERS_ONLINE]),
    todayPeakPlayers: parseNumber(texts[APP_STATS_INDICES.TODAY_PEAK]),
    allTimePeakPlayers: parseNumber(texts[APP_STATS_INDICES.ALL_TIME_PEAK]),
  }
}

/**
 * Извлекает месячную статистику из таблицы
 * @param {CheerioAPI} $ - Cheerio instance
 * @returns {Object} Объект с месячной статистикой
 */
export function extractMonthlyStats($) {
  const rowElements = $(SELECTORS.MONTHLY_STATS_ROW).first().children().toArray()

  if (rowElements.length < 5) {
    throw new SteamChartsParsingError(
      `Expected at least 5 monthly stat columns, got ${rowElements.length}`,
      SELECTORS.MONTHLY_STATS_ROW,
    )
  }

  const texts = rowElements.map((el) => $(el).text().trim())

  return {
    averagePlayersCount: parseNumber(texts[MONTHLY_STATS_INDICES.AVERAGE_PLAYERS]),
    monthlyPlayersChange: Math.round(parseNumber(texts[MONTHLY_STATS_INDICES.MONTHLY_CHANGE])),
    monthlyChangePercentage: Math.round(
      parseNumber(texts[MONTHLY_STATS_INDICES.CHANGE_PERCENTAGE], true),
    ),
    monthlyPeakPlayers: parseNumber(texts[MONTHLY_STATS_INDICES.MONTHLY_PEAK]),
  }
}

/**
 * Парсит HTML SteamCharts и извлекает игровую статистику
 * @param {string} htmlData - HTML контент страницы
 * @returns {Object} Объект с полной статистикой игры
 */
export function parseSteamChartsData(htmlData) {
  const $ = cheerio.load(htmlData)

  const appStats = extractAppStats($)
  const monthlyStats = extractMonthlyStats($)

  return {
    playersOnline: appStats.playersOnline,
    todayPeakPlayers: appStats.todayPeakPlayers,
    allTimePeakPlayers: appStats.allTimePeakPlayers,
    averagePlayersCount: monthlyStats.averagePlayersCount,
    monthlyPlayersChange: monthlyStats.monthlyPlayersChange,
    monthlyChangePercentage: monthlyStats.monthlyChangePercentage,
    monthlyPeakPlayers: monthlyStats.monthlyPeakPlayers,
  }
}
