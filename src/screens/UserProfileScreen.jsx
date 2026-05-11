import { useState } from 'react'
import ProfileCard from '../components/ProfileCard.jsx'
import useUser from '../hooks/useUser'
import useFavorites from '../hooks/useFavorites'

const pastTrips = [
  {
    id: 1,
    destination: 'Paris, France',
    dates: 'March 15-22, 2024',
    status: 'Completed',
  },
  {
    id: 2,
    destination: 'Tokyo, Japan',
    dates: 'January 8-18, 2024',
    status: 'Completed',
  },
  {
    id: 3,
    destination: 'Barcelona, Spain',
    dates: 'November 3-10, 2023',
    status: 'Completed',
  },
]

function UserProfileScreen() {
  const { user } = useUser()
  const { favorites: savedDestinations, removeFavorite } = useFavorites()

  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [darkModeEnabled, setDarkModeEnabled] = useState(false)

  // Format user data for ProfileCard
  const userData = {
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    memberSince: user.memberSince,
    avatar: user.avatarUrl,
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <ProfileCard userData={userData} />

            {/* Settings */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Settings
              </h3>
              <div className="space-y-4">
                {/* Notifications Toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Notifications
                    </p>
                    <p className="text-xs text-gray-500">
                      Receive trip updates
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setNotificationsEnabled(!notificationsEnabled)
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notificationsEnabled ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Dark Mode Toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Dark Mode
                    </p>
                    <p className="text-xs text-gray-500">
                      Change theme appearance
                    </p>
                  </div>
                  <button
                    onClick={() => setDarkModeEnabled(!darkModeEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      darkModeEnabled ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        darkModeEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Saved Destinations & Past Trips */}
          <div className="lg:col-span-2 space-y-8">
            {/* Saved Destinations */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Saved Destinations
                </h2>
                <span className="text-sm text-gray-500">
                  {savedDestinations.length} saved
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {savedDestinations.map((destination) => (
                  <div
                    key={destination.id}
                    className="group relative rounded-lg overflow-hidden cursor-pointer"
                  >
                    <div className="aspect-square relative">
                      <img
                        src={destination.image}
                        alt={destination.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-white font-semibold text-sm">
                          {destination.name}
                        </p>
                        <p className="text-white/80 text-xs">
                          {destination.country}
                        </p>
                      </div>
                      {/* Remove button on hover */}
                      <button
                        onClick={() => removeFavorite(destination.id)}
                        className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg
                          className="w-4 h-4 text-gray-700"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Past Trips */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Past Trips
                </h2>
                <span className="text-sm text-gray-500">
                  {pastTrips.length} trips
                </span>
              </div>

              <div className="space-y-4">
                {pastTrips.map((trip) => (
                  <div
                    key={trip.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-blue-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {trip.destination}
                        </p>
                        <p className="text-sm text-gray-500">{trip.dates}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        {trip.status}
                      </span>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfileScreen
