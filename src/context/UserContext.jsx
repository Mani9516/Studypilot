import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
} from 'react'
import { getSubjectsForClass } from '../utils/curriculum'
import { persistUserPatch } from '../services/userDatabase'

const UserContext = createContext(null)

const DEFAULT_SUBJECT = () => getSubjectsForClass(10)[0]

export function UserProvider({ children }) {
  const [userProfile, setUserProfile] = useState(null)
  const [currentSubject, setCurrentSubject] = useState(DEFAULT_SUBJECT)
  const [allCoursesUnlocked, setAllCoursesUnlocked] = useState(false)
  const [purchaseInfo, setPurchaseInfo] = useState(null)
  const [teacherAssignments, setTeacherAssignments] = useState([])
  const [quizChapter, setQuizChapter] = useState(2)

  const subjects = useMemo(() => {
    if (!userProfile || userProfile.role !== 'student') {
      return getSubjectsForClass(10)
    }
    return getSubjectsForClass(userProfile.classLevel ?? 10)
  }, [userProfile])

  const login = useCallback((profile) => {
    setUserProfile(profile)
    setAllCoursesUnlocked(!!profile.allCoursesUnlocked)
    setPurchaseInfo(profile.purchaseInfo ?? null)
    if (profile.role === 'student') {
      const list = getSubjectsForClass(profile.classLevel ?? 10)
      setCurrentSubject(
        list.includes(profile.currentSubject)
          ? profile.currentSubject
          : list[0],
      )
    } else {
      setCurrentSubject(DEFAULT_SUBJECT())
    }
    setQuizChapter(2)
  }, [])

  const logout = useCallback(() => {
    setUserProfile(null)
    setCurrentSubject(DEFAULT_SUBJECT())
    setAllCoursesUnlocked(false)
    setPurchaseInfo(null)
    setTeacherAssignments([])
    setQuizChapter(2)
  }, [])

  const updateProfile = useCallback((patch) => {
    setUserProfile((prev) => {
      if (!prev) return prev
      const next = { ...prev, ...patch }
      if (prev.userId) {
        const dbPatch = { ...patch }
        if (patch.displayName != null) dbPatch.name = patch.displayName
        delete dbPatch.displayName
        persistUserPatch(prev.userId, dbPatch)
      }
      return next
    })
  }, [])

  const setClassLevel = useCallback((classLevel) => {
    const next = Number(classLevel)
    const list = getSubjectsForClass(next)
    setUserProfile((prev) => {
      if (!prev) return prev
      const nextProfile = { ...prev, classLevel: next }
      if (prev.userId) persistUserPatch(prev.userId, { classLevel: next })
      return nextProfile
    })
    setCurrentSubject((cur) => (list.includes(cur) ? cur : list[0]))
  }, [])

  const setSubject = useCallback((subject) => {
    setCurrentSubject(subject)
  }, [])

  const unlockAllCourses = useCallback((info) => {
    const payload = { allCoursesUnlocked: true, purchaseInfo: info ?? null }
    setUserProfile((prev) => {
      if (!prev) return prev
      if (prev.userId) persistUserPatch(prev.userId, payload)
      return { ...prev, ...payload }
    })
    setAllCoursesUnlocked(true)
    setPurchaseInfo(info ?? null)
  }, [])

  const addTeacherAssignment = useCallback((row) => {
    setTeacherAssignments((prev) => [
      {
        id: `asg-${Date.now()}`,
        createdAt: new Date().toISOString(),
        ...row,
      },
      ...prev,
    ])
  }, [])

  const value = useMemo(
    () => ({
      userProfile,
      currentSubject,
      subjects,
      allCoursesUnlocked,
      purchaseInfo,
      teacherAssignments,
      quizChapter,
      setQuizChapter,
      login,
      logout,
      updateProfile,
      setClassLevel,
      setSubject,
      unlockAllCourses,
      addTeacherAssignment,
    }),
    [
      userProfile,
      currentSubject,
      subjects,
      allCoursesUnlocked,
      purchaseInfo,
      teacherAssignments,
      quizChapter,
      login,
      logout,
      updateProfile,
      setClassLevel,
      setSubject,
      unlockAllCourses,
      addTeacherAssignment,
    ],
  )

  return (
    <UserContext.Provider value={value}>{children}</UserContext.Provider>
  )
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) {
    throw new Error('useUser must be used within UserProvider')
  }
  return ctx
}
