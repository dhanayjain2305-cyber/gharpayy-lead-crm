'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { LeadCard } from './LeadCard'

interface PipelineColumnProps {
  stage: {
    id: string
    title: string
    color: string
    bgColor: string
    borderColor: string
    icon: string
  }
  leads: any[]
  conversionRate?: string
}

export function PipelineColumn({ stage, leads, conversionRate }: PipelineColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage.id,
  })

  return (
    <div className="flex-shrink-0 w-80">
      {/* Column Header */}
      <div className="mb-4">
        <div className={`flex items-center justify-between p-4 rounded-xl bg-gradient-to-r ${stage.color} shadow-lg transform transition-all duration-300 hover:scale-105`}>
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{stage.icon}</div>
            <div>
              <h3 className="font-bold text-white text-lg">{stage.title}</h3>
              <div className="flex items-center space-x-2">
                <span className="text-white/80 text-sm">{leads.length} leads</span>
                {conversionRate && (
                  <>
                    <span className="text-white/60">•</span>
                    <span className="text-white/80 text-sm font-medium">
                      {conversionRate}% rate
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <span className="text-white text-sm font-bold">{leads.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Column Body */}
      <div
        ref={setNodeRef}
        className={`
          premium-card min-h-[500px] p-4 transition-all duration-300 border-2
          ${isOver 
            ? `${stage.borderColor} bg-gradient-to-b from-white/5 to-transparent shadow-glow transform scale-102` 
            : 'border-border/50'
          }
        `}
      >
        <SortableContext items={leads.map(lead => lead.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {leads.map((lead, index) => (
              <div 
                key={lead.id} 
                className="fade-in" 
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <LeadCard lead={lead} />
              </div>
            ))}
          </div>
        </SortableContext>

        {leads.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className={`w-16 h-16 ${stage.bgColor} rounded-2xl flex items-center justify-center mb-4 border-2 ${stage.borderColor} border-dashed`}>
              <span className="text-2xl opacity-50">{stage.icon}</span>
            </div>
            <p className="text-text-muted text-sm font-medium mb-1">No leads in this stage</p>
            <p className="text-text-muted text-xs">Drag leads here to move them</p>
            {isOver && (
              <div className="mt-3 flex items-center space-x-2 text-accent-400 text-sm font-medium animate-pulse">
                <div className="w-2 h-2 bg-accent-400 rounded-full animate-bounce"></div>
                <span>Drop to move lead</span>
                <div className="w-2 h-2 bg-accent-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              </div>
            )}
          </div>
        )}

        {/* Add lead button */}
        <button className={`
          w-full mt-4 py-3 px-4 rounded-xl border-2 ${stage.borderColor} ${stage.bgColor}
          text-text-secondary hover:text-text-primary transition-all duration-300
          flex items-center justify-center space-x-2 group hover:scale-105
          ${isOver ? 'opacity-0' : 'opacity-100'}
        `}>
          <span className="text-lg">+</span>
          <span className="text-sm font-medium">Add Lead</span>
        </button>
      </div>

      {/* Column Footer Stats */}
      <div className="mt-3 p-3 bg-gradient-to-r from-card/50 to-transparent rounded-xl border border-border/30">
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-muted">Stage Performance</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-text-secondary">Active</span>
          </div>
        </div>
      </div>
    </div>
  )
}
