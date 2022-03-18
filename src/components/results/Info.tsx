import React from 'react'

type Props = {
  children: React.ReactNode
}

export const Info = ({ children }: Props) => {
  return (
    <p className="flex justify-center text-lg leading-10 font-medium text-gray-900 dark:text-gray-100">
      {children}
    </p>
  )
}
