import * as cheerio from 'cheerio'
import { extractGameVersion } from '../utils/onliineFixUtils.js'

export function parseOnlineFixVersionGame(htmlData) {
  const $ = cheerio.load(htmlData)
  const elements = $(
    "article div[itemprop='articleBody'] .quote div[style='text-align:center;'] > b",
  ).toArray()

  return extractGameVersion($(elements[0]).prop('textContent'))
}
