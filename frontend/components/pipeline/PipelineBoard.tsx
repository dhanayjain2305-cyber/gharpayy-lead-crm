'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent, 
         closestCenter, KeyboardSensor, PointerSensor, useSensor, 
         useSensors, DragOverlay } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } 
       from '@dnd-kit/sortable'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { Plus, MoreHorizontal, Sparkles, TrendingUp } from 'lucide-react'
import { LeadCard } from './LeadCard'
import { PipelineColumn } from './PipelineColumn'

const PIPELINE_STAGES = [
  { 
    id: 'NEW_LEAD', 
    title: 'New Leads', 
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    icon: '🆕'
  },
  { 
    id: 'CONTACTED', 
    title: 'Contacted', 
    color: 'from-yellow-500 to-orange-500',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
    icon: '📞'
  },
  { 
    id: 'REQUIREMENT_COLLECTED', 
    title: 'Requirements', 
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    icon: '📋'
  },
  { 
    id: 'PROPERTY_SUGGESTED', 
    title: 'Properties Suggested', 
    color: 'from-indigo-500 to-indigo-600',
    bgColor: 'bg-indigo-500/10',
    borderColor: 'border-indigo-500/30',
    icon: '🏠'
  },
  { 
    id: 'VISIT_SCHEDULED', 
    title: 'Visits Scheduled', 
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
    icon: '📅'
  },
  { 
    id: 'VISIT_COMPLETED', 
    title: 'Visits Completed', 
    color: 'from-teal-500 to-cyan-500',
    bgColor: 'bg-teal-500/10',
    borderColor: 'border-teal-500/30',
    icon: '✅'
  },
  { 
    id: 'BOOKED', 
    title: 'Booked', 
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    icon: '🎉'
  },
  { 
    id: 'LOST', 
    title: 'Lost', 
    color: 'from-red-500 to-pink-500',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    icon: '❌'
  },
]

async function fetchLeads() {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/leads`)
  return response.data.leads
}

async function updateLeadStatus({ leadId, status }: { leadId: string; status: string }) {
  const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/leads/${leadId}/status`, {
    status,
  })
  return response.data
}

export function PipelineBoard() {
  const queryClient = useQueryClient()
  const [activeLead, setActiveLead] = useState<any>(null)
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['leads'],
    queryFn: fetchLeads,
  })

  const updateLeadStatusMutation = useMutation({
    mutationFn: updateLeadStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
    },
  })

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const lead = leads.find((lead: any) => lead.id === active.id)
    setActiveLead(lead)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) return

    const leadId = active.id as string
    const newStatus = over.id as string

    if (newStatus && PIPELINE_STAGES.some(stage => stage.id === newStatus)) {
      updateLeadStatusMutation.mutate({ leadId, status: newStatus })
    }

    setActiveLead(null)
  }

  const getLeadsByStage = (stageId: string) => {
    return leads.filter((lead: any) => lead.status === stageId)
  }

  const getTotalLeads = () => leads.length

  if (isLoading) {
    return (
      <div className="flex space-x-6 overflow-x-auto pb-6">
        {PIPELINE_STAGES.map((stage) => (
          <div key={stage.id} className="flex-shrink-0 w-80">
            <div className="premium-card p-4 animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-700 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gradient mb-2">Sales Pipeline</h1>
          <div className="flex items-center space-x-4">
            <p className="text-text-muted">
              Manage your leads through the sales journey
            </p>
            <div className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-accent-600/20 to-purple-600/20 rounded-full border border-accent-600/30">
              <Sparkles className="h-3 w-3 text-accent-400" />
              <span className="text-sm text-accent-400 font-medium">{getTotalLeads()} Total Leads</span>
            </div>
          </div>
        </div>
        <button className="btn-primary group">
          <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
          Add Lead
        </button>
      </div>

      <div className="relative">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent-600/5 via-transparent to-purple-600/5 rounded-2xl"></div>
        
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="relative flex space-x-6 overflow-x-auto pb-6">
            {PIPELINE_STAGES.map((stage, index) => {
              const stageLeads = getLeadsByStage(stage.id)
              const conversionRate = stage.id === 'BOOKED' ? 
                (stageLeads.length / getTotalLeads() * 100).toFixed(1) : null
              
              return (
                <div key={stage.id} className="flex-shrink-0 w-80 fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <PipelineColumn
                    stage={stage}
                    leads={stageLeads}
                    conversionRate={conversionRate}
                  />
                </div>
              )
            })}
          </div>

          <DragOverlay>
            {activeLead ? (
              <div className="rotate-3 shadow-glow-lg scale-105">
                <LeadCard lead={activeLead} isDragging />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Pipeline Stats */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="premium-card p-4 text-center">
          <div className="text-2xl font-bold text-gradient">{getTotalLeads()}</div>
          <div className="text-sm text-text-muted">Total Leads</div>
        </div>
        <div className="premium-card p-4 text-center">
          <div className="text-2xl font-bold text-green-400">
            {getLeadsByStage('BOOKED').length}
          </div>
          <div className="text-sm text-text-muted">Converted</div>
        </div>
        <div className="premium-card p-4 text-center">
          <div className="text-2xl font-bold text-orange-400">
            {getLeadsByStage('VISIT_SCHEDULED').length}
          </div>
          <div className="text-sm text-text-muted">Visits Pending</div>
        </div>
        <div className="premium-card p-4 text-center">
          <div className="text-2xl font-bold text-accent-400">
            {getTotalLeads() > 0 ? ((getLeadsByStage('BOOKED').length / getTotalLeads()) * 100).toFixed(1) : 0}%
          </div>
          <div className="text-sm text-text-muted">Conversion Rate</div>
        </div>
      </div>
    </div>
  )
}
