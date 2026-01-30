'use client'

import { useApp } from '@/contexts/app-context'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { useState } from 'react'
import { Download, Calendar } from 'lucide-react'

const COLORS = ['#5a4fb3', '#3d8cc9', '#d97706', '#f59e0b', '#ef4444']

export default function ReportsPage() {
  const { students, tutors, attendance, fees } = useApp()
  const [reportMonth, setReportMonth] = useState('December 2024')
  const [reportType, setReportType] = useState('attendance')

  // Calculate attendance statistics
  const totalAttendanceRecords = attendance.length
  const studentAttendance = attendance.filter(a => a.userType === 'student').length
  const tutorAttendance = attendance.filter(a => a.userType === 'tutor').length
  const studentAttendanceRate = Math.round(
    (studentAttendance / (students.length * 10)) * 100
  )
  const tutorAttendanceRate = Math.round(
    (tutorAttendance / (tutors.length * 10)) * 100
  )

  // Attendance by subject
  const attendanceBySubject = [
    { subject: 'Mathematics', present: 22, absent: 3 },
    { subject: 'Science', present: 20, absent: 5 },
    { subject: 'English', present: 18, absent: 7 },
    { subject: 'History', present: 19, absent: 6 },
    { subject: 'Economics', present: 21, absent: 4 },
  ]

  // Fee collection data
  const feeCollectionData = [
    { month: 'October', paid: 45000, pending: 15000 },
    { month: 'November', paid: 50000, pending: 10000 },
    { month: 'December', paid: 42000, pending: 18000 },
  ]

  // Monthly fee status
  const feeStatus = [
    { name: 'Paid', value: 45000 },
    { name: 'Pending', value: 18000 },
  ]

  // Student performance/attendance percentage
  const studentPerformance = students.slice(0, 8).map((student, idx) => ({
    name: student.name.split(' ')[0],
    attendance: Math.floor(Math.random() * 30 + 70),
  }))

  // Tutor attendance trend
  const tutorTrend = [
    { week: 'Week 1', attended: 5, absent: 0 },
    { week: 'Week 2', attended: 5, absent: 0 },
    { week: 'Week 3', attended: 4, absent: 1 },
    { week: 'Week 4', attended: 5, absent: 0 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive attendance, fee, and performance analytics
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <label className="block text-sm font-medium mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            Report Month
          </label>
          <Select value={reportMonth} onValueChange={setReportMonth}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="October 2024">October 2024</SelectItem>
              <SelectItem value="November 2024">November 2024</SelectItem>
              <SelectItem value="December 2024">December 2024</SelectItem>
              <SelectItem value="January 2025">January 2025</SelectItem>
            </SelectContent>
          </Select>
        </Card>

        <Card className="p-4">
          <label className="block text-sm font-medium mb-2">Report Type</label>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="attendance">Attendance Report</SelectItem>
              <SelectItem value="fees">Fee Report</SelectItem>
              <SelectItem value="performance">Performance Report</SelectItem>
            </SelectContent>
          </Select>
        </Card>

        <Card className="p-4 flex items-end">
          <Button className="w-full">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </Card>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Total Attendance
            </p>
            <p className="text-3xl font-bold">{totalAttendanceRecords}</p>
            <p className="text-xs text-muted-foreground">records</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Student Rate
            </p>
            <p className="text-3xl font-bold">{studentAttendanceRate}%</p>
            <p className="text-xs text-muted-foreground">{studentAttendance} present</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Tutor Rate
            </p>
            <p className="text-3xl font-bold">{tutorAttendanceRate}%</p>
            <p className="text-xs text-muted-foreground">{tutorAttendance} present</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Fee Collection
            </p>
            <p className="text-3xl font-bold">
              ₹{fees
                .filter(f => f.status === 'paid')
                .reduce((sum, f) => sum + f.amount, 0)
                .toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">
              {fees.filter(f => f.status === 'paid').length} payments
            </p>
          </div>
        </Card>
      </div>

      {/* Charts */}
      {reportType === 'attendance' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attendance by Subject */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Attendance by Subject</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceBySubject}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="present" fill="var(--chart-1)" radius={[8, 8, 0, 0]} />
                <Bar dataKey="absent" fill="var(--chart-3)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Tutor Attendance Trend */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Tutor Attendance Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={tutorTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="attended"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="absent"
                  stroke="var(--chart-3)"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Student Attendance Percentage */}
          <Card className="p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Student Attendance %</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={studentPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="attendance" fill="var(--chart-1)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {reportType === 'fees' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Fee Collection Trend */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Fee Collection Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={feeCollectionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="paid"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="pending"
                  stroke="var(--chart-3)"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Fee Status Pie */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Fee Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={feeStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {feeStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Monthly Comparison */}
          <Card className="p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Monthly Fee Comparison</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={feeCollectionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="paid" fill="var(--chart-1)" radius={[8, 8, 0, 0]} />
                <Bar dataKey="pending" fill="var(--chart-3)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}
    </div>
  )
}
