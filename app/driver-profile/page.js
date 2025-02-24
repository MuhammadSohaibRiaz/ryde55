"use client"

import { useState } from "react"
import DriverProfile from "@/components/profile/DriverProfile"
import DriverDashboard from "@/components/dashboards/DriverDashboard"
import { mockDriverData } from "@/components/utils/mockData"
import { DashboardHeader } from "@/components/layout/DashboardHeader"

export default function DriverProfilePage() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [driverData, setDriverData] = useState(mockDriverData)

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardHeader
        title={activeTab === "dashboard" ? "Driver Dashboard" : "Driver Profile"}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        notificationCount={3}
      />

      <main className="container mx-auto px-4 py-0">
        {activeTab === "dashboard" ? <DriverDashboard driver={driverData} /> : <DriverProfile driver={driverData} />}
      </main>
    </div>
  )
}

