"use client"

import React, { useState, useRef, useEffect } from "react"

const DropdownMenu = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      {React.Children.map(children, (child) => React.cloneElement(child, { isOpen, setIsOpen }))}
    </div>
  )
}

const DropdownMenuTrigger = ({ children, isOpen, setIsOpen, asChild, ...props }) => {
  const handleClick = () => setIsOpen(!isOpen)

  if (asChild) {
    return React.cloneElement(children, { onClick: handleClick, ...props })
  }

  return (
    <button onClick={handleClick} {...props}>
      {children}
    </button>
  )
}

const DropdownMenuContent = ({ children, isOpen, align = "start", className = "" }) => {
  if (!isOpen) return null

  const alignClasses = {
    start: "left-0",
    end: "right-0",
    center: "left-1/2 transform -translate-x-1/2",
  }

  return (
    <div
      className={`absolute top-full mt-1 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md z-50 ${alignClasses[align]} ${className}`}
    >
      {children}
    </div>
  )
}

const DropdownMenuItem = ({ children, className = "", onClick, ...props }) => {
  return (
    <div
      className={`relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  )
}

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem }
