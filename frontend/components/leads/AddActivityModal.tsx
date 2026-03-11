'use client'

import { useState } from 'react'
import { X, PhoneCall, Mail, MapPin, FileText, CheckCircle, MessageSquare } from 'lucide-react'

interface AddActivityModalProps {
  leadId: string
  onClose: () => void
  onSubmit: (type: string, notes?: string) => void
}

const ACTIVITY_TYPES = [
  { id: 'CALL', label: 'Phone Call', icon: PhoneCall, color: 'bg-blue-500' },
  { id: 'EMAIL', label: 'Email', icon: Mail, color: 'bg-purple-500' },
  { id: 'VISIT', label: 'Visit', icon: MapPin, color: 'bg-orange-500' },
  { id: 'NOTE', label: 'Note', icon: FileText, color: 'bg-gray-500' },
  { id: 'FOLLOW_UP', label: 'Follow Up', icon: MessageSquare, color: 'bg-yellow-500' },
]

export function AddActivityModal({ leadId, onClose, onSubmit }: AddActivityModalProps) {
  const [selectedType, setSelectedType] = useState('')
  const [notes, setNotes] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedType) return

    onSubmit(selectedType, notes.trim() || undefined)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">
            Add Activity
          </h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-secondary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-3">
              Activity Type
            </label>
            <div className="space-y-2">
              {ACTIVITY_TYPES.map((type) => {
                const Icon = type.icon
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setSelectedType(type.id)}
                    className={`
                      w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200
                      ${selectedType === type.id
                        ? 'bg-accent-600 border-accent-600 text-white'
                        : 'bg-background border-border hover:bg-card/50 text-text-primary'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`h-3 w-3 rounded-full ${type.color}`}></div>
                      <Icon className="h-4 w-4" />
                      <span className="font-medium">{type.label}</span>
                    </div>
                    {selectedType === type.id && (
                      <CheckCircle className="h-4 w-4" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add details about this activity..."
              rows={4}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 text-text-primary resize-none"
            />
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedType}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Activity
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
