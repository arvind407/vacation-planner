import { createContext, useContext, useState } from 'react'

const TripContext = createContext()

export function TripProvider({ children }) {
  const [currentTrip, setCurrentTrip] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    days: [],
  })

  const updateTrip = (tripData) => {
    setCurrentTrip((prev) => ({ ...prev, ...tripData }))
  }

  const clearTrip = () => {
    setCurrentTrip({
      destination: '',
      startDate: '',
      endDate: '',
      days: [],
    })
  }

  return (
    <TripContext.Provider value={{ currentTrip, updateTrip, clearTrip }}>
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
