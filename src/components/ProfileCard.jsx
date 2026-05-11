function ProfileCard({ userData }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="text-center">
        {/* Avatar */}
        <div className="inline-block relative mb-4">
          <img
            src={userData.avatar}
            alt={userData.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-gray-100"
          />
        </div>

        {/* User Info */}
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          {userData.name}
        </h2>
        <p className="text-sm text-gray-600 mb-4">{userData.email}</p>

        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">Member since</p>
          <p className="text-sm font-semibold text-gray-900">
            {userData.memberSince}
          </p>
        </div>

        <button className="mt-6 w-full px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md text-sm hover:bg-gray-50 transition-colors">
          Edit Profile
        </button>
      </div>
    </div>
  )
}

export default ProfileCard
