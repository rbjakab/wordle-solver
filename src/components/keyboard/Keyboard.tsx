import { CharStatus, getStatuses } from '../../lib/statuses'
import { Key } from './Key'
import { useEffect } from 'react'
import {
  ENTER_TEXT,
  DELETE_TEXT,
  EDIT_MODE_TEXT,
  ABSENT_TEXT,
  PRESENT_TEXT,
  CORRECT_TEXT,
} from '../../constants/strings'
import { localeAwareUpperCase } from '../../lib/words'

export type ArrowKeyType = 'ARROWUP' | 'ARROWRIGHT' | 'ARROWDOWN' | 'ARROWLEFT'

type Props = {
  onChar: (value: string) => void
  onDelete: () => void
  onEnter: () => void
  onEditMode: () => void
  handleEditMode: (editMode: CharStatus) => void
  handleArrowKey: (arrowKey: ArrowKeyType) => void
  guesses: string[]
  isRevealing?: boolean
  isEditingMode: boolean
}

export const Keyboard = ({
  onChar,
  onDelete,
  onEnter,
  onEditMode,
  handleEditMode,
  handleArrowKey,
  guesses,
  isRevealing,
  isEditingMode,
}: Props) => {
  const charStatuses = getStatuses(guesses)

  const onClick = (value: string) => {
    if (value === 'ENTER') {
      onEnter()
    } else if (value === 'DELETE') {
      onDelete()
    } else if (value === 'EDIT_MODE') {
      onEditMode()
    } else if (value === 'ABSENT') {
      handleEditMode('absent')
    } else if (value === 'PRESENT') {
      handleEditMode('present')
    } else if (value === 'CORRECT') {
      handleEditMode('correct')
    } else {
      onChar(value)
    }
  }

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.code === 'Enter') {
        onEnter()
      } else if (e.code === 'Backspace') {
        onDelete()
      } else {
        const key = localeAwareUpperCase(e.key)
        // TODO: check this test if the range works with non-english letters
        if (key.length === 1 && key >= 'A' && key <= 'Z') {
          onChar(key)
        }

        if (
          isEditingMode &&
          ['ARROWUP', 'ARROWRIGHT', 'ARROWDOWN', 'ARROWLEFT'].includes(key)
        ) {
          handleArrowKey(key as ArrowKeyType)
        }
      }
    }
    window.addEventListener('keyup', listener)
    return () => {
      window.removeEventListener('keyup', listener)
    }
  }, [onEnter, onDelete, onChar, handleArrowKey, isEditingMode])

  return (
    <>
      <div className="flex justify-center mb-1">
        <Key
          width={85}
          value="EDIT_MODE"
          onClick={onClick}
          isActive={isEditingMode}
        >
          {EDIT_MODE_TEXT}
        </Key>
      </div>
      {!isEditingMode && (
        <div>
          <div className="flex justify-center mb-1">
            {['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'].map((key) => (
              <Key
                value={key}
                key={key}
                onClick={onClick}
                status={undefined}
                isRevealing={isRevealing}
              />
            ))}
          </div>
          <div className="flex justify-center mb-1">
            {['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'].map((key) => (
              <Key
                value={key}
                key={key}
                onClick={onClick}
                status={undefined}
                isRevealing={isRevealing}
              />
            ))}
          </div>
          <div className="flex justify-center">
            <Key width={65.4} value="ENTER" onClick={onClick}>
              {ENTER_TEXT}
            </Key>
            {['Z', 'X', 'C', 'V', 'B', 'N', 'M'].map((key) => (
              <Key
                value={key}
                key={key}
                onClick={onClick}
                status={undefined}
                isRevealing={isRevealing}
              />
            ))}
            <Key width={65.4} value="DELETE" onClick={onClick}>
              {DELETE_TEXT}
            </Key>
          </div>
        </div>
      )}
      {isEditingMode && (
        <div className="flex justify-center mb-1">
          <Key width={85} value="ABSENT" onClick={onClick} status="absent">
            {ABSENT_TEXT}
          </Key>
          <Key width={85} value="PRESENT" onClick={onClick} status="present">
            {PRESENT_TEXT}
          </Key>
          <Key width={85} value="CORRECT" onClick={onClick} status="correct">
            {CORRECT_TEXT}
          </Key>
        </div>
      )}
    </>
  )
}
