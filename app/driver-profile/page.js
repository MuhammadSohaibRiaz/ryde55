"use client"

import { useState, useEffect } from "react"
import DriverProfile from "@/components/profile/DriverProfile"
import DriverDashboard from "@/components/dashboards/DriverDashboard"

export default function DriverProfilePage() {
  const [driver, setDriver] = useState(null)

  useEffect(() => {
    // Fetch driver data from your API
    const fetchDriverData = async () => {
      // Replace this with your actual API call
      const response = await fetch("/api/driver")
      const driverData = await response.json()
      setDriver(driverData)
    }

    fetchDriverData()
  }, [])

  if (!driver) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Driver Profile</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <DriverProfile driver={driver} />
        </div>
        <div className="md:col-span-2">
          <DriverDashboard driver={driver} />
        </div>
      </div>
    </div>
  )
}

