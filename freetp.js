import 'dotenv/config'
import axios from 'axios'
import * as cheerio from 'cheerio'
import iconv from 'iconv-lite'
import { db } from './src/db/index.js'
import { freetpTable } from './src/db/schema.js'
import { extractFreetpGameTitle, getDifferenceByTitle } from './src/utils/freeTpUtils.js'

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function main() {
  const startPage = 1
  const maxPages = 5
  const dbFreetpGames = await db.select().from(freetpTable)

  const games = []

  for (let i = startPage; i <= maxPages; i++) {
    const url = `https://freetp.org/po-seti/page/${i}/`

    const { data } = await axios.get(url, {
      responseType: 'arraybuffer',
    })

    const $ = cheerio.load(iconv.decode(data, 'win1251'))
    const freetpGames = $('.base .header-h1 a')
      .toArray()
      .map((el) => {
        return {
          title: extractFreetpGameTitle($(el).text()),
          link: $(el).attr('href'),
        }
      })
      .filter((game) => game.title)

    games.push(...freetpGames)

    if (i < maxPages) {
      await delay(1000)
    }
  }

  const newGames = getDifferenceByTitle(games, dbFreetpGames)
  if (newGames.length) {
    console.log(newGames)
    await db.insert(freetpTable).values(newGames)
  }
}

main()
