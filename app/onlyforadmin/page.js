"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/buttons"
import { Input } from "@/components/ui/input"

export default function AdminPinAccess() {
  const [pin, setPin] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = (e) => {
    e.preventDefault()
    // In a real application, you would validate the PIN against a secure backend
    if (pin === "1234") {
      // Replace with actual PIN validation
      localStorage.setItem("adminPin", pin)
      router.push("/admin")
    } else {
      setError("Invalid PIN. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Image src="/logo.png" alt="Ryde5 Logo" width={180} height={35} className="mx-auto" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">Admin Access</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <Input
              type="password"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
              placeholder="Enter PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div>
            <Button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Access Dashboard
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

