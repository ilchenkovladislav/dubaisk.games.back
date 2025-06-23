import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import {
  getPlatiMarketGames,
  getGGSelGames,
  getOnlineFixByTitle,
  getFreetpByTitle,
  getGameOnline,
} from './src/index.js'
import { NotFoundError, DatabaseError } from './src/errors/ApiErrors.js'
import { SteamChartsParsingError } from './src/errors/SteamChartsError.js'

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

app.get('/api/ggsel/:query', ggsel)

async function ggsel(req, res) {
  const query = req.params.query
  const result = await getGGSelGames(query)

  result.match(
    (data) => res.json({ success: true, data }),
    (error) => {
      console.error('Error in getGGSelGames:', error)
      return res.status(500).json({ success: false, error: error.message })
    },
  )
}

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
