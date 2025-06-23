import axios from 'axios'
import { ResultAsync } from 'neverthrow'

const GGSEL_BASE_URL = 'https://ggsel.net'

/**
 * Fetches search results from GGsel by query.
 * @param {string} query - The search query.
 * @returns {ResultAsync<string, Error>} - ResultAsync containing HTML string or Error.
 */
export function fetchGGSelData(query) {
  const url = `${GGSEL_BASE_URL}/search/${encodeURIComponent(query)}`

  return ResultAsync.fromPromise(
    axios.get(url).then((response) => response.data),
    (error) => new Error(`Failed to fetch data from GGsel: ${error?.message ?? 'Unknown error'}`),
  )
}
