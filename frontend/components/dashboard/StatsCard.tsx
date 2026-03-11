import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  color: string
  trend?: {
    value: number
    isPositive: boolean
  }
}

export function StatsCard({ title, value, icon: Icon, color, trend }: StatsCardProps) {
  return (
    <div className="premium-card p-6 group cursor-pointer">
      <div className="flex items-center justify-between mb-4">
        <div className={`relative p-4 rounded-2xl ${color} shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
          <Icon className="h-6 w-6 text-white" />
          <div className="absolute inset-0 bg-white/20 rounded-2xl animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm transition-all duration-300 ${
            trend.isPositive 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            {trend.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            <span>{trend.value}%</span>
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-text-muted text-sm font-medium mb-2 uppercase tracking-wide">{title}</h3>
        <p className="text-3xl font-bold text-text-primary group-hover:text-gradient transition-all duration-300">
          {value}
        </p>
      </div>

      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-600/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  )
}
