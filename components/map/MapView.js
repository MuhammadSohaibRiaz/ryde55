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

    loader.load().then((google) => {
      const mapInstance = new google.maps.Map(mapRef.current, {
        center: MAPS_CONFIG.defaultCenter,
        zoom: MAPS_CONFIG.defaultZoom,
        ...MAPS_CONFIG.mapOptions,
      })

      setMap(mapInstance)

      // Initialize simulated cars on actual roads
      const directionsService = new google.maps.DirectionsService()
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
            travelMode: google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === "OK" && result.routes.length) {
              const path = result.routes[0].overview_path
              const car = new google.maps.Marker({
                position: path[0],
                map: mapInstance,
                icon: {
                  path: google.maps.SymbolPath.CIRCLE,
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
      markersRef.current.cars.forEach((car) => car.marker.setMap(null))
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!map || !pickup || !dropoff) return

    Object.values(markersRef.current).forEach((marker) => {
      if (Array.isArray(marker)) {
        marker.forEach((m) => m?.setMap(null))
      } else {
        marker?.setMap(null)
      }
    })
    if (routeRef.current) routeRef.current.setMap(null)

    const bounds = new google.maps.LatLngBounds()

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

    map.fitBounds(bounds)
  }, [map, pickup, dropoff])

  useEffect(() => {
    if (!map || !driverLocation) return

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
  }, [map, driverLocation])

  return (
    <div className="w-full h-full">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  )
}
