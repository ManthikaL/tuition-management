'use client'

import React from "react"

import { useState } from 'react'
import { useApp } from '@/contexts/app-context'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Scan, Calendar } from 'lucide-react'
import { Attendance } from '@/contexts/app-context'

export default function AttendancePage() {
  const { students, tutors, attendance, markAttendance, classes } = useApp()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterDate, setFilterDate] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [openDialog, setOpenDialog] = useState(false)
  const [scanMode, setScanMode] = useState(false)
  const [formData, setFormData] = useState({
    qrCode: '',
    userType: 'student' as const,
    class: '',
  })

  const filteredAttendance = attendance.filter(att => {
    if (filterDate && att.date !== filterDate) return false
    if (filterType !== 'all' && att.userType !== filterType) return false
    return true
  })

  const handleScanQR = (qrCode: string) => {
    // Find user by QR code
    const student = students.find(s => s.qrCode === qrCode)
    const tutor = tutors.find(t => t.qrCode === qrCode)

    if (student || tutor) {
      const newAttendance: Attendance = {
        id: Date.now().toString(),
        userId: student?.id || tutor!.id,
        userType: student ? 'student' : 'tutor',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('en-IN'),
        class: formData.class || (classes[0]?.name || 'General'),
        subject: student?.subject || tutor?.subjects[0] || 'General',
      }
      markAttendance(newAttendance)
      setFormData({ qrCode: '', userType: 'student', class: '' })
    } else {
      alert('QR code not found')
    }
  }

  const handleManualAttendance = (e: React.FormEvent) => {
    e.preventDefault()
    handleScanQR(formData.qrCode)
    setOpenDialog(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Attendance Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Track student and tutor attendance with QR codes
          </p>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button>
              <Scan className="w-4 h-4 mr-2" />
              Mark Attendance
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Mark Attendance</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleManualAttendance} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  QR Code / ID
                </label>
                <Input
                  autoFocus
                  value={formData.qrCode}
                  onChange={e => setFormData({ ...formData, qrCode: e.target.value })}
                  placeholder="Scan QR code or enter ID"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Example: STU-2024-001 or TUT-2024-001
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Class / Subject
                </label>
                <Select
                  value={formData.class}
                  onValueChange={value =>
                    setFormData({ ...formData, class: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map(cls => (
                      <SelectItem key={cls.id} value={cls.name}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpenDialog(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  <Scan className="w-4 h-4 mr-2" />
                  Mark Present
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Date Filter */}
        <Card className="p-4">
          <label className="block text-sm font-medium mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            Date
          </label>
          <Input
            type="date"
            value={filterDate}
            onChange={e => setFilterDate(e.target.value)}
          />
        </Card>

        {/* Type Filter */}
        <Card className="p-4">
          <label className="block text-sm font-medium mb-2">User Type</label>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="student">Students</SelectItem>
              <SelectItem value="tutor">Tutors</SelectItem>
            </SelectContent>
          </Select>
        </Card>

        {/* Search */}
        <Card className="p-4">
          <label className="block text-sm font-medium mb-2">
            <Search className="w-4 h-4 inline mr-2" />
            Search
          </label>
          <Input
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </Card>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Today's Attendance
            </p>
            <p className="text-3xl font-bold">
              {filteredAttendance.filter(a => a.userType === 'student').length}
            </p>
            <p className="text-xs text-muted-foreground">
              {Math.round(
                (filteredAttendance.filter(a => a.userType === 'student').length /
                  students.length) *
                  100
              )}% of students
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Tutors Present
            </p>
            <p className="text-3xl font-bold">
              {filteredAttendance.filter(a => a.userType === 'tutor').length}
            </p>
            <p className="text-xs text-muted-foreground">
              {Math.round(
                (filteredAttendance.filter(a => a.userType === 'tutor').length /
                  tutors.length) *
                  100
              )}% of tutors
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Total Present
            </p>
            <p className="text-3xl font-bold">{filteredAttendance.length}</p>
            <p className="text-xs text-muted-foreground">
              Total records for {filterDate}
            </p>
          </div>
        </Card>
      </div>

      {/* Attendance Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Type</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Class/Subject</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAttendance.length > 0 ? (
                filteredAttendance
                  .filter(att => {
                    const user =
                      att.userType === 'student'
                        ? students.find(s => s.id === att.userId)
                        : tutors.find(t => t.id === att.userId)
                    return user?.name
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  })
                  .map(att => {
                    const user =
                      att.userType === 'student'
                        ? students.find(s => s.id === att.userId)
                        : tutors.find(t => t.id === att.userId)
                    return (
                      <TableRow key={att.id}>
                        <TableCell>
                          <Badge
                            variant={
                              att.userType === 'student'
                                ? 'default'
                                : 'secondary'
                            }
                          >
                            {att.userType}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {user?.name || 'Unknown'}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {att.userType === 'student'
                            ? (user as any)?.studentId
                            : (user as any)?.tutorId}
                        </TableCell>
                        <TableCell className="text-sm">{att.date}</TableCell>
                        <TableCell className="text-sm">{att.time}</TableCell>
                        <TableCell className="text-sm">{att.subject}</TableCell>
                      </TableRow>
                    )
                  })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No attendance records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
