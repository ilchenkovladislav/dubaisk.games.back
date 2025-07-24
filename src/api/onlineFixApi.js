import { eq } from 'drizzle-orm'
import { db } from '../db/index.js'
import { onlinefixTable } from '../db/schema.js'
import { ResultAsync, ok, err } from 'neverthrow'
import { NotFoundError, DatabaseError } from '../errors/ApiErrors.js'
import { fetchOnlineFixGame } from '../services/onlineFixService.js'
import { parseOnlineFixVersionGame } from '../parsers/onlineFixParser.js'

export async function getOnlineFixByTitle(title) {
  const findOnlineFix = db.select().from(onlinefixTable).where(eq(onlinefixTable.title, title))

  return ResultAsync.fromPromise(
    findOnlineFix,
    (error) => new DatabaseError(`Database query failed: ${error.message}`),
  ).andThen((select) => {
    if (!select.length) {
      return err(new NotFoundError('OnlineFix not found'))
    }
    return ok(select[0])
  })
}

export async function getOnlineFixGameVersion(link) {
  const data = await fetchOnlineFixGame(link)

  return data.match(
    (data) => ok(parseOnlineFixVersionGame(data)),
    (error) => {
      console.error('Error in getGGSelGames:', error)
      return err(error)
    },
  )
}
