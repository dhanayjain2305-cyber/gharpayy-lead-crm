import { Phone, Mail, Clock, User } from 'lucide-react'

interface RecentLeadsProps {
  leads: Array<{
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
  }>
}

export function RecentLeads({ leads }: RecentLeadsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW_LEAD': return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      case 'CONTACTED': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
      case 'VISIT_SCHEDULED': return 'bg-purple-500/10 text-purple-400 border-purple-500/20'
      case 'BOOKED': return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'LOST': return 'bg-red-500/10 text-red-400 border-red-500/20'
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return 'Yesterday'
    return date.toLocaleDateString()
  }

  return (
    <div className="bg-card rounded-xl p-6">
      <h2 className="text-lg font-semibold text-text-primary mb-4">Recent Leads</h2>
      <div className="space-y-3">
        {leads.slice(0, 5).map((lead) => (
          <div key={lead.id} className="flex items-center justify-between p-3 bg-background rounded-lg hover:bg-card/50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-accent-600 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-text-primary">{lead.name}</h4>
                <div className="flex items-center space-x-2 text-xs text-text-muted">
                  <Phone className="h-3 w-3" />
                  <span>{lead.phone}</span>
                  {lead.email && (
                    <>
                      <Mail className="h-3 w-3 ml-2" />
                      <span>{lead.email}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(lead.status)}`}>
                {lead.status.replace('_', ' ')}
              </div>
              <div className="flex items-center text-xs text-text-muted mt-1">
                <Clock className="h-3 w-3 mr-1" />
                {formatTime(lead.createdAt)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
