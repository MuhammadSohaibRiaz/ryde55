// "use client"

// import { useState } from "react"
// import { MapPin, Clock, DollarSign, Users, Power } from "lucide-react"
// import dynamic from "next/dynamic"

// const Map = dynamic(() => import("@/components/Map"), { ssr: false })

// export default function DriverDashboard({ driver }) {
//   const [isOnline, setIsOnline] = useState(true)
//   const [currentRide, setCurrentRide] = useState(null)

//   return (
//     <div className="min-h-screen bg-[#F5F5F5]">
//       {/* Status Bar */}
//       <div className="bg-white p-4 shadow-sm flex items-center justify-between">
//         <div className="flex items-center space-x-4">
//           <div className={`h-3 w-3 rounded-full ${isOnline ? "bg-green-500" : "bg-red-500"}`} />
//           <span className="font-medium">{isOnline ? "Online" : "Offline"}</span>
//         </div>
//         <button
//           onClick={() => setIsOnline(!isOnline)}
//           className={`flex items-center px-4 py-2 rounded-full ${
//             isOnline ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
//           }`}
//         >
//           <Power className="w-4 h-4 mr-2" />
//           {isOnline ? "Go Offline" : "Go Online"}
//         </button>
//       </div>

//       {/* Map Section */}
//       <div className="relative h-[50vh] w-full">
//         <Map />
//         {currentRide && (
//           <div className="absolute bottom-4 left-4 right-4 bg-white p-4 rounded-lg shadow-lg">
//             <div className="flex items-center justify-between mb-2">
//               <h3 className="font-semibold">Current Ride</h3>
//               <span className="bg-[#6C63FF] text-white px-3 py-1 rounded-full text-sm">In Progress</span>
//             </div>
//             <div className="flex items-center justify-between">
//               <div className="flex items-center">
//                 <Users className="w-5 h-5 text-gray-500 mr-2" />
//                 <span>{currentRide.passengerName}</span>
//               </div>
//               <span className="font-semibold">${currentRide.amount}</span>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Earnings & Stats */}
//       <div className="bg-white -mt-8 relative rounded-t-3xl p-6 min-h-[40vh]">
//         <h2 className="text-xl font-semibold mb-4">Today's Summary</h2>

//         <div className="grid grid-cols-2 gap-4 mb-6">
//           <div className="bg-[#6C63FF] p-4 rounded-lg text-white">
//             <p className="text-sm opacity-90">Today's Earnings</p>
//             <p className="text-3xl font-bold">${driver?.todayStats?.earnings}</p>
//           </div>
//           <div className="bg-gray-50 p-4 rounded-lg">
//             <p className="text-sm text-gray-500">Completed Rides</p>
//             <p className="text-3xl font-semibold text-[#6C63FF]">{driver?.todayStats?.completedRides}</p>
//           </div>
//         </div>

//         <div className="space-y-4">
//           <h3 className="font-medium text-gray-500">Recent Activity</h3>
//           {driver?.recentActivity?.map((activity, index) => (
//             <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//               <div className="flex items-center">
//                 <div className="bg-[#6C63FF] bg-opacity-10 p-2 rounded-full">
//                   <Clock className="w-5 h-5 text-[#6C63FF]" />
//                 </div>
//                 <div className="ml-3">
//                   <p className="font-medium">{activity.type}</p>
//                   <p className="text-sm text-gray-500">{activity.time}</p>
//                 </div>
//               </div>
//               <span className="font-semibold">${activity.amount}</span>
//             </div>
//           ))}
//         </div>

//         {/* Performance Metrics */}
//         <div className="mt-6">
//           <h3 className="font-medium text-gray-500 mb-3">Performance</h3>
//           <div className="grid grid-cols-3 gap-4">
//             <div className="text-center">
//               <div className="text-2xl font-semibold text-[#6C63FF]">{driver?.performance?.rating}★</div>
//               <p className="text-sm text-gray-500">Rating</p>
//             </div>
//             <div className="text-center">
//               <div className="text-2xl font-semibold text-[#6C63FF]">{driver?.performance?.acceptance}%</div>
//               <p className="text-sm text-gray-500">Acceptance</p>
//             </div>
//             <div className="text-center">
//               <div className="text-2xl font-semibold text-[#6C63FF]">{driver?.performance?.completion}%</div>
//               <p className="text-sm text-gray-500">Completion</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

import React from 'react'

export default function DriverDashboard() {
  return (
    <div>
      
    </div>
  )
}
