export const STEAMCHARTS_BASE_URL = 'https://steamcharts.com/app'

export const SELECTORS = {
  APP_STATS: '.app-stat .num',
  MONTHLY_STATS_ROW: '.common-table tbody tr',
}

export const APP_STATS_INDICES = {
  PLAYERS_ONLINE: 0,
  TODAY_PEAK: 1,
  ALL_TIME_PEAK: 2,
}

export const MONTHLY_STATS_INDICES = {
  AVERAGE_PLAYERS: 1,
  MONTHLY_CHANGE: 2,
  CHANGE_PERCENTAGE: 3,
  MONTHLY_PEAK: 4,
}
