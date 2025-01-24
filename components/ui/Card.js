import React from "react"

const Card = React.forwardRef(({ className, ...props }, ref) => {
  return <div ref={ref} className={`rounded-lg shadow-sm ${className}`} {...props} />
})
Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, ...props }, ref) => {
  return <div ref={ref} className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props} />
})
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className, ...props }, ref) => {
  return <h3 ref={ref} className={`text-lg font-semibold leading-none tracking-tight ${className}`} {...props} />
})
CardTitle.displayName = "CardTitle"

const CardContent = React.forwardRef(({ className, ...props }, ref) => {
  return <div ref={ref} className={`p-6 pt-0 ${className}`} {...props} />
})
CardContent.displayName = "CardContent"

export { Card, CardHeader, CardTitle, CardContent }

