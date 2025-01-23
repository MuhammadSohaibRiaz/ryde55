"use client"

import { useEffect, useRef } from "react"
import { Loader } from "@googlemaps/js-api-loader"

export default function TrackingMap() {
  const mapRef = useRef(null)

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: "AIzaSyCeiu1ZkE95Ler7aYMCifN0cKZ9Xa6EHb0",
        version: "weekly",
      })

      const google = await loader.load()
      const map = new google.maps.Map(mapRef.current, {
        center: { lat: 42.8864, lng: -78.8784 },
        zoom: 12,
      })

      // Add some dummy markers for demonstration
      const locations = [
        { lat: 42.8864, lng: -78.8784 },
        { lat: 42.89, lng: -78.87 },
        { lat: 42.88, lng: -78.86 },
      ]

      locations.forEach((location) => {
        new google.maps.Marker({
          position: location,
          map,
          icon: {
            url: "/car-icon.png",
            scaledSize: new google.maps.Size(32, 32),
          },
        })
      })
    }

    initMap()
  }, [])

  return <div ref={mapRef} className="w-full h-[400px] rounded-lg" />
}

