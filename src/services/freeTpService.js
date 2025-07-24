import { ok, err } from 'neverthrow'
import axios from 'axios'

export async function fetchFreeTpGame(link) {
  if (!link) {
    return err(new Error('Нет ссылки на страницу с игрой'))
  }

  try {
    const response = await axios.get(link)
    return ok(response.data)
  } catch (error) {
    return err(new Error(`Failed to fetch data for game ${link}: ${error.message}`))
  }
}
