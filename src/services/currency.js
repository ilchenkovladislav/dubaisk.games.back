import axios from 'axios'

export async function getCurrency() {
  const resKZT = await axios.get(
    'https://steam-rates.playwallet.bot/latest-rate/?currency_code=KZT&base_currency_code=USD',
  )

  const resRUB = await axios.get(
    'https://steam-rates.playwallet.bot/latest-rate/?currency_code=RUB&base_currency_code=USD',
  )

  const kztRate = await resKZT.data[0].exchange_rate
  const rubRate = await resRUB.data[0].exchange_rate

  return rubRate / kztRate
}
