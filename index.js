import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import {
  getPlatiMarketGames,
  // getGGSelGames,
  getOnlineFixByTitle,
  getFreetpByTitle,
  getGameOnline,
} from './src/index.js'
import { NotFoundError, DatabaseError } from './src/errors/ApiErrors.js'
import { SteamChartsParsingError } from './src/errors/SteamChartsError.js'
import { getFreeTpVersionGame } from './src/api/freeTpOrgApi.js'
import { getOnlineFixGameVersion } from './src/api/onlineFixApi.js'
import { getCurrency } from './src/services/currency.js'

const app = express()
app.use(cors())
const port = 3000

app.get('/api/online/:id', async (req, res) => {
  const result = await getGameOnline(req.params.id)

  result.match(
    (data) => res.json({ success: true, data }),
    (error) => {
      if (error instanceof SteamChartsParsingError) {
        console.error('SteamChartsParsingError:', error)
        return res.status(500).json({ success: false, error: error.message })
      }

      console.error('Unexpected error:', error)
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
      })
    },
  )
})

// app.get('/api/ggsel/:query', ggsel)

// async function ggsel(req, res) {
//   const query = req.params.query
//   const result = await getGGSelGames(query)

//   result.match(
//     (data) => res.json({ success: true, data }),
//     (error) => {
//       console.error('Error in getGGSelGames:', error)
//       return res.status(500).json({ success: false, error: error.message })
//     },
//   )
// }

app.get('/api/plati/:query', async (req, res) => {
  const query = req.params.query
  const result = await getPlatiMarketGames(query)

  result.match(
    (data) => res.json({ success: true, data }),
    (error) => {
      console.error('Error in getPlatiMarketGames:', error)
      return res.status(500).json({ success: false, error: error.message })
    },
  )
})

app.get('/api/onlinefix/:query', async (req, res) => {
  const query = req.params.query
  const result = await getOnlineFixByTitle(query)

  result.match(
    (data) => res.json({ success: true, data }),
    (error) => {
      const response = { success: false, error: error.message }

      if (error instanceof NotFoundError) {
        return res.status(404).json(response)
      }

      if (error instanceof DatabaseError) {
        console.error('Database error:', error)
        return res.status(500).json(response)
      }

      console.error('Unexpected error:', error)
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
      })
    },
  )
})

app.get('/api/freetp/:query', async (req, res) => {
  const query = req.params.query
  const result = await getFreetpByTitle(query)

  result.match(
    (data) => res.json({ success: true, data }),
    (error) => {
      const response = { success: false, error: error.message }

      if (error instanceof NotFoundError) {
        return res.status(404).json(response)
      }

      if (error instanceof DatabaseError) {
        console.error('Database error:', error)
        return res.status(500).json(response)
      }

      console.error('Unexpected error:', error)
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
      })
    },
  )
})

app.get('/api/game/:id/:query', async (req, res) => {
  const { id, query } = req.params
  const freetp = await getFreetpByTitle(query)
  const onlinefix = await getOnlineFixByTitle(query)
  const plati = await getPlatiMarketGames(query, 4)
  const online = await getGameOnline(id)
  let freetpVersionGame = null
  let onlineFixVersionGame = null

  let results = {
    freetp,
    onlinefix,
    plati,
    online,
  }

  if (freetp.isOk()) {
    freetpVersionGame = await getFreeTpVersionGame(freetp.value.link)
    results = { ...results, freetpVersionGame }
  }

  if (onlinefix.isOk()) {
    onlineFixVersionGame = await getOnlineFixGameVersion(onlinefix.value.link)
    results = { ...results, onlineFixVersionGame }
  }

  for (const key in results) {
    if (Object.prototype.hasOwnProperty.call(results, key)) {
      results[key].match(
        (data) => {
          results[key] = { success: true, data }
        },
        (error) => {
          results[key] = { success: false, error: error.message }
        },
      )
    }
  }

  res.json(results)
})

app.get('/api/currency/', async (req, res) => {
  res.json(await getCurrency())
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
