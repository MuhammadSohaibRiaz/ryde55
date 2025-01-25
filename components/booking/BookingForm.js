"use client"

import { useState, useCallback, useEffect } from "react"
import { MapPin,User, Search, ArrowLeft, X, CheckCircle2, Navigation, Edit2 } from "lucide-react"
import MapView from "../map/MapView"
import { motion, AnimatePresence } from "framer-motion"
import { MAPS_CONFIG } from "@/components/map/maps"

const BOOKING_STATES = {
  INITIAL: "initial",
  SELECTING_LOCATION: "selecting_location",
  CONFIRMING_LOCATIONS: "confirming_locations",
  FINDING_DRIVERS: "finding_drivers",
  DRIVER_FOUND: "driver_found",
  DRIVER_ACCEPTED: "driver_accepted",
  DRIVER_ARRIVING: "driver_arriving",
}

export default function BookingForm() {
  const [bookingState, setBookingState] = useState(BOOKING_STATES.INITIAL)
  const [activeInput, setActiveInput] = useState(null)
  const [formData, setFormData] = useState({
    pickup: null,
    dropoff: null,
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isMapSelection, setIsMapSelection] = useState(false)
  const [routeDetails, setRouteDetails] = useState(null)
  const [driverLocation, setDriverLocation] = useState(null)
  const [selectedDriver, setSelectedDriver] = useState(null)
  const [userLocation, setUserLocation] = useState(null)

  const handleSearch = useCallback(async (query) => {
    if (!query.trim() || !window.google) return

    try {
      const autocomplete = new window.google.maps.places.AutocompleteService()
      const predictions = await new Promise((resolve, reject) => {
        autocomplete.getPlacePredictions(
          {
            input: query,
            componentRestrictions: { country: "uk" },
            location: new google.maps.LatLng(MAPS_CONFIG.defaultCenter),
            radius: 50000, // 50km radius
          },
          (results, status) => {
            if (status === "OK") resolve(results)
            else reject(new Error("Location search failed"))
          },
        )
      })
      setSearchResults(predictions)
    } catch (error) {
      console.error("Location search error:", error)
      setSearchResults([])
    }
  }, [])

  const handleLocationSelect = useCallback(
    (location) => {
      setFormData((prev) => ({
        ...prev,
        [activeInput]: location,
      }))

      if (activeInput === "pickup") {
        setActiveInput(null)
        setBookingState(BOOKING_STATES.INITIAL)
      } else if (activeInput === "dropoff") {
        setBookingState(BOOKING_STATES.CONFIRMING_LOCATIONS)
      }

      setIsMapSelection(false)
      setSearchQuery("")
      setSearchResults([])
    },
    [activeInput],
  )

  const handleRouteCalculated = useCallback((details) => {
    setRouteDetails(details)
  }, [])

  const handleRequestRide = useCallback(() => {
    setBookingState(BOOKING_STATES.FINDING_DRIVERS)

    setTimeout(() => {
      setSelectedDriver({
        name: "Michael",
        rating: 4.9,
        trips: "2,543",
        car: "Tesla Model 3",
        plate: "ABC 123",
        photo: "/placeholder.svg",
      })
      setBookingState(BOOKING_STATES.DRIVER_FOUND)

      setTimeout(() => {
        setBookingState(BOOKING_STATES.DRIVER_ACCEPTED)

        const startLocation = {
          lat: formData.pickup.coordinates.lat + (Math.random() - 0.5) * 0.01,
          lng: formData.pickup.coordinates.lng + (Math.random() - 0.5) * 0.01,
        }
        setDriverLocation(startLocation)
        setBookingState(BOOKING_STATES.DRIVER_ARRIVING)
      }, 2000)
    }, 3000)
  }, [formData.pickup])

  useEffect(() => {
    if (bookingState === BOOKING_STATES.DRIVER_ARRIVING && driverLocation && formData.pickup) {
      const interval = setInterval(() => {
        setDriverLocation((prev) => {
          if (!prev) return prev

          const moveTowards = (current, target) => {
            const step = 0.0001
            return current < target ? Math.min(current + step, target) : Math.max(current - step, target)
          }

          return {
            lat: moveTowards(prev.lat, formData.pickup.coordinates.lat),
            lng: moveTowards(prev.lng, formData.pickup.coordinates.lng),
          }
        })
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [bookingState, driverLocation, formData.pickup])

  useEffect(() => {
    // Get user's location when component mounts
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        () => {
          console.warn("Geolocation failed")
        },
      )
    }
  }, [])

  const handleEditLocation = (type) => {
    setActiveInput(type)
    setBookingState(BOOKING_STATES.SELECTING_LOCATION)
  }

  return (
    <div className="h-screen w-full relative overflow-hidden">
      <div className="absolute inset-0">
        <MapView
          onLocationSelect={handleLocationSelect}
          pickup={formData.pickup}
          dropoff={formData.dropoff}
          bookingState={bookingState}
          selectionMode={isMapSelection}
          driverLocation={driverLocation}
          onRouteCalculated={handleRouteCalculated}
          userLocation={userLocation}
        />
      </div>
      <div className="absolute top-4 right-4 z-30">
        <button
          onClick={() => (window.location.href = "/profile")}
          className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50"
        >
          <User className="w-6 h-6 text-gray-700" />
        </button>
      </div>
      <AnimatePresence>
        {bookingState === BOOKING_STATES.INITIAL && !activeInput && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg"
          >
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto my-3" />
            <div className="p-6 space-y-4">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Where are you?"
                  value={formData.pickup?.address || ""}
                  readOnly
                  onClick={() => {
                    setActiveInput("pickup")
                    setBookingState(BOOKING_STATES.SELECTING_LOCATION)
                  }}
                  className="w-full p-4 pl-12 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#FFA500]"
                />
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FFA500] w-5 h-5" />
                {formData.pickup && (
                  <button
                    onClick={() => handleEditLocation("pickup")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                  >
                    <Edit2 className="w-4 h-4 text-gray-500" />
                  </button>
                )}
              </div>

              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Where to?"
                  value={formData.dropoff?.address || ""}
                  readOnly
                  onClick={() => {
                    setActiveInput("dropoff")
                    setBookingState(BOOKING_STATES.SELECTING_LOCATION)
                  }}
                  className="w-full p-4 pl-12 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#FFA500]"
                />
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FFA500] w-5 h-5" />
                {formData.dropoff && (
                  <button
                    onClick={() => handleEditLocation("dropoff")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                  >
                    <Edit2 className="w-4 h-4 text-gray-500" />
                  </button>
                )}
              </div>

              {formData.pickup && formData.dropoff && (
                <button
                  onClick={() => setBookingState(BOOKING_STATES.CONFIRMING_LOCATIONS)}
                  className="w-full py-4 bg-[#FFA500] text-white rounded-full font-medium hover:bg-[#FFD700] transition-colors"
                >
                  Confirm Locations
                </button>
              )}
            </div>
          </motion.div>
        )}

        {bookingState === BOOKING_STATES.SELECTING_LOCATION && !isMapSelection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white z-10"
          >
            <div className="p-4 border-b flex items-center gap-4">
              <button
                onClick={() => {
                  setActiveInput(null)
                  setBookingState(BOOKING_STATES.INITIAL)
                  setSearchQuery("")
                  setSearchResults([])
                }}
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <input
                type="text"
                placeholder={`Search for ${activeInput === "pickup" ? "pickup" : "destination"}...`}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  handleSearch(e.target.value)
                }}
                className="flex-1 text-lg outline-none"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("")
                    setSearchResults([])
                  }}
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              )}
            </div>

            <div className="overflow-auto h-[calc(100vh-72px)]">
              <button
                onClick={() => setIsMapSelection(true)}
                className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 border-b"
              >
                <div className="w-10 h-10 rounded-full bg-[#FFA500]/10 flex items-center justify-center">
                  <Navigation className="w-5 h-5 text-[#FFA500]" />
                </div>
                <span className="font-medium">Choose on map</span>
              </button>

              {searchResults.map((result) => (
                <button
                  key={result.place_id}
                  onClick={() => {
                    const placesService = new google.maps.places.PlacesService(document.createElement("div"))
                    placesService.getDetails(
                      {
                        placeId: result.place_id,
                        fields: ["formatted_address", "geometry"],
                      },
                      (place, status) => {
                        if (status === "OK" && place.geometry) {
                          handleLocationSelect({
                            address: place.formatted_address,
                            coordinates: {
                              lat: place.geometry.location.lat(),
                              lng: place.geometry.location.lng(),
                            },
                          })
                        }
                      },
                    )
                  }}
                  className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 border-b"
                >
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div className="text-left">
                    <p className="font-medium">{result.structured_formatting.main_text}</p>
                    <p className="text-sm text-gray-500">{result.structured_formatting.secondary_text}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {isMapSelection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20"
          >
            <div className="absolute top-4 left-4 z-30">
              <button onClick={() => setIsMapSelection(false)} className="p-2 bg-white rounded-full shadow-lg">
                <ArrowLeft className="w-6 h-6" />
              </button>
            </div>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
              <button
                onClick={() => setIsMapSelection(false)}
                className="px-12 py-3 bg-[#FFA500] text-white rounded-full font-medium shadow-lg"
              >
                Confirm Location
              </button>
            </div>
          </motion.div>
        )}

        {bookingState === BOOKING_STATES.CONFIRMING_LOCATIONS && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg"
          >
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto my-3" />
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#FFA500] mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Pickup</p>
                    <p className="font-medium">{formData.pickup?.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#FFA500] mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Dropoff</p>
                    <p className="font-medium">{formData.dropoff?.address}</p>
                  </div>
                </div>
              </div>

              {routeDetails && (
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Estimated fare</span>
                    <span className="font-medium">{routeDetails.fare}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Trip duration</span>
                    <span className="font-medium">{routeDetails.duration}</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleRequestRide}
                className="w-full py-4 bg-[#FFA500] text-white rounded-full font-medium hover:bg-[#FFD700] transition-colors"
              >
                Request Ride
              </button>
            </div>
          </motion.div>
        )}

        {bookingState === BOOKING_STATES.FINDING_DRIVERS && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 flex items-center justify-center px-4"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#FFA500]/10 flex items-center justify-center">
                  <Search className="w-8 h-8 text-[#FFA500] animate-pulse" />
                </div>
                <h3 className="text-xl font-semibold">Finding your driver</h3>
                <p className="text-gray-500">Looking for nearby drivers...</p>
              </div>
            </div>
          </motion.div>
        )}

        {bookingState === BOOKING_STATES.DRIVER_FOUND && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 flex items-center justify-center px-4"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold">Driver Found!</h3>
                <p className="text-gray-500">Your ride is confirmed</p>
              </div>
            </div>
          </motion.div>
        )}

        {(bookingState === BOOKING_STATES.DRIVER_ACCEPTED || bookingState === BOOKING_STATES.DRIVER_ARRIVING) && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg"
          >
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto my-3" />
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
                  <img
                    src={selectedDriver.photo || "/placeholder.svg"}
                    alt={selectedDriver.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{selectedDriver.name}</h3>
                  <p className="text-gray-500">
                    {selectedDriver.car} • {selectedDriver.plate}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Driver Status</span>
                  <span className="font-medium text-green-600">On the way</span>
                </div>
                {routeDetails && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Estimated arrival</span>
                    <span className="font-medium">{routeDetails.pickupEta} mins</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  setBookingState(BOOKING_STATES.INITIAL)
                  setFormData({ pickup: null, dropoff: null })
                  setSelectedDriver(null)
                  setDriverLocation(null)
                }}
                className="w-full py-4 bg-red-500 text-white rounded-full font-medium hover:bg-red-600 transition-colors"
              >
                Cancel Ride
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

