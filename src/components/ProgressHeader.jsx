import React from 'react'
import './ProgressHeader.css'

function ProgressHeader({ current, total, todayReviewed, masteryRate }) {
  const progress = total > 0 ? (current / total) * 100 : 0

  return (
    <header className="progress-header">
      <div className="header-top">
        <h1 className="header-title">深题</h1>
        <div className="today-badge">
          <span className="today-icon">📚</span>
          <span className="today-count">{todayReviewed}</span>
        </div>
      </div>

      <div className="progress-info">
        <div className="progress-text">
          <span className="progress-current">{current}</span>
          <span className="progress-separator">/</span>
          <span className="progress-total">{total}</span>
        </div>
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mastery-info">
        <div className="mastery-item">
          <span className="mastery-label">掌握率</span>
          <span className="mastery-value">{masteryRate}%</span>
        </div>
      </div>
    </header>
  )
}

export default ProgressHeader
