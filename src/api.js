import axios from 'axios'
import * as cheerio from 'cheerio'
import iconv from 'iconv-lite'
import { extractFreetpGameTitle } from './utils/freeTpUtils.js'

function extractName(title) {
  const networkPart = ' по сети'

  const name = title.trim()
  if (name.endsWith(networkPart)) {
    return name.slice(0, name.length - networkPart.length)
  }

  return name
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function getOnlineFixGames() {
  const games = []
  const maxPages = 74

  for (let index = 1; index <= maxPages; index++) {
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

    games.push(...pageGames)

    if (index < maxPages) {
      await delay(1000)
    }
  }

  return games
}

export async function freeTpOrg() {
  const url = 'https://freetp.org/polnyy-spisok-igr-na-sayte.html'

  const { data } = await axios.get(url, {
    responseType: 'arraybuffer',
  })

  const $ = cheerio.load(iconv.decode(data, 'win1251'))

  return $('#dle-content h5 a')
    .toArray()
    .map((el) => {
      return {
        title: extractFreetpGameTitle($(el).text()),
        link: $(el).attr('href'),
      }
    })
}
