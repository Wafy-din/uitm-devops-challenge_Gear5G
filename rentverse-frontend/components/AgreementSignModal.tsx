'use client'

import { useState } from 'react'
import { X, FileText, CheckCircle } from 'lucide-react'
import DigitalSignature from './DigitalSignature'

interface AgreementSignModalProps {
  isOpen: boolean
  onClose: () => void
  onSign: (signature: string) => void
  bookingTitle: string
  role: 'tenant' | 'landlord'
}

export default function AgreementSignModal({ 
  isOpen, 
  onClose, 
  onSign, 
  bookingTitle,
  role 
}: AgreementSignModalProps) {
  if (!isOpen) return null

  const handleSaveSignature = (signature: string) => {
    onSign(signature)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-teal-100 rounded-lg text-teal-600">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Sign Agreement</h3>
              <p className="text-sm text-slate-500">{bookingTitle}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4">
              <h4 className="text-sm font-semibold text-blue-800 mb-1">Digital Signature Required</h4>
              <p className="text-sm text-blue-600">
                Please sign below to confirm your agreement as the <strong>{role}</strong> for this property rental.
                By signing, you accept the terms and conditions outlined in the rental agreement.
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <DigitalSignature 
              onSave={handleSaveSignature}
              onCancel={onClose}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
