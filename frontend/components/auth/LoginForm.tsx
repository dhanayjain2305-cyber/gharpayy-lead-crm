'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Eye, EyeOff, Building2, Sparkles } from 'lucide-react'

export function LoginForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { login, register } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isLogin) {
        await login(email, password)
      } else {
        await register(email, password, name)
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-600/20 via-transparent to-purple-600/20"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 via-transparent to-pink-600/10"></div>
      
      {/* Floating orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-accent-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{ animationDelay: '4s' }}></div>

      <div className="w-full max-w-md relative z-10">
        <div className="premium-card p-8 border-gradient">
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <div className="gradient-primary p-4 rounded-2xl shadow-glow">
                <Building2 className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -top-1 -right-1">
                <Sparkles className="h-4 w-4 text-yellow-400 animate-pulse" />
              </div>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gradient text-center mb-2">
            Gharpayy CRM
          </h1>
          <p className="text-text-muted text-center mb-8">
            {isLogin ? 'Welcome back to your premium CRM experience' : 'Create your account to get started'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="fade-in">
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-background/50 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent text-text-primary backdrop-blur-sm transition-all duration-300"
                  placeholder="John Doe"
                  required
                />
              </div>
            )}

            <div className="fade-in" style={{ animationDelay: '0.1s' }}>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-background/50 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent text-text-primary backdrop-blur-sm transition-all duration-300"
                placeholder="john@example.com"
                required
              />
            </div>

            <div className="fade-in" style={{ animationDelay: '0.2s' }}>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-background/50 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent text-text-primary pr-12 backdrop-blur-sm transition-all duration-300"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm animate-bounce-in">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none fade-in"
              style={{ animationDelay: '0.3s' }}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
              )}
            </button>
          </form>

          <div className="mt-8 text-center fade-in" style={{ animationDelay: '0.4s' }}>
            <button
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
              }}
              className="text-gradient hover:opacity-80 text-sm font-medium transition-opacity duration-200"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>

        <div className="mt-6 text-center fade-in" style={{ animationDelay: '0.5s' }}>
          <p className="text-2xs text-text-muted">
            Powered by advanced AI and modern web technologies
          </p>
        </div>
      </div>
    </div>
  )
}
