import { eq } from 'drizzle-orm'
import { db } from '../db/index.js'
import { onlinefixTable } from '../db/schema.js'
import { ResultAsync, ok, err } from 'neverthrow'
import { NotFoundError, DatabaseError } from '../errors/ApiErrors.js'

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
