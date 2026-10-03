import React from 'react'
import { useLearning, getCurrentBank, getStats } from '../context/LearningContext'
import ProgressHeader from '../components/ProgressHeader'
import FlipCard from '../components/FlipCard'
import ActionButtons from '../components/ActionButtons'
import './StudyPage.css'

function StudyPage() {
  const { state, dispatch } = useLearning()
  const currentBank = getCurrentBank(state)
  const stats = getStats(state)
  const currentQuestion = currentBank?.questions[state.currentIndex]
  const progress = currentQuestion ? state.progress[currentQuestion.id] : null

  const handleFlip = () => {
    dispatch({ type: 'FLIP_CARD' })
  }

  const handleSelect = (status) => {
    if (!currentQuestion) return
    dispatch({
      type: 'SET_STATUS',
      payload: {
        questionId: currentQuestion.id,
        status
      }
    })

    if (navigator.vibrate) {
      navigator.vibrate(10)
    }
  }

  const handleNext = () => {
    if (!currentQuestion) return
    dispatch({ type: 'NEXT_QUESTION' })
  }

  if (!currentBank) {
    return (
      <div className="study-page">
        <ProgressHeader
          current={0}
          total={0}
          todayReviewed={stats.todayReviewed}
          masteryRate={0}
        />
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <h2 className="empty-title">暂无题库</h2>
          <p className="empty-text">请先在「题库」页面添加或导入题库</p>
        </div>
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="study-page">
        <ProgressHeader
          current={0}
          total={0}
          todayReviewed={stats.todayReviewed}
          masteryRate={0}
        />
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h2 className="empty-title">题库为空</h2>
          <p className="empty-text">当前题库没有任何题目</p>
        </div>
      </div>
    )
  }

  return (
    <div className="study-page">
      <ProgressHeader
        current={state.currentIndex + 1}
        total={stats.total}
        todayReviewed={stats.todayReviewed}
        masteryRate={stats.masteryRate}
      />

      <div className="study-content">
        <FlipCard
          question={currentQuestion}
          isFlipped={state.isFlipped}
          onFlip={handleFlip}
          progress={progress}
        />
      </div>

      <div className="study-actions">
        <ActionButtons
          onSelect={handleSelect}
          onNext={handleNext}
          disabled={!state.isFlipped}
        />
      </div>
    </div>
  )
}

export default StudyPage
