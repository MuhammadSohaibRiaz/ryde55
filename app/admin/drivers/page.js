"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Edit2, Ban, Trash2, Users, Search, Plus, UserCog, Upload } from "lucide-react"
import { Button } from "@/components/ui/buttons"
import { useState } from "react"

const mockDrivers = [
  {
    id: 1,
    name: "Mike Johnson",
    email: "mike@example.com",
    status: "active",
    vehicleType: "Sedan",
    rating: "4.8",
    totalRides: 156,
    carImage: null,
  },
  {
    id: 2,
    name: "Sarah Wilson",
    email: "sarah@example.com",
    status: "inactive",
    vehicleType: "SUV",
    rating: "4.6",
    totalRides: 98,
    carImage: null,
  },
]

function DriverTable({ drivers, onDeleteDriver, onStatusChange, onCarImageUpload }) {
  return (
    <div className="relative">
      <div className="-mx-4 sm:mx-0 overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="hidden sm:table-header-group">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Car Image</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {drivers.map((driver) => (
                  <tr key={driver.id} className="block sm:table-row">
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 block sm:table-cell">
                      <span className="inline-block sm:hidden font-medium mr-2">Name:</span>
                      {driver.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 block sm:table-cell">
                      <span className="inline-block sm:hidden font-medium mr-2">Email:</span>
                      {driver.email}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 block sm:table-cell">
                      <span className="inline-block sm:hidden font-medium mr-2">Status:</span>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          driver.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {driver.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 block sm:table-cell">
                      <span className="inline-block sm:hidden font-medium mr-2">Car Image:</span>
                      <div className="flex items-center gap-2">
                        {driver.carImage ? (
                          <img
                            src={driver.carImage || "/placeholder.svg"}
                            alt="Car"
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                            <Upload className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                onCarImageUpload(driver.id, file)
                              }
                            }}
                          />
                          <Button variant="outline" size="sm">
                            {driver.carImage ? "Change" : "Upload"}
                          </Button>
                        </label>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 block sm:table-cell text-right sm:text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuContent align="end" className="w-[160px] z-50">
                            <DropdownMenuItem>
                              <Edit2 className="mr-2 h-4 w-4" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                onStatusChange(driver.id, driver.status === "active" ? "inactive" : "active")
                              }
                            >
                              <Ban className="mr-2 h-4 w-4" />
                              <span>{driver.status === "active" ? "Deactivate" : "Activate"}</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={() => onDeleteDriver(driver.id)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenuPortal>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DriversPage() {
  const [drivers, setDrivers] = useState(mockDrivers)
  const [searchTerm, setSearchTerm] = useState("")

  const handleStatusChange = (driverId, newStatus) => {
    setDrivers(drivers.map((driver) => (driver.id === driverId ? { ...driver, status: newStatus } : driver)))
  }

  const handleDeleteDriver = (driverId) => {
    setDrivers(drivers.filter((driver) => driver.id !== driverId))
  }

  const handleCarImageUpload = (driverId, file) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      setDrivers(drivers.map((driver) => (driver.id === driverId ? { ...driver, carImage: reader.result } : driver)))
    }
    reader.readAsDataURL(file)
  }

  const filteredDrivers = drivers.filter(
    (driver) =>
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl sm:text-3xl font-semibold">Drivers Management</h1>
          <UserCog className="w-8 h-8 text-gray-500" />
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" /> Add New Driver
        </Button>
      </div>

      <div className="bg-white shadow-sm rounded-lg">
        <div className="p-4 sm:p-6 border-b">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search drivers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-4">
              <select className="w-full sm:w-auto px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value="all">All Vehicle Types</option>
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
              </select>
              <select className="w-full sm:w-auto px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <DriverTable
          drivers={filteredDrivers}
          onDeleteDriver={handleDeleteDriver}
          onStatusChange={handleStatusChange}
          onCarImageUpload={handleCarImageUpload}
        />

        <div className="px-4 sm:px-6 py-4 border-t">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-500 text-center sm:text-left">
              Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{" "}
              <span className="font-medium">{drivers.length}</span> results
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" disabled className="w-24">
                Previous
              </Button>
              <Button variant="outline" className="w-24">
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

