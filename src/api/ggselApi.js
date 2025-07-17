import { fetchStealthGGselData } from '../services/ggselService.js'
import { parseGGSelData } from '../parsers/ggselParser.js'
import { ok, err } from 'neverthrow'

export async function getGGSelGames(query) {
  const data = await fetchStealthGGselData(query)

  return data.match(
    (data) => ok(parseGGSelData(data)),
    (error) => {
      console.error('Error in getGGSelGames:', error)
      return err(error)
    },
  )
}
