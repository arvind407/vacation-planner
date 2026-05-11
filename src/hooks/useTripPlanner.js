import { useState, useMemo } from 'react'

export default function useTripPlanner() {
  const [destination, setDestination] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [activities, setActivities] = useState({})

  const totalDays = useMemo(() => {
    if (!startDate || !endDate) return 0
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return diffDays
  }, [startDate, endDate])

  const estimatedBudget = useMemo(() => {
    let total = 0
    Object.values(activities).forEach((dayActivities) => {
      Object.values(dayActivities).forEach((slotActivities) => {
        slotActivities.forEach((activity) => {
          total += parseFloat(activity.cost) || 0
        })
      })
    })
    return total
  }, [activities])

  const days = useMemo(() => {
    if (!startDate || !endDate) return []
    const daysArray = []
    const start = new Date(startDate)
    const total = totalDays

    for (let i = 0; i < total; i++) {
      const currentDate = new Date(start)
      currentDate.setDate(start.getDate() + i)
      daysArray.push({
        index: i,
        date: currentDate.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        }),
      })
    }
    return daysArray
  }, [startDate, endDate, totalDays])

  const addActivity = (dayIndex, timeSlot, activity) => {
    setActivities((prev) => {
      const updatedActivities = { ...prev }

      if (!updatedActivities[dayIndex]) {
        updatedActivities[dayIndex] = {}
      }
      if (!updatedActivities[dayIndex][timeSlot]) {
        updatedActivities[dayIndex][timeSlot] = []
      }

      updatedActivities[dayIndex][timeSlot].push(activity)
      return updatedActivities
    })
  }

  const removeActivity = (dayIndex, timeSlot, activityIndex) => {
    setActivities((prev) => {
      const updatedActivities = { ...prev }
      updatedActivities[dayIndex][timeSlot].splice(activityIndex, 1)
      return updatedActivities
    })
  }

  return {
    destination,
    setDestination,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    activities,
    totalDays,
    estimatedBudget,
    days,
    addActivity,
    removeActivity,
  }
}
