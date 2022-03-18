import { WORDS } from '../constants/wordlist'
import { CharStatus } from './statuses'
import { localeAwareLowerCase } from './words'

type Letter = { position: number; letter: string }

const filterAbsentLetters = (word: string, absentLetters: string[]) => {
  for (const letter of absentLetters) {
    if (word.includes(letter)) {
      return false
    }
  }
  return true
}

const filterPresentLetters = (word: string, presentLetters: Letter[]) => {
  for (const letter of presentLetters) {
    if (
      !word.includes(letter.letter) ||
      word[letter.position] === letter.letter
    ) {
      return false
    }
  }
  return true
}

const filterCorrectLetters = (word: string, presentLetters: Letter[]) => {
  for (const letter of presentLetters) {
    if (word[letter.position] !== letter.letter) {
      return false
    }
  }
  return true
}

export const calculateResults = (
  statuses: CharStatus[][],
  guesses: string[]
) => {
  const absentLetters: string[] = []
  const presentLetters: Letter[] = []
  const correctLetters: Letter[] = []

  for (let i = 0; i < statuses.length; i++) {
    for (let j = 0; j < statuses[i].length; j++) {
      if (statuses[i][j] === 'absent') {
        absentLetters.push(localeAwareLowerCase(guesses[i][j]))
      }

      if (statuses[i][j] === 'present') {
        presentLetters.push({
          position: j,
          letter: localeAwareLowerCase(guesses[i][j]),
        })
      }

      if (statuses[i][j] === 'correct') {
        correctLetters.push({
          position: j,
          letter: localeAwareLowerCase(guesses[i][j]),
        })
      }
    }
  }

  const wordsAfterAbsentFiltering = WORDS.filter((word) =>
    filterAbsentLetters(word, absentLetters)
  )

  const wordsAfterPresentFiltering = wordsAfterAbsentFiltering.filter((word) =>
    filterPresentLetters(word, presentLetters)
  )

  const wordsAfterCorrectFiltering = wordsAfterPresentFiltering.filter((word) =>
    filterCorrectLetters(word, correctLetters)
  )

  return wordsAfterCorrectFiltering
}
