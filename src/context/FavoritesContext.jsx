import { createContext, useContext, useState, useEffect } from 'react'

const FavoritesContext = createContext()

const API_BASE_URL = 'http://localhost:3001'

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch favorites on mount
  useEffect(() => {
    fetchFavorites()
  }, [])

  const fetchFavorites = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${API_BASE_URL}/favorites`)
      if (!response.ok) {
        throw new Error('Failed to fetch favorites')
      }
      const data = await response.json()
      setFavorites(data)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching favorites:', err)
    } finally {
      setLoading(false)
    }
  }

  const addFavorite = async (destination) => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${API_BASE_URL}/favorites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ destination }),
      })
      if (!response.ok) {
        throw new Error('Failed to add favorite')
      }
      const newFavorite = await response.json()
      setFavorites((prev) => [...prev, newFavorite])
      return newFavorite
    } catch (err) {
      setError(err.message)
      console.error('Error adding favorite:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const removeFavorite = async (id) => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${API_BASE_URL}/favorites/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to remove favorite')
      }
      setFavorites((prev) => prev.filter((fav) => fav.id !== id))
    } catch (err) {
      setError(err.message)
      console.error('Error removing favorite:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const isFavorite = (id) => {
    return favorites.some((fav) => fav.id === id)
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        loading,
        error,
        addFavorite,
        removeFavorite,
        isFavorite,
        fetchFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}
