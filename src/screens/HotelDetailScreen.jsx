import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getDestinationDetails } from '../api/destinations.js'
import HotelCard from '../components/HotelCard.jsx'

const mockImages = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200',
  'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200',
]

const mockAmenities = [
  { name: 'Swimming Pool', icon: 'pool' },
  { name: 'Free WiFi', icon: 'wifi' },
  { name: 'Free Parking', icon: 'parking' },
  { name: 'Breakfast Included', icon: 'breakfast' },
  { name: 'Fitness Center', icon: 'fitness' },
  { name: 'Room Service', icon: 'service' },
]

const mockReviews = [
  {
    id: 1,
    author: 'Sarah Johnson',
    rating: 5,
    date: 'March 2024',
    comment:
      'Absolutely wonderful stay! The staff was incredibly friendly and the room was spotless. The location is perfect for exploring the city.',
  },
  {
    id: 2,
    author: 'Michael Chen',
    rating: 4,
    date: 'February 2024',
    comment:
      'Great hotel with excellent amenities. The breakfast buffet was fantastic. Only minor issue was some noise from the street, but overall highly recommend.',
  },
  {
    id: 3,
    author: 'Emma Williams',
    rating: 5,
    date: 'January 2024',
    comment:
      'Best hotel experience in Paris! The spa was amazing and the views from our room were breathtaking. Will definitely return.',
  },
]

const amenityIcons = {
  pool: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
      />
    </svg>
  ),
  wifi: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
      />
    </svg>
  ),
  parking: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
      />
    </svg>
  ),
  breakfast: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
      />
    </svg>
  ),
  fitness: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    </svg>
  ),
  service: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
}

function HotelDetailScreen() {
  const { id } = useParams()
  const [destination, setDestination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    async function loadDestination() {
      try {
        setLoading(true)
        setError(null)
        const data = await getDestinationDetails(id)
        setDestination(data)
      } catch (err) {
        setError(err.message || 'Failed to load destination details')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadDestination()
    } else {
      // No ID provided - show sample/mock destination
      setLoading(false)
      setDestination({
        name: 'Grand Luxury Hotel & Spa',
        address: 'Downtown Paris, France',
        description:
          'Experience luxury and comfort in the heart of Paris. Our hotel features elegant rooms with modern amenities, a world-class spa, and stunning views of the city. Perfect for both business and leisure travelers.',
      })
    }
  }, [id])

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === mockImages.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? mockImages.length - 1 : prev - 1
    )
  }

  // Loading spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600 mb-4"></div>
          <p className="text-gray-600 text-lg">Loading destination details...</p>
        </div>
      </div>
    )
  }

  // Error message
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-red-900 mb-2">Error Loading Destination</h2>
            <p className="text-red-700 mb-6">{error}</p>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Create hotelData object from destination data
  const hotelData = {
    name: destination.name,
    location: destination.address,
    rating: 4.5,
    reviewCount: 128,
    description: destination.description,
    pricePerNight: 299,
    images: mockImages,
    amenities: mockAmenities,
    reviews: mockReviews,
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-8">
        {/* Image Gallery */}
        <div className="mb-8">
          <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden">
            <img
              src={mockImages[currentImageIndex]}
              alt={`${hotelData.name} view ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />

            {/* Navigation Arrows */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-900"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-900"
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

            {/* Navigation Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {mockImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImageIndex
                      ? 'bg-white w-8'
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hotel Info */}
            <HotelCard hotelData={hotelData} />

            {/* Amenities */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Amenities
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {mockAmenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="text-gray-700">
                      {amenityIcons[amenity.icon]}
                    </div>
                    <span className="text-sm text-gray-700">{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Guest Reviews
              </h2>
              <div className="space-y-6">
                {mockReviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {review.author}
                        </p>
                        <p className="text-sm text-gray-500">{review.date}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'text-yellow-500'
                                : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-28">
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-gray-900">
                    ${hotelData.pricePerNight}
                  </span>
                  <span className="text-gray-600">/ night</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600 mb-4">
                  <svg
                    className="w-4 h-4 text-yellow-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-semibold">{hotelData.rating}</span>
                  <span>({hotelData.reviewCount} reviews)</span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-in
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-out
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Guests
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>1 guest</option>
                    <option>2 guests</option>
                    <option>3 guests</option>
                    <option>4 guests</option>
                  </select>
                </div>
              </div>

              <button className="w-full px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg transition-colors">
                Book Now
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Free cancellation up to 24 hours before check-in
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HotelDetailScreen
