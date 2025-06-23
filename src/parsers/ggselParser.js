import * as cheerio from 'cheerio'

const GGSEL_BASE_URL = 'https://ggsel.net'
const MAX_ITEMS = 3

function extractText($element, selector) {
  return $element.find(selector).text().trim()
}

function extractInt($element, selector) {
  const text = extractText($element, selector)
  const digits = text.replace(/[^\d]/g, '')
  return digits ? parseInt(digits, 10) : null
}

function parseGGSelItem(element, $) {
  const $el = $(element)
  const relativeLink = $el.find('[data-test="link"]').attr('href') || ''
  return {
    link: `${GGSEL_BASE_URL}${relativeLink}`,
    title: extractText($el, '[class*=ProductCard_description__] span'),
    price: extractInt($el, '[data-test="price"]'),
    stats: extractInt($el, '[data-test="stat"]'),
  }
}

export function parseGGSelData(html) {
  if (!html) return []

  const $ = cheerio.load(html)
  return $('[data-test="item"]')
    .toArray()
    .slice(0, MAX_ITEMS)
    .map((el) => parseGGSelItem(el, $))
}
