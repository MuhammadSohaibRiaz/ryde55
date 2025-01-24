"use client"

import { useEffect, useRef } from "react"
import { Loader } from "@googlemaps/js-api-loader"

const MAPS_CONFIG = {
  apiKey: "AIzaSyCeiu1ZkE95Ler7aYMCifN0cKZ9Xa6EHb0",
  libraries: ["places"],
  defaultCenter: { lat: 42.8864, lng: -78.8784 }, // Buffalo center
  defaultZoom: 13,
  mapOptions: {
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
    ],
    disableDefaultUI: true,
  },
  simulatedCars: {
    default: 8,
    min: 0,
    max: 20,
    bounds: {
      latMin: 42.8,
      latMax: 42.95,
      lngMin: -78.91,
      lngMax: -78.75,
    },
    movementRadius: 0.01, // Smaller radius for more realistic movement
    updateInterval: 5000, // 5 seconds between movements
  },
}

export { MAPS_CONFIG }

export default function Maps() {
  const mapRef = useRef(null)

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: MAPS_CONFIG.apiKey,
        version: "weekly",
        libraries: MAPS_CONFIG.libraries,
      })

      try {
        const google = await loader.load()
        const map = new google.maps.Map(mapRef.current, {
          center: MAPS_CONFIG.defaultCenter,
          zoom: MAPS_CONFIG.defaultZoom,
          ...MAPS_CONFIG.mapOptions,
        })
      } catch (error) {
        console.error("Error loading map:", error)
      }
    }

    initMap()
  }, [])

  return <div ref={mapRef} className="w-full h-full rounded-lg" />
}

