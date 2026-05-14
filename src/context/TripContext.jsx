import { createContext, useContext, useState, useEffect } from 'react'

const TripContext = createContext()

const API_BASE_URL = 'http://localhost:3001'

export function TripProvider({ children }) {
  const [trips, setTrips] = useState([])
  const [currentTrip, setCurrentTrip] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch all trips on mount
  useEffect(() => {
    fetchTrips()
  }, [])

  const fetchTrips = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${API_BASE_URL}/trips`)
      if (!response.ok) {
        throw new Error('Failed to fetch trips')
      }
      const data = await response.json()
      setTrips(data)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching trips:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchTrip = async (id) => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${API_BASE_URL}/trips/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch trip')
      }
      const data = await response.json()
      setCurrentTrip(data)
      return data
    } catch (err) {
      setError(err.message)
      console.error('Error fetching trip:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const createTrip = async (tripData) => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${API_BASE_URL}/trips`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tripData),
      })
      if (!response.ok) {
        throw new Error('Failed to create trip')
      }
      const newTrip = await response.json()
      setTrips((prev) => [...prev, newTrip])
      setCurrentTrip(newTrip)
      return newTrip
    } catch (err) {
      setError(err.message)
      console.error('Error creating trip:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const addActivity = async (tripId, dayIndex, activity) => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${API_BASE_URL}/trips/${tripId}/activities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dayIndex, activity }),
      })
      if (!response.ok) {
        throw new Error('Failed to add activity')
      }
      const updatedTrip = await response.json()
      setTrips((prev) =>
        prev.map((trip) => (trip.id === tripId ? updatedTrip : trip))
      )
      if (currentTrip?.id === tripId) {
        setCurrentTrip(updatedTrip)
      }
      return updatedTrip
    } catch (err) {
      setError(err.message)
      console.error('Error adding activity:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const clearCurrentTrip = () => {
    setCurrentTrip(null)
  }

  return (
    <TripContext.Provider
      value={{
        trips,
        currentTrip,
        loading,
        error,
        fetchTrips,
        fetchTrip,
        createTrip,
        addActivity,
        clearCurrentTrip,
        setCurrentTrip,
      }}
    >
      {children}
    </TripContext.Provider>
  )
}

export function useTrip() {
  const context = useContext(TripContext)
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider')
  }
  return context
}
