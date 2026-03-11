'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { Search, Filter, Plus, Phone, Mail, Calendar, User, MoreHorizontal } from 'lucide-react'
import { LeadStatusModal } from './LeadStatusModal'

interface Lead {
  id: string
  name: string
  phone: string
  email?: string
  source: string
  status: string
  createdAt: string
  assignedAgent?: {
    id: string
    name: string
  }
  _count: {
    visits: number
    leadActivities: number
  }
}

async function fetchLeads(filters: any) {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value as string)
  })
  
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/leads?${params}`)
  return response.data
}

export function LeadList() {
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState({
    status: '',
    source: '',
    assignedAgentId: '',
    search: '',
  })
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [showStatusModal, setShowStatusModal] = useState(false)

  const { data, isLoading, error } = useQuery({
    queryKey: ['leads', filters],
    queryFn: () => fetchLeads(filters),
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

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'WEBSITE_FORM': return '🌐'
      case 'PHONE_INQUIRY': return '📞'
      case 'WHATSAPP': return '💬'
      case 'GOOGLE_FORM': return '📋'
      case 'TALLY_FORM': return '📊'
      case 'SOCIAL_MEDIA': return '📱'
      default: return '📝'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
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
        Error loading leads. Please try again.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">Leads Management</h1>
        <button className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Add Lead
        </button>
      </div>

      <div className="bg-card rounded-xl p-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search leads by name, phone, or email..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 text-text-primary"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 text-text-primary"
            >
              <option value="">All Statuses</option>
              <option value="NEW_LEAD">New Lead</option>
              <option value="CONTACTED">Contacted</option>
              <option value="REQUIREMENT_COLLECTED">Requirement Collected</option>
              <option value="PROPERTY_SUGGESTED">Property Suggested</option>
              <option value="VISIT_SCHEDULED">Visit Scheduled</option>
              <option value="VISIT_COMPLETED">Visit Completed</option>
              <option value="BOOKED">Booked</option>
              <option value="LOST">Lost</option>
            </select>

            <select
              value={filters.source}
              onChange={(e) => setFilters({ ...filters, source: e.target.value })}
              className="px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 text-text-primary"
            >
              <option value="">All Sources</option>
              <option value="WEBSITE_FORM">Website Form</option>
              <option value="PHONE_INQUIRY">Phone Inquiry</option>
              <option value="WHATSAPP">WhatsApp</option>
              <option value="GOOGLE_FORM">Google Form</option>
              <option value="TALLY_FORM">Tally Form</option>
              <option value="SOCIAL_MEDIA">Social Media</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Lead</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Source</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Agent</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Activity</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Created</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.leads.map((lead: Lead) => (
                <tr key={lead.id} className="border-b border-border hover:bg-card/50 transition-colors">
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium text-text-primary">{lead.name}</div>
                      <div className="text-sm text-text-muted">{lead.phone}</div>
                      {lead.email && (
                        <div className="text-sm text-text-muted">{lead.email}</div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <span>{getSourceIcon(lead.source)}</span>
                      <span className="text-sm text-text-secondary">
                        {lead.source.replace('_', ' ').toLowerCase()}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => {
                        setSelectedLead(lead)
                        setShowStatusModal(true)
                      }}
                      className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border cursor-pointer hover:opacity-80 transition-opacity ${getStatusColor(lead.status)}`}
                    >
                      {lead.status.replace('_', ' ')}
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    {lead.assignedAgent ? (
                      <div className="flex items-center space-x-2">
                        <div className="h-6 w-6 bg-accent-600 rounded-full flex items-center justify-center">
                          <User className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-sm text-text-secondary">{lead.assignedAgent.name}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-text-muted">Unassigned</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-4 text-sm text-text-muted">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{lead._count.visits}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Mail className="h-3 w-3" />
                        <span>{lead._count.leadActivities}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-text-muted">{formatDate(lead.createdAt)}</span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-text-muted hover:text-text-secondary">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data.leads.length === 0 && (
          <div className="text-center py-8">
            <div className="text-text-muted">No leads found</div>
            <div className="text-text-muted text-sm mt-1">Try adjusting your filters</div>
          </div>
        )}
      </div>

      {showStatusModal && selectedLead && (
        <LeadStatusModal
          lead={selectedLead as any}
          onClose={() => {
            setShowStatusModal(false)
            setSelectedLead(null)
          }}
        />
      )}
    </div>
  )
}
