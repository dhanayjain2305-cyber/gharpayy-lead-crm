'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { X, CheckCircle, XCircle, AlertCircle, Calendar } from 'lucide-react'

interface VisitOutcomeModalProps {
  visit: {
    id: string
    propertyName: string
    lead: {
      name: string
    }
    outcome?: string
    notes?: string
  }
  onClose: () => void
}

const OUTCOMES = [
  { id: 'VISITED', label: 'Visited', icon: CheckCircle, color: 'bg-blue-500' },
  { id: 'BOOKED', label: 'Booked', icon: CheckCircle, color: 'bg-green-500' },
  { id: 'NO_SHOW', label: 'No Show', icon: XCircle, color: 'bg-red-500' },
  { id: 'NOT_INTERESTED', label: 'Not Interested', icon: XCircle, color: 'bg-gray-500' },
  { id: 'RESCHEDULED', label: 'Rescheduled', icon: AlertCircle, color: 'bg-yellow-500' },
]

async function updateVisitOutcome({ visitId, outcome, notes }: { 
  visitId: string; 
  outcome: string; 
  notes?: string 
}) {
  const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/visits/${visitId}`, {
    outcome,
    notes,
  })
  return response.data
}

export function VisitOutcomeModal({ visit, onClose }: VisitOutcomeModalProps) {
  const queryClient = useQueryClient()
  const [selectedOutcome, setSelectedOutcome] = useState(visit.outcome || '')
  const [notes, setNotes] = useState(visit.notes || '')

  const updateOutcomeMutation = useMutation({
    mutationFn: updateVisitOutcome,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visits'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      onClose()
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedOutcome) return

    updateOutcomeMutation.mutate({
      visitId: visit.id,
      outcome: selectedOutcome,
      notes: notes.trim() || undefined,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">
            Update Visit Outcome
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
            <p className="text-text-secondary mb-2">
              Property: <span className="font-medium text-text-primary">{visit.propertyName}</span>
            </p>
            <p className="text-text-secondary">
              Lead: <span className="font-medium text-text-primary">{visit.lead.name}</span>
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-3">
              Visit Outcome
            </label>
            <div className="space-y-2">
              {OUTCOMES.map((outcome) => {
                const Icon = outcome.icon
                return (
                  <button
                    key={outcome.id}
                    type="button"
                    onClick={() => setSelectedOutcome(outcome.id)}
                    className={`
                      w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200
                      ${selectedOutcome === outcome.id
                        ? 'bg-accent-600 border-accent-600 text-white'
                        : 'bg-background border-border hover:bg-card/50 text-text-primary'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`h-3 w-3 rounded-full ${outcome.color}`}></div>
                      <Icon className="h-4 w-4" />
                      <span className="font-medium">{outcome.label}</span>
                    </div>
                    {selectedOutcome === outcome.id && (
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
              placeholder="Add any additional notes about the visit..."
              rows={3}
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
              disabled={!selectedOutcome || updateOutcomeMutation.isPending}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateOutcomeMutation.isPending ? 'Updating...' : 'Update Outcome'}
            </button>
          </div>
        </form>

        {updateOutcomeMutation.error && (
          <div className="mt-4 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">
            Error updating outcome. Please try again.
          </div>
        )}
      </div>
    </div>
  )
}
