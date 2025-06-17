"use client"

import React, { useState } from "react"

const TooltipProvider = ({ children }) => children

const Tooltip = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="relative">
      {React.Children.map(children, (child) => React.cloneElement(child, { isVisible, setIsVisible }))}
    </div>
  )
}

const TooltipTrigger = ({ children, isVisible, setIsVisible, asChild, ...props }) => {
  const handleMouseEnter = () => setIsVisible(true)
  const handleMouseLeave = () => setIsVisible(false)

  if (asChild) {
    return React.cloneElement(children, {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      ...props,
    })
  }

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} {...props}>
      {children}
    </div>
  )
}

const TooltipContent = ({ children, isVisible, side = "top", className = "" }) => {
  if (!isVisible) return null

  const sideClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
    left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
    right: "left-full top-1/2 transform -translate-y-1/2 ml-2",
  }

  return (
    <div
      className={`absolute z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md ${sideClasses[side]} ${className}`}
    >
      {children}
    </div>
  )
}

export { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent }
