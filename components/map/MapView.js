"use client"

import { useEffect, useRef, useState } from "react"
import { Loader } from "@googlemaps/js-api-loader"
import { MAPS_CONFIG } from "./maps"

export default function MapView({
  onRouteCalculated,
  onError,
  pickup,
  dropoff,
  bookingState,
  driverLocation,
  userLocation,
}) {
  const mapRef = useRef(null)
  const [map, setMap] = useState(null)
  const [google, setGoogle] = useState(null)
  const markersRef = useRef({
    pickup: null,
    dropoff: null,
    driver: null,
    cars: [],
  })
  const routeRef = useRef(null)
  const animationRef = useRef(null)

  useEffect(() => {
    if (!mapRef.current) return

    const loader = new Loader({
      apiKey: MAPS_CONFIG.apiKey,
      version: "weekly",
      libraries: MAPS_CONFIG.libraries,
    })

    loader.load().then((googleInstance) => {
      setGoogle(googleInstance)
      const mapInstance = new googleInstance.maps.Map(mapRef.current, {
        center: MAPS_CONFIG.defaultCenter,
        zoom: MAPS_CONFIG.defaultZoom,
        ...MAPS_CONFIG.mapOptions,
      })

      setMap(mapInstance)

      // Initialize simulated cars on actual roads
      const directionsService = new googleInstance.maps.DirectionsService()
      const cars = []

      for (let i = 0; i < 8; i++) {
        const origin = {
          lat: MAPS_CONFIG.defaultCenter.lat + (Math.random() - 0.5) * 0.01,
          lng: MAPS_CONFIG.defaultCenter.lng + (Math.random() - 0.5) * 0.01,
        }
        
        directionsService.route(
          {
            origin,
            destination: pickup?.coordinates || MAPS_CONFIG.defaultCenter,
            travelMode: googleInstance.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === "OK" && result.routes.length) {
              const path = result.routes[0].overview_path
              const car = new googleInstance.maps.Marker({
                position: path[0],
                map: mapInstance,
                icon: {
                  path: googleInstance.maps.SymbolPath.CIRCLE,
                  scale: 8,
                  fillColor: "#4CAF50",
                  fillOpacity: 0.8,
                  strokeWeight: 2,
                  strokeColor: "#FFFFFF",
                },
              })
              cars.push({ marker: car, path, index: 0 })
            }
          },
        )
      }
      markersRef.current.cars = cars

      // Move cars along the route
      setInterval(() => {
        cars.forEach((carObj) => {
          if (carObj.index < carObj.path.length - 1) {
            carObj.index++
            carObj.marker.setPosition(carObj.path[carObj.index])
          }
        })
      }, 2000)
    })

    return () => {
      markersRef.current.cars.forEach((car) => car.marker && car.marker.setMap(null))
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!map || !google || !pickup || !dropoff) return

    // Clear existing markers and route
    Object.entries(markersRef.current).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => item && item.marker && item.marker.setMap(null))
      } else if (value && typeof value.setMap === 'function') {
        value.setMap(null)
      }
    })

    if (routeRef.current && typeof routeRef.current.setMap === 'function') {
      routeRef.current.setMap(null)
    }

    const bounds = new google.maps.LatLngBounds()

    // Set pickup marker
    markersRef.current.pickup = new google.maps.Marker({
      position: pickup.coordinates,
      map: map,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: "#FFA500",
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: "#FFFFFF",
      },
    })
    bounds.extend(pickup.coordinates)

    // Set dropoff marker
    markersRef.current.dropoff = new google.maps.Marker({
      position: dropoff.coordinates,
      map: map,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: "#4CAF50",
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: "#FFFFFF",
      },
    })
    bounds.extend(dropoff.coordinates)

    // Calculate and display route
    const directionsService = new google.maps.DirectionsService()

    directionsService.route(
      {
        origin: pickup.coordinates,
        destination: dropoff.coordinates,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          const route = result.routes[0]
          const path = route.overview_path

          // Create a polyline for the route
          const polyline = new google.maps.Polyline({
            path: [],
            geodesic: true,
            strokeColor: "#FFA500",
            strokeOpacity: 0.8,
            strokeWeight: 5,
            map: map,
          })

          routeRef.current = polyline

          // Animate the polyline
          let step = 0
          const numSteps = 100
          const animationStep = () => {
            const progress = step / numSteps
            const currentPath = path.slice(0, Math.floor(progress * path.length))
            polyline.setPath(currentPath)

            if (step < numSteps) {
              step++
              animationRef.current = requestAnimationFrame(animationStep)
            }
          }
          animationRef.current = requestAnimationFrame(animationStep)
          
          // Calculate and display route information
          const distance = route.legs[0].distance.text
          const duration = route.legs[0].duration.text
          onRouteCalculated({ distance, duration })
        } else {
          onError("Failed to calculate route")
        }
      }
    )

    map.fitBounds(bounds)
  }, [map, google, pickup, dropoff, onRouteCalculated, onError])

  useEffect(() => {
    if (!map || !google || !driverLocation) return

    if (markersRef.current.driver) {
      markersRef.current.driver.setPosition(driverLocation)
    } else {
      markersRef.current.driver = new google.maps.Marker({
        position: driverLocation,
        map: map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#2196F3",
          fillOpacity: 0.8,
          strokeWeight: 2,
          strokeColor: "#FFFFFF",
        },
      })
    }
  }, [map, google, driverLocation])

  return (
    <div className="w-full h-full">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  )
}