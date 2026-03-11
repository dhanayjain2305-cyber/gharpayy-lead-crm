'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  Kanban, 
  Calendar, 
  UserCheck, 
  BarChart3, 
  Settings,
  X,
  Building2,
  TrendingUp,
  Zap
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  currentPage: string
  setCurrentPage: (page: string) => void
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
  { id: 'leads', label: 'Lead Management', icon: Users, badge: 'New' },
  { id: 'pipeline', label: 'Sales Pipeline', icon: Kanban, badge: null },
  { id: 'visits', label: 'Visit Scheduling', icon: Calendar, badge: '3' },
  { id: 'agents', label: 'Agent Performance', icon: UserCheck, badge: null },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, badge: null },
  { id: 'settings', label: 'Settings', icon: Settings, badge: null },
]

export function Sidebar({ isOpen, onClose, currentPage, setCurrentPage }: SidebarProps) {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 z-50 w-72 h-full transition-all duration-300 ease-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full glass-card border-r border-border/50">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border/30">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="gradient-primary p-3 rounded-xl shadow-glow">
                  <Building2 className="h-7 w-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1">
                  <Zap className="h-3 w-3 text-yellow-400 animate-pulse" />
                </div>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gradient">Gharpayy</h1>
                <p className="text-xs text-text-muted">Premium CRM</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden text-text-muted hover:text-text-secondary transition-colors duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1">
            {menuItems.map((item, index) => {
              const Icon = item.icon
              const isActive = currentPage === item.id
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id)
                    onClose()
                  }}
                  className={`
                    w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group
                    ${isActive 
                      ? 'gradient-primary text-white shadow-glow transform scale-105' 
                      : 'text-text-muted hover:text-text-secondary hover:bg-card/50 hover:transform hover:scale-102 hover:translate-x-1'
                    }
                  `}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`
                      p-2 rounded-lg transition-all duration-300
                      ${isActive ? 'bg-white/20' : 'bg-card/50 group-hover:bg-accent-600/20'}
                    `}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {item.badge && (
                      <span className={`
                        px-2 py-1 text-xs font-medium rounded-full
                        ${isActive 
                          ? 'bg-white/20 text-white' 
                          : 'bg-accent-600/20 text-accent-400'
                        }
                      `}>
                        {item.badge}
                      </span>
                    )}
                    {isActive && <TrendingUp className="h-3 w-3" />}
                  </div>
                </button>
              )
            })}
          </nav>

          {/* Bottom Section */}
          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
            <div className="premium-card p-4 border border-border/30">
              <div className="flex items-center space-x-2 mb-2">
                <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-text-secondary">System Status</span>
              </div>
              <p className="text-xs text-text-muted mb-3">All systems operational</p>
              <div className="flex items-center justify-between">
                <span className="text-2xs text-text-muted">Version 2.0.1</span>
                <button className="text-2xs text-accent-400 hover:text-accent-300 transition-colors">
                  Check updates
                </button>
              </div>
            </div>

            <div className="text-center p-3 bg-gradient-to-r from-accent-600/10 to-purple-600/10 rounded-xl border border-border/30">
              <p className="text-xs text-text-muted mb-1">Need assistance?</p>
              <button className="text-xs font-medium text-gradient hover:opacity-80 transition-opacity">
                View Documentation →
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
