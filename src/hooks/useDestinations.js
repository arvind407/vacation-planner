import { useState, useMemo } from 'react'

const destinations = [
  {
    id: 1,
    name: 'Santorini',
    country: 'Greece',
    type: 'beach',
    rating: 4.9,
    priceRange: '$$$',
    image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800',
  },
  {
    id: 2,
    name: 'Tokyo',
    country: 'Japan',
    type: 'city',
    rating: 4.8,
    priceRange: '$$$$',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
  },
  {
    id: 3,
    name: 'Swiss Alps',
    country: 'Switzerland',
    type: 'mountain',
    rating: 5.0,
    priceRange: '$$$$',
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800',
  },
  {
    id: 4,
    name: 'Bali',
    country: 'Indonesia',
    type: 'beach',
    rating: 4.7,
    priceRange: '$$',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
  },
  {
    id: 5,
    name: 'New Zealand',
    country: 'New Zealand',
    type: 'adventure',
    rating: 4.9,
    priceRange: '$$$',
    image: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=800',
  },
  {
    id: 6,
    name: 'Paris',
    country: 'France',
    type: 'city',
    rating: 4.8,
    priceRange: '$$$',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
  },
  {
    id: 7,
    name: 'Maldives',
    country: 'Maldives',
    type: 'beach',
    rating: 5.0,
    priceRange: '$$$$',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800',
  },
  {
    id: 8,
    name: 'Patagonia',
    country: 'Argentina',
    type: 'mountain',
    rating: 4.9,
    priceRange: '$$$',
    image: 'https://images.unsplash.com/photo-1570714243497-3f9842b07d3e?w=800',
  },
  {
    id: 9,
    name: 'Iceland',
    country: 'Iceland',
    type: 'adventure',
    rating: 4.8,
    priceRange: '$$$$',
    image: 'https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=800',
  },
  {
    id: 10,
    name: 'New York',
    country: 'USA',
    type: 'city',
    rating: 4.7,
    priceRange: '$$$$',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800',
  },
  {
    id: 11,
    name: 'Machu Picchu',
    country: 'Peru',
    type: 'adventure',
    rating: 5.0,
    priceRange: '$$',
    image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800',
  },
  {
    id: 12,
    name: 'Norwegian Fjords',
    country: 'Norway',
    type: 'mountain',
    rating: 4.9,
    priceRange: '$$$',
    image: 'https://images.unsplash.com/photo-1601439678777-b2b3c56fa627?w=800',
  },
]

export default function useDestinations() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredDestinations = useMemo(() => {
    return destinations.filter((destination) => {
      const matchesFilter =
        activeFilter === 'all' || destination.type === activeFilter
      const matchesSearch = destination.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
      return matchesFilter && matchesSearch
    })
  }, [activeFilter, searchTerm])

  return {
    destinations,
    activeFilter,
    setActiveFilter,
    searchTerm,
    setSearchTerm,
    filteredDestinations,
  }
}
