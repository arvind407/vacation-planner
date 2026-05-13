import { useState, useEffect, useMemo } from 'react'
import { fetchDestinationsByCategory } from '../api/destinations.js'

export default function useDestinations() {
  const [destinations, setDestinations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Fetch destinations when activeFilter changes - default to Rome, Italy
  useEffect(() => {
    async function loadDestinations() {
      try {
        setLoading(true)
        setError(null)
        setDestinations([]) // Clear previous results

        // Fetch based on active filter
        const data = await fetchDestinationsByCategory(
          'Rome',
          'Italy',
          activeFilter
        )
        setDestinations(data)
      } catch (err) {
        setError(err.message || 'Failed to load destinations')
      } finally {
        setLoading(false)
      }
    }

    loadDestinations()
  }, [activeFilter])

  // Refetch function for manual reload
  const refetch = async () => {
    try {
      setLoading(true)
      setError(null)
      setDestinations([]) // Clear previous results

      const data = await fetchDestinationsByCategory(
        'Rome',
        'Italy',
        activeFilter
      )
      setDestinations(data)
    } catch (err) {
      setError(err.message || 'Failed to load destinations')
    } finally {
      setLoading(false)
    }
  }

  const filteredDestinations = useMemo(() => {
    return destinations.filter((destination) => {
      // Only filter by search term - category filtering is done by API
      const matchesSearch = destination.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())

      return matchesSearch
    })
  }, [destinations, searchTerm])

  return {
    destinations,
    loading,
    error,
    activeFilter,
    setActiveFilter,
    searchTerm,
    setSearchTerm,
    filteredDestinations,
    refetch,
  }
}
