import { MAX_WORD_LENGTH } from '../constants/settings'
import { VALID_GUESSES } from '../constants/validGuesses'
import { CharStatus } from './statuses'
import { localeAwareLowerCase } from './words'

type LetterWithPositionType = { letter: string; position: number }
type LetterOccurrenceType = { letter: string; occurrence: number }
// type SummaryType = { word: string; sum: number }

const numberOfChar = (char: string, text: string) => {
  return (text.match(new RegExp(char, 'g')) || []).length
}

const getLetters = (
  statuses: CharStatus[][],
  guesses: string[]
): [
  string,
  LetterWithPositionType[],
  LetterWithPositionType[],
  LetterWithPositionType[]
] => {
  let absentLetters: string = ''
  let presentLetters: LetterWithPositionType[] = []
  let correctLetters: LetterWithPositionType[] = []
  let specialAbsentLetters: LetterWithPositionType[] = []

  for (let i = 0; i < guesses.length; i++) {
    const guess = localeAwareLowerCase(guesses[i])

    for (let j = 0; j < guess.length; j++) {
      const status = statuses[i][j]
      const char = localeAwareLowerCase(guess[j])

      if (status === 'absent' && numberOfChar(char, guess) === 1) {
        absentLetters += char
      }

      if (status === 'absent' && numberOfChar(char, guess) > 1) {
        specialAbsentLetters.push({ letter: char, position: j })
      }

      if (status === 'present') {
        presentLetters.push({ letter: char, position: j })
      }

      if (status === 'correct') {
        correctLetters.push({ letter: char, position: j })
      }
    }
  }

  return [absentLetters, presentLetters, correctLetters, specialAbsentLetters]
}

const getLetterOccurrences = (
  presentLetters: LetterWithPositionType[],
  correctLetters: LetterWithPositionType[]
): LetterOccurrenceType[] => {
  const letters =
    presentLetters.map((object) => object.letter).join('') +
    correctLetters.map((object) => object.letter).join('')

  const letterOccurrence: { letter: string; occurrence: number }[] = []

  for (let letter of letters) {
    const occurrence = numberOfChar(letter, letters)
    if (
      occurrence > 1 &&
      letterOccurrence.filter((object) => object.letter === letter).length === 0
    ) {
      letterOccurrence.push({ letter: letter, occurrence: occurrence })
    }
  }

  return letterOccurrence
}

const calculateBaseRegexPattern = (
  absentLetters: string,
  presentLetters: LetterWithPositionType[],
  correctLetters: LetterWithPositionType[],
  specialAbsentLetters: LetterWithPositionType[]
) => {
  let pattern = '^'

  for (let i = 0; i < presentLetters.length; i++) {
    pattern += `(?=.*${presentLetters[i].letter}.*)`
  }

  pattern += `(?=[a-z]{${MAX_WORD_LENGTH}})`

  for (let i = 0; i < MAX_WORD_LENGTH; i++) {
    const filteredCorrectLetters = correctLetters.filter(
      (object) => object.position === i
    )

    if (filteredCorrectLetters.length >= 1) {
      pattern += filteredCorrectLetters[0].letter
    }

    if (filteredCorrectLetters.length === 0) {
      const convertedPresentLetters = presentLetters
        .filter((object) => object.position === i)
        .map((object) => object.letter)
      const convertedSpecialAbsentLetters = specialAbsentLetters
        .filter((object) => object.position === i)
        .map((object) => object.letter)
      pattern += '[^'
      pattern += absentLetters
      pattern += convertedPresentLetters.join('')
      pattern += convertedSpecialAbsentLetters.join('')
      pattern += ']'
    }
  }

  return pattern
}

const getPattern = (letterOccurrence: LetterOccurrenceType) => {
  const letter = letterOccurrence.letter
  const occurrence = letterOccurrence.occurrence
  let pattern = `^[^${letter}]`
  for (let i = 0; i < occurrence; i++) {
    pattern += `*${letter}[^${letter}]`
  }
  pattern += '*'
  return pattern
}

const calculateMultiplexRegexPattern = (
  statuses: CharStatus[][],
  guesses: string[]
) => {
  const patterns = []

  for (let i = 0; i < guesses.length; i++) {
    const guess = guesses[i]
    const status = statuses[i]
    const [, presentLetters, correctLetters, ,] = getLetters([status], [guess])
    const letterOccurrences = getLetterOccurrences(
      presentLetters,
      correctLetters
    )
    for (let occurrence of letterOccurrences) {
      patterns.push(getPattern(occurrence))
    }
  }

  return patterns
}

export const getWordRecommendations = (
  statuses: CharStatus[][],
  guesses: string[]
) => {
  const [absentLetters, presentLetters, correctLetters, specialAbsentLetters] =
    getLetters(statuses, guesses)

  const baseRegex = calculateBaseRegexPattern(
    absentLetters,
    presentLetters,
    correctLetters,
    specialAbsentLetters
  )
  const multiplexRegex = calculateMultiplexRegexPattern(statuses, guesses)

  let filteredWords = VALID_GUESSES.filter((word) => word.match(baseRegex))

  for (let pattern of multiplexRegex) {
    filteredWords = filteredWords.filter((word) => word.match(pattern))
  }

  return filteredWords
}

// export const getWordRecommendations = async (
//   statuses: CharStatus[][],
//   guesses: string[]
// ) => {
//   const wordList = getWordList(statuses, guesses)
//   const clonedStatuses: CharStatus[][] = JSON.parse(JSON.stringify(statuses))
//   const clonedGuesses: string[] = JSON.parse(JSON.stringify(guesses))

//   clonedStatuses.push([])
//   clonedGuesses.push('')

//   const summary: SummaryType[] = []

//   for (let word of wordList) {
//     clonedGuesses[clonedGuesses.length - 1] = word.slice()
//     const newSummaryElement: SummaryType = { word: word, sum: 0 }

//     let newStatusArray: CharStatus[] = Array.from(Array(MAX_WORD_LENGTH)).map(
//       () => 'absent'
//     )

//     for (let i = 0; i < word.length; i++) {
//       for (let status of ['absent', 'present', 'correct']) {
//         newStatusArray[i] = status as CharStatus
//         clonedStatuses[clonedStatuses.length - 1] = newStatusArray
//         newSummaryElement.sum += getWordList(
//           clonedStatuses,
//           clonedGuesses
//         ).length
//       }
//     }

//     summary.push(newSummaryElement)
//   }

//   return wordList
// }
