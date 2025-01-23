"use client"

import { useState } from "react"
import Image from "next/image"
import { Star } from "lucide-react"

export default function PaymentForm({ onPaymentComplete }) {
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvc: "",
    name: "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onPaymentComplete(paymentData)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setPaymentData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className="w-full max-w-md p-8 mx-auto bg-white rounded-lg shadow-lg">
      <div className="flex justify-center mb-6">
        <div className="flex items-center gap-1">
          <span className="text-2xl font-bold text-orange-500">RYDE</span>
          <Star className="w-6 h-6 fill-black" />
        </div>
      </div>

      <h1 className="mb-8 text-2xl font-bold text-center">Complete Your Payment</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 text-sm font-medium">Card Number</label>
          <input
            type="text"
            name="cardNumber"
            placeholder="1234 5678 9012 3456"
            value={paymentData.cardNumber}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
            maxLength="19"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium">Expiration Date</label>
            <input
              type="text"
              name="expiryDate"
              placeholder="MM / YY"
              value={paymentData.expiryDate}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              maxLength="7"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">CVC</label>
            <input
              type="text"
              name="cvc"
              placeholder="123"
              value={paymentData.cvc}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              maxLength="3"
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">Name on Card</label>
          <input
            type="text"
            name="name"
            placeholder="John Doe"
            value={paymentData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <button type="submit" className="w-full py-3 text-white bg-orange-500 rounded hover:bg-orange-600">
          Pay Now
        </button>
      </form>
    </div>
  )
}

