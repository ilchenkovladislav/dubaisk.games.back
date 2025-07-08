import axios from 'axios'
import * as cheerio from 'cheerio'
import iconv from 'iconv-lite'

export async function fetchPage(url, options) {
  try {
    return await axios.get(url, options)
  } catch (e) {
    console.log(e)
  }
}

export function parsePage(page, elSelector, parseFn, charset = 'utf-8') {
  let $ = null

  switch (charset) {
    case 'win1251':
      $ = cheerio.load(iconv.decode(page, 'win1251'))
      break
    default:
      $ = cheerio.load(page)
      break
  }

  return $(elSelector)
    .toArray()
    .map((el) => parseFn($(el)))
}

export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
