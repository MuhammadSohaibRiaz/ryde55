"use client"

import { useState } from "react"
import Image from "next/image"
import { Star, MapPin, Clock, CreditCard, Shield, History, Bell } from "lucide-react"
import NotificationBell from "../NotificationBell"
import Link from "next/link"
import { Button } from "@/components/ui/buttons"
import { ArrowLeft, Car } from "lucide-react"

export default function UserProfile() {
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    avatar: "/user.png",
    rating: 4.8,
    ridesCompleted: 42,
    favoriteLocations: ["123 Main St, Buffalo, NY", "456 Elm St, Buffalo, NY", "789 Oak St, Buffalo, NY"],
    paymentMethods: [
      { id: 1, type: "Visa", last4: "1234", isDefault: true },
      { id: 2, type: "Mastercard", last4: "5678", isDefault: false },
      { id: 3, type: "Cash App", username: "@johndoe", isDefault: false },
    ],
    rideHistory: [
      {
        id: 1,
        date: "2025-01-21",
        from: "123 Main St",
        to: "Buffalo Airport",
        amount: 45.5,
        driverName: "Jane Smith",
        rating: 5,
      },
      {
        id: 2,
        date: "2025-01-20",
        from: "Buffalo Airport",
        to: "456 Elm St",
        amount: 38.75,
        driverName: "Mike Johnson",
        rating: 4,
      },
    ],
    emergencyContacts: [{ name: "Mary Doe", phone: "+1 (555) 987-6543", relation: "Sister" }],
    twoFactorEnabled: true,
  })

  const [isEditing, setIsEditing] = useState(false)
  const [showRideHistory, setShowRideHistory] = useState(false)
  const [showEmergencyContacts, setShowEmergencyContacts] = useState(false)

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    setIsEditing(false)
    // Here you would typically send the updated user data to your backend
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }))
  }

  const handleAddPaymentMethod = () => {
    // Integrate with Stripe/Cash App here
    alert("Redirecting to payment provider...")
  }

  const handleEmergencySOSClick = () => {
    // In a real app, this would trigger emergency protocols
    alert("Emergency services and Ryde5 support have been notified. Help is on the way.")
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      {/* <div className="flex items-center justify-center mb-6">
        
        <h1 className="text-2xl font-bold  text-gray-800">User Profile</h1>
        
      </div> */}
      <div className="bg-white shadow-lg rounded-lg">
        <div className="p-4 sm:p-6 md:p-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-0">
              <Image
                src={user.avatar || "/placeholder.svg"}
                alt={user.name}
                width={80}
                height={80}
                className="rounded-full"
              />
              <div className="text-center sm:text-left">
                <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
                <div className="flex items-center justify-center sm:justify-start mt-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="ml-1 text-gray-600">{user.rating}</span>
                </div>
                <p className="text-gray-600 mt-1">{user.ridesCompleted} rides completed</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">

              <Link
                href="/register-driver"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors w-full sm:w-auto flex items-center justify-center gap-2"
              >
                <Car className="w-4 h-4" />
                Register as Driver
              </Link>
              {!isEditing && (
                <Button onClick={handleEdit} className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white">
                  Edit Profile
                </Button>
              )}
              <button
                onClick={handleEmergencySOSClick}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors w-full sm:w-auto"
              >
                SOS
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Basic Info */}
            <div className="lg:col-span-1">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                      />
                    ) : (
                      <p className="text-gray-800">{user.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={user.phone}
                        onChange={handleChange}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                      />
                    ) : (
                      <p className="text-gray-800">{user.phone}</p>
                    )}
                  </div>
                  {user.twoFactorEnabled && (
                    <div className="flex items-center mt-2 text-green-600">
                      <Shield className="w-4 h-4 mr-1" />
                      <span className="text-sm">2FA Enabled</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Middle Column - Payment & Locations */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Payment Methods</h3>
                  <div className="space-y-2">
                    {user.paymentMethods.map((method) => (
                      <div key={method.id} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                        <div className="flex items-center">
                          <CreditCard className="w-5 h-5 text-gray-400 mr-2" />
                          <span className="text-gray-700">
                            {method.type} {method.last4 ? `ending in ${method.last4}` : method.username}
                          </span>
                        </div>
                        {method.isDefault && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Default</span>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={handleAddPaymentMethod}
                      className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-orange-500 hover:text-orange-500 transition-colors"
                    >
                      + Add Payment Method
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Favorite Locations</h3>
                  <ul className="space-y-2">
                    {user.favoriteLocations.map((location, index) => (
                      <li key={index} className="flex items-start bg-gray-50 p-3 rounded">
                        <MapPin className="w-5 h-5 text-gray-400 mr-2 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{location}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section - Ride History & Emergency Contacts */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Recent Rides</h3>
              <div className="space-y-2">
                {user.rideHistory.slice(0, 3).map((ride) => (
                  <div key={ride.id} className="bg-gray-50 p-3 rounded">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{ride.date}</p>
                        <p className="text-sm text-gray-600">
                          {ride.from} → {ride.to}
                        </p>
                      </div>
                      <span className="text-sm font-medium">${ride.amount}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="text-gray-600">Driver: {ride.driverName}</span>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1">{ride.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => setShowRideHistory(!showRideHistory)}
                  className="text-orange-500 hover:text-orange-600 text-sm font-medium"
                >
                  View All Rides
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-800">Emergency Contacts</h3>
                <button
                  onClick={() => setShowEmergencyContacts(!showEmergencyContacts)}
                  className="text-orange-500 hover:text-orange-600 text-sm font-medium"
                >
                  {showEmergencyContacts ? "Hide" : "Manage"}
                </button>
              </div>
              {showEmergencyContacts && (
                <div className="bg-gray-50 p-4 rounded">
                  {user.emergencyContacts.map((contact, index) => (
                    <div key={index} className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium">{contact.name}</p>
                        <p className="text-sm text-gray-600">
                          {contact.phone} • {contact.relation}
                        </p>
                      </div>
                      {isEditing && <button className="text-red-500 hover:text-red-600">Remove</button>}
                    </div>
                  ))}
                  {isEditing && (
                    <button className="mt-2 text-orange-500 hover:text-orange-600">+ Add Emergency Contact</button>
                  )}
                </div>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

