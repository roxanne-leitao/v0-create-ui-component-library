"use client"

import type React from "react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Carousel component for sliding content
interface CarouselProps {
  items: React.ReactNode[]
  className?: string
}

export function Carousel({ items, className }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? items.length - 1 : prevIndex - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === items.length - 1 ? 0 : prevIndex + 1))
  }

  return (
    <div className={cn("relative w-full", className)}>
      <div className="overflow-hidden rounded-lg">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {items.map((item, index) => (
            <div key={index} className="w-full flex-shrink-0">
              {item}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={goToPrevious}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 rounded-full bg-white bg-opacity-80 p-2 shadow-md hover:bg-opacity-100"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full bg-white bg-opacity-80 p-2 shadow-md hover:bg-opacity-100"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              "h-2 w-2 rounded-full transition-colors",
              index === currentIndex ? "bg-blue-600" : "bg-blue-300",
            )}
          />
        ))}
      </div>
    </div>
  )
}
