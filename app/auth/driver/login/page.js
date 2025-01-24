"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Mail, Lock } from "lucide-react"

import { Button } from "@/components/ui/buttons"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import AuthLayout from "@/components/auth/AuthLayout"

export default function DriverLogin() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Here you would typically handle the login logic
    // For now, we'll just redirect to the main application
    router.push("/driver-profile")
  }

  return (
    <AuthLayout title="Driver Sign In" subtitle="Sign in to your driver account to start accepting rides">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="pl-9"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="pl-9"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
        </div>

        <Button type="submit" className="w-full">
          Sign In
        </Button>

        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            Want to become a driver?{" "}
            <Link href="/auth/driver/register" className="text-orange-600 hover:underline">
              Sign up
            </Link>
          </p>
          <Link href="/auth/driver/forgot-password" className="text-sm text-orange-600 hover:underline">
            Forgot password?
          </Link>
        </div>
      </form>
    </AuthLayout>
  )
}

