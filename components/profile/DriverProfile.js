"use client"

import { useState } from "react"
import Image from "next/image"
import { Star, Shield, Clock, FileText, AlertTriangle } from "lucide-react"
import NotificationBell from "../NotificationBell"
import Link from "next/link"
import { Button } from "@/components/ui/buttons"
import { ArrowLeft } from "lucide-react"

export default function DriverProfile() {
  const [driver, setDriver] = useState({
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1 (555) 987-6543",
    avatar: "/driver.png",
    rating: 4.9,
    ridesCompleted: 1024,
    status: "active", // active, offline, suspended
    vehicle: {
      make: "Toyota",
      model: "Camry",
      year: 2020,
      color: "Silver",
      licensePlate: "ABC 123",
      insurance: {
        provider: "SafeAuto",
        policyNumber: "SA123456789",
        expiryDate: "2025-12-31",
      },
    },
    documents: [
      {
        type: "Driver's License",
        number: "DL123456789",
        expiryDate: "2026-01-01",
        status: "approved",
        lastVerified: "2024-12-01",
      },
      {
        type: "Vehicle Registration",
        number: "VR987654321",
        expiryDate: "2025-06-30",
        status: "approved",
        lastVerified: "2024-12-01",
      },
      {
        type: "Insurance Card",
        number: "IC456789123",
        expiryDate: "2025-12-31",
        status: "approved",
        lastVerified: "2024-12-01",
      },
    ],
    earnings: {
      total: 15780,
      lastWeek: 850,
      currentWeek: 425,
      pending: 150,
      stats: {
        totalTrips: 1024,
        averageRating: 4.9,
        completionRate: 98,
        cancellationRate: 2,
      },
    },
    schedule: {
      monday: { active: true, hours: "9:00 AM - 5:00 PM" },
      tuesday: { active: true, hours: "9:00 AM - 5:00 PM" },
      wednesday: { active: true, hours: "9:00 AM - 5:00 PM" },
      thursday: { active: true, hours: "9:00 AM - 5:00 PM" },
      friday: { active: true, hours: "9:00 AM - 5:00 PM" },
      saturday: { active: false, hours: "" },
      sunday: { active: false, hours: "" },
    },
  })

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

  const handleStatusToggle = () => {
    setDriver((prev) => ({
      ...prev,
      status: prev.status === "active" ? "offline" : "active",
    }))
  }

  const handleDocumentUpload = (type) => {
    // In a real app, this would open a file picker and handle document upload
    alert(`Upload new ${type} document`)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "text-green-600"
      case "pending":
        return "text-yellow-600"
      case "rejected":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <Link href="/main">
          <Button variant="outline" className="flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Driver Profile</h1>
        <NotificationBell />
      </div>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-4 sm:p-6 md:p-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-0">
              <Image
                src={driver.avatar || "/placeholder.svg"}
                alt={driver.name}
                width={80}
                height={80}
                className="rounded-full"
              />
              <div className="text-center sm:text-left">
                <h2 className="text-xl font-semibold text-gray-800">{driver.name}</h2>
                <div className="flex items-center justify-center sm:justify-start mt-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="ml-1 text-gray-600">{driver.rating}</span>
                </div>
                <p className="text-gray-600 mt-1">{driver.ridesCompleted} rides completed</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
              {!isEditing && (
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors w-full sm:w-auto"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Performance */}
            <div className="lg:col-span-1">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Completion Rate</span>
                      <span className="font-medium">{driver.earnings.stats.completionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${driver.earnings.stats.completionRate}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Average Rating</span>
                      <span className="font-medium">{driver.earnings.stats.averageRating}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: `${(driver.earnings.stats.averageRating / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Cancellation Rate</span>
                      <span className="font-medium">{driver.earnings.stats.cancellationRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${driver.earnings.stats.cancellationRate}%` }}
                      />
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
                      {Object.entries(driver.vehicle).map(([key, value]) => {
                        if (typeof value === "object") return null
                        return (
                          <div key={key}>
                            <label className="text-sm text-gray-600 capitalize">{key}</label>
                            {isEditing ? (
                              <input
                                type="text"
                                value={value}
                                onChange={(e) => {
                                  setDriver((prev) => ({
                                    ...prev,
                                    vehicle: {
                                      ...prev.vehicle,
                                      [key]: e.target.value,
                                    },
                                  }))
                                }}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                              />
                            ) : (
                              <p className="font-medium">{value}</p>
                            )}
                          </div>
                        )
                      })}
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
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{doc.type}</h4>
                              <p className="text-sm text-gray-600">#{doc.number}</p>
                              <p className="text-sm text-gray-600">
                                Expires: {new Date(doc.expiryDate).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className={`text-sm ${getStatusColor(doc.status)}`}>
                                {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                              </span>
                              <p className="text-xs text-gray-500">
                                Verified: {new Date(doc.lastVerified).toLocaleDateString()}
                              </p>
                            </div>
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
                    <p className="text-sm text-gray-600">Total Earnings</p>
                    <p className="text-xl font-bold text-green-600">${driver.earnings.total.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">This Week</p>
                    <p className="text-xl font-bold text-green-600">${driver.earnings.currentWeek.toLocaleString()}</p>
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

