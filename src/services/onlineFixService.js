import { ok, err } from 'neverthrow'
import axios from 'axios'
import iconv from 'iconv-lite'

export async function fetchOnlineFixGame(link) {
  if (!link) {
    return err(new Error('Нет ссылки на страницу с игрой'))
  }

  try {
    const response = await axios.get(link, {
      responseType: 'arraybuffer',
      headers: {
        Cookie:
          'dle_password=b731cdfbb12fb70529f7353bcb6bc1f7; dle_user_id=4579369; PHPSESSID=c8kt3ad9to1avskgf2rck3pdsc',
      },
    })

    return ok(iconv.decode(response.data, 'win1251'))
  } catch (error) {
    return err(new Error(`Failed to fetch data for game ${link}: ${error.message}`))
  }
}
