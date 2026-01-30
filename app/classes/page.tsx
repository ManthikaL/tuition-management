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
import { Plus, Edit2, Trash2, Users, Clock } from 'lucide-react'
import { Class } from '@/contexts/app-context'

export default function ClassesPage() {
  const { classes, setClasses, students, tutors } = useApp()
  const [openDialog, setOpenDialog] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    subject: '',
    schedule: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingId) {
      setClasses(
        classes.map(c =>
          c.id === editingId
            ? {
                ...c,
                name: formData.name,
                grade: formData.grade,
                subject: formData.subject,
              }
            : c
        )
      )
      setEditingId(null)
    } else {
      const newClass: Class = {
        id: Date.now().toString(),
        name: formData.name,
        grade: formData.grade,
        subject: formData.subject,
        schedule: [
          { day: 'Monday', time: '4:00 PM - 5:30 PM' },
          { day: 'Wednesday', time: '4:00 PM - 5:30 PM' },
        ],
        students: [],
        tutors: [],
      }
      setClasses([...classes, newClass])
    }

    setFormData({ name: '', grade: '', subject: '', schedule: '' })
    setOpenDialog(false)
  }

  const handleEdit = (cls: Class) => {
    setEditingId(cls.id)
    setFormData({
      name: cls.name,
      grade: cls.grade,
      subject: cls.subject,
      schedule: cls.schedule.map(s => `${s.day}: ${s.time}`).join(', '),
    })
    setOpenDialog(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this class?')) {
      setClasses(classes.filter(c => c.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Class & Subject Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage classes, schedules, and class-wise student/tutor assignments
          </p>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingId(null)
                setFormData({ name: '', grade: '', subject: '', schedule: '' })
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Class
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingId ? 'Edit Class' : 'Add New Class'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Class Name
                </label>
                <Input
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., 10th Grade Mathematics"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Grade / Batch
                </label>
                <Input
                  required
                  value={formData.grade}
                  onChange={e => setFormData({ ...formData, grade: e.target.value })}
                  placeholder="e.g., 10th Grade"
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
                  placeholder="e.g., Mathematics"
                />
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
                  {editingId ? 'Update' : 'Add'} Class
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map(cls => (
          <Card key={cls.id} className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{cls.name}</h3>
                <p className="text-sm text-muted-foreground">{cls.grade}</p>
              </div>

              <Badge className="w-fit">{cls.subject}</Badge>

              {/* Schedule */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">Schedule</span>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  {cls.schedule.map((sch, idx) => (
                    <p key={idx}>
                      {sch.day}: {sch.time}
                    </p>
                  ))}
                </div>
              </div>

              {/* Students & Tutors */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <div className="text-xs">
                    <p className="text-muted-foreground">Students</p>
                    <p className="font-semibold">{cls.students.length}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <div className="text-xs">
                    <p className="text-muted-foreground">Tutors</p>
                    <p className="font-semibold">{cls.tutors.length}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => handleEdit(cls)}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-destructive hover:text-destructive bg-transparent"
                  onClick={() => handleDelete(cls.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Summary Card */}
      {classes.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Class Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Classes</p>
              <p className="text-2xl font-bold">{classes.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Students</p>
              <p className="text-2xl font-bold">
                {classes.reduce((sum, c) => sum + c.students.length, 0)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Tutors</p>
              <p className="text-2xl font-bold">
                {classes.reduce((sum, c) => sum + c.tutors.length, 0)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Students/Class</p>
              <p className="text-2xl font-bold">
                {Math.round(
                  classes.reduce((sum, c) => sum + c.students.length, 0) /
                    classes.length
                )}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
