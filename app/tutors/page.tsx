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
import { Search, Plus, Edit2, Trash2, QrCode } from 'lucide-react'
import { Tutor } from '@/contexts/app-context'

export default function TutorsPage() {
  const { tutors, addTutor, updateTutor, deleteTutor } = useApp()
  const [searchTerm, setSearchTerm] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showQRDialog, setShowQRDialog] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subjects: '' as any,
    joinedDate: new Date().toISOString().split('T')[0],
    classes: '' as any,
  })

  const filteredTutors = tutors.filter(
    t =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.tutorId.includes(searchTerm) ||
      t.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingId) {
      updateTutor(editingId, {
        ...formData,
        subjects: formData.subjects
          .split(',')
          .map((s: string) => s.trim())
          .filter((s: string) => s),
        classes: formData.classes
          .split(',')
          .map((c: string) => c.trim())
          .filter((c: string) => c),
      })
      setEditingId(null)
    } else {
      const newTutor: Tutor = {
        id: Date.now().toString(),
        name: formData.name,
        tutorId: `TUT-2024-${String(tutors.length + 1).padStart(3, '0')}`,
        email: formData.email,
        phone: formData.phone,
        subjects: formData.subjects
          .split(',')
          .map((s: string) => s.trim())
          .filter((s: string) => s),
        joinedDate: formData.joinedDate,
        status: 'active',
        qrCode: `TUT-QR-${Date.now()}`,
        classes: formData.classes
          .split(',')
          .map((c: string) => c.trim())
          .filter((c: string) => c),
      }
      addTutor(newTutor)
    }

    setFormData({
      name: '',
      email: '',
      phone: '',
      subjects: '',
      joinedDate: new Date().toISOString().split('T')[0],
      classes: '',
    })
    setOpenDialog(false)
  }

  const handleEdit = (tutor: Tutor) => {
    setEditingId(tutor.id)
    setFormData({
      name: tutor.name,
      email: tutor.email,
      phone: tutor.phone,
      subjects: tutor.subjects.join(', '),
      joinedDate: tutor.joinedDate,
      classes: tutor.classes.join(', '),
    })
    setOpenDialog(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this tutor?')) {
      deleteTutor(id)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tutor Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage tutor profiles, subjects, and class assignments
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
                  subjects: '',
                  joinedDate: new Date().toISOString().split('T')[0],
                  classes: '',
                })
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Tutor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingId ? 'Edit Tutor' : 'Add New Tutor'}
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
                    placeholder="Ms. Anjali Singh"
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
                    placeholder="tutor@tuition.local"
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
                    Joined Date
                  </label>
                  <Input
                    type="date"
                    required
                    value={formData.joinedDate}
                    onChange={e =>
                      setFormData({ ...formData, joinedDate: e.target.value })
                    }
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Subjects (comma-separated)
                  </label>
                  <Input
                    required
                    value={formData.subjects}
                    onChange={e => setFormData({ ...formData, subjects: e.target.value })}
                    placeholder="Mathematics, Science"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Classes (comma-separated)
                  </label>
                  <Input
                    required
                    value={formData.classes}
                    onChange={e => setFormData({ ...formData, classes: e.target.value })}
                    placeholder="10th Grade Math, 9th Grade Science"
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
                  {editingId ? 'Update' : 'Add'} Tutor
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
            placeholder="Search by name, email, or tutor ID..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Tutors Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Tutor ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Subjects</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Classes</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTutors.length > 0 ? (
                filteredTutors.map(tutor => (
                  <TableRow key={tutor.id}>
                    <TableCell className="font-mono text-sm">
                      {tutor.tutorId}
                    </TableCell>
                    <TableCell className="font-medium">{tutor.name}</TableCell>
                    <TableCell className="text-sm">
                      {tutor.subjects.slice(0, 2).join(', ')}
                      {tutor.subjects.length > 2 && ` +${tutor.subjects.length - 2}`}
                    </TableCell>
                    <TableCell className="text-sm">{tutor.phone}</TableCell>
                    <TableCell className="text-sm">
                      {tutor.classes.length} classes
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          tutor.status === 'active' ? 'default' : 'secondary'
                        }
                      >
                        {tutor.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(tutor.joinedDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowQRDialog(tutor.id)}
                        title="View QR Code"
                      >
                        <QrCode className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(tutor)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(tutor.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No tutors found
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
              <DialogTitle>Tutor QR Code</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center gap-4">
              <div className="w-48 h-48 bg-white p-4 rounded-lg border-2 border-primary flex items-center justify-center">
                <div className="text-center text-sm font-mono">
                  <div className="font-bold mb-2">
                    {tutors.find(t => t.id === showQRDialog)?.tutorId}
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
