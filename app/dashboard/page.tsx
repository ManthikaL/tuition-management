'use client'

import { useApp } from '@/contexts/app-context'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

const COLORS = ['#5a4fb3', '#3d8cc9', '#d97706', '#f59e0b', '#ef4444']

export default function DashboardPage() {
  const { students, tutors, attendance, fees } = useApp()

  // Calculate statistics
  const totalStudents = students.length
  const activeStudents = students.filter(s => s.status === 'active').length
  const totalTutors = tutors.length
  const activeTutors = tutors.filter(t => t.status === 'active').length

  // Today's attendance
  const today = new Date().toISOString().split('T')[0]
  const todayAttendance = attendance.filter(a => a.date === today)
  const presentStudents = todayAttendance.filter(a => a.userType === 'student').length
  const presentTutors = todayAttendance.filter(a => a.userType === 'tutor').length

  // Fee statistics
  const pendingFees = fees.filter(f => f.status === 'pending')
  const paidFees = fees.filter(f => f.status === 'paid')
  const totalPending = pendingFees.reduce((sum, f) => sum + f.amount, 0)
  const totalPaid = paidFees.reduce((sum, f) => sum + f.amount, 0)

  // Attendance data for chart
  const attendanceData = [
    { name: 'Mon', students: 22, tutors: 5 },
    { name: 'Tue', students: 20, tutors: 5 },
    { name: 'Wed', students: 25, tutors: 5 },
    { name: 'Thu', students: 23, tutors: 5 },
    { name: 'Fri', students: 24, tutors: 5 },
    { name: 'Sat', students: 18, tutors: 4 },
  ]

  // Fee status pie chart
  const feeStatusData = [
    { name: 'Paid', value: totalPaid },
    { name: 'Pending', value: totalPending },
  ]

  // Attendance percentage by student
  const attendanceByStudent = students.slice(0, 5).map(student => ({
    name: student.name.split(' ')[0],
    percentage: Math.floor(Math.random() * 30 + 70),
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's a snapshot of your tuition center.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <Card className="p-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Total Students</p>
            <p className="text-3xl font-bold">{totalStudents}</p>
            <p className="text-xs text-green-600 dark:text-green-400">
              {activeStudents} active
            </p>
          </div>
        </Card>

        {/* Total Tutors */}
        <Card className="p-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Total Tutors</p>
            <p className="text-3xl font-bold">{totalTutors}</p>
            <p className="text-xs text-green-600 dark:text-green-400">
              {activeTutors} active
            </p>
          </div>
        </Card>

        {/* Today's Attendance */}
        <Card className="p-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Today's Attendance</p>
            <p className="text-3xl font-bold">{presentStudents}</p>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              {presentTutors} tutors marked
            </p>
          </div>
        </Card>

        {/* Pending Fees */}
        <Card className="p-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Pending Fees</p>
            <p className="text-3xl font-bold">₹{totalPending.toLocaleString()}</p>
            <p className="text-xs text-orange-600 dark:text-orange-400">
              {pendingFees.length} students
            </p>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trend */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Weekly Attendance Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={attendanceData}>
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
                dataKey="students"
                stroke="var(--primary)"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="tutors"
                stroke="var(--secondary)"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Fee Status */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Fee Collection Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={feeStatusData}
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
                {feeStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* More Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance by Student */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Student Attendance %</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attendanceByStudent}>
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
              <Bar dataKey="percentage" fill="var(--chart-1)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Monthly Fee Collection */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Monthly Fee Collection</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                { month: 'Oct', collected: 45000, pending: 15000 },
                { month: 'Nov', collected: 50000, pending: 10000 },
                { month: 'Dec', collected: 42000, pending: 18000 },
                { month: 'Jan', collected: 38000, pending: 22000 },
              ]}
            >
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
              <Bar dataKey="collected" fill="var(--chart-1)" radius={[8, 8, 0, 0]} />
              <Bar dataKey="pending" fill="var(--chart-3)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link href="/students">
            <Button className="w-full bg-transparent" variant="outline">
              Add Student
            </Button>
          </Link>
          <Link href="/tutors">
            <Button className="w-full bg-transparent" variant="outline">
              Add Tutor
            </Button>
          </Link>
          <Link href="/attendance">
            <Button className="w-full bg-transparent" variant="outline">
              Mark Attendance
            </Button>
          </Link>
          <Link href="/fees">
            <Button className="w-full bg-transparent" variant="outline">
              Record Fee Payment
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
