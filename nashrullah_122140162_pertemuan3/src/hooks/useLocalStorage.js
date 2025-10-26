import { useEffect, useState } from 'react'

const parseJSON = (value) => {
  try {
    return value === 'undefined' ? undefined : JSON.parse(value ?? '')
  } catch (error) {
    console.warn('Gagal mem-parse data localStorage', error)
    return undefined
  }
}

export function useLocalStorage(key, initialValue) {
  const readValue = () => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    const item = window.localStorage.getItem(key)
    return item !== null ? parseJSON(item) ?? initialValue : initialValue
  }

  const [storedValue, setStoredValue] = useState(readValue)

  useEffect(() => {
    setStoredValue(readValue())
    // sync state when key changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error('Tidak dapat menyimpan ke localStorage', error)
    }
  }

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === key) {
        setStoredValue(parseJSON(event.newValue))
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [key])

  return [storedValue, setValue]
}
