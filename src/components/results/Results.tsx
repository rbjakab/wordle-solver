import React from 'react'

type Props = {
  children: React.ReactNode
}

export const Results = ({ children }: Props) => {
  return (
    <div className="flex flex-row flex-wrap justify-center md:justify-end w-fit">
      {children}
    </div>
  )
}
