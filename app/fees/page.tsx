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
import { Search, Plus, CheckCircle, AlertCircle } from 'lucide-react'
import { Fee } from '@/contexts/app-context'

export default function FeesPage() {
  const { students, fees, recordFeePayment } = useApp()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [openDialog, setOpenDialog] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    studentId: '',
    month: '',
    amount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'online' as const,
  })

  const filteredFees = fees.filter(f => {
    if (filterStatus !== 'all' && f.status !== filterStatus) return false
    const student = students.find(s => s.id === f.studentId)
    return student?.name.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const totalCollected = fees
    .filter(f => f.status === 'paid')
    .reduce((sum, f) => sum + f.amount, 0)
  const totalPending = fees
    .filter(f => f.status === 'pending')
    .reduce((sum, f) => sum + f.amount, 0)

  const handleRecordPayment = (feeId: string) => {
    recordFeePayment(
      feeId,
      new Date().toISOString().split('T')[0],
      'online'
    )
    setOpenDialog(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // This would typically be an API call
    alert('Fee record created successfully')
    setFormData({
      studentId: '',
      month: '',
      amount: '',
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'online',
    })
    setOpenDialog(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Fee Management</h1>
          <p className="text-muted-foreground mt-1">
            Track student fees, payments, and outstanding amounts
          </p>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Fee Record
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Fee Record</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Student
                </label>
                <Select
                  value={formData.studentId}
                  onValueChange={value =>
                    setFormData({ ...formData, studentId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map(student => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Month
                </label>
                <Input
                  placeholder="e.g., January 2025"
                  value={formData.month}
                  onChange={e => setFormData({ ...formData, month: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Amount (₹)
                </label>
                <Input
                  type="number"
                  placeholder="5000"
                  value={formData.amount}
                  onChange={e => setFormData({ ...formData, amount: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Payment Method
                </label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={value =>
                    setFormData({
                      ...formData,
                      paymentMethod: value as 'cash' | 'online',
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
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
                <Button type="submit">Add Record</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Total Collected
            </p>
            <p className="text-3xl font-bold">₹{totalCollected.toLocaleString()}</p>
            <p className="text-xs text-green-600 dark:text-green-400">
              {fees.filter(f => f.status === 'paid').length} payments
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Pending Amount
            </p>
            <p className="text-3xl font-bold">₹{totalPending.toLocaleString()}</p>
            <p className="text-xs text-orange-600 dark:text-orange-400">
              {fees.filter(f => f.status === 'pending').length} pending
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Collection Rate
            </p>
            <p className="text-3xl font-bold">
              {Math.round(
                (totalCollected / (totalCollected + totalPending)) * 100
              )}%
            </p>
            <p className="text-xs text-muted-foreground">
              {totalCollected + totalPending > 0 ? 'Overall' : 'No data'}
            </p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by student name..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card>

        <Card className="p-4">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Fees</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </Card>
      </div>

      {/* Fees Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Student Name</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Month</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Date</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFees.length > 0 ? (
                filteredFees.map(fee => {
                  const student = students.find(s => s.id === fee.studentId)
                  return (
                    <TableRow key={fee.id}>
                      <TableCell className="font-medium">
                        {student?.name}
                      </TableCell>
                      <TableCell className="text-sm">{student?.grade}</TableCell>
                      <TableCell className="text-sm">{fee.month}</TableCell>
                      <TableCell className="font-medium">
                        ₹{fee.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={fee.status === 'paid' ? 'default' : 'secondary'}
                        >
                          {fee.status === 'paid' ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Paid
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Pending
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {fee.paymentDate
                          ? new Date(fee.paymentDate).toLocaleDateString()
                          : '-'}
                      </TableCell>
                      <TableCell className="text-sm">
                        {fee.paymentMethod ? (
                          <Badge variant="outline">{fee.paymentMethod}</Badge>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {fee.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRecordPayment(fee.id)}
                          >
                            Record Payment
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No fees found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Summary Card */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Fee Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Records</p>
            <p className="text-2xl font-bold">{fees.length}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Average Amount</p>
            <p className="text-2xl font-bold">
              ₹{Math.round(fees.reduce((sum, f) => sum + f.amount, 0) / fees.length).toLocaleString()}
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
