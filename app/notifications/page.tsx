'use client'

import { useApp } from '@/contexts/app-context'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { AlertCircle, CheckCircle, Info, AlertTriangle, Trash2 } from 'lucide-react'

export default function NotificationsPage() {
  const { notifications, addNotification } = useApp()

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />
      default:
        return <Info className="w-5 h-5 text-blue-600" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-950'
      case 'error':
        return 'bg-red-50 dark:bg-red-950'
      case 'warning':
        return 'bg-orange-50 dark:bg-orange-950'
      default:
        return 'bg-blue-50 dark:bg-blue-950'
    }
  }

  const sortedNotifications = [...notifications].sort(
    (a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

  const unreadNotifications = sortedNotifications.filter(n => !n.read)
  const readNotifications = sortedNotifications.filter(n => n.read)

  const handleAddTestNotification = (type: string) => {
    const messages = {
      success: {
        title: 'Payment Received',
        message: 'Fee payment of ₹5000 from Aarav Sharma has been recorded',
      },
      warning: {
        title: 'Fee Overdue',
        message: 'Fee for January 2025 is due from Priya Patel',
      },
      error: {
        title: 'Attendance Alert',
        message: 'Rohan Kumar has been absent for 3 consecutive classes',
      },
      info: {
        title: 'System Update',
        message: 'New class "12th Grade Physics" has been created',
      },
    }

    const msg = messages[type as keyof typeof messages]
    addNotification({
      id: Date.now().toString(),
      title: msg.title,
      message: msg.message,
      type: type as any,
      timestamp: new Date().toISOString(),
      read: false,
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground mt-1">
            Fee reminders, attendance alerts, and system notifications
          </p>
        </div>
      </div>

      {/* Test Notifications */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Send Test Notification</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleAddTestNotification('success')}
          >
            Test Success
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleAddTestNotification('warning')}
          >
            Test Warning
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleAddTestNotification('error')}
          >
            Test Error
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleAddTestNotification('info')}
          >
            Test Info
          </Button>
        </div>
      </Card>

      {/* Unread Notifications */}
      {unreadNotifications.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Unread ({unreadNotifications.length})
            </h2>
          </div>

          {unreadNotifications.map(notification => (
            <Card
              key={notification.id}
              className={`p-4 border-l-4 border-primary ${getTypeColor(
                notification.type
              )}`}
            >
              <div className="flex items-start gap-4">
                {getIcon(notification.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold">{notification.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                    </div>
                    <Badge variant="default" className="ml-2 flex-shrink-0">
                      New
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(notification.timestamp).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Read Notifications */}
      {readNotifications.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Earlier ({readNotifications.length})
            </h2>
          </div>

          {readNotifications.map(notification => (
            <Card
              key={notification.id}
              className={`p-4 border-l-4 border-muted opacity-75 ${getTypeColor(
                notification.type
              )}`}
            >
              <div className="flex items-start gap-4">
                {getIcon(notification.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold">{notification.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(notification.timestamp).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {notifications.length === 0 && (
        <Card className="p-12 text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold">No notifications</h3>
          <p className="text-muted-foreground text-sm mt-2">
            You're all caught up! Check back later for updates.
          </p>
        </Card>
      )}

      {/* Notification Types Guide */}
      <Card className="p-6 border-2 border-dashed">
        <h3 className="text-lg font-semibold mb-4">Notification Types</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <p className="font-medium">Success</p>
              <p className="text-sm text-muted-foreground">
                Fee payments, new admissions, successful transactions
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-1" />
            <div>
              <p className="font-medium">Warning</p>
              <p className="text-sm text-muted-foreground">
                Overdue fees, low attendance, pending actions
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <p className="font-medium">Error / Alert</p>
              <p className="text-sm text-muted-foreground">
                Enrollment issues, serious attendance problems
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <p className="font-medium">Information</p>
              <p className="text-sm text-muted-foreground">
                New classes, updates, schedule changes
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Notification Preferences */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Fee Due Reminders</p>
              <p className="text-sm text-muted-foreground">
                Get notified when fees are due
              </p>
            </div>
            <Button size="sm" variant="outline">
              Enabled
            </Button>
          </div>

          <div className="flex items-center justify-between border-t pt-4">
            <div>
              <p className="font-medium">Attendance Alerts</p>
              <p className="text-sm text-muted-foreground">
                Get notified about low attendance
              </p>
            </div>
            <Button size="sm" variant="outline">
              Enabled
            </Button>
          </div>

          <div className="flex items-center justify-between border-t pt-4">
            <div>
              <p className="font-medium">Payment Confirmations</p>
              <p className="text-sm text-muted-foreground">
                Get notified when payments are received
              </p>
            </div>
            <Button size="sm" variant="outline">
              Enabled
            </Button>
          </div>

          <div className="flex items-center justify-between border-t pt-4">
            <div>
              <p className="font-medium">Schedule Updates</p>
              <p className="text-sm text-muted-foreground">
                Get notified about class schedule changes
              </p>
            </div>
            <Button size="sm" variant="outline">
              Enabled
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
