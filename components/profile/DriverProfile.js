"use client"

import { useState } from "react"
import Image from "next/image"
import { Star, Shield, Clock, FileText } from "lucide-react"
import { Button } from "@/components/ui/buttons"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import NotificationBell from "../NotificationBell"

export default function DriverProfile({ driver }) {
  const [isEditing, setIsEditing] = useState(false)
  const [showDocuments, setShowDocuments] = useState(false)
  const [showSchedule, setShowSchedule] = useState(false)

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    setIsEditing(false)
    // Here you would typically send the updated driver data to your backend
  }

  const handleDocumentUpload = (type) => {
    // In a real app, this would open a file picker and handle document upload
    alert(`Upload new ${type} document`)
  }

  // Safely access nested properties
  const stats = driver?.earnings?.stats || {
    completionRate: 0,
    averageRating: 0,
    cancellationRate: 0,
  }

  return (
    <div className="max-w-4xl mx-auto">
      
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-4 sm:p-6 md:p-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
            {/* Profile image and info section */}
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-0">
              <div className="relative w-32 h-32">
                <Image
                  // src={driver?.avatar || "/placeholder.svg"}
                  src= "/user.png"
                
                  alt={driver?.name || "Driver"}
                  fill
                  className="rounded-full object-cover border-4 border-white shadow-lg"
                />
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full shadow-lg">
                    <FileText className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-bold text-gray-800">{driver?.name}</h2>
                <div className="flex items-center justify-center sm:justify-start mt-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="ml-1 text-gray-600">{driver?.rating} Rating</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start mt-1">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span className="ml-1 text-gray-600">{driver?.ridesCompleted} Rides</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
              {!isEditing ? (
                <Button onClick={handleEdit} className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white">
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600 text-white">
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Performance */}
            <div className="lg:col-span-1">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Completion Rate</span>
                      <span className="font-medium">{stats.completionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${stats.completionRate}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Average Rating</span>
                      <span className="font-medium">{stats.averageRating}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: `${(stats.averageRating / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Cancellation Rate</span>
                      <span className="font-medium">{stats.cancellationRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: `${stats.cancellationRate}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Column - Vehicle & Documents */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {/* Vehicle Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Vehicle Information</h3>
                  <div className="bg-gray-50 p-4 rounded">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-600">Make</label>
                        <p className="font-medium">{driver.vehicle?.make}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Model</label>
                        <p className="font-medium">{driver.vehicle?.model}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Year</label>
                        <p className="font-medium">{driver.vehicle?.year}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">License Plate</label>
                        <p className="font-medium">{driver.vehicle?.licensePlate}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Documents Section */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">Documents</h3>
                    <button
                      onClick={() => setShowDocuments(!showDocuments)}
                      className="text-orange-500 hover:text-orange-600 text-sm font-medium"
                    >
                      {showDocuments ? "Hide" : "View All"}
                    </button>
                  </div>
                  {showDocuments && (
                    <div className="space-y-3">
                      {driver.documents.map((doc, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">{doc.type}</h4>
                              <p className="text-sm text-gray-600">#{doc.number}</p>
                              <p className="text-sm text-gray-600">
                                Expires: {new Date(doc.expiryDate).toLocaleDateString()}
                              </p>
                            </div>
                            <span
                              className={`text-sm ${doc.status === "approved" ? "text-green-600" : "text-orange-600"}`}
                            >
                              {doc.status}
                            </span>
                          </div>
                          {isEditing && (
                            <button
                              onClick={() => handleDocumentUpload(doc.type)}
                              className="mt-2 text-sm text-orange-500 hover:text-orange-600"
                            >
                              Upload New
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section - Earnings & Schedule */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Earnings Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Earnings</h3>
              <div className="bg-gray-50 p-4 rounded space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Today</label>
                    <p className="text-2xl font-bold text-green-600">${driver.earnings?.today || 0}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">This Week</label>
                    <p className="text-2xl font-bold text-green-600">${driver.earnings?.week || 0}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pending Payments</p>
                  <p className="text-orange-500 font-medium">${driver.earnings.pending.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Schedule Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-800">Schedule</h3>
                <button
                  onClick={() => setShowSchedule(!showSchedule)}
                  className="text-orange-500 hover:text-orange-600 text-sm font-medium"
                >
                  {showSchedule ? "Hide" : "View"}
                </button>
              </div>
              {showSchedule && (
                <div className="bg-gray-50 p-4 rounded">
                  {Object.entries(driver.schedule).map(([day, schedule]) => (
                    <div key={day} className="flex items-center justify-between py-2">
                      <span className="capitalize">{day}</span>
                      <span className={schedule.active ? "text-gray-800" : "text-gray-400"}>
                        {schedule.active ? schedule.hours : "Not Available"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

