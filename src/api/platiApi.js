import { ResultAsync, err, ok } from 'neverthrow'
import axios from 'axios'

export function transformGames(games) {
  return games.map((game) => {
    const { name, url, price_rur, numsold } = game
    return { title: name, link: url, price: price_rur, stats: numsold }
  })
}

export function getPlatiMarketGames(query) {
  const url = 'https://plati.io/api/search.ashx'
  const params = {
    query,
    pagesize: 3,
    response: 'json',
  }

  return ResultAsync.fromPromise(
    axios.get(url, { params }).then((response) => response.data),
    (error) => new Error(`Failed to fetch data from Plati: ${error?.message ?? 'Unknown error'}`),
  ).andThen((games) => {
    if (!games.items) {
      return err(new Error('No games found'))
    }
    return ok(transformGames(games.items))
  })
}
