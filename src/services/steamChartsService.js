import { ok, err } from 'neverthrow'
import axios from 'axios'
import { STEAMCHARTS_BASE_URL } from '../constants/selectors.js'

export async function fetchSteamChartsData(gameId) {
  if (!gameId || (typeof gameId !== 'string' && typeof gameId !== 'number')) {
    return err(new Error('Game ID must be a valid string or number'))
  }

  try {
    const response = await axios.get(`${STEAMCHARTS_BASE_URL}/${gameId}`)
    return ok(response.data)
  } catch (error) {
    if (error.response?.status === 404) {
      return err(new Error(`Game with ID ${gameId} not found on SteamCharts`))
    }
    return err(new Error(`Failed to fetch data for game ${gameId}: ${error.message}`))
  }
}
