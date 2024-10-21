import React, { useState, useMemo } from 'react'
import { WordFrequency } from '../types'
import ExampleModal from './ExampleModal'
import { ChevronUp, ChevronDown } from 'lucide-react'

interface FrequencyTableProps {
  wordFrequencies: WordFrequency[]
  text: string
}

const FrequencyTable: React.FC<FrequencyTableProps> = ({ wordFrequencies, text }) => {
  const [selectedWord, setSelectedWord] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [wordsPerPage, setWordsPerPage] = useState(50)
  const [sortBy, setSortBy] = useState<'count' | 'word'>('count')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const totalWords = text.split(/\s+/).length
  const uniqueWords = wordFrequencies.length

  const sortedFrequencies = useMemo(() => {
    return [...wordFrequencies].sort((a, b) => {
      if (sortBy === 'count') {
        return sortOrder === 'asc' ? a.count - b.count : b.count - a.count
      } else {
        return sortOrder === 'asc' ? a.word.localeCompare(b.word) : b.word.localeCompare(a.word)
      }
    })
  }, [wordFrequencies, sortBy, sortOrder])

  const paginatedFrequencies = useMemo(() => {
    const startIndex = (currentPage - 1) * wordsPerPage
    return sortedFrequencies.slice(startIndex, startIndex + wordsPerPage)
  }, [sortedFrequencies, currentPage, wordsPerPage])

  const totalPages = Math.ceil(wordFrequencies.length / wordsPerPage)

  const handleWordClick = (word: string) => {
    setSelectedWord(word)
  }

  const closeModal = () => {
    setSelectedWord(null)
  }

  const handleSort = (column: 'count' | 'word') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('desc')
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-lg font-semibold">Total Words: {totalWords}</p>
        <p className="text-lg font-semibold">Unique Words: {uniqueWords}</p>
      </div>
      <div className="flex justify-between items-center">
        <div>
          <label htmlFor="wordsPerPage" className="mr-2">Words per page:</label>
          <select
            id="wordsPerPage"
            value={wordsPerPage}
            onChange={(e) => {
              setWordsPerPage(Number(e.target.value))
              setCurrentPage(1)
            }}
            className="border rounded p-1"
          >
            {[50, 100, 250, 500, 1000].map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </div>
        <div>
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-2 py-1 bg-gray-200 rounded mr-2 disabled:opacity-50"
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-2 py-1 bg-gray-200 rounded ml-2 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
      <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('word')}>
              Word
              {sortBy === 'word' && (sortOrder === 'asc' ? <ChevronUp className="inline ml-1" /> : <ChevronDown className="inline ml-1" />)}
            </th>
            <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('count')}>
              Occurrences
              {sortBy === 'count' && (sortOrder === 'asc' ? <ChevronUp className="inline ml-1" /> : <ChevronDown className="inline ml-1" />)}
            </th>
            <th className="px-4 py-2">Percentage</th>
          </tr>
        </thead>
        <tbody>
          {paginatedFrequencies.map((item, index) => (
            <tr key={item.word} className="hover:bg-gray-100">
              <td className="border px-4 py-2">{(currentPage - 1) * wordsPerPage + index + 1}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleWordClick(item.word)}
                  className="text-blue-500 hover:underline"
                >
                  {item.word}
                </button>
              </td>
              <td className="border px-4 py-2">{item.count}</td>
              <td className="border px-4 py-2">{item.percentage.toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedWord && (
        <ExampleModal word={selectedWord} text={text} onClose={closeModal} />
      )}
    </div>
  )
}

export default FrequencyTable