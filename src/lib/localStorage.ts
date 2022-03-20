import { CharStatus } from './statuses'

const gameStateKey = 'gameState'
const highContrastKey = 'highContrast'
const statusesKey = 'statuses'

type StoredGameState = {
  guesses: string[]
}

export const saveGameStateToLocalStorage = (gameState: StoredGameState) => {
  localStorage.setItem(gameStateKey, JSON.stringify(gameState))
}

export const saveStatusesToLocalStorage = (statuses: CharStatus[][]) => {
  localStorage.setItem(statusesKey, JSON.stringify(statuses))
}

export const loadStatusesToLocalStorage = () => {
  const state = localStorage.getItem(statusesKey)
  return state ? (JSON.parse(state) as CharStatus[][]) : []
}

export const loadGameStateFromLocalStorage = () => {
  const state = localStorage.getItem(gameStateKey)
  return state ? (JSON.parse(state) as StoredGameState) : null
}

export type GameStats = {
  winDistribution: number[]
  gamesFailed: number
  currentStreak: number
  bestStreak: number
  totalGames: number
  successRate: number
}

export const setStoredIsHighContrastMode = (isHighContrast: boolean) => {
  if (isHighContrast) {
    localStorage.setItem(highContrastKey, '1')
  } else {
    localStorage.removeItem(highContrastKey)
  }
}

export const getStoredIsHighContrastMode = () => {
  const highContrast = localStorage.getItem(highContrastKey)
  return highContrast === '1'
}
