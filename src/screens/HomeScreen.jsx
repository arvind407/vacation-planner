import useUser from '../hooks/useUser'
import heroImg from '../assets/hero.jpg'
import parisImg from '../assets/paris.jpg'
import tokyoImg from '../assets/japan.jpg'
import baliImg from '../assets/bali.jpg'

function HomeScreen() {
  const { user } = useUser()
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24">
      {/* Hero Section */}
      <div
        className="relative h-[600px] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <div className="inline-block px-4 py-2 mb-6 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <span className="text-white text-sm font-medium tracking-wide">
              ✈️ Explore the World with Confidence
            </span>
          </div>
          <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-4 tracking-tight">
            Your Next Adventure
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mt-2">
              Awaits
            </span>
          </h1>
          <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
            Welcome back, {user.firstName}! Discover breathtaking destinations
            and create unforgettable memories
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-3xl mx-auto backdrop-blur-sm bg-white/95 p-2 rounded-2xl shadow-2xl">
            <div className="flex-1 flex items-center px-4">
              <span className="text-2xl mr-3">🔍</span>
              <input
                type="text"
                placeholder="Search destinations, activities, or experiences..."
                className="flex-1 py-4 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none text-lg"
              />
            </div>
            <button className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform">
              Explore Now
            </button>
          </div>
        </div>
      </div>

      {/* Featured Destinations Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 mb-4 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold tracking-wide uppercase">
            Popular Picks
          </span>
          <h2 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Featured Destinations
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Hand-picked locations that promise extraordinary experience
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 - Paris */}
          <div className="group relative bg-white rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer">
            <div className="absolute top-4 right-4 z-20 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              TRENDING
            </div>
            <div className="relative h-72 overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700"
                style={{ backgroundImage: `url(${parisImg})` }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            </div>
            <div className="relative -mt-20 px-6 pb-6 z-10">
              <div className="bg-white rounded-2xl p-5 shadow-xl">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                      Paris
                    </h3>
                    <p className="text-gray-500 text-sm">France</p>
                  </div>
                  <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                    <span className="text-yellow-500 text-lg">★</span>
                    <span className="ml-1 text-gray-900 font-bold text-sm">
                      5.0
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-gray-600 text-sm">Starting from</span>
                  <span className="text-blue-600 text-xl font-bold">$899</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 - Tokyo */}
          <div className="group relative bg-white rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer">
            <div className="absolute top-4 right-4 z-20 bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              POPULAR
            </div>
            <div className="relative h-72 overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700"
                style={{ backgroundImage: `url(${tokyoImg})` }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            </div>
            <div className="relative -mt-20 px-6 pb-6 z-10">
              <div className="bg-white rounded-2xl p-5 shadow-xl">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                      Tokyo
                    </h3>
                    <p className="text-gray-500 text-sm">Japan</p>
                  </div>
                  <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                    <span className="text-yellow-500 text-lg">★</span>
                    <span className="ml-1 text-gray-900 font-bold text-sm">
                      4.8
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-gray-600 text-sm">Starting from</span>
                  <span className="text-blue-600 text-xl font-bold">
                    $1,299
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3 - Bali */}
          <div className="group relative bg-white rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer">
            <div className="absolute top-4 right-4 z-20 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              FEATURED
            </div>
            <div className="relative h-72 overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700"
                style={{ backgroundImage: `url(${baliImg})` }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            </div>
            <div className="relative -mt-20 px-6 pb-6 z-10">
              <div className="bg-white rounded-2xl p-5 shadow-xl">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                      Bali
                    </h3>
                    <p className="text-gray-500 text-sm">Indonesia</p>
                  </div>
                  <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                    <span className="text-yellow-500 text-lg">★</span>
                    <span className="ml-1 text-gray-900 font-bold text-sm">
                      4.9
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-gray-600 text-sm">Starting from</span>
                  <span className="text-blue-600 text-xl font-bold">$699</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeScreen
