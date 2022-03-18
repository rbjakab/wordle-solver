import React from 'react'

type Props = {
  children: string
  onClick: (word: string) => void
}

export const Result = ({ children, onClick }: Props) => {
  return (
    <p
      className="flex justify-center text-lg leading-10 font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-300 w-full max-w-none rounded-lg"
      onClick={() => onClick(children)}
    >
      {children}
    </p>
  )
}
