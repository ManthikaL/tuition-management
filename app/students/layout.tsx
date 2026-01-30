import React from "react"
import { AppLayout } from '@/components/app-layout'

export default function StudentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppLayout>{children}</AppLayout>
}
