import { useMemo, useState } from 'react'
import { useUser } from '../context/UserContext'
import {
  QUIZ_QUESTION_COUNT,
  createQuizSessionSeed,
} from '../utils/generateAdaptiveQuiz'
import { buildChapterQuizDeck } from '../utils/chapterQuizDeck'
import { recordQuizScore } from '../services/userDatabase'
import { getChapterSyllabus } from '../data/syllabusVideos'
import { getQuizUiLabels } from '../data/topicQuizContent'

export default function AdaptiveQuiz({ onBack }) {
  const {
    userProfile,
    currentSubject,
    purchaseInfo,
    allCoursesUnlocked,
    quizChapter,
  } = useUser()
  const level = userProfile?.classLevel ?? 10

  const canTakeQuiz =
    allCoursesUnlocked || (quizChapter >= 1 && quizChapter <= 2)

  const syllabus = useMemo(
    () => getChapterSyllabus(level, currentSubject, quizChapter),
    [level, currentSubject, quizChapter],
  )

  const ui = useMemo(
    () => getQuizUiLabels(currentSubject),
    [currentSubject],
  )

  const [sessionSeed] = useState(() => createQuizSessionSeed())
  const deck = useMemo(
    () =>
      canTakeQuiz
        ? buildChapterQuizDeck(level, currentSubject, quizChapter, sessionSeed)
        : [],
    [canTakeQuiz, level, currentSubject, quizChapter, sessionSeed],
  )

  const [questionIndex, setQuestionIndex] = useState(0)
  const [adaptiveLevel, setAdaptiveLevel] = useState(
    () => deck[0]?.level ?? 3,
  )
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [lastCorrect, setLastCorrect] = useState(null)

  const current = deck[questionIndex] ?? null

  if (!canTakeQuiz) {
    return (
      <div className="page-quiz">
        <header className="page-head">
          <button type="button" className="back-link row align-center gap-8" onClick={onBack}>
            <span aria-hidden>←</span> Back to course
          </button>
        </header>
        <div className="soft-card finish-card">
          <h1 className="page-title">Quiz locked</h1>
          <p className="muted">
            Chapter {quizChapter} quizzes open after you unlock the library (chapters
            3–8). Chapters 1–2 stay free — open their quiz from those chapters only.
          </p>
          <button type="button" className="primary" onClick={onBack}>
            Back to course
          </button>
        </div>
      </div>
    )
  }

  const handleAnswer = (choiceIndex) => {
    if (!current) return
    const correct = choiceIndex === current.correctIndex
    setLastCorrect(correct)
    const nextScore = correct ? score + 1 : score
    if (correct) setScore((s) => s + 1)

    const isLast = questionIndex >= QUIZ_QUESTION_COUNT - 1

    setTimeout(() => {
      setLastCorrect(null)
      if (isLast) {
        if (userProfile?.userId) {
          recordQuizScore({
            userId: userProfile.userId,
            name: userProfile.displayName ?? 'Student',
            classLevel: level,
            subject: currentSubject,
            chapter: quizChapter,
            score: nextScore,
            max: QUIZ_QUESTION_COUNT,
          })
        }
        setFinished(true)
      } else {
        const nextIndex = questionIndex + 1
        setQuestionIndex(nextIndex)
        const nextQ = deck[nextIndex]
        if (nextQ?.level) setAdaptiveLevel(nextQ.level)
      }
    }, 450)
  }

  if (finished) {
    return (
      <div className="page-quiz">
        <header className="page-head">
          <button type="button" className="back-link row align-center gap-8" onClick={onBack}>
            <span aria-hidden>←</span> Back to course
          </button>
        </header>
        <div className="soft-card finish-card">
          <p className="eyebrow">Quiz complete</p>
          <h1 className="page-title">Nice work</h1>
          <p className="lead">
            You finished the Class {level} {currentSubject} · Chapter {quizChapter}{' '}
            quiz ({score}/{QUIZ_QUESTION_COUNT} correct).
            {purchaseInfo ? ' Thanks for unlocking the full library.' : ''}
          </p>
          <p className="muted small">
            {ui.lessonTopic}: <strong>{syllabus.unit}</strong>
          </p>
          <button type="button" className="primary" onClick={onBack}>
            Return to course
          </button>
        </div>
      </div>
    )
  }

  if (!current) return null

  const displayLevel = current.level ?? adaptiveLevel

  return (
    <div className="page-quiz">
      <header className="page-head">
        <button type="button" className="back-link row align-center gap-8" onClick={onBack}>
          <span aria-hidden>←</span> Back to course
        </button>
      </header>

      <div className="soft-card quiz-intro row space-between align-start wrap-gap">
        <div>
          <p className="eyebrow">
            Class {level} {currentSubject} · Ch.{quizChapter}
          </p>
          <h1 className="page-title">
            {ui.questionOf(questionIndex + 1, QUIZ_QUESTION_COUNT)}
          </h1>
          <p className="muted small quiz-syllabus-line">
            <strong>{ui.lessonTopic}:</strong> {syllabus.unit}
          </p>
          <p className="muted small">
            {ui.difficulty}: <strong>{current.difficulty}</strong> ({ui.adaptiveLevel}{' '}
            {displayLevel}/5)
          </p>
        </div>
        <div className="pill subtle-pill">
          {ui.score} {score}
        </div>
      </div>

      <article className="soft-card question-card">
        <p className="quiz-block-label">{ui.question}</p>
        <p className="prompt" lang={currentSubject === 'Hindi' ? 'hi' : undefined}>
          {current.prompt}
        </p>
        <p className="quiz-block-label quiz-block-label--options">{ui.options}</p>
        <div className="answers" role="list">
          {current.options.map((opt, i) => (
            <button
              type="button"
              key={`${current.id}-${i}`}
              className="answer"
              onClick={() => handleAnswer(i)}
              disabled={lastCorrect !== null}
              aria-label={`Option ${String.fromCharCode(65 + i)}: ${opt}`}
            >
              <span className="badge">{String.fromCharCode(65 + i)}</span>
              <span className="answer-text">{opt}</span>
            </button>
          ))}
        </div>
        {lastCorrect !== null && (
          <p className="feedback" data-correct={lastCorrect}>
            {lastCorrect ? ui.correctNext : ui.wrongNext}
          </p>
        )}
      </article>
    </div>
  )
}
