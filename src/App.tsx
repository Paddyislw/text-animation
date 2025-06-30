"use client"

import { useState } from "react"
import InputView from "@/components/InputView"
import AnimationView from "@/components/AnimatedView"
import { Toaster } from "react-hot-toast"
import toast from "react-hot-toast"
import type { AnimatedText } from "./types"



export default function Home() {
  const [currentView, setCurrentView] = useState<"input" | "animation">("input")
  const [animations, setAnimations] = useState<AnimatedText[]>([])
  const [globalSpeed, setGlobalSpeed] = useState(0.4) // Slower default speed

  const handleSubmit = (text: string) => {
    // Check if we're at the limit
    if (animations.length >= 5) {
      toast.error("Animation limit reached! Please delete an existing animation before adding a new one.", {
        duration: 4000,
        style: {
          background: "#1F2937",
          color: "#F3F4F6",
          border: "1px solid #374151",
        },
        iconTheme: {
          primary: "#EF4444",
          secondary: "#1F2937",
        },
      })
      return
    }

    // Professional color palette for dark mode
    const colors = ["#60A5FA", "#A78BFA", "#34D399", "#FBBF24", "#F87171", "#FB7185"]

    const newAnimation: AnimatedText = {
      id: Date.now().toString(),
      text,
      x: Math.random() * 80 + 10,
      y: Math.random() * 60 + 20,
      vx: (Math.random() - 0.5) * 4, // Moderate initial velocity
      vy: (Math.random() - 0.5) * 4,
      color: colors[Math.floor(Math.random() * colors.length)],
    }

    setAnimations((prev) => {
      const updated = [...prev, newAnimation]
      return updated.slice(-5)
    })

    // Show success toast
    toast.success(`"${text}" animation created successfully!`, {
      duration: 3000,
      style: {
        background: "#1F2937",
        color: "#F3F4F6",
        border: "1px solid #374151",
      },
      iconTheme: {
        primary: "#10B981",
        secondary: "#1F2937",
      },
    })

    setCurrentView("animation")
  }

  const removeAnimation = (id: string) => {
    const animation = animations.find((anim) => anim.id === id)
    setAnimations((prev) => prev.filter((anim) => anim.id !== id))

    if (animation) {
      toast(`"${animation.text}" animation removed`, {
        duration: 2000,
        style: {
          background: "#1F2937",
          color: "#F3F4F6",
          border: "1px solid #374151",
        },
        icon: "🗑️",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {currentView === "input" ? (
        <InputView
          onSubmit={handleSubmit}
          animations={animations}
          onRemoveAnimation={removeAnimation}
          onViewAnimations={() => setCurrentView("animation")}
        />
      ) : (
        <AnimationView
          animations={animations}
          onRemoveAnimation={removeAnimation}
          onBackToInput={() => setCurrentView("input")}
          globalSpeed={globalSpeed}
          onSpeedChange={setGlobalSpeed}
        />
      )}

      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Define default options
          className: "",
          duration: 4000,
          style: {
            background: "#1F2937",
            color: "#F3F4F6",
            border: "1px solid #374151",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "500",
            padding: "12px 16px",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          },
          // Default options for specific types
          success: {
            iconTheme: {
              primary: "#10B981",
              secondary: "#1F2937",
            },
          },
          error: {
            iconTheme: {
              primary: "#EF4444",
              secondary: "#1F2937",
            },
          },
        }}
      />
    </div>
  )
}
