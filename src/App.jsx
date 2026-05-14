import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import HomeScreen from './screens/HomeScreen.jsx'
import DestinationExplorerScreen from './screens/DestinationExplorerScreen.jsx'
import TripPlannerScreen from './screens/TripPlannerScreen.jsx'
import HotelDetailScreen from './screens/HotelDetailScreen.jsx'
import UserProfileScreen from './screens/UserProfileScreen.jsx'
import './App.css'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/explore" element={<DestinationExplorerScreen />} />
        <Route path="/planner" element={<TripPlannerScreen />} />
        <Route path="/hotels" element={<HotelDetailScreen />} />
        <Route path="/hotels/:id" element={<HotelDetailScreen />} />
        <Route path="/profile" element={<UserProfileScreen />} />
      </Routes>
    </>
  )
}

export default App
