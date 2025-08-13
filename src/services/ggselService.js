import 'dotenv/config'
import axios from 'axios'
import { ResultAsync } from 'neverthrow'
// import puppeteer from 'puppeteer-extra'
// import StealthPlugin from 'puppeteer-extra-plugin-stealth'

const GGSEL_BASE_URL = 'https://ggsel.net/search'

/**
 * Fetches search results from GGsel by query.
 * @param {string} query - The search query.
 * @returns {ResultAsync<string, Error>} - ResultAsync containing HTML string or Error.
 */
export function fetchGGSelData(query) {
  const url = `${GGSEL_BASE_URL}/${encodeURIComponent(query)}`

  return ResultAsync.fromPromise(
    axios.get(url).then((response) => response.data),
    (error) => new Error(`Failed to fetch data from GGsel: ${error?.message ?? 'Unknown error'}`),
  )
}

/**
 * Fetches search results from GGsel by query using stealth.
 * @param {string} query - The search query.
 * @returns {ResultAsync<string, Error>} - ResultAsync containing HTML string or Error.
 */
export async function fetchStealthGGselData(query) {
  puppeteer.use(StealthPlugin())
  const browser = await puppeteer.launch({ args: ['--no-sandbox'], headless: true })

  const page = await browser.newPage()
  await page.goto(`${GGSEL_BASE_URL}/${query}`)
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const res = await ResultAsync.fromPromise(
    page.content(),
    (error) => new Error(`Failed to fetch data from GGsel: ${error?.message ?? 'Unknown error'}`),
  )

  await browser.close()

  return res
}
