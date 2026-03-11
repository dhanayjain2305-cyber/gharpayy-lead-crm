import { Calendar, Clock, MapPin, User, Phone } from 'lucide-react'

interface UpcomingVisitsProps {
  visits: Array<{
    id: string
    propertyName: string
    visitDate: string
    visitTime: string
    outcome?: string
    lead: {
      id: string
      name: string
      phone: string
    }
    agent: {
      id: string
      name: string
    }
  }>
}

export function UpcomingVisits({ visits }: UpcomingVisitsProps) {
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
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="bg-card rounded-xl p-6">
      <h2 className="text-lg font-semibold text-text-primary mb-4">Upcoming Visits</h2>
      <div className="space-y-3">
        {visits.slice(0, 5).map((visit) => (
          <div key={visit.id} className="p-3 bg-background rounded-lg hover:bg-card/50 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-medium text-text-primary">{visit.propertyName}</h4>
                <p className="text-sm text-text-secondary">{visit.lead.name}</p>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-text-primary">
                  {formatDate(visit.visitDate)}
                </div>
                <div className="text-xs text-text-muted">
                  {formatTime(visit.visitTime)}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 text-xs text-text-muted">
                <div className="flex items-center">
                  <User className="h-3 w-3 mr-1" />
                  {visit.agent.name}
                </div>
                <div className="flex items-center">
                  <Phone className="h-3 w-3 mr-1" />
                  {visit.lead.phone}
                </div>
              </div>
              {visit.outcome && (
                <div className={`px-2 py-1 text-xs font-medium rounded-full ${
                  visit.outcome === 'BOOKED' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                  visit.outcome === 'NO_SHOW' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                  'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                }`}>
                  {visit.outcome.replace('_', ' ')}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
