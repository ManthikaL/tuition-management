import React from "react"
import { AppLayout } from '@/components/app-layout'

export default function NotificationsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppLayout>{children}</AppLayout>
}
