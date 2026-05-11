function DestinationCard({ destination, isFavorite, onToggleFavorite }) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer">
      {/* Image */}
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500">
        <div
          className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700"
          style={{ backgroundImage: `url(${destination.image})` }}
        ></div>
        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleFavorite()
          }}
          className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors z-10"
        >
          <svg
            className={`w-5 h-5 ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`}
            fill={isFavorite ? 'currentColor' : 'none'}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
          <span className="text-sm font-bold text-gray-900">
            {destination.priceRange}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-3">
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {destination.name}
          </h3>
          <p className="text-gray-500 text-sm">{destination.country}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center bg-yellow-50 px-3 py-1.5 rounded-full">
            <span className="text-yellow-500 text-lg">★</span>
            <span className="ml-1.5 text-gray-900 font-bold text-sm">
              {destination.rating}
            </span>
          </div>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-100 px-3 py-1.5 rounded-full">
            {destination.type}
          </span>
        </div>
      </div>
    </div>
  )
}

export default DestinationCard
