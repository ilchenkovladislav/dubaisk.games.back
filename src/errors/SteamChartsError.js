export class SteamChartsParsingError extends Error {
  constructor(message, selector) {
    super(`Failed to parse SteamCharts data: ${message}`)
    this.selector = selector
    this.name = 'SteamChartsParsingError'
  }
}
