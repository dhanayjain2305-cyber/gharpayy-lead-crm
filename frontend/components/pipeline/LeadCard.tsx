'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Phone, Mail, Globe, MessageSquare, User, Clock, Star, ArrowRight } from 'lucide-react'

interface LeadCardProps {
  lead: {
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
  }
  isDragging?: boolean
}

export function LeadCard({ lead, isDragging = false }: LeadCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: lead.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging || isSortableDragging ? 0.5 : 1,
  }

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'WEBSITE_FORM': return <Globe className="h-3 w-3" />
      case 'PHONE_INQUIRY': return <Phone className="h-3 w-3" />
      case 'WHATSAPP': return <MessageSquare className="h-3 w-3" />
      case 'EMAIL': return <Mail className="h-3 w-3" />
      default: return <User className="h-3 w-3" />
    }
  }

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'WEBSITE_FORM': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'PHONE_INQUIRY': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'WHATSAPP': return 'bg-green-600/20 text-green-500 border-green-600/30'
      case 'EMAIL': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return 'Yesterday'
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        premium-card p-4 cursor-pointer group
        ${isDragging ? 'cursor-grabbing scale-105 shadow-glow-lg' : 'cursor-grab hover:shadow-premium-hover'}
      `}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="h-10 w-10 gradient-primary rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-card"></div>
          </div>
          <div>
            <h4 className="font-semibold text-text-primary text-sm group-hover:text-accent-400 transition-colors duration-200">
              {lead.name}
            </h4>
            <div className="flex items-center text-xs text-text-muted mt-1">
              <Phone className="h-3 w-3 mr-1" />
              {lead.phone}
            </div>
          </div>
        </div>
        <ArrowRight className="h-4 w-4 text-text-muted group-hover:text-accent-400 group-hover:translate-x-1 transition-all duration-200" />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className={`inline-flex items-center space-x-2 px-3 py-1.5 text-xs font-medium rounded-full border backdrop-blur-sm transition-all duration-200 hover:scale-105 ${getSourceColor(lead.source)}`}>
            {getSourceIcon(lead.source)}
            <span>{lead.source.replace('_', ' ').toLowerCase()}</span>
          </div>
          <div className="flex items-center text-xs text-text-muted">
            <Clock className="h-3 w-3 mr-1" />
            {formatTime(lead.createdAt)}
          </div>
        </div>

        {lead.assignedAgent && (
          <div className="flex items-center space-x-2 p-2 bg-card/30 rounded-lg border border-border/30">
            <div className="h-6 w-6 bg-accent-600/20 rounded-lg flex items-center justify-center">
              <User className="h-3 w-3 text-accent-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-text-secondary">{lead.assignedAgent.name}</p>
              <p className="text-2xs text-text-muted">Assigned Agent</p>
            </div>
            <Star className="h-3 w-3 text-yellow-400" />
          </div>
        )}
      </div>

      {/* Hover gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-600/5 via-transparent to-purple-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      
      {/* Priority indicator for new leads */}
      {lead.status === 'NEW_LEAD' && (
        <div className="absolute top-2 right-2">
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse shadow-lg shadow-red-400/50"></div>
        </div>
      )}
    </div>
  )
}
