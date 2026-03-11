'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Menu, Search, Bell, User, LogOut, Settings, HelpCircle, Sparkles } from 'lucide-react'

interface TopNavProps {
  onMenuClick: () => void
  user: any
}

export function TopNav({ onMenuClick, user }: TopNavProps) {
  const [showProfile, setShowProfile] = useState(false)
  const [searchFocus, setSearchFocus] = useState(false)
  const { logout } = useAuth()

  return (
    <header className="glass-card border-b border-border/30 px-6 py-4 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <button
            onClick={onMenuClick}
            className="lg:hidden text-text-muted hover:text-text-secondary transition-all duration-200 hover:scale-110"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className={`relative transition-all duration-300 ${searchFocus ? 'scale-105' : ''}`}>
            <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors duration-200 ${searchFocus ? 'text-accent-400' : 'text-text-muted'}`} />
            <input
              type="text"
              placeholder="Search leads, agents, or properties..."
              onFocus={() => setSearchFocus(true)}
              onBlur={() => setSearchFocus(false)}
              className="pl-12 pr-6 py-3 w-64 lg:w-96 bg-background/50 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500/50 focus:border-transparent text-text-primary backdrop-blur-sm transition-all duration-300 placeholder-text-text-muted"
            />
            {searchFocus && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Sparkles className="h-4 w-4 text-accent-400 animate-pulse" />
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative text-text-muted hover:text-text-secondary transition-all duration-200 hover:scale-110 group">
            <div className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse"></span>
            </div>
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-card/90 backdrop-blur-sm text-xs text-text-secondary px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Notifications
            </span>
          </button>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center space-x-3 text-text-muted hover:text-text-secondary transition-all duration-200 hover:scale-105 group"
            >
              <div className="relative">
                <div className="h-10 w-10 gradient-primary rounded-full flex items-center justify-center shadow-glow">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-400 rounded-full border-2 border-background"></div>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-text-primary">{user?.name}</p>
                <p className="text-xs text-text-muted capitalize">{user?.role}</p>
              </div>
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-3 w-64 glass-card border border-border/50 py-2 animate-bounce-in z-50">
                <div className="px-4 py-3 border-b border-border/30">
                  <p className="text-sm font-medium text-text-primary">{user?.name}</p>
                  <p className="text-xs text-text-muted">{user?.email}</p>
                  <div className="mt-2">
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-accent-600/20 text-accent-400 border border-accent-600/30">
                      {user?.role} Account
                    </span>
                  </div>
                </div>
                
                <div className="py-2">
                  <button className="w-full flex items-center space-x-3 px-4 py-2 text-text-muted hover:text-text-secondary hover:bg-card/50 transition-colors duration-200">
                    <Settings className="h-4 w-4" />
                    <span className="text-sm">Account Settings</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-4 py-2 text-text-muted hover:text-text-secondary hover:bg-card/50 transition-colors duration-200">
                    <HelpCircle className="h-4 w-4" />
                    <span className="text-sm">Help & Support</span>
                  </button>
                </div>

                <div className="border-t border-border/30 pt-2">
                  <button
                    onClick={() => {
                      logout()
                      setShowProfile(false)
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors duration-200"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
