'use client'

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { 
  Users, 
  UserPlus, 
  Calendar, 
  CheckCircle, 
  TrendingUp,
  Phone,
  MessageSquare,
  Globe
} from 'lucide-react'
import { StatsCard } from './StatsCard'
import { LeadsChart } from './LeadsChart'
import { RecentLeads } from './RecentLeads'
import { UpcomingVisits } from './UpcomingVisits'

async function fetchDashboardStats() {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/stats`)
  return response.data
}

export function Dashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchDashboardStats,
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-card rounded-xl p-6 animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg">
        Error loading dashboard data. Please try again.
      </div>
    )
  }

  const { overview, charts, recentLeads, upcomingVisits } = data

  const statsCards = [
    {
      title: 'Total Leads',
      value: overview.totalLeads,
      icon: Users,
      color: 'bg-blue-500',
      trend: undefined,
    },
    {
      title: 'New Leads Today',
      value: overview.newLeadsToday,
      icon: UserPlus,
      color: 'bg-green-500',
      trend: undefined,
    },
    {
      title: 'Visits Scheduled',
      value: overview.visitsScheduled,
      icon: Calendar,
      color: 'bg-yellow-500',
      trend: undefined,
    },
    {
      title: 'Conversion Rate',
      value: `${overview.conversionRate}%`,
      icon: TrendingUp,
      color: 'bg-purple-500',
      trend: undefined,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">Dashboard</h1>
        <p className="text-text-muted">Welcome back! Here's what's happening with your leads today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Leads Overview</h2>
          <LeadsChart data={charts.leadsByDay} />
        </div>

        <div className="bg-card rounded-xl p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Lead Sources</h2>
          <div className="space-y-3">
            {charts.leadsBySource.map((source: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-accent-600 rounded-lg flex items-center justify-center">
                    {source.source === 'WEBSITE_FORM' && <Globe className="h-4 w-4 text-white" />}
                    {source.source === 'PHONE_INQUIRY' && <Phone className="h-4 w-4 text-white" />}
                    {source.source === 'WHATSAPP' && <MessageSquare className="h-4 w-4 text-white" />}
                    {![ 'WEBSITE_FORM', 'PHONE_INQUIRY', 'WHATSAPP'].includes(source.source) && (
                      <Users className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <span className="text-sm text-text-secondary">
                    {source.source.replace('_', ' ').toLowerCase()}
                  </span>
                </div>
                <span className="text-sm font-medium text-text-primary">{source.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentLeads leads={recentLeads} />
        <UpcomingVisits visits={upcomingVisits} />
      </div>
    </div>
  )
}
