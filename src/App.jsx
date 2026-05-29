import { useState } from 'react'
import { UserProvider, useUser } from './context/UserContext'
import LoginScreen from './components/LoginScreen'
import StudentLayout from './components/StudentLayout'
import StudentDashboard from './components/StudentDashboard'
import TeacherLayout from './components/TeacherLayout'
import TeacherDashboard from './components/TeacherDashboard'
import ParentLayout from './components/ParentLayout'
import ParentDashboard from './components/ParentDashboard'
import ProgressOverview from './components/ProgressOverview'
import CourseView from './components/CourseView'
import AdaptiveQuiz from './components/AdaptiveQuiz'
import PaymentModal from './components/PaymentModal'
import Leaderboard from './components/Leaderboard'
import AccountPage from './components/AccountPage'
import './App.css'

function AppShell() {
  const { userProfile, logout, currentSubject, quizChapter } = useUser()
  const [studentView, setStudentView] = useState('dashboard')
  const [teacherTab, setTeacherTab] = useState('overview')
  const [parentTab, setParentTab] = useState('family')
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [quizRunId, setQuizRunId] = useState(0)

  const openPayment = () => setPaymentOpen(true)
  const closePayment = () => setPaymentOpen(false)

  if (!userProfile) {
    return <LoginScreen />
  }

  if (userProfile.role === 'teacher') {
    return (
      <TeacherLayout
        activeTab={teacherTab}
        onTab={setTeacherTab}
        onLogout={logout}
      >
        {teacherTab === 'account' ? (
          <AccountPage />
        ) : (
          <TeacherDashboard activeTab={teacherTab} />
        )}
      </TeacherLayout>
    )
  }

  if (userProfile.role === 'parent') {
    return (
      <ParentLayout activeTab={parentTab} onTab={setParentTab} onLogout={logout}>
        {parentTab === 'account' ? <AccountPage /> : <ParentDashboard />}
      </ParentLayout>
    )
  }

  return (
    <>
      <StudentLayout
        studentView={studentView}
        onNavigate={setStudentView}
        onLogout={logout}
      >
        {studentView === 'dashboard' && (
          <StudentDashboard
            onOpenCourse={() => setStudentView('course')}
            onOpenPayment={openPayment}
          />
        )}
        {studentView === 'progress' && <ProgressOverview />}
        {studentView === 'leaderboard' && <Leaderboard />}
        {studentView === 'account' && <AccountPage />}
        {studentView === 'course' && (
          <CourseView
            onBack={() => setStudentView('dashboard')}
            onStartQuiz={() => {
              setQuizRunId((n) => n + 1)
              setStudentView('quiz')
            }}
            onOpenPayment={() => {
              setStudentView('dashboard')
              openPayment()
            }}
          />
        )}
        {studentView === 'quiz' && (
          <AdaptiveQuiz
            key={`quiz-${currentSubject}-${quizChapter}-${quizRunId}`}
            onBack={() => setStudentView('course')}
          />
        )}
      </StudentLayout>
      {paymentOpen && <PaymentModal onClose={closePayment} />}
    </>
  )
}

export default function App() {
  return (
    <UserProvider>
      <div className="app-root">
        <AppShell />
      </div>
    </UserProvider>
  )
}
