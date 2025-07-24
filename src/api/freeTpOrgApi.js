import { ResultAsync, ok, err } from 'neverthrow'
import { NotFoundError, DatabaseError } from '../errors/ApiErrors.js'

import { db } from '../db/index.js'
import { freetpTable } from '../db/schema.js'
import { eq } from 'drizzle-orm'
import { parseFreeTpVersionGame } from '../parsers/freeTpParser.js'
import { fetchFreeTpGame } from '../services/freeTpService.js'

export async function getFreetpByTitle(title) {
  const findFreetp = db.select().from(freetpTable).where(eq(freetpTable.title, title))

  return ResultAsync.fromPromise(
    findFreetp,
    (error) => new DatabaseError(`Database query failed: ${error.message}`),
  ).andThen((select) => {
    if (!select.length) {
      return err(new NotFoundError('Freetp not found'))
    }

    return ok(select[0])
  })
}

export async function getFreeTpVersionGame(link) {
  const htmlData = await fetchFreeTpGame(link)

  return htmlData.match(
    (data) => ok(parseFreeTpVersionGame(data)),
    (error) => {
      console.error(`Error in getGameVersion for ID ${link}`, error)
      return err(new Error(`Error in getGameVersion for ID ${link}`))
    },
  )
}
