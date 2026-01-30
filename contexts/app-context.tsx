'use client'

import React, { createContext, useContext, useState } from 'react'

export interface Student {
  id: string
  name: string
  studentId: string
  email: string
  phone: string
  parentName: string
  parentPhone: string
  grade: string
  subject: string
  enrollmentDate: string
  status: 'active' | 'inactive'
  qrCode: string
  fees?: Fee[]
  attendance?: Attendance[]
}

export interface Tutor {
  id: string
  name: string
  tutorId: string
  email: string
  phone: string
  subjects: string[]
  joinedDate: string
  status: 'active' | 'inactive'
  qrCode: string
  classes: string[]
  attendance?: Attendance[]
}

export interface Class {
  id: string
  name: string
  grade: string
  subject: string
  schedule: {
    day: string
    time: string
  }[]
  students: string[]
  tutors: string[]
}

export interface Attendance {
  id: string
  userId: string
  userType: 'student' | 'tutor'
  date: string
  time: string
  class: string
  subject: string
}

export interface Fee {
  id: string
  studentId: string
  month: string
  amount: number
  status: 'paid' | 'pending'
  paymentDate?: string
  paymentMethod?: 'cash' | 'online'
  class: string
  subject: string
}

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'tutor' | 'student' | 'parent'
  profilePicture?: string
}

