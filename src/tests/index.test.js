import { describe, it, expect } from 'vitest'
import { extractFreetpGameTitle } from '../utils'

describe('extractFreetpGameTitle', () => {
  it('извлекает название перед "играть"', () => {
    expect(extractFreetpGameTitle('007 Legends играть по Сети и Интернету')).toBe('007 Legends')
  })

  it('извлекает название перед "игра"', () => {
    expect(extractFreetpGameTitle('Call of Duty игра по локалке')).toBe('Call of Duty')
  })

  it('извлекает название перед "по сети"', () => {
    expect(extractFreetpGameTitle('Counter-Strike по сети через VPN')).toBe('Counter-Strike')
  })

  it('извлекает название перед "игра/играть по сети"', () => {
    expect(extractFreetpGameTitle('Counter-Strike игра по сети через VPN')).toBe('Counter-Strike')
    expect(extractFreetpGameTitle('Counter-Strike играть по сети через VPN')).toBe('Counter-Strike')
  })

  it('работает с заглавными буквами', () => {
    expect(extractFreetpGameTitle('Minecraft ИГРАТЬ Онлайн')).toBe('Minecraft')
    expect(extractFreetpGameTitle('Terraria По Сети')).toBe('Terraria')
  })

  it('возвращает null, если ключевое слово отсутствует', () => {
    expect(extractFreetpGameTitle('Просто какая-то строка без ключевых слов')).toBeNull()
  })

  it('работает с лишними пробелами', () => {
    expect(extractFreetpGameTitle('  Portal 2     играть через Steam ')).toBe('Portal 2')
  })
})
