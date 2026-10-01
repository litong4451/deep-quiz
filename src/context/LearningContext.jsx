import React, { createContext, useContext, useReducer } from 'react'

const STORAGE_KEY = 'deepquiz_data'

const initialState = {
  questionBanks: [],
  currentBankId: null,
  progress: {},
  todayReviewed: 0,
  lastStudyDate: null,
  currentIndex: 0,
  isFlipped: false
}

function loadFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      const today = new Date().toDateString()
      return {
        ...initialState,
        questionBanks: parsed.questionBanks || [],
        currentBankId: parsed.currentBankId || null,
        progress: parsed.progress || {},
        todayReviewed: parsed.lastStudyDate === today ? (parsed.todayReviewed || 0) : 0,
        lastStudyDate: parsed.lastStudyDate || null
      }
    }
  } catch (e) {
    console.warn('Failed to load data from storage')
  }
  return initialState
}

function saveToStorage(state) {
  try {
    const today = new Date().toDateString()
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      questionBanks: state.questionBanks,
      currentBankId: state.currentBankId,
      progress: state.progress,
      todayReviewed: state.todayReviewed,
      lastStudyDate: today
    }))
  } catch (e) {
    console.warn('Failed to save data to storage')
  }
}

function learningReducer(state, action) {
  switch (action.type) {
    case 'FLIP_CARD':
      return { ...state, isFlipped: !state.isFlipped }

    case 'NEXT_QUESTION': {
      const bank = state.questionBanks.find(b => b.id === state.currentBankId)
      if (!bank) return state
      let nextIndex = state.currentIndex + 1
      if (nextIndex >= bank.questions.length) {
        nextIndex = 0
      }
      return { ...state, currentIndex: nextIndex, isFlipped: false }
    }

    case 'PREV_QUESTION': {
      const bank = state.questionBanks.find(b => b.id === state.currentBankId)
      if (!bank) return state
      let prevIndex = state.currentIndex - 1
      if (prevIndex < 0) {
        prevIndex = bank.questions.length - 1
      }
      return { ...state, currentIndex: prevIndex, isFlipped: false }
    }

    case 'SET_STATUS': {
      const { questionId, status } = action.payload
      const bank = state.questionBanks.find(b => b.id === state.currentBankId)
      if (!bank) return state

      const newProgress = {
        ...state.progress,
        [questionId]: {
          status,
          lastReviewed: Date.now(),
          reviewCount: (state.progress[questionId]?.reviewCount || 0) + 1
        }
      }

      const today = new Date().toDateString()
      const newTodayReviewed = state.lastStudyDate !== today
        ? 1
        : state.todayReviewed + 1

      let nextIndex = state.currentIndex + 1
      if (nextIndex >= bank.questions.length) {
        nextIndex = 0
      }

      const newState = {
        ...state,
        progress: newProgress,
        todayReviewed: newTodayReviewed,
        lastStudyDate: today,
        currentIndex: nextIndex,
        isFlipped: false
      }

      setTimeout(() => saveToStorage(newState), 0)
      return newState
    }

    case 'GO_TO_QUESTION':
      return { ...state, currentIndex: action.payload, isFlipped: false }

    case 'ADD_QUESTION_BANK': {
      const newBank = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: Date.now()
      }
      const newState = {
        ...state,
        questionBanks: [...state.questionBanks, newBank],
        currentBankId: newBank.id
      }
      setTimeout(() => saveToStorage(newState), 0)
      return newState
    }

    case 'UPDATE_QUESTION_BANK': {
      const { bankId, updates } = action.payload
      const newState = {
        ...state,
        questionBanks: state.questionBanks.map(b =>
          b.id === bankId ? { ...b, ...updates } : b
        )
      }
      setTimeout(() => saveToStorage(newState), 0)
      return newState
    }

    case 'DELETE_QUESTION_BANK': {
      const bankToDelete = state.questionBanks.find(b => b.id === action.payload)
      if (!bankToDelete) return state

      const newProgress = { ...state.progress }
      bankToDelete.questions.forEach(q => {
        delete newProgress[q.id]
      })

      const newBanks = state.questionBanks.filter(b => b.id !== action.payload)
      const newState = {
        ...state,
        questionBanks: newBanks,
        currentBankId: newBanks.length > 0 ? newBanks[0].id : null,
        progress: newProgress,
        currentIndex: 0,
        isFlipped: false
      }
      setTimeout(() => saveToStorage(newState), 0)
      return newState
    }

    case 'SELECT_BANK':
      return { ...state, currentBankId: action.payload, currentIndex: 0, isFlipped: false }

    case 'IMPORT_BANK': {
      const existingIndex = state.questionBanks.findIndex(b => b.id === action.payload.id)
      let newBanks
      if (existingIndex >= 0) {
        newBanks = state.questionBanks.map((b, i) =>
          i === existingIndex ? { ...action.payload, id: b.id } : b
        )
      } else {
        const newBank = { ...action.payload, id: Date.now().toString(), createdAt: Date.now() }
        newBanks = [...state.questionBanks, newBank]
      }
      const newState = {
        ...state,
        questionBanks: newBanks,
        currentBankId: existingIndex >= 0 ? state.currentBankId : newBanks[newBanks.length - 1].id
      }
      setTimeout(() => saveToStorage(newState), 0)
      return newState
    }

    case 'ADD_QUESTION': {
      const { bankId, question } = action.payload
      const newQuestion = { ...question, id: Date.now().toString() }
      const newState = {
        ...state,
        questionBanks: state.questionBanks.map(b =>
          b.id === bankId
            ? { ...b, questions: [...b.questions, newQuestion] }
            : b
        )
      }
      setTimeout(() => saveToStorage(newState), 0)
      return newState
    }

    case 'UPDATE_QUESTION': {
      const { bankId, questionId, updates } = action.payload
      const newState = {
        ...state,
        questionBanks: state.questionBanks.map(b =>
          b.id === bankId
            ? {
                ...b,
                questions: b.questions.map(q =>
                  q.id === questionId ? { ...q, ...updates } : q
                )
              }
            : b
        )
      }
      setTimeout(() => saveToStorage(newState), 0)
      return newState
    }

    case 'DELETE_QUESTION': {
      const { bankId, questionId } = action.payload
      const newProgress = { ...state.progress }
      delete newProgress[questionId]
      const newState = {
        ...state,
        questionBanks: state.questionBanks.map(b =>
          b.id === bankId
            ? { ...b, questions: b.questions.filter(q => q.id !== questionId) }
            : b
        ),
        progress: newProgress,
        currentIndex: Math.max(0, state.currentIndex - 1)
      }
      setTimeout(() => saveToStorage(newState), 0)
      return newState
    }

    case 'RESET_PROGRESS':
      return { ...initialState, questionBanks: state.questionBanks, currentBankId: state.currentBankId }

    default:
      return state
  }
}

const LearningContext = createContext(null)

export function LearningProvider({ children }) {
  const [state, dispatch] = useReducer(learningReducer, null, loadFromStorage)
  return (
    <LearningContext.Provider value={{ state, dispatch }}>
      {children}
    </LearningContext.Provider>
  )
}

export function useLearning() {
  const context = useContext(LearningContext)
  if (!context) {
    throw new Error('useLearning must be used within a LearningProvider')
  }
  return context
}

export function getCurrentBank(state) {
  return state.questionBanks.find(b => b.id === state.currentBankId) || null
}

export function getStats(state) {
  const bank = getCurrentBank(state)
  const total = bank?.questions.length || 0
  const mastered = Object.values(state.progress).filter(p => p.status === 'mastered').length
  const fuzzy = Object.values(state.progress).filter(p => p.status === 'fuzzy').length
  const unknown = Object.values(state.progress).filter(p => p.status === 'unknown').length
  const masteryRate = total > 0 ? Math.round((mastered / total) * 100) : 0

  return {
    total,
    mastered,
    fuzzy,
    unknown,
    masteryRate,
    todayReviewed: state.todayReviewed,
    reviewed: Object.keys(state.progress).length,
    bankCount: state.questionBanks.length
  }
}
