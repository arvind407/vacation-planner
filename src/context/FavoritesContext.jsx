import { createContext, useContext, useState } from 'react'

const FavoritesContext = createContext()

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([
    {
      id: 1,
      name: 'Santorini',
      country: 'Greece',
      image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400',
    },
    {
      id: 2,
      name: 'Kyoto',
      country: 'Japan',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400',
    },
    {
      id: 3,
      name: 'Swiss Alps',
      country: 'Switzerland',
      image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400',
    },
    {
      id: 4,
      name: 'Bali',
      country: 'Indonesia',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400',
    },
  ])

  const addFavorite = (destination) => {
    setFavorites((prev) => {
      // Check if already in favorites
      if (prev.some((fav) => fav.id === destination.id)) {
        return prev
      }
      return [...prev, destination]
    })
  }

  const removeFavorite = (id) => {
    setFavorites((prev) => prev.filter((fav) => fav.id !== id))
  }

  const isFavorite = (id) => {
    return favorites.some((fav) => fav.id === id)
  }

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, isFavorite }}
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
