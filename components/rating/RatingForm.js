"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import Image from "next/image"

export default function RatingForm({ onSubmitReview }) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [feedback, setFeedback] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmitReview({ rating, feedback })
  }

  return (
    <div className="w-full max-w-md p-8 mx-auto bg-white rounded-lg shadow-lg">
      <div className="flex justify-center mb-6">
        <div className="flex items-center gap-1">
          <span className="text-2xl font-bold text-orange-500">RYDE</span>
          <Star className="w-6 h-6 fill-black" />
        </div>
      </div>

      <h1 className="mb-8 text-2xl font-bold text-center">Rate Your Ride</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="focus:outline-none"
            >
              <Star
                className={`w-8 h-8 ${
                  star <= (hoveredRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-yellow-400"
                }`}
              />
            </button>
          ))}
        </div>

        <textarea
          placeholder="Tell us about your experience (optional)"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="w-full h-32 p-3 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
        />

        <button type="submit" className="w-full py-3 text-white bg-orange-500 rounded hover:bg-orange-600">
          Submit Review
        </button>
      </form>
    </div>
  )
}

