import { useState, useEffect } from 'react'
import { Grid } from './components/grid/Grid'
import { ArrowKeyType, Keyboard } from './components/keyboard/Keyboard'
import { InfoModal } from './components/modals/InfoModal'
import { SettingsModal } from './components/modals/SettingsModal'
import {
  NOT_ENOUGH_LETTERS_MESSAGE,
  WORD_NOT_FOUND_MESSAGE,
} from './constants/strings'
import {
  MAX_WORD_LENGTH,
  MAX_CHALLENGES,
  REVEAL_TIME_MS,
  WELCOME_INFO_MODAL_MS,
} from './constants/settings'
import {
  isWordInWordList,
  unicodeLength,
  unicodeSplit,
  localeAwareUpperCase,
} from './lib/words'
import {
  loadGameStateFromLocalStorage,
  saveGameStateToLocalStorage,
  setStoredIsHighContrastMode,
  getStoredIsHighContrastMode,
  saveStatusesToLocalStorage,
  loadStatusesToLocalStorage,
} from './lib/localStorage'
import { default as GraphemeSplitter } from 'grapheme-splitter'

import './App.css'
import { AlertContainer } from './components/alerts/AlertContainer'
import { useAlert } from './context/AlertContext'
import { Navbar } from './components/navbar/Navbar'
import { CharStatus } from './lib/statuses'
import { getWordRecommendations } from './lib/results'
import { Results } from './components/results/Results'
import { Result } from './components/results/Result'
import { Info } from './components/results/Info'

export type EditCellType = {
  row: number
  column: number
}

