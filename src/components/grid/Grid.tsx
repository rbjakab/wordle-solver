import { MAX_CHALLENGES } from '../../constants/settings'
import { CharStatus } from '../../lib/statuses'
import { CompletedRow } from './CompletedRow'
import { CurrentRow } from './CurrentRow'
import { EmptyRow } from './EmptyRow'

type Props = {
  guesses: string[]
  currentGuess: string
  isRevealing?: boolean
  currentRowClassName: string
  editCell: { row: number; column: number }
  isEditingMode: boolean
  statuses: CharStatus[][]
  handleRemoveIconClick: (guessRow: number) => void
}

export const Grid = ({
  guesses,
  currentGuess,
  isRevealing,
  currentRowClassName,
  editCell,
  isEditingMode,
  statuses,
  handleRemoveIconClick,
}: Props) => {
  const empties =
    guesses.length < MAX_CHALLENGES - 1
      ? Array.from(Array(MAX_CHALLENGES - 1 - guesses.length))
      : []

  return (
    <div className="flex items-center mb-1 flex-col">
      {guesses.map((guess, i) => (
        <CompletedRow
          key={i}
          guess={guess}
          isRevealing={isRevealing && guesses.length - 1 === i}
          editCell={
            i === editCell.row && isEditingMode ? editCell.column : undefined
          }
          statusRow={statuses[i]}
          guessRow={i}
          onRemoveClick={handleRemoveIconClick}
        />
      ))}
      {guesses.length < MAX_CHALLENGES && (
        <CurrentRow guess={currentGuess} className={currentRowClassName} />
      )}
      {empties.map((_, i) => (
        <EmptyRow key={i} />
      ))}
    </div>
  )
}
