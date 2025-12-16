'use client'

import { useRef, useState, useEffect, KeyboardEvent } from 'react'
import { X } from 'lucide-react'

interface DigitalSignatureProps {
  onSave: (signature: string) => void
  onCancel: () => void
}

export default function DigitalSignature({ onSave, onCancel }: DigitalSignatureProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [isEmpty, setIsEmpty] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onCancel])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    setIsDrawing(true)
    setIsEmpty(false)

    const rect = canvas.getBoundingClientRect()
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top

    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top

    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setIsEmpty(true)
  }

  const saveSignature = () => {
    const canvas = canvasRef.current
    if (!canvas || isEmpty) return

    const dataURL = canvas.toDataURL('image/png')
    onSave(dataURL)
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-slate-900">Digital Signature</h3>
        <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-lg">
          <X size={20} />
        </button>
      </div>

      <div className="mb-4">
        <p className="text-sm text-slate-600 mb-2">Please sign below:</p>
        <div className="border-2 border-slate-300 rounded-lg overflow-hidden bg-white focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-200">
          <canvas
            ref={canvasRef}
            width={600}
            height={300}
            className="w-full touch-none cursor-crosshair"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            role="img"
            aria-label="Signature canvas"
            tabIndex={0}
          />
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <button
          onClick={clearSignature}
          className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
        >
          Clear
        </button>
        <button
          onClick={saveSignature}
          disabled={isEmpty}
          className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Save Signature
        </button>
      </div>
    </div>
  )
}
