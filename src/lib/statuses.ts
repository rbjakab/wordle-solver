export type CharStatus = 'absent' | 'present' | 'correct'

export const getLettersStatuses = (
  guesses: string[],
  statuses: CharStatus[][]
): { [key: string]: CharStatus } => {
  const charObj: { [key: string]: CharStatus } = {}

  for (let i = 0; i < guesses.length; i++) {
    const guess = guesses[i]
    for (let j = 0; j < guess.length; j++) {
      const letter = guess[j]

      if (
        (charObj[letter] !== 'present' || statuses[i][j] === 'correct') &&
        charObj[letter] !== 'correct'
      ) {
        charObj[letter] = statuses[i][j]
      }
    }
  }

  return charObj
}
