"use client"

import Image from "next/image"
import { Star } from "lucide-react"

export default function DriverInfo({ driver, fare, duration }) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-full overflow-hidden relative">
          <Image src={driver.photo || "/placeholder.svg"} alt={driver.name} fill className="object-cover" />
        </div>
        <div className="absolute -bottom-1 -right-1 bg-[#6C63FF] text-white text-xs px-2 py-1 rounded-full">
          {driver.rating}
        </div>
      </div>

      <div className="flex-1">
        <h3 className="text-lg font-semibold">{driver.name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">{driver.trips} trips</span>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < Math.floor(driver.rating) ? "fill-[#6C63FF]" : "fill-gray-200"}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="text-right">
        <p className="text-2xl font-bold text-[#6C63FF]">£{fare}</p>
        <p className="text-sm text-gray-600">~{duration}</p>
      </div>
    </div>
  )
}

