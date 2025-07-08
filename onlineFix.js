import 'dotenv/config'
import axios from 'axios'
import * as cheerio from 'cheerio'
import iconv from 'iconv-lite'
import { db } from './src/db/index.js'
import { onlinefixTable } from './src/db/schema.js'

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function extractName(title) {
  const networkPart = ' по сети'

  const name = title.trim()
  if (name.endsWith(networkPart)) {
    return name.slice(0, name.length - networkPart.length)
  }

  return name
}

export async function parseOnlineFixGames() {
  const games = []
  const maxPages = 74
  const dbGames = await db.select().from(onlinefixTable)
  let flag = false

  for (let index = 1; index <= maxPages; index++) {
    if (flag) break

    const { data } = await axios.get(`https://online-fix.me/page/${index}`, {
      responseType: 'arraybuffer',
    })

    const $ = cheerio.load(iconv.decode(data, 'win1251'))

    const pageGames = $('.news .article')
      .toArray()
      .map((el) => {
        return {
          link: $(el).find('.big-link').attr('href') ?? '',
          title: extractName($(el).find('.title').text()),
        }
      })

    for (const game of pageGames) {
      if (game.title === 'DayZ (DayZavr)') continue

      if (dbGames.some((dbGame) => dbGame.title === game.title)) {
        flag = true
        break
      }

      games.push(game)
    }

    if (index < maxPages) {
      await delay(1000)
    }
  }

  if (games.length) {
    console.log(games)
    await db.insert(onlinefixTable).values(games)
  }
}

parseOnlineFixGames()
