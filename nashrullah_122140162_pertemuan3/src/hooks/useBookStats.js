import { useMemo } from 'react'
import { useBooks } from '../context/BookContext'

export function useBookStats() {
  const { books } = useBooks()

  return useMemo(() => {
    const total = books.length
    const statusCounts = books.reduce(
      (acc, book) => {
        acc[book.status] = (acc[book.status] ?? 0) + 1
        return acc
      },
      { owned: 0, reading: 0, wishlist: 0 },
    )

    const authorCounts = books.reduce((acc, book) => {
      acc[book.author] = (acc[book.author] ?? 0) + 1
      return acc
    }, {})

    const mostCollectedAuthor =
      Object.entries(authorCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '-'

    return {
      total,
      ...statusCounts,
      mostCollectedAuthor,
    }
  }, [books])
}
