import { useState } from 'react'
import useTripPlanner from '../hooks/useTripPlanner'

const destinations = [
  'Paris, France',
  'Tokyo, Japan',
  'Bali, Indonesia',
  'New York, USA',
  'London, UK',
  'Barcelona, Spain',
  'Dubai, UAE',
  'Sydney, Australia',
]

const timeSlots = [
  { id: 'morning', label: 'Morning', time: '6:00 - 12:00' },
  { id: 'afternoon', label: 'Afternoon', time: '12:00 - 18:00' },
  { id: 'evening', label: 'Evening', time: '18:00 - 24:00' },
]

function TripPlannerScreen() {
  const {
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
    addActivity: addActivityToHook,
    removeActivity: removeActivityFromHook,
  } = useTripPlanner()

  // UI-only state
  const [activeForm, setActiveForm] = useState(null)
  const [newActivity, setNewActivity] = useState({ name: '', cost: '' })
  const [isEditingDates, setIsEditingDates] = useState(false)

  const addActivity = (dayIndex, timeSlot) => {
    if (!newActivity.name) return

    addActivityToHook(dayIndex, timeSlot, {
      name: newActivity.name,
      cost: parseFloat(newActivity.cost) || 0,
    })

    setNewActivity({ name: '', cost: '' })
    setActiveForm(null)
  }

  const removeActivity = (dayIndex, timeSlot, activityIndex) => {
    removeActivityFromHook(dayIndex, timeSlot, activityIndex)
  }

  const totalBudget = estimatedBudget

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Trip Planner
          </h1>
          <p className="text-gray-600">
            Plan your itinerary day by day
          </p>
        </div>

        <div className="flex gap-8">
          {/* Left Sidebar */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-28">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Trip details
              </h2>

              {/* Destination Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destination
                </label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select destination</option>
                  {destinations.map((dest) => (
                    <option key={dest} value={dest}>
                      {dest}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Inputs - Collapsible */}
              {!totalDays || isEditingDates ? (
                <>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End date
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </>
              ) : null}

              {/* Summary */}
              {totalDays > 0 && (
                <div className="pt-6 border-t border-gray-200 space-y-4">
                  <button
                    onClick={() => setIsEditingDates(!isEditingDates)}
                    className="w-full flex justify-between items-center hover:bg-gray-50 -mx-2 px-2 py-1 rounded transition-colors"
                  >
                    <span className="text-sm text-gray-600">Duration</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">
                        {totalDays} {totalDays === 1 ? 'day' : 'days'}
                      </span>
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </div>
                  </button>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Activities</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {Object.values(activities).reduce(
                        (total, day) =>
                          total +
                          Object.values(day).reduce(
                            (dayTotal, slot) => dayTotal + slot.length,
                            0
                          ),
                        0
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total budget</span>
                    <span className="text-sm font-semibold text-gray-900">
                      ${totalBudget.toFixed(2)}
                    </span>
                  </div>
                  {totalBudget > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Per day</span>
                      <span className="text-sm font-semibold text-gray-900">
                        ${(totalBudget / totalDays).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {days.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <div className="max-w-md mx-auto">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No itinerary yet
                  </h3>
                  <p className="text-sm text-gray-500">
                    Get started by selecting a destination and your travel dates
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {days.map((day) => (
                  <div
                    key={day.index}
                    className="bg-white rounded-lg border border-gray-200"
                  >
                    {/* Day Header */}
                    <div className="px-6 py-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Day {day.index + 1}
                          </h3>
                          <p className="text-sm text-gray-500">{day.date}</p>
                        </div>
                        <span className="text-sm text-gray-500">
                          {(activities[day.index] &&
                            Object.values(activities[day.index]).reduce(
                              (total, slot) => total + slot.length,
                              0
                            )) ||
                            0}{' '}
                          {((activities[day.index] &&
                            Object.values(activities[day.index]).reduce(
                              (total, slot) => total + slot.length,
                              0
                            )) ||
                            0) === 1
                            ? 'activity'
                            : 'activities'}
                        </span>
                      </div>
                    </div>

                    {/* Time Slots */}
                    <div className="divide-y divide-gray-200">
                      {timeSlots.map((slot) => (
                        <div key={slot.id} className="px-6 py-5">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="text-sm font-semibold text-gray-900">
                                {slot.label}
                              </h4>
                              <p className="text-xs text-gray-500">
                                {slot.time}
                              </p>
                            </div>
                            <button
                              onClick={() =>
                                setActiveForm(`${day.index}-${slot.id}`)
                              }
                              className="text-sm font-medium text-blue-600 hover:text-blue-700"
                            >
                              + Add activity
                            </button>
                          </div>

                          {/* Activities List */}
                          <div className="space-y-2">
                            {activities[day.index]?.[slot.id]?.map(
                              (activity, idx) => (
                                <div
                                  key={idx}
                                  className="group flex items-center justify-between p-3 rounded-md border border-gray-200 hover:bg-gray-50"
                                >
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">
                                      {activity.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      ${activity.cost.toFixed(2)}
                                    </p>
                                  </div>
                                  <button
                                    onClick={() =>
                                      removeActivity(day.index, slot.id, idx)
                                    }
                                    className="text-xs font-medium text-red-600 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    Remove
                                  </button>
                                </div>
                              )
                            )}
                          </div>

                          {/* Add Activity Form */}
                          {activeForm === `${day.index}-${slot.id}` && (
                            <div className="mt-3 p-4 bg-gray-50 rounded-md border border-gray-200">
                              <div className="space-y-3">
                                <input
                                  type="text"
                                  placeholder="Activity name"
                                  value={newActivity.name}
                                  onChange={(e) =>
                                    setNewActivity({
                                      ...newActivity,
                                      name: e.target.value,
                                    })
                                  }
                                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <input
                                  type="number"
                                  placeholder="Cost ($)"
                                  value={newActivity.cost}
                                  onChange={(e) =>
                                    setNewActivity({
                                      ...newActivity,
                                      cost: e.target.value,
                                    })
                                  }
                                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <div className="flex gap-2">
                                  <button
                                    onClick={() =>
                                      addActivity(day.index, slot.id)
                                    }
                                    className="flex-1 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-md transition-colors"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => {
                                      setActiveForm(null)
                                      setNewActivity({ name: '', cost: '' })
                                    }}
                                    className="flex-1 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-md border border-gray-300 transition-colors"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TripPlannerScreen