interface AppContextType {
  currentUser: User | null
  setCurrentUser: (user: User | null) => void
  students: Student[]
  setStudents: (students: Student[]) => void
  tutors: Tutor[]
  setTutors: (tutors: Tutor[]) => void
  classes: Class[]
  setClasses: (classes: Class[]) => void
  attendance: Attendance[]
  setAttendance: (attendance: Attendance[]) => void
  fees: Fee[]
  setFees: (fees: Fee[]) => void
  addStudent: (student: Student) => void
  updateStudent: (id: string, student: Partial<Student>) => void
  deleteStudent: (id: string) => void
  addTutor: (tutor: Tutor) => void
  updateTutor: (id: string, tutor: Partial<Tutor>) => void
  deleteTutor: (id: string) => void
  markAttendance: (attendance: Attendance) => void
  recordFeePayment: (feeId: string, paymentDate: string, method: string) => void
  notifications: Notification[]
  addNotification: (notification: Notification) => void
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: string
  read: boolean
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: 'admin-1',
    email: 'admin@tuition.local',
    name: 'Admin User',
    role: 'admin',
  })

  const [students, setStudents] = useState<Student[]>([
    {
      id: '1',
      name: 'Aarav Sharma',
      studentId: 'STU-2024-001',
      email: 'aarav@example.com',
      phone: '+91 98765 43210',
      parentName: 'Mr. Sharma',
      parentPhone: '+91 98765 43211',
      grade: '10th Grade',
      subject: 'Mathematics',
      enrollmentDate: '2024-01-15',
      status: 'active',
      qrCode: 'STU-2024-001-QR',
    },
    {
      id: '2',
      name: 'Priya Patel',
      studentId: 'STU-2024-002',
      email: 'priya@example.com',
      phone: '+91 98765 43212',
      parentName: 'Mrs. Patel',
      parentPhone: '+91 98765 43213',
      grade: '10th Grade',
      subject: 'Science',
      enrollmentDate: '2024-01-20',
      status: 'active',
      qrCode: 'STU-2024-002-QR',
    },
    {
      id: '3',
      name: 'Rohan Kumar',
      studentId: 'STU-2024-003',
      email: 'rohan@example.com',
      phone: '+91 98765 43214',
      parentName: 'Mr. Kumar',
      parentPhone: '+91 98765 43215',
      grade: '9th Grade',
      subject: 'English',
      enrollmentDate: '2024-02-10',
      status: 'active',
      qrCode: 'STU-2024-003-QR',
    },
  ])

  const [tutors, setTutors] = useState<Tutor[]>([
    {
      id: '1',
      name: 'Ms. Anjali Singh',
      tutorId: 'TUT-2024-001',
      email: 'anjali@tuition.local',
      phone: '+91 98765 54320',
      subjects: ['Mathematics', 'Science'],
      joinedDate: '2023-06-01',
      status: 'active',
      qrCode: 'TUT-2024-001-QR',
      classes: ['10th Grade Math', '10th Grade Science'],
    },
    {
      id: '2',
      name: 'Mr. Vikram Desai',
      tutorId: 'TUT-2024-002',
      email: 'vikram@tuition.local',
      phone: '+91 98765 54321',
      subjects: ['English', 'History'],
      joinedDate: '2023-07-15',
      status: 'active',
      qrCode: 'TUT-2024-002-QR',
      classes: ['9th Grade English', '10th Grade History'],
    },
  ])

  const [classes, setClasses] = useState<Class[]>([
    {
      id: '1',
      name: '10th Grade Mathematics',
      grade: '10th Grade',
      subject: 'Mathematics',
      schedule: [
        { day: 'Monday', time: '4:00 PM - 5:30 PM' },
        { day: 'Wednesday', time: '4:00 PM - 5:30 PM' },
        { day: 'Friday', time: '4:00 PM - 5:30 PM' },
      ],
      students: ['1'],
      tutors: ['1'],
    },
    {
      id: '2',
      name: '10th Grade Science',
      grade: '10th Grade',
      subject: 'Science',
      schedule: [
        { day: 'Tuesday', time: '4:00 PM - 5:30 PM' },
        { day: 'Thursday', time: '4:00 PM - 5:30 PM' },
        { day: 'Saturday', time: '2:00 PM - 3:30 PM' },
      ],
      students: ['2'],
      tutors: ['1'],
    },
  ])

  const [attendance, setAttendance] = useState<Attendance[]>([
    {
      id: '1',
      userId: '1',
      userType: 'student',
      date: '2024-12-20',
      time: '16:05',
      class: '10th Grade Mathematics',
      subject: 'Mathematics',
    },
    {
      id: '2',
      userId: '1',
      userType: 'tutor',
      date: '2024-12-20',
      time: '16:00',
      class: '10th Grade Mathematics',
      subject: 'Mathematics',
    },
  ])

  const [fees, setFees] = useState<Fee[]>([
    {
      id: '1',
      studentId: '1',
      month: 'December 2024',
      amount: 5000,
      status: 'paid',
      paymentDate: '2024-12-01',
      paymentMethod: 'online',
      class: '10th Grade',
      subject: 'Mathematics',
    },
    {
      id: '2',
      studentId: '2',
      month: 'December 2024',
      amount: 5000,
      status: 'pending',
      class: '10th Grade',
      subject: 'Science',
    },
    {
      id: '3',
      studentId: '1',
      month: 'January 2025',
      amount: 5000,
      status: 'pending',
      class: '10th Grade',
      subject: 'Mathematics',
    },
  ])

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Fee Due',
      message: 'Fee for Priya Patel is due for December 2024',
      type: 'warning',
      timestamp: new Date().toISOString(),
      read: false,
    },
  ])

  const addStudent = (student: Student) => {
    setStudents([...students, student])
    addNotification({
      id: Date.now().toString(),
      title: 'Student Added',
      message: `${student.name} has been added successfully`,
      type: 'success',
      timestamp: new Date().toISOString(),
      read: false,
    })
  }

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents(students.map(s => s.id === id ? { ...s, ...updates } : s))
  }

  const deleteStudent = (id: string) => {
    setStudents(students.filter(s => s.id !== id))
  }

  const addTutor = (tutor: Tutor) => {
    setTutors([...tutors, tutor])
    addNotification({
      id: Date.now().toString(),
      title: 'Tutor Added',
      message: `${tutor.name} has been added successfully`,
      type: 'success',
      timestamp: new Date().toISOString(),
      read: false,
    })
  }

  const updateTutor = (id: string, updates: Partial<Tutor>) => {
    setTutors(tutors.map(t => t.id === id ? { ...t, ...updates } : t))
  }

  const deleteTutor = (id: string) => {
    setTutors(tutors.filter(t => t.id !== id))
  }

  const markAttendance = (att: Attendance) => {
    setAttendance([...attendance, att])
  }

  const recordFeePayment = (feeId: string, paymentDate: string, method: string) => {
    setFees(
      fees.map(f =>
        f.id === feeId
          ? {
              ...f,
              status: 'paid' as const,
              paymentDate,
              paymentMethod: method as 'cash' | 'online',
            }
          : f
      )
    )
  }

  const addNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev])
  }

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        students,
        setStudents,
        tutors,
        setTutors,
        classes,
        setClasses,
        attendance,
        setAttendance,
        fees,
        setFees,
        addStudent,
        updateStudent,
        deleteStudent,
        addTutor,
        updateTutor,
        deleteTutor,
        markAttendance,
        recordFeePayment,
        notifications,
        addNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
