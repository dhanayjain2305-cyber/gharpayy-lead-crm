'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import axios from 'axios'
import { 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  Edit,
  Plus,
  PhoneCall,
  MessageSquare,
  FileText,
  CheckCircle
} from 'lucide-react'
import { AddActivityModal } from './AddActivityModal'

interface Lead {
  id: string
  name: string
  phone: string
  email?: string
  source: string
  status: string
  createdAt: string
  updatedAt: string
  assignedAgent?: {
    id: string
    name: string
    email: string
  }
  visits: Array<{
    id: string
    propertyName: string
    visitDate: string
    visitTime: string
    outcome?: string
    notes?: string
    agent: {
      name: string
    }
  }>
  leadActivities: Array<{
    id: string
    type: string
    notes?: string
    createdAt: string
    agent: {
      name: string
    }
  }>
}

async function fetchLead(id: string) {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/leads/${id}`)
  return response.data
}

async function addActivity({ leadId, type, notes }: { 
  leadId: string; 
  type: string; 
  notes?: string 
}) {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/leads/${leadId}/activities`, {
    type,
    notes,
  })
  return response.data
}

export function LeadProfile() {
  const params = useParams()
  const leadId = params.id as string
  const queryClient = useQueryClient()
  const [showActivityModal, setShowActivityModal] = useState(false)

  const { data: lead, isLoading, error } = useQuery({
    queryKey: ['lead', leadId],
    queryFn: () => fetchLead(leadId),
    enabled: !!leadId,
  })

  const addActivityMutation = useMutation({
    mutationFn: addActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead', leadId] })
      setShowActivityModal(false)
    },
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW_LEAD': return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      case 'CONTACTED': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
      case 'REQUIREMENT_COLLECTED': return 'bg-purple-500/10 text-purple-400 border-purple-500/20'
      case 'PROPERTY_SUGGESTED': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
      case 'VISIT_SCHEDULED': return 'bg-orange-500/10 text-orange-400 border-orange-500/20'
      case 'VISIT_COMPLETED': return 'bg-teal-500/10 text-teal-400 border-teal-500/20'
      case 'BOOKED': return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'LOST': return 'bg-red-500/10 text-red-400 border-red-500/20'
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'CALL': return <PhoneCall className="h-4 w-4" />
      case 'EMAIL': return <Mail className="h-4 w-4" />
      case 'VISIT': return <MapPin className="h-4 w-4" />
      case 'NOTE': return <FileText className="h-4 w-4" />
      case 'STATUS_CHANGE': return <CheckCircle className="h-4 w-4" />
      case 'FOLLOW_UP': return <MessageSquare className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-card rounded-xl p-6 animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (error || !lead) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg">
        Error loading lead profile. Please try again.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">Lead Profile</h1>
        <button className="btn-secondary">
          <Edit className="h-4 w-4 mr-2" />
          Edit Lead
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-xl p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Lead Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">Name</label>
                <p className="text-text-primary">{lead.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">Phone</label>
                <div className="flex items-center text-text-primary">
                  <Phone className="h-4 w-4 mr-2" />
                  {lead.phone}
                </div>
              </div>
              {lead.email && (
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1">Email</label>
                  <div className="flex items-center text-text-primary">
                    <Mail className="h-4 w-4 mr-2" />
                    {lead.email}
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">Source</label>
                <p className="text-text-primary">{lead.source.replace('_', ' ').toLowerCase()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">Status</label>
                <div className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(lead.status)}`}>
                  {lead.status.replace('_', ' ')}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">Assigned Agent</label>
                {lead.assignedAgent ? (
                  <div className="flex items-center text-text-primary">
                    <User className="h-4 w-4 mr-2" />
                    {lead.assignedAgent.name}
                  </div>
                ) : (
                  <span className="text-text-muted">Unassigned</span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">Created</label>
                <div className="flex items-center text-text-primary">
                  <Calendar className="h-4 w-4 mr-2" />
                  {formatDateTime(lead.createdAt)}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">Last Updated</label>
                <div className="flex items-center text-text-primary">
                  <Clock className="h-4 w-4 mr-2" />
                  {formatDateTime(lead.updatedAt)}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-text-primary">Activity Timeline</h2>
              <button
                onClick={() => setShowActivityModal(true)}
                className="btn-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Activity
              </button>
            </div>
            
            <div className="space-y-4">
              {lead.leadActivities.map((activity: any, index: number) => (
                <div key={activity.id} className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-accent-600 rounded-full flex items-center justify-center">
                      {getActivityIcon(activity.type)}
                    </div>
                    {index < lead.leadActivities.length - 1 && (
                      <div className="h-full w-0.5 bg-border ml-4 mt-2"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-text-primary capitalize">
                        {activity.type.replace('_', ' ').toLowerCase()}
                      </h4>
                      <span className="text-xs text-text-muted">
                        {formatDateTime(activity.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary mb-1">
                      by {activity.agent.name}
                    </p>
                    {activity.notes && (
                      <p className="text-sm text-text-muted bg-background p-2 rounded border border-border">
                        {activity.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              
              {lead.leadActivities.length === 0 && (
                <div className="text-center py-8 text-text-muted">
                  No activities yet. Add the first activity to get started.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card rounded-xl p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Visit History</h2>
            <div className="space-y-3">
              {lead.visits.map((visit) => (
                <div key={visit.id} className="p-3 bg-background rounded-lg border border-border">
                  <h4 className="font-medium text-text-primary">{visit.propertyName}</h4>
                  <p className="text-sm text-text-muted mb-2">
                    {new Date(visit.visitDate).toLocaleDateString()} at {visit.visitTime}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-muted">
                      Agent: {visit.agent.name}
                    </span>
                    {visit.outcome && (
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${
                        visit.outcome === 'BOOKED' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        visit.outcome === 'NO_SHOW' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                        'bg-gray-500/10 text-gray-400 border-gray-500/20'
                      }`}>
                        {visit.outcome.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                  {visit.notes && (
                    <p className="text-xs text-text-muted mt-2">{visit.notes}</p>
                  )}
                </div>
              ))}
              
              {lead.visits.length === 0 && (
                <div className="text-center py-4 text-text-muted text-sm">
                  No visits scheduled yet
                </div>
              )}
            </div>
          </div>

          <div className="bg-card rounded-xl p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button className="w-full btn-secondary text-left justify-start">
                <PhoneCall className="h-4 w-4 mr-2" />
                Log Call
              </button>
              <button className="w-full btn-secondary text-left justify-start">
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </button>
              <button className="w-full btn-secondary text-left justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Visit
              </button>
              <button className="w-full btn-secondary text-left justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Add Note
              </button>
            </div>
          </div>
        </div>
      </div>

      {showActivityModal && (
        <AddActivityModal
          leadId={lead.id}
          onClose={() => setShowActivityModal(false)}
          onSubmit={(type, notes) => {
            addActivityMutation.mutate({ leadId: lead.id, type, notes })
          }}
        />
      )}
    </div>
  )
}
