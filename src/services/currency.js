import axios from 'axios'

export async function getCurrency() {
  const resUSD = await axios.get(
    'https://steam-rates.playwallet.bot/latest-rate/?currency_code=KZT&base_currency_code=USD',
  )

  const resRUB = await axios.get(
    'https://steam-rates.playwallet.bot/latest-rate/?currency_code=USD&base_currency_code=RUB',
  )

  //  1$ ≈ 545.831тг
  const usdRate = await resUSD.data[0].exchange_rate

  //  1р ≈ 0.01258$
  const rubRate = await resRUB.data[0].exchange_rate

  return usdRate / rubRate
}
