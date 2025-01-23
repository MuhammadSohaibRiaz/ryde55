import React, { useState, createContext, useContext } from "react"

const SheetContext = createContext()

export const Sheet = ({ open, onOpenChange, children }) => {
  return (
    <SheetContext.Provider value={{ open, onOpenChange }}>
      <div>{children}</div>
    </SheetContext.Provider>
  )
}

export const useSheetContext = () => {
  return useContext(SheetContext)
}
