'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Sidebar } from './Sidebar'
import { TopNav } from './TopNav'
import { Dashboard } from '@/components/dashboard/Dashboard'
import { LeadList } from '@/components/leads/LeadList'
import { PipelineBoard } from '@/components/pipeline/PipelineBoard'
import { VisitList } from '@/components/visits/VisitList'

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [currentPage, setCurrentPage] = useState('dashboard')
  const { user } = useAuth()
  const router = useRouter()

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'leads':
        return <LeadList />
      case 'pipeline':
        return <PipelineBoard />
      case 'visits':
        return <VisitList />
      case 'agents':
        return <div>Agents Page - Coming Soon</div>
      case 'analytics':
        return <div>Analytics Page - Coming Soon</div>
      case 'settings':
        return <div>Settings Page - Coming Soon</div>
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <TopNav 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          user={user}
        />
        
        <main className="p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  )
}
