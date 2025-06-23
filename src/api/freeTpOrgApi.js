import { ResultAsync, ok, err } from 'neverthrow'
import { NotFoundError, DatabaseError } from '../errors/ApiErrors.js'

import { db } from '../db/index.js'
import { freetpTable } from '../db/schema.js'
import { eq } from 'drizzle-orm'

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
