import { createContext, useContext, useState } from 'react'

const UserContext = createContext()

export function UserProvider({ children }) {
  const [user, setUser] = useState({
    firstName: 'Sarah',
    lastName: 'Anderson',
    email: 'sarah.anderson@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    memberSince: 'January 2023',
  })

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
