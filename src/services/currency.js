import axios from 'axios'

export async function getCurrency() {
  const rates = await axios.get('https://www.cbr-xml-daily.ru/latest.js')

  return rates.data.rates['KZT']
}
