import DestinationCard from '../components/DestinationCard.jsx'
import useDestinations from '../hooks/useDestinations'
import useFavorites from '../hooks/useFavorites'

const filterTypes = [
  { id: 'all', label: 'All Destinations', icon: '🌍' },
  { id: 'beach', label: 'Beach', icon: '🏖️' },
  { id: 'city', label: 'City', icon: '🏙️' },
  { id: 'mountain', label: 'Mountain', icon: '⛰️' },
  { id: 'adventure', label: 'Adventure', icon: '🎒' },
]

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
      <div className="h-64 bg-gray-300"></div>
      <div className="p-6">
        <div className="h-6 bg-gray-300 rounded mb-3 w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded mb-4 w-1/2"></div>
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  )
}

function DestinationExplorerScreen() {
  const {
    loading,
    error,
    activeFilter,
    setActiveFilter,
    searchTerm,
    setSearchTerm,
    filteredDestinations,
    refetch,
  } = useDestinations()

  const { addFavorite, removeFavorite, isFavorite } = useFavorites()

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24">
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Error Banner */}
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-xl p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h3 className="font-semibold text-red-900">Error Loading Destinations</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
            <button
              onClick={refetch}
              className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200"
            >
              Retry
            </button>
          </div>
        )}
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Explore Destinations
          </h1>
          <p className="text-xl text-gray-600">
            Discover your next adventure from our handpicked collection of
            amazing destinations
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <span className="text-gray-400 text-xl">🔍</span>
            </div>
            <input
              type="text"
              placeholder="Search destinations by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
            />
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-3">
            {filterTypes.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeFilter === filter.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{filter.icon}</span>
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing{' '}
            <span className="font-semibold text-gray-900">
              {filteredDestinations.length}
            </span>{' '}
            destination{filteredDestinations.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            // Show 6 skeleton cards while loading
            Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))
          ) : (
            // Show actual destination cards
            filteredDestinations.map((destination) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                isFavorite={isFavorite(destination.id)}
                onToggleFavorite={() => {
                  if (isFavorite(destination.id)) {
                    removeFavorite(destination.id)
                  } else {
                    addFavorite(destination)
                  }
                }}
              />
            ))
          )}
        </div>

        {/* No Results */}
        {!loading && filteredDestinations.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No destinations found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filters to find what you're looking
              for
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DestinationExplorerScreen
