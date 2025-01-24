"use client"

import { useState } from "react"
import UserProfile from "@/components/profile/UserProfile"
import UserDashboard from "@/components/dashboards/UserDashboard"
import { mockUserData } from "@/components/utils/mockData"
import { DashboardHeader } from "@/components/layout/DashboardHeader"

export default function UserProfilePage() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [userData, setUserData] = useState(mockUserData)

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardHeader
        title={activeTab === "dashboard" ? "User Dashboard" : "User Profile"}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        notificationCount={2}
      />

      <main className="container mx-auto px-4 py-8">
        {activeTab === "dashboard" ? <UserDashboard user={userData} /> : <UserProfile user={userData} />}
      </main>
    </div>
  )
}

