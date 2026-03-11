'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { Calendar, Clock, MapPin, User, Plus, Filter, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { VisitOutcomeModal } from './VisitOutcomeModal'

interface Visit {
  id: string
  propertyName: string
  visitDate: string
  visitTime: string
  outcome?: string
  notes?: string
  lead: {
    id: string
    name: string
    phone: string
  }
  agent: {
    id: string
    name: string
  }
}

async function fetchVisits(filters: any) {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value as string)
  })
  
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/visits?${params}`)
  return response.data
}

export function VisitList() {
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState({
    date: '',
    agentId: '',
    outcome: '',
  })
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null)
  const [showOutcomeModal, setShowOutcomeModal] = useState(false)

  const { data, isLoading, error } = useQuery({
    queryKey: ['visits', filters],
    queryFn: () => fetchVisits(filters),
  })

  const getOutcomeColor = (outcome?: string) => {
    switch (outcome) {
      case 'VISITED': return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      case 'BOOKED': return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'NO_SHOW': return 'bg-red-500/10 text-red-400 border-red-500/20'
      case 'NOT_INTERESTED': return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
      case 'RESCHEDULED': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
      default: return 'bg-orange-500/10 text-orange-400 border-orange-500/20'
    }
  }

  const getOutcomeIcon = (outcome?: string) => {
    switch (outcome) {
      case 'VISITED': return <CheckCircle className="h-4 w-4" />
      case 'BOOKED': return <CheckCircle className="h-4 w-4" />
      case 'NO_SHOW': return <XCircle className="h-4 w-4" />
      case 'NOT_INTERESTED': return <XCircle className="h-4 w-4" />
      case 'RESCHEDULED': return <AlertCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : hour
    return `${displayHour}:${minutes} ${ampm}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    if (date.toDateString() === today.toDateString()) return 'Today'
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow'
    
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
  }

  const isPastVisit = (dateString: string, time: string) => {
    const visitDateTime = new Date(`${dateString}T${time}`)
    return visitDateTime < new Date()
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-card rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-1/4 mb-2"></div>
            <div className="h-3 bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg">
        Error loading visits. Please try again.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">Visit Scheduling</h1>
        <button className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Schedule Visit
        </button>
      </div>

      <div className="bg-card rounded-xl p-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <input
            type="date"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
            className="px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 text-text-primary"
          />
          
          <select
            value={filters.outcome}
            onChange={(e) => setFilters({ ...filters, outcome: e.target.value })}
            className="px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 text-text-primary"
          >
            <option value="">All Outcomes</option>
            <option value="PENDING">Pending</option>
            <option value="VISITED">Visited</option>
            <option value="BOOKED">Booked</option>
            <option value="NO_SHOW">No Show</option>
            <option value="NOT_INTERESTED">Not Interested</option>
            <option value="RESCHEDULED">Rescheduled</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {data.visits.map((visit: Visit) => {
            const isPast = isPastVisit(visit.visitDate, visit.visitTime)
            
            return (
              <div
                key={visit.id}
                className={`
                  bg-background rounded-lg p-4 border border-border
                  ${isPast && !visit.outcome ? 'border-orange-500/50 bg-orange-500/5' : ''}
                  hover:shadow-medium transition-all duration-200
                `}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-text-primary">{visit.propertyName}</h3>
                    <p className="text-sm text-text-secondary">{visit.lead.name}</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedVisit(visit)
                      setShowOutcomeModal(true)
                    }}
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border cursor-pointer hover:opacity-80 transition-opacity ${getOutcomeColor(visit.outcome)}`}
                  >
                    {getOutcomeIcon(visit.outcome)}
                    <span className="ml-1">
                      {visit.outcome ? visit.outcome.replace('_', ' ') : 'Pending'}
                    </span>
                  </button>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-text-muted">
                    <Calendar className="h-4 w-4 mr-2" />
                    {formatDate(visit.visitDate)}
                  </div>
                  <div className="flex items-center text-text-muted">
                    <Clock className="h-4 w-4 mr-2" />
                    {formatTime(visit.visitTime)}
                  </div>
                  <div className="flex items-center text-text-muted">
                    <User className="h-4 w-4 mr-2" />
                    {visit.agent.name}
                  </div>
                  <div className="flex items-center text-text-muted">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-xs">{visit.lead.phone}</span>
                  </div>
                </div>

                {visit.notes && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-xs text-text-muted">{visit.notes}</p>
                  </div>
                )}

                {isPast && !visit.outcome && (
                  <div className="mt-3 text-xs text-orange-400">
                    ⚠️ Visit outcome pending
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {data.visits.length === 0 && (
          <div className="text-center py-8">
            <div className="text-text-muted">No visits found</div>
            <div className="text-text-muted text-sm mt-1">Try adjusting your filters</div>
          </div>
        )}
      </div>

      {showOutcomeModal && selectedVisit && (
        <VisitOutcomeModal
          visit={selectedVisit}
          onClose={() => {
            setShowOutcomeModal(false)
            setSelectedVisit(null)
          }}
        />
      )}
    </div>
  )
}
