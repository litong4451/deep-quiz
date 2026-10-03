import React from 'react'
import './ActionButtons.css'

function ActionButtons({ onSelect, disabled, onNext }) {
  const buttons = [
    {
      id: 'unknown',
      label: '不会',
      icon: '✕',
      className: 'btn-unknown'
    },
    {
      id: 'fuzzy',
      label: '模糊',
      icon: '~',
      className: 'btn-fuzzy'
    },
    {
      id: 'mastered',
      label: '掌握',
      icon: '✓',
      className: 'btn-mastered'
    }
  ]

  return (
    <div className="action-buttons">
      {onNext && (
        <button
          className="action-btn btn-next"
          onClick={onNext}
        >
          <span className="btn-icon">▶</span>
          <span className="btn-label">下一题</span>
        </button>
      )}
      {buttons.map(btn => (
        <button
          key={btn.id}
          className={`action-btn ${btn.className}`}
          onClick={() => onSelect(btn.id)}
          disabled={disabled}
        >
          <span className="btn-icon">{btn.icon}</span>
          <span className="btn-label">{btn.label}</span>
        </button>
      ))}
    </div>
  )
}

export default ActionButtons
