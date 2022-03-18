import React from 'react'

type Props = {
  children: React.ReactNode
}

export const Results = ({ children }: Props) => {
  return (
    <div className="flex flex-col items-center mb-1 w-full max-w-none">
      {children}
    </div>
  )
}
