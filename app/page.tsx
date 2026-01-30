'use client'

import React from "react"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/contexts/app-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { setCurrentUser } = useApp()
  const { theme, setTheme } = useTheme()
  const [email, setEmail] = useState('admin@tuition.local')
  const [password, setPassword] = useState('password')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate login
    setTimeout(() => {
      setCurrentUser({
        id: 'user-1',
        email,
        name: email.includes('admin') ? 'Admin' : 'User',
        role: email.includes('admin') ? 'admin' : 'tutor',
      })
      router.push('/dashboard')
      setLoading(false)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      {/* Theme Toggle */}
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="fixed top-6 right-6 p-2 rounded-lg bg-card border border-border hover:bg-muted transition-colors"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </button>

      <Card className="w-full max-w-md shadow-xl">
        <div className="p-8">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <div className="w-14 h-14 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground text-2xl font-bold">T</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-center mb-2">
            Tuition Manager
          </h1>
          <p className="text-center text-muted-foreground mb-8">
            Student Management System
          </p>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="admin@tuition.local"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Demo Info */}
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground mb-3">
              Demo Credentials:
            </p>
            <div className="space-y-2 text-xs">
              <div>
                <p className="font-medium">Admin:</p>
                <p className="text-muted-foreground">admin@tuition.local / password</p>
              </div>
              <div>
                <p className="font-medium">Tutor:</p>
                <p className="text-muted-foreground">tutor@tuition.local / password</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
