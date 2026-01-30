import React from "react"
import { AppLayout } from '@/components/app-layout'

export default function ClassesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppLayout>{children}</AppLayout>
}
