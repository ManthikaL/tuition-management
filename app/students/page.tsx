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
import { Search, Plus, Edit2, Trash2, Eye, QrCode } from 'lucide-react'
import { Student } from '@/contexts/app-context'

export default function StudentsPage() {
  const { students, addStudent, updateStudent, deleteStudent } = useApp()
  const [searchTerm, setSearchTerm] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showQRDialog, setShowQRDialog] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    parentName: '',
    parentPhone: '',
    grade: '',
    subject: '',
    enrollmentDate: new Date().toISOString().split('T')[0],
  })

  const filteredStudents = students.filter(
    s =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentId.includes(searchTerm) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingId) {
      updateStudent(editingId, formData)
      setEditingId(null)
    } else {
      const newStudent: Student = {
        id: Date.now().toString(),
        name: formData.name,
        studentId: `STU-2024-${String(students.length + 1).padStart(3, '0')}`,
        email: formData.email,
        phone: formData.phone,
        parentName: formData.parentName,
        parentPhone: formData.parentPhone,
        grade: formData.grade,
        subject: formData.subject,
        enrollmentDate: formData.enrollmentDate,
        status: 'active',
        qrCode: `STU-QR-${Date.now()}`,
      }
      addStudent(newStudent)
    }

    setFormData({
      name: '',
      email: '',
      phone: '',
      parentName: '',
      parentPhone: '',
      grade: '',
      subject: '',
      enrollmentDate: new Date().toISOString().split('T')[0],
    })
    setOpenDialog(false)
  }

  const handleEdit = (student: Student) => {
    setEditingId(student.id)
    setFormData({
      name: student.name,
      email: student.email,
      phone: student.phone,
      parentName: student.parentName,
      parentPhone: student.parentPhone,
      grade: student.grade,
      subject: student.subject,
      enrollmentDate: student.enrollmentDate,
    })
    setOpenDialog(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this student?')) {
      deleteStudent(id)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Student Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage student accounts, profiles, and enrollment
          </p>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingId(null)
                setFormData({
                  name: '',
                  email: '',
                  phone: '',
                  parentName: '',
                  parentPhone: '',
                  grade: '',
                  subject: '',
                  enrollmentDate: new Date().toISOString().split('T')[0],
                })
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingId ? 'Edit Student' : 'Add New Student'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <Input
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <Input
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 9876543210"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Grade / Class
                  </label>
                  <Input
                    required
                    value={formData.grade}
                    onChange={e => setFormData({ ...formData, grade: e.target.value })}
                    placeholder="10th Grade"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Subject
                  </label>
                  <Input
                    required
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Mathematics"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Enrollment Date
                  </label>
                  <Input
                    type="date"
                    required
                    value={formData.enrollmentDate}
                    onChange={e =>
                      setFormData({ ...formData, enrollmentDate: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Parent/Guardian Name
                  </label>
                  <Input
                    required
                    value={formData.parentName}
                    onChange={e => setFormData({ ...formData, parentName: e.target.value })}
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Parent/Guardian Phone
                  </label>
                  <Input
                    required
                    value={formData.parentPhone}
                    onChange={e =>
                      setFormData({ ...formData, parentPhone: e.target.value })
                    }
                    placeholder="+91 9876543211"
                  />
                </div>
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
                  {editingId ? 'Update' : 'Add'} Student
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Bar */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or student ID..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Students Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Student ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Enrollment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map(student => (
                  <TableRow key={student.id}>
                    <TableCell className="font-mono text-sm">
                      {student.studentId}
                    </TableCell>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.grade}</TableCell>
                    <TableCell>{student.subject}</TableCell>
                    <TableCell className="text-sm">{student.phone}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          student.status === 'active' ? 'default' : 'secondary'
                        }
                      >
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(student.enrollmentDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowQRDialog(student.id)}
                        title="View QR Code"
                      >
                        <QrCode className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(student)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(student.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No students found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* QR Code Dialog */}
      {showQRDialog && (
        <Dialog open={!!showQRDialog} onOpenChange={() => setShowQRDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Student QR Code</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center gap-4">
              <div className="w-48 h-48 bg-white p-4 rounded-lg border-2 border-primary flex items-center justify-center">
                <div className="text-center text-sm font-mono">
                  <div className="font-bold mb-2">
                    {students.find(s => s.id === showQRDialog)?.studentId}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    QR Code
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Scan this QR code for attendance tracking
              </p>
              <Button className="w-full">Download QR Code</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
