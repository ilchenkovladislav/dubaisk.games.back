import 'dotenv/config'
import { onlinefixTable } from './src/db/schema.js'
import { fetchPage, parsePage, delay } from './src/utils/parseUtils.js'
import { getExistingGames, saveGamesToDatabase } from './src/utils/dbUtils.js'

const NETWORK_SUFFIX = ' по сети'
const MAX_PAGES = 5
const BASE_URL = 'https://online-fix.me'
const REQUEST_DELAY = 1000
const EXCLUDED_GAMES = ['DayZ (DayZavr)']

const SELECTORS = {
  articles: '.news .article',
  link: '.big-link',
  title: '.title',
}

const REQUEST_OPTIONS = {
  responseType: 'arraybuffer',
}

const isGameExcluded = (gameTitle) => EXCLUDED_GAMES.includes(gameTitle)

const isGameInDatabase = (gameTitle, existingGames) =>
  existingGames.some((dbGame) => dbGame.title === gameTitle)

function extractCleanGameName(title) {
  const cleanTitle = title.trim()

  if (cleanTitle.endsWith(NETWORK_SUFFIX)) {
    return cleanTitle.slice(0, -NETWORK_SUFFIX.length)
  }

  return cleanTitle
}

function extractGameInfo(element) {
  const link = element.find(SELECTORS.link).attr('href') ?? ''
  const rawTitle = element.find(SELECTORS.title).text()

  return {
    link,
    title: extractCleanGameName(rawTitle),
  }
}

async function parseSinglePage(pageNumber) {
  const url = `${BASE_URL}/page/${pageNumber}`
  const { data } = await fetchPage(url, REQUEST_OPTIONS)

  return parsePage(data, SELECTORS.articles, extractGameInfo, 'win1251')
}

function processGames(pageGames, existingGames) {
  const newGames = []
  let shouldStop = false

  for (const game of pageGames) {
    if (isGameExcluded(game.title)) {
      continue
    }

    if (isGameInDatabase(game.title, existingGames)) {
      shouldStop = true
      break
    }

    newGames.push(game)
  }

  return { newGames, shouldStop }
}

export async function parseOnlineFixGames() {
  const existingGames = await getExistingGames(onlinefixTable)
  const allNewGames = []
  let shouldStop = false

  for (let currentPage = 1; currentPage <= MAX_PAGES && !shouldStop; currentPage++) {
    try {
      const pageGames = await parseSinglePage(currentPage)
      const { newGames, shouldStop: stopFlag } = processGames(pageGames, existingGames)

      allNewGames.push(...newGames)
      shouldStop = stopFlag

      if (currentPage < MAX_PAGES) {
        await delay(REQUEST_DELAY)
      }
    } catch (error) {
      console.error(`Ошибка при парсинге страницы ${currentPage}:`, error)
      break
    }
  }

  await saveGamesToDatabase(onlinefixTable, allNewGames)

  return {
    totalFound: allNewGames.length,
    games: allNewGames,
  }
}

parseOnlineFixGames()
  .then((result) => {
    console.log(`Парсинг завершен. Найдено ${result.totalFound} новых игр.`)
    process.exit(0)
  })
  .catch((error) => {
    console.error('Ошибка при парсинге:', error)
    process.exit(1)
  })
