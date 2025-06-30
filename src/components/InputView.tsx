"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, Trash2, Eye } from "lucide-react"
import toast from "react-hot-toast"
import type { AnimatedText } from "@/types"

interface InputViewProps {
  onSubmit: (text: string) => void
  animations: AnimatedText[]
  onRemoveAnimation: (id: string) => void
  onViewAnimations: () => void
}

export default function InputView({ onSubmit, animations, onRemoveAnimation, onViewAnimations }: InputViewProps) {
  const [inputText, setInputText] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputText.trim()) {
      onSubmit(inputText.trim())
      setInputText("")
    }
  }

  const handleRemove = (id: string, text: string) => {
    onRemoveAnimation(id)
    toast(`"${text}" removed from studio`, {
      duration: 2000,
      style: {
        background: "#1F2937",
        color: "#F3F4F6",
        border: "1px solid #374151",
      },
      icon: "🗑️",
    })
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Main Input Card */}
        <Card className="shadow-xl border border-gray-700 bg-gray-800">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-semibold text-white">Text Animation Studio</CardTitle>
            <CardDescription className="text-gray-300">
              Create animated text elements with professional motion effects
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Enter text to animate..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  maxLength={50}
                  className="text-center text-base py-3 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                  {inputText.length}/50
                </div>
              </div>
              <Button
                type="submit"
                className="w-full py-3 text-base font-medium bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!inputText.trim()}
              >
                <Play className="w-4 h-4 mr-2" />
                Create Animation
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Current Animations List */}
        {animations.length > 0 && (
          <Card className="shadow-xl border border-gray-700 bg-gray-800">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-white">
                  Active Animations ({animations.length}/5)
                </CardTitle>
                <Button
                  variant="outline"
                  onClick={onViewAnimations}
                  className="text-blue-400 border-blue-600 hover:bg-blue-900/50 bg-transparent"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {animations.map((animation) => (
                  <div
                    key={animation.id}
                    className="flex items-center justify-between p-3 bg-gray-700 rounded-lg border border-gray-600"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: animation.color }} />
                      <span className="text-white font-medium">{animation.text}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemove(animation.id, animation.text)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        <Card className="shadow-xl border border-gray-700 bg-gray-800">
          <CardContent className="pt-6">
            <div className="text-sm text-gray-300 space-y-2">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span>Support for up to 5 simultaneous animations</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                <span>Hover over animations to pause and remove</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span>Adjustable speed controls with memory</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
