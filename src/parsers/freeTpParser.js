import * as cheerio from 'cheerio'
import { extractVersion } from '../utils/freeTpUtils.js'

export function parseFreeTpVersionGame(htmlData) {
  const $ = cheerio.load(htmlData)
  const elements = $(
    "img[src = '//freetp.org/templates/freetp2/images/download.png'] + a",
  ).toArray()

  return extractVersion($(elements[0]).prop('textContent'))
}
