import { useState } from 'react'
import { useUser } from '../context/UserContext'
import {
  getChapter1Blurb,
  getChapter2Summary,
  getChapterNBlurb,
  getSubjectFocus,
} from '../utils/courseContent'
import { getChapterSyllabus } from '../data/syllabusVideos'
import {
  CHAPTERS_PER_SUBJECT,
  isChapterFree,
} from '../utils/curriculum'

function ChapterLessonVideo({ level, subject, chapter, extraBlurb }) {
  const s = getChapterSyllabus(level, subject, chapter)
  return (
    <div className="video-shell">
      <p className="muted small syllabus-unit">
        <strong>Syllabus focus ·</strong> {s.unit}
      </p>
      <p className="muted small">
        <strong>Track ·</strong> {s.track}
      </p>
      {extraBlurb ? <p className="muted">{extraBlurb}</p> : null}
      {s.searchUrl ? (
        <a
          className="btn btn-youtube-search"
          href={s.searchUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Find lesson on YouTube — {s.unit}
        </a>
      ) : null}
      {s.embedUrl ? (
        <div className="video-youtube" title={`${subject} chapter ${chapter}`}>
          <iframe
            src={s.embedUrl}
            title={`Class ${level} ${subject} — chapter ${chapter} lesson`}
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      ) : null}
      <p className="muted tiny video-youtube-note">
        {s.embedUrl
          ? 'Embedded lesson from your topic search. Use the link above for more videos.'
          : 'Open YouTube to watch lessons for this exact chapter topic. Quiz questions use the syllabus line above.'}
      </p>
    </div>
  )
}

export default function CourseView({ onBack, onStartQuiz, onOpenPayment }) {
  const {
    userProfile,
    currentSubject,
    allCoursesUnlocked,
    setQuizChapter,
  } = useUser()
  const level = userProfile?.classLevel ?? 10
  const [openChapter, setOpenChapter] = useState(2)

  const title = `Class ${level} ${currentSubject}`
  const focus = getSubjectFocus(currentSubject)

  const startQuiz = (chapterNum) => {
    setQuizChapter(chapterNum)
    onStartQuiz()
  }

  const chapters = Array.from({ length: CHAPTERS_PER_SUBJECT }, (_, i) => i + 1)

  const chapterBlurb = (n) => {
    if (n === 1) return getChapter1Blurb(level, currentSubject)
    if (n === 2) return getChapter2Summary(level, currentSubject)
    return getChapterNBlurb(level, currentSubject, n)
  }

  return (
    <div className="page-course">
      <header className="page-head row space-between align-center">
        <button type="button" className="back-link row align-center gap-8" onClick={onBack}>
          <span aria-hidden>←</span> Back
        </button>
        <span className="muted small">
          {allCoursesUnlocked ? 'Full access' : 'Free: Ch. 1–2'}
        </span>
      </header>

      <section className="soft-card course-hero">
        <p className="eyebrow">Your subject</p>
        <h1 className="page-title">{title}</h1>
        <p className="muted">
          {CHAPTERS_PER_SUBJECT} chapters — chapters <strong>1–2</strong> are free with
          lessons and quizzes. Chapters <strong>3–8</strong> unlock with the library plan
          ({focus}).
        </p>
      </section>

      {!allCoursesUnlocked && (
        <section className="soft-card course-upgrade-banner">
          <div className="pay-banner-row">
            <div>
              <strong>Unlock chapters 3–8</strong>
              <p className="muted small">
                Every subject includes eight chapters. Upgrade once to open paid
                chapters across your class.
              </p>
            </div>
            <button type="button" className="primary pay-banner-btn" onClick={onOpenPayment}>
              Unlock — ₹499
            </button>
          </div>
        </section>
      )}

      <div className="chapters">
        {chapters.map((n) => {
          const unlocked = isChapterFree(n, allCoursesUnlocked)

          if (!unlocked) {
            return (
              <div key={n} className="chapter soft-card chapter-locked">
                <div className="chapter-locked-head">
                  <span className="chapter-num">Chapter {n}</span>
                  <span className="pill pill-paid">Paid</span>
                </div>
                <p className="muted small">
                  Included with full library access. Pay once from the dashboard to
                  unlock chapters 3–8 for every subject.
                </p>
                <button type="button" className="primary" onClick={onOpenPayment}>
                  Unlock library
                </button>
              </div>
            )
          }

          return (
            <details
              key={n}
              className="chapter soft-card video-chapter"
              open={openChapter === n}
              onToggle={(e) => {
                if (e.target.open) setOpenChapter(n)
              }}
            >
              <summary>
                Chapter {n}
                {n <= 2 ? ' · Free' : ''}
              </summary>

              <ChapterLessonVideo
                level={level}
                subject={currentSubject}
                chapter={n}
                extraBlurb={chapterBlurb(n)}
              />

              <button
                type="button"
                className="primary wide quiz-cta"
                onClick={() => startQuiz(n)}
              >
                Chapter {n} quiz (8 questions)
              </button>
            </details>
          )
        })}
      </div>
    </div>
  )
}
