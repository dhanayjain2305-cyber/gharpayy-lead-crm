'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { X, Check } from 'lucide-react'

interface LeadStatusModalProps {
  lead: {
    id: string
    name: string
    currentStatus: string
  }
  onClose: () => void
}

const STATUSES = [
  { id: 'NEW_LEAD', label: 'New Lead', color: 'bg-blue-500' },
  { id: 'CONTACTED', label: 'Contacted', color: 'bg-yellow-500' },
  { id: 'REQUIREMENT_COLLECTED', label: 'Requirement Collected', color: 'bg-purple-500' },
  { id: 'PROPERTY_SUGGESTED', label: 'Property Suggested', color: 'bg-indigo-500' },
  { id: 'VISIT_SCHEDULED', label: 'Visit Scheduled', color: 'bg-orange-500' },
  { id: 'VISIT_COMPLETED', label: 'Visit Completed', color: 'bg-teal-500' },
  { id: 'BOOKED', label: 'Booked', color: 'bg-green-500' },
  { id: 'LOST', label: 'Lost', color: 'bg-red-500' },
]

async function updateLeadStatus({ leadId, status }: { leadId: string; status: string }) {
  const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/leads/${leadId}/status`, {
    status,
  })
  return response.data
}

export function LeadStatusModal({ lead, onClose }: LeadStatusModalProps) {
  const queryClient = useQueryClient()
  const [selectedStatus, setSelectedStatus] = useState(lead.currentStatus)

  const updateStatusMutation = useMutation({
    mutationFn: updateLeadStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
      onClose()
    },
  })

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status)
    updateStatusMutation.mutate({ leadId: lead.id, status })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">
            Update Lead Status
          </h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-secondary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-text-secondary mb-4">
            Lead: <span className="font-medium text-text-primary">{lead.name}</span>
          </p>
          <p className="text-sm text-text-muted">
            Select new status for this lead:
          </p>
        </div>

        <div className="space-y-2">
          {STATUSES.map((status) => (
            <button
              key={status.id}
              onClick={() => handleStatusChange(status.id)}
              disabled={updateStatusMutation.isPending}
              className={`
                w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200
                ${selectedStatus === status.id
                  ? 'bg-accent-600 border-accent-600 text-white'
                  : 'bg-background border-border hover:bg-card/50 text-text-primary'
                }
                ${updateStatusMutation.isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className="flex items-center space-x-3">
                <div className={`h-3 w-3 rounded-full ${status.color}`}></div>
                <span className="font-medium">{status.label}</span>
              </div>
              {selectedStatus === status.id && (
                <Check className="h-4 w-4" />
              )}
            </button>
          ))}
        </div>

        {updateStatusMutation.isPending && (
          <div className="mt-4 text-center text-sm text-text-muted">
            Updating status...
          </div>
        )}

        {updateStatusMutation.error && (
          <div className="mt-4 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">
            Error updating status. Please try again.
          </div>
        )}
      </div>
    </div>
  )
}
