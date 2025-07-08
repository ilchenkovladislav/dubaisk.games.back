import 'dotenv/config'
import { freetpTable } from './src/db/schema.js'
import { fetchPage, parsePage, delay } from './src/utils/parseUtils.js'
import { extractFreetpGameTitle, getDifferenceByTitle } from './src/utils/freeTpUtils.js'
import { getExistingGames, saveGamesToDatabase } from './src/utils/dbUtils.js'

const MAX_PAGES = 5
const REQUEST_DELAY = 1000
const REQUEST_OPTIONS = {
  responseType: 'arraybuffer',
}

const SELECTORS = {
  articles: '.base .header-h1 a',
}

function extractGameInfo(element) {
  const link = element.attr('href') ?? ''
  const rawTitle = element.text()

  return {
    link,
    title: extractFreetpGameTitle(rawTitle),
  }
}

async function parseSinglePage(pageNumber) {
  const url = `https://freetp.org/po-seti/page/${pageNumber}/`
  const { data } = await fetchPage(url, REQUEST_OPTIONS)

  return parsePage(data, SELECTORS.articles, extractGameInfo, 'win1251')
}

async function parseFreetp() {
  const existingGames = await getExistingGames(freetpTable)
  const games = []

  for (let currentPage = 1; currentPage <= MAX_PAGES; currentPage++) {
    const pageGames = await parseSinglePage(currentPage)
    games.push(...pageGames)

    if (currentPage < MAX_PAGES) {
      await delay(REQUEST_DELAY)
    }
  }

  const newGames = getDifferenceByTitle(games, existingGames)
  await saveGamesToDatabase(freetpTable, newGames)

  return { totalFound: newGames.length }
}

parseFreetp()
  .then((result) => {
    console.log(`Парсинг завершен. Найдено ${result.totalFound} новых игр.`)
    process.exit(0)
  })
  .catch((error) => {
    console.error('Ошибка при парсинге:', error)
    process.exit(1)
  })