function App() {
  const prefersDarkMode = window.matchMedia(
    '(prefers-color-scheme: dark)'
  ).matches

  const { showError: showErrorAlert } = useAlert()
  const [currentGuess, setCurrentGuess] = useState('')
  const [isEditingModeActive, setIsEditingModeActive] = useState(false)
  const [editCell, setEditCell] = useState<EditCellType>({ row: 0, column: 0 })
  const [results, setResults] = useState<string[]>([])
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [currentRowClass, setCurrentRowClass] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('theme')
      ? localStorage.getItem('theme') === 'dark'
      : prefersDarkMode
      ? true
      : false
  )
  const [isHighContrastMode, setIsHighContrastMode] = useState(
    getStoredIsHighContrastMode()
  )
  const [isRevealing, setIsRevealing] = useState(false)
  const [playState, setPlayState] = useState<{
    guesses: string[]
    statuses: CharStatus[][]
  }>(() => {
    const loaded = loadGameStateFromLocalStorage()
    const guessesValue = loaded?.guesses ?? []
    const statusesValue = loadStatusesToLocalStorage()

    return { guesses: guessesValue, statuses: statusesValue }
  })
  const [displayedResultsNumber, setDisplayedResultsNumber] = useState(5)

  useEffect(() => {
    // if no game state on load,
    // show the user the how-to info modal
    if (!loadGameStateFromLocalStorage()) {
      setTimeout(() => {
        setIsInfoModalOpen(true)
      }, WELCOME_INFO_MODAL_MS)
    }
  }, [])

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    if (isHighContrastMode) {
      document.documentElement.classList.add('high-contrast')
    } else {
      document.documentElement.classList.remove('high-contrast')
    }
  }, [isDarkMode, isHighContrastMode])

  const handleDarkMode = (isDark: boolean) => {
    setIsDarkMode(isDark)
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }

  const handleEditMode = (editMode: CharStatus) => {
    const newStatuses = JSON.parse(JSON.stringify(playState.statuses))

    newStatuses[editCell.row][editCell.column] = editMode

    setPlayState({ guesses: playState.guesses, statuses: newStatuses })

    const newEditCellColumn =
      editCell.row === playState.guesses.length - 1 &&
      editCell.column === MAX_WORD_LENGTH - 1
        ? editCell.column
        : editCell.column === MAX_WORD_LENGTH - 1
        ? 0
        : editCell.column + 1

    const newEditCellRow =
      editCell.row === playState.guesses.length - 1 &&
      editCell.column === MAX_WORD_LENGTH - 1
        ? editCell.row
        : editCell.column === MAX_WORD_LENGTH - 1
        ? editCell.row + 1
        : editCell.row

    setEditCell({ row: newEditCellRow, column: newEditCellColumn })
  }

  const handleArrowKey = (arrowKey: ArrowKeyType) => {
    const newEditCell = { row: editCell.row, column: editCell.column }

    if (arrowKey === 'ARROWUP' && editCell.row !== 0) {
      newEditCell.row = newEditCell.row - 1
    }

    if (arrowKey === 'ARROWRIGHT' && editCell.column !== MAX_WORD_LENGTH - 1) {
      newEditCell.column = newEditCell.column + 1
    }

    if (
      arrowKey === 'ARROWDOWN' &&
      editCell.row !== playState.guesses.length - 1
    ) {
      newEditCell.row = newEditCell.row + 1
    }

    if (arrowKey === 'ARROWLEFT' && editCell.column !== 0) {
      newEditCell.column = newEditCell.column - 1
    }

    setEditCell(newEditCell)
  }

  const handleRemoveIconClick = (guessRow: number) => {
    setPlayState({
      guesses: playState.guesses.filter((_, i) => i !== guessRow),
      statuses: playState.statuses.filter((_, i) => i !== guessRow),
    })
  }

  const handleWordSelect = (word: string) => {
    if (playState.guesses.length === MAX_CHALLENGES - 1) return

    const newStatusValue: CharStatus[][] = [
      ...playState.statuses,
      unicodeSplit(word).map((_) => 'absent'),
    ]
    const newGuess = localeAwareUpperCase(word)
    setPlayState((prevState) => {
      return {
        guesses: [...prevState.guesses, newGuess],
        statuses: newStatusValue,
      }
    })
  }

  const handleHighContrastMode = (isHighContrast: boolean) => {
    setIsHighContrastMode(isHighContrast)
    setStoredIsHighContrastMode(isHighContrast)
  }

  const handleSeeMore = () => {
    setDisplayedResultsNumber((prevNumber) => prevNumber + 5)
  }

  const handleLetterClick = (newEditCell: EditCellType) => {
    setEditCell(newEditCell)
  }

  const clearCurrentRowClass = () => {
    setCurrentRowClass('')
  }

  useEffect(() => {
    saveGameStateToLocalStorage({ guesses: playState.guesses })
  }, [playState.guesses])

  useEffect(() => {
    saveStatusesToLocalStorage(playState.statuses)
  }, [playState.statuses])

  useEffect(() => {
    setResults(getWordRecommendations(playState.statuses, playState.guesses))
  }, [playState.guesses, playState.statuses])

  const onChar = (value: string) => {
    if (isEditingModeActive) {
      if (value === 'A') {
        handleEditMode('absent')
      }

      if (value === 'P') {
        handleEditMode('present')
      }

      if (value === 'C') {
        handleEditMode('correct')
      }

      return
    }

    if (
      unicodeLength(`${currentGuess}${value}`) <= MAX_WORD_LENGTH &&
      playState.guesses.length < MAX_CHALLENGES
    ) {
      setCurrentGuess(`${currentGuess}${value}`)
    }
  }

  const onDelete = () => {
    setCurrentGuess(
      new GraphemeSplitter().splitGraphemes(currentGuess).slice(0, -1).join('')
    )
  }

  const onEnter = () => {
    if (unicodeLength(currentGuess) !== MAX_WORD_LENGTH) {
      setCurrentRowClass('jiggle')
      return showErrorAlert(NOT_ENOUGH_LETTERS_MESSAGE, {
        onClose: clearCurrentRowClass,
      })
    }

    if (!isWordInWordList(currentGuess)) {
      setCurrentRowClass('jiggle')
      return showErrorAlert(WORD_NOT_FOUND_MESSAGE, {
        onClose: clearCurrentRowClass,
      })
    }

    setIsRevealing(true)
    // turn this back off after all
    // chars have been revealed
    setTimeout(() => {
      setIsRevealing(false)
    }, REVEAL_TIME_MS * MAX_WORD_LENGTH)

    if (
      unicodeLength(currentGuess) === MAX_WORD_LENGTH &&
      playState.guesses.length < MAX_CHALLENGES
    ) {
      const newStatusValue: CharStatus[][] = [
        ...playState.statuses,
        unicodeSplit(currentGuess).map((_) => 'absent'),
      ]
      setPlayState((prevState) => {
        return {
          guesses: [...prevState.guesses, currentGuess],
          statuses: newStatusValue,
        }
      })
      setCurrentGuess('')
    }
  }

  const onEditMode = () => {
    setIsEditingModeActive(!isEditingModeActive)
    setEditCell({ row: 0, column: 0 })
  }

  return (
    <div className="h-screen flex flex-col">
      <Navbar
        setIsInfoModalOpen={setIsInfoModalOpen}
        setIsSettingsModalOpen={setIsSettingsModalOpen}
      />
      <div className="">
        <div className="pt-2 px-1 pb-8 md:max-w-7xl w-full mx-auto sm:px-6 lg:px-8 flex flex-col grow md:relative">
          <div className="w-full md:w-fit flex flex-col grow justify-center items-center md:absolute md:left-0 md:top-0">
            <Info>Number of Results: {results.length}</Info>
          </div>
          <div className="flex flex-col justify-center items-center md:items-end grow w-full mb-4 md:mb-0 md:absolute md:right-0 md:top-0 md:w-2/12">
            <Results>
              {results.slice(0, displayedResultsNumber).map((result, i) => (
                <Result key={i} onClick={handleWordSelect}>
                  {result}
                </Result>
              ))}
              {displayedResultsNumber < results.length && (
                <Result onClick={handleSeeMore}>(...)</Result>
              )}
              {results.length === 0 && <Info>No result.</Info>}
            </Results>
          </div>
          <div className="pb-6 grow">
            <Grid
              guesses={playState.guesses}
              currentGuess={currentGuess}
              isRevealing={isRevealing}
              currentRowClassName={currentRowClass}
              editCell={editCell}
              isEditingMode={isEditingModeActive}
              statuses={playState.statuses}
              handleRemoveIconClick={handleRemoveIconClick}
              handleLetterClick={handleLetterClick}
            />
          </div>
          <Keyboard
            onChar={onChar}
            onDelete={onDelete}
            onEnter={onEnter}
            onEditMode={onEditMode}
            handleEditMode={handleEditMode}
            handleArrowKey={handleArrowKey}
            onSpace={onEditMode}
            guesses={playState.guesses}
            isRevealing={isRevealing}
            isEditingMode={isEditingModeActive}
            statuses={playState.statuses}
          />
          <InfoModal
            isOpen={isInfoModalOpen}
            handleClose={() => setIsInfoModalOpen(false)}
          />
          <SettingsModal
            isOpen={isSettingsModalOpen}
            handleClose={() => setIsSettingsModalOpen(false)}
            isDarkMode={isDarkMode}
            handleDarkMode={handleDarkMode}
            isHighContrastMode={isHighContrastMode}
            handleHighContrastMode={handleHighContrastMode}
          />
          <AlertContainer />
          <p className="mt-6 flex justify-center">
            Made by&nbsp;
            <a
              href="https://rjakab.vercel.app/"
              className="text-blue-500"
              target={'_blank'}
              rel="noreferrer"
            >
              Richard Jakab
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
