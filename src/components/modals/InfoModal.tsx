import { BaseModal } from './BaseModal'

type Props = {
  isOpen: boolean
  handleClose: () => void
}

export const InfoModal = ({ isOpen, handleClose }: Props) => {
  return (
    <BaseModal title="How to use" isOpen={isOpen} handleClose={handleClose}>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        Write in the received words from Wordle with the revealed letters. Use
        one of the recommended words (by typing or clicking).
      </p>

      <p className="text-lg mt-6 text-gray-900 dark:text-gray-300">
        Edit Mode:
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        You can set the letters' statuses in the edit mode. Use the arrows to
        navigate or click on the letter.
      </p>

      <p className="text-lg mt-6 text-gray-900 dark:text-gray-300">
        Shortcuts:
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        <span className="text-base text-gray-900 dark:text-gray-300">
          Space:
        </span>{' '}
        Edit Mode On / Off
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        <span className="text-base text-gray-900 dark:text-gray-300">
          Edit Mode On + A:
        </span>{' '}
        Make letter Absent
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        <span className="text-base text-gray-900 dark:text-gray-300">
          Edit Mode On + P:
        </span>{' '}
        Make letter Present
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        <span className="text-base text-gray-900 dark:text-gray-300">
          Edit Mode On + C:
        </span>{' '}
        Make letter Correct
      </p>

      <p className="italic text-sm mt-6 text-gray-500 dark:text-gray-300">
        This is an open source version of the word guessing game we all know and
        love.
      </p>
      <p>
        <a
          href="https://github.com/rbjakab/wordle-solver"
          className="italic text-sm mt-6 text-gray-500 dark:text-gray-300 underline font-bold"
        >
          check out this project's code here
        </a>
      </p>
      <p>
        <a
          href="https://github.com/cwackerfuss/react-wordle"
          className="italic text-sm mt-6 text-gray-500 dark:text-gray-300 underline font-bold"
        >
          check out the original code here
        </a>
      </p>
    </BaseModal>
  )
}
