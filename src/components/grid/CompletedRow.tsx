import { CharStatus } from '../../lib/statuses'
import { Cell } from './Cell'
import { unicodeSplit } from '../../lib/words'
import { XCircleIcon } from '@heroicons/react/outline'
import { EditCellType } from '../../App'

type Props = {
  guess: string
  isRevealing?: boolean
  editCell?: number
  statusRow: CharStatus[]
  guessRow: number
  onRemoveClick: (guessRow: number) => void
  handleLetterClick: (editCell: EditCellType) => void
}

export const CompletedRow = ({
  guess,
  isRevealing,
  editCell,
  statusRow,
  guessRow,
  onRemoveClick,
  handleLetterClick,
}: Props) => {
  // const statuses = getGuessStatuses(guess)
  const splitGuess = unicodeSplit(guess)
  const updatedStatusRow: CharStatus[] =
    statusRow ?? Array.from(Array(guess.length)).map((_) => 'absent')

  return (
    <>
      <div className="flex justify-center mb-1 w-fit relative">
        <div className="w-14 h-14 flex items-center justify-center absolute -left-14">
          <XCircleIcon
            width={28}
            className="hover:fill-red-500 hover:cursor-pointer dark:stroke-white"
            onClick={() => onRemoveClick(guessRow)}
          />
        </div>
        {splitGuess.map((letter, i) => (
          <Cell
            key={i}
            value={letter}
            status={updatedStatusRow[i]}
            position={i}
            isRevealing={isRevealing}
            isCompleted
            editCell={i === editCell}
            editCellPosition={{ row: guessRow, column: i }}
            handleLetterClick={handleLetterClick}
          />
        ))}
      </div>
    </>
  )
}
