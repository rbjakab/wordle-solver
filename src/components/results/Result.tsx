type Props = {
  children: string
  onClick: (word: string) => void
}

export const Result = ({ children, onClick }: Props) => {
  return (
    <p
      className="w-20 flex justify-center text-lg leading-10 font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-300 rounded-lg hover:cursor-pointer dark:hover:text-gray-900"
      onClick={() => onClick(children)}
    >
      {children}
    </p>
  )
}
