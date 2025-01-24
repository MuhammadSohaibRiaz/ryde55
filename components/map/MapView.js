"use client"

import { useEffect, useRef, useState } from "react"
import { Loader } from "@googlemaps/js-api-loader"
import { MAPS_CONFIG } from "./maps"

export default function MapView({ onRouteCalculated, onError, pickup, dropoff, isAdmin = false }) {
  const mapRef = useRef(null)
  const [map, setMap] = useState(null)
  const markersRef = useRef({
    pickup: null,
    dropoff: null,
    cars: [],
  })
  const simulatedCarsRef = useRef([])
  // Initialize with default value, will update from localStorage after mount
  const [numSimulatedCars, setNumSimulatedCars] = useState(MAPS_CONFIG.simulatedCars.default)
  const intervalsRef = useRef([])

  // Safely access localStorage after mount
  useEffect(() => {
    const storedCars =
      typeof window !== "undefined" ? Number.parseInt(window.localStorage.getItem("simulatedCars")) : null
    if (storedCars !== null) {
      setNumSimulatedCars(storedCars)
    }
  }, [])

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return

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
      })

      // Initialize services
      const directionsService = new google.maps.DirectionsService()
      const directionsRenderer = new google.maps.DirectionsRenderer({
        map: mapInstance,
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: "#FFA500",
          strokeWeight: 4,
        },
      })

      // Initialize simulated cars
      initializeSimulatedCars(google, mapInstance)

      // Store references
      setMap(mapInstance)

      // Handle route calculations
      if (pickup && dropoff) {
        calculateRoute(google, mapInstance, directionsService, directionsRenderer)
      }

      // Get user's location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            }
            mapInstance.setCenter(pos)
          },
          () => {
            console.warn("Geolocation failed")
          },
        )
      }
    })

    return () => {
      // Cleanup markers and intervals
      simulatedCarsRef.current.forEach((car) => car?.setMap(null))
      intervalsRef.current.forEach(clearInterval)
    }
  }, [pickup, dropoff])

  // Helper function to get random location within bounds
  const getRandomLocation = () => {
    return {
      lat: MAPS_CONFIG.defaultCenter.lat + (Math.random() - 0.5) * 0.1,
      lng: MAPS_CONFIG.defaultCenter.lng + (Math.random() - 0.5) * 0.1,
    }
  }

  // Helper function to get random location within a radius
  const getRandomLocationNearby = (center) => {
    const radius = 0.01 // Smaller radius for more realistic movement
    const lat = center.lat + (Math.random() - 0.5) * radius * 2
    const lng = center.lng + (Math.random() - 0.5) * radius * 2
    return { lat, lng }
  }

  // Initialize and manage simulated cars
  const initializeSimulatedCars = (google, mapInstance) => {
    // Clear existing cars and intervals
    simulatedCarsRef.current.forEach((car) => car.setMap(null))
    intervalsRef.current.forEach(clearInterval)
    simulatedCarsRef.current = []
    intervalsRef.current = []

    // Create new cars
    const numCars = isAdmin ? 12 : 8 // More cars visible in admin view
    for (let i = 0; i < numCars; i++) {
      const position = getRandomLocation()
      const car = new google.maps.Marker({
        position,
        map: mapInstance,
        icon: {
          url: "/image.png",
          scaledSize: new google.maps.Size(32, 32),
          anchor: new google.maps.Point(16, 16),
        },
      })
      simulatedCarsRef.current.push(car)

      // Individual interval for each car for more natural movement
      const interval = setInterval(
        () => {
          const currentPos = car.getPosition()
          const newPos = getRandomLocationNearby({
            lat: currentPos.lat(),
            lng: currentPos.lng(),
          })
          animateMarkerTo(google, car, newPos)
        },
        5000 + Math.random() * 2000,
      ) // Add randomness to intervals

      intervalsRef.current.push(interval)
    }
  }

  // Animate marker movement with easing
  const animateMarkerTo = (google, marker, newPosition) => {
    const startPosition = marker.getPosition()
    const frames = 90 // More frames for smoother animation
    const duration = 3000 // 3 seconds for smoother movement

    const delta = {
      lat: (newPosition.lat - startPosition.lat()) / frames,
      lng: (newPosition.lng - startPosition.lng()) / frames,
    }

    let frame = 0

    const animate = () => {
      frame++

      // Add easing for smoother movement
      const progress = frame / frames
      const easing = 1 - Math.pow(1 - progress, 3)

      const lat = startPosition.lat() + delta.lat * frames * easing
      const lng = startPosition.lng() + delta.lng * frames * easing

      marker.setPosition(new google.maps.LatLng(lat, lng))

      if (frame < frames) {
        requestAnimationFrame(animate)
      }
    }

    animate()
  }

  const calculateRoute = (google, mapInstance, directionsService, directionsRenderer) => {
    directionsService.route(
      {
        origin: pickup,
        destination: dropoff,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          directionsRenderer.setDirections(result)
          const route = result.routes[0]
          const leg = route.legs[0]

          onRouteCalculated?.({
            distance: leg.distance.text,
            duration: leg.duration.text,
            fare: calculateFare(leg.distance.value),
            pickupEta: Math.ceil((leg.duration.value / 60) * 0.3),
          })
        } else {
          onError?.(new Error("Could not calculate route"))
        }
      },
    )
  }

  const handleSimulatedCarsChange = (value) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("simulatedCars", value.toString())
    }
    setNumSimulatedCars(value)
    // Reinitialize cars with new count
    if (map) {
      initializeSimulatedCars(window.google, map)
    }
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  )
}

function calculateFare(distanceInMeters) {
  const distanceInMiles = distanceInMeters / 1609.34
  const baseRate = 2.5
  const minimumFare = 5
  return Math.max(minimumFare, baseRate * distanceInMiles).toFixed(2)
}

