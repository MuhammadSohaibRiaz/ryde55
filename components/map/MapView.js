"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Loader } from "@googlemaps/js-api-loader"
import { motion } from "framer-motion"
import { MAPS_CONFIG } from "@/config/maps"
import { User } from "lucide-react"
import Link from "next/link"

export default function MapView({
  onLocationSelect,
  pickup,
  dropoff,
  bookingState,
  selectionMode = false,
  driverLocation,
  onRouteCalculated,
  userLocation,
}) {
  const mapRef = useRef(null)
  const [map, setMap] = useState(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const markersRef = useRef({
    pickup: null,
    dropoff: null,
    driver: null,
    selection: null,
  })
  const directionsRendererRef = useRef(null)
  const autocompleteService = useRef(null)
  const placesService = useRef(null)
  const [showUserProfile, setShowUserProfile] = useState(false)

  useEffect(() => {
    if (!mapRef.current || mapLoaded) return

    const loader = new Loader({
      apiKey: MAPS_CONFIG.apiKey,
      version: "weekly",
      libraries: MAPS_CONFIG.libraries,
    })

    loader.load().then((google) => {
      const mapInstance = new google.maps.Map(mapRef.current, {
        center: MAPS_CONFIG.defaultCenter,
        zoom: MAPS_CONFIG.defaultZoom,
        ...MAPS_CONFIG.mapOptions,
        disableDefaultUI: selectionMode,
      })

      autocompleteService.current = new google.maps.places.AutocompleteService()
      placesService.current = new google.maps.places.PlacesService(mapInstance)

      if (!selectionMode) {
        directionsRendererRef.current = new google.maps.DirectionsRenderer({
          map: mapInstance,
          suppressMarkers: true,
          polylineOptions: {
            strokeColor: "#FFA500",
            strokeWeight: 4,
          },
        })
      }

      if (selectionMode) {
        const marker = new google.maps.Marker({
          map: mapInstance,
          position: mapInstance.getCenter(),
          icon: {
            url: "/marker.png",
            scaledSize: new google.maps.Size(40, 40),
            anchor: new google.maps.Point(20, 40),
          },
        })

        markersRef.current.selection = marker

        mapInstance.addListener("center_changed", () => {
          marker.setPosition(mapInstance.getCenter())
        })

        mapInstance.addListener("idle", () => {
          reverseGeocode(mapInstance.getCenter())
        })
      }

      // Add user marker
      if (!selectionMode && userLocation) {
        const userMarker = new google.maps.Marker({
          map: mapInstance,
          position: userLocation,
          icon: {
            url: "/user-marker.png", // You'll need to add this asset
            scaledSize: new google.maps.Size(40, 40),
            anchor: new google.maps.Point(20, 20),
          },
          clickable: true,
        })

        userMarker.addListener("click", () => {
          setShowUserProfile(true)
        })
      }

      setMap(mapInstance)
      setMapLoaded(true)

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            }
            mapInstance.setCenter(pos)
            if (selectionMode && markersRef.current.selection) {
              markersRef.current.selection.setPosition(pos)
              reverseGeocode(pos)
            }
          },
          () => {
            console.warn("Geolocation failed")
          },
        )
      }
    })

    return () => {
      Object.values(markersRef.current).forEach((marker) => marker?.setMap(null))
      if (directionsRendererRef.current) {
        directionsRendererRef.current.setMap(null)
      }
    }
  }, [mapLoaded, selectionMode, userLocation])

  useEffect(() => {
    if (!map || !pickup || !dropoff) return

    const directionsService = new google.maps.DirectionsService()

    directionsService.route(
      {
        origin: pickup.coordinates,
        destination: dropoff.coordinates,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          directionsRendererRef.current.setDirections(result)

          const route = result.routes[0]
          const leg = route.legs[0]
          onRouteCalculated?.({
            distance: leg.distance.text,
            duration: leg.duration.text,
            fare: calculateFare(leg.distance.value),
            pickupEta: Math.ceil((leg.duration.value / 60) * 0.3),
          })
        }
      },
    )
  }, [map, pickup, dropoff])

  useEffect(() => {
    if (!map || !driverLocation) return

    if (!markersRef.current.driver) {
      markersRef.current.driver = new google.maps.Marker({
        map,
        icon: {
          url: "/car-icon.png",
          scaledSize: new google.maps.Size(32, 32),
          anchor: new google.maps.Point(16, 16),
        },
      })
    }

    markersRef.current.driver.setPosition(driverLocation)
  }, [map, driverLocation])

  const reverseGeocode = useCallback(
    (latLng) => {
      if (!map) return

      const geocoder = new google.maps.Geocoder()
      geocoder.geocode({ location: latLng }, (results, status) => {
        if (status === "OK" && results[0]) {
          onLocationSelect?.({
            address: results[0].formatted_address,
            coordinates: {
              lat: latLng.lat(),
              lng: latLng.lng(),
            },
          })
        }
      })
    },
    [map, onLocationSelect],
  )

  return (
    <div className="relative h-full w-full">
      <div ref={mapRef} className="h-full w-full" />

      {/* User Profile Quick Access */}
      <Link
        href="/profile"
        className="absolute top-4 right-4 z-30 p-3 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
      >
        <User className="w-6 h-6 text-gray-700" />
      </Link>

      {showUserProfile && (
        <div className="absolute bottom-24 right-4 z-30 bg-white rounded-lg shadow-lg p-4 w-64">
          <div className="flex items-center space-x-3 mb-3">
            <img src="/user.png" alt="User" className="w-12 h-12 rounded-full" />
            <div>
              <h3 className="font-semibold">John Doe</h3>
              <p className="text-sm text-gray-500">42 rides completed</p>
            </div>
          </div>
          <Link
            href="/profile"
            className="block w-full py-2 px-4 bg-orange-500 text-white rounded-lg text-center hover:bg-orange-600 transition-colors"
          >
            View Full Profile
          </Link>
          <button
            onClick={() => setShowUserProfile(false)}
            className="mt-2 w-full py-2 px-4 border border-gray-300 rounded-lg text-center hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      )}

      {bookingState === "finding_drivers" && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            className="rounded-full bg-[#FFA500]/20"
            initial={{ width: 50, height: 50, opacity: 1 }}
            animate={{
              width: 200,
              height: 200,
              opacity: 0,
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeOut",
            }}
          />
        </div>
      )}
    </div>
  )
}

function calculateFare(distanceInMeters) {
  const distanceInMiles = distanceInMeters / 1609.34
  const baseRate = 2.5
  const minimumFare = 5
  return `£${Math.max(minimumFare, baseRate * distanceInMiles).toFixed(2)}`
}

