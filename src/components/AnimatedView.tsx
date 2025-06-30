"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft, Plus, X, Settings } from "lucide-react"
import toast from "react-hot-toast"
import type { AnimatedText } from "@/types"

interface AnimationViewProps {
  animations: AnimatedText[]
  onRemoveAnimation: (id: string) => void
  onBackToInput: () => void
  globalSpeed: number
  onSpeedChange: (speed: number) => void
}

export default function AnimationView({
  animations,
  onRemoveAnimation,
  onBackToInput,
  globalSpeed,
  onSpeedChange,
}: AnimationViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [showControls, setShowControls] = useState(false)

  useEffect(() => {
    const animate = () => {
      if (!containerRef.current) return

      const container = containerRef.current

      animations.forEach((animation) => {
        const element = container.querySelector(`[data-id="${animation.id}"]`) as HTMLElement
        if (!element) return

        // Skip animation if this element is hovered
        if (hoveredId === animation.id) return

        // Update position with global speed (remembered across sessions)
        animation.x += animation.vx * globalSpeed * 0.3 // Slower multiplier for smoother control
        animation.y += animation.vy * globalSpeed * 0.3

        // Bounce off walls with proper boundaries
        if (animation.x <= 5 || animation.x >= 95) {
          animation.vx *= -1
          animation.x = Math.max(5, Math.min(95, animation.x))
        }
        if (animation.y <= 5 || animation.y >= 95) {
          animation.vy *= -1
          animation.y = Math.max(5, Math.min(95, animation.y))
        }

        // Apply position directly to the element
        element.style.left = `${animation.x}%`
        element.style.top = `${animation.y}%`
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    if (animations.length > 0) {
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [animations, hoveredId, globalSpeed])

  const handleSpeedChange = (newSpeed: number[]) => {
    onSpeedChange(newSpeed[0])
    toast(`Speed set to ${newSpeed[0].toFixed(1)}x`, {
      duration: 1500,
      style: {
        background: "#1F2937",
        color: "#F3F4F6",
        border: "1px solid #374151",
      },
      icon: "⚡",
    })
  }

  const handleMouseEnter = (id: string) => {
    setHoveredId(id)
  }

  const handleMouseLeave = () => {
    setHoveredId(null)
  }

  const handleRemoveAnimation = (id: string) => {
    const animation = animations.find((anim) => anim.id === id)
    onRemoveAnimation(id)

    if (animation) {
      toast(`"${animation.text}" removed`, {
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
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 shadow-lg">
        <div className="px-6 py-4 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={onBackToInput}
            className="border-gray-600 text-gray-200 hover:bg-gray-700 bg-transparent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Studio
          </Button>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-300 bg-gray-700 px-3 py-1 rounded-full border border-gray-600">
              {animations.length}/5 Active
            </span>
            <Button
              variant="outline"
              onClick={() => setShowControls(!showControls)}
              className="border-gray-600 text-gray-200 hover:bg-gray-700 bg-transparent"
            >
              <Settings className="w-4 h-4 mr-2" />
              Controls
            </Button>
          </div>

          <Button onClick={onBackToInput} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add New
          </Button>
        </div>

        {/* Speed Controls */}
        {showControls && (
          <div className="px-6 py-4 bg-gray-750 border-t border-gray-700">
            <div className="flex items-center space-x-4 max-w-md">
              <label className="text-sm font-medium text-gray-200 min-w-0">Animation Speed:</label>
              <div className="flex-1">
                <Slider
                  value={[globalSpeed]}
                  onValueChange={handleSpeedChange}
                  max={3}
                  min={0.1}
                  step={0.1}
                  className="w-full"
                />
              </div>
              <span className="text-sm text-gray-400 min-w-0">{globalSpeed.toFixed(1)}x</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">Speed setting is remembered for new animations</p>
          </div>
        )}
      </div>

      {/* Animation Container */}
      <div className="p-6">
        <div
          ref={containerRef}
          className="relative w-full bg-gray-800 rounded-lg border border-gray-700 shadow-xl overflow-hidden"
          style={{ aspectRatio: "16/9" }}
        >
          {/* Subtle grid */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
            }}
          />

          {animations.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="text-xl mb-2 font-medium">No animations running</div>
                <div className="text-sm">Add some text to see animations in action</div>
              </div>
            </div>
          ) : (
            animations.map((animation) => (
              <div
                key={animation.id}
                data-id={animation.id}
                className="absolute cursor-pointer"
                style={{
                  left: `${animation.x}%`,
                  top: `${animation.y}%`,
                  transform: "translate(-50%, -50%)",
                  transition: hoveredId === animation.id ? "transform 0.2s ease-out" : "none",
                }}
                onMouseEnter={() => handleMouseEnter(animation.id)}
                onMouseLeave={handleMouseLeave}
              >
                {/* Hover area - larger invisible area for better hover detection */}
                <div className="absolute inset-0 -m-4" onClick={() => handleRemoveAnimation(animation.id)} />

                {/* Main text element */}
                <div
                  className={`
                    relative px-4 py-2 rounded-lg text-white font-medium text-sm 
                    shadow-lg border border-gray-600 transition-all duration-200 select-none
                    ${hoveredId === animation.id ? "shadow-2xl scale-110" : ""}
                  `}
                  style={{
                    backgroundColor: animation.color,
                    boxShadow:
                      hoveredId === animation.id
                        ? `0 8px 25px ${animation.color}60, 0 0 20px ${animation.color}40`
                        : `0 4px 15px ${animation.color}40`,
                  }}
                >
                  {animation.text}

                  {/* Remove button */}
                  <div
                    className={`
                      absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full 
                      flex items-center justify-center transition-all duration-200
                      border-2 border-gray-800 shadow-lg hover:bg-red-600 hover:scale-110
                      ${hoveredId === animation.id ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"}
                    `}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveAnimation(animation.id)
                    }}
                  >
                    <X className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="px-6 pb-6">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
          <div className="text-sm text-gray-300 space-y-1">
            <p>• Hover over animated text to pause movement and reveal remove button</p>
            <p>• Use the speed slider to adjust animation velocity (currently {globalSpeed.toFixed(1)}x)</p>
            <p>• Speed setting is remembered for all new animations</p>
            <p>• Maximum 5 animations - delete existing ones to add new text</p>
          </div>
        </div>
      </div>
    </div>
  )
}
