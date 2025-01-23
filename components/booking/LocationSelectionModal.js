"use client"

import { useState, useCallback } from "react"
import { MapPin, X, ArrowLeft } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function LocationSelectionModal({ isOpen, onClose, onSelect, type }) {
  const [mode, setMode] = useState("search")
  const [searchQuery, setSearchQuery] = useState("")
  const [suggestions] = useState([
    "Lekki Conservation Centre",
    "Victoria Garden City",
    "Filmhouse Cinemas IMAX Lekki",
    "Freedom Park Lagos",
  ])

  const handleSearch = useCallback(
    (query) => {
      setSearchQuery(query)
      // In a real app, this would call your Places API
      const filtered = suggestions.filter((place) => place.toLowerCase().includes(query.toLowerCase()))
      setSuggestions(filtered)
    },
    [suggestions],
  )

  const handleMapSelect = useCallback(
    (coordinates) => {
      // In a real app, you would reverse geocode these coordinates
      onSelect("Selected location", coordinates)
      onClose()
    },
    [onClose, onSelect],
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "100%" }}
          className="fixed inset-0 bg-white z-50"
        >
          {mode === "search" ? (
            <div className="h-full flex flex-col">
              <div className="p-4 border-b flex items-center gap-4">
                <button onClick={onClose}>
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder={type === "pickup" ? "Where are you?" : "Where to?"}
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full p-2 outline-none text-lg"
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex-1 overflow-auto">
                <button
                  onClick={() => setMode("map")}
                  className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 border-b"
                >
                  <div className="w-10 h-10 rounded-full bg-[#FFA500]/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-[#FFA500]" />
                  </div>
                  <span className="font-medium">Choose on map</span>
                </button>

                {suggestions.map((place, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      onSelect(place, { lat: 0, lng: 0 }) // Add real coordinates in production
                      onClose()
                    }}
                    className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 border-b"
                  >
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span>{place}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full relative">
              <div className="absolute inset-0">
                <MapView onLocationSelect={handleMapSelect} selectionMode={true} showSearchBar={false} />
              </div>
              <button
                onClick={() => setMode("search")}
                className="absolute top-4 left-4 p-2 bg-white rounded-full shadow-lg"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <button className="absolute bottom-8 left-1/2 -translate-x-1/2 px-12 py-3 bg-[#FFA500] text-white rounded-full font-medium">
                Done
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

