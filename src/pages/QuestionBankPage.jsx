import React, { useState, useRef } from 'react'
import { useLearning } from '../context/LearningContext'
import './QuestionBankPage.css'

function QuestionBankPage() {
  const { state, dispatch } = useLearning()
  const [isDragging, setIsDragging] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showQuestionModal, setShowQuestionModal] = useState(false)
  const [editingBank, setEditingBank] = useState(null)
  const [editingQuestion, setEditingQuestion] = useState(null)
  const [activeBankId, setActiveBankId] = useState(null)
  const fileInputRef = useRef(null)

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && (file.type === 'application/json' || file.name.endsWith('.json'))) {
      importQuestionBank(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      importQuestionBank(file)
    }
  }

  const importQuestionBank = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        if (data.questions && Array.isArray(data.questions)) {
          dispatch({
            type: 'IMPORT_BANK',
            payload: data
          })
          alert(`成功导入「${data.name}」，共 ${data.questions.length} 道题目！`)
        } else {
          alert('文件格式错误，请确保包含 questions 数组')
        }
      } catch (err) {
        alert('JSON 解析失败：' + err.message)
      }
    }
    reader.readAsText(file)
  }

  const handleDeleteBank = (bankId, bankName) => {
    if (confirm(`确定要删除题库「${bankName}」吗？\n该操作不可恢复。`)) {
      dispatch({ type: 'DELETE_QUESTION_BANK', payload: bankId })
    }
  }

  const handleSelectBank = (bankId) => {
    dispatch({ type: 'SELECT_BANK', payload: bankId })
  }

  const handleAddQuestion = (bankId) => {
    setActiveBankId(bankId)
    setEditingQuestion(null)
    setShowQuestionModal(true)
  }

  const handleEditQuestion = (question) => {
    setActiveBankId(state.currentBankId)
    setEditingQuestion(question)
    setShowQuestionModal(true)
  }

  const handleDeleteQuestion = (bankId, questionId) => {
    if (confirm('确定要删除这道题目吗？')) {
      dispatch({ type: 'DELETE_QUESTION', payload: { bankId, questionId } })
    }
  }

  const handleSaveQuestion = (questionData) => {
    if (editingQuestion) {
      dispatch({
        type: 'UPDATE_QUESTION',
        payload: { bankId: activeBankId, questionId: editingQuestion.id, updates: questionData }
      })
    } else {
      dispatch({
        type: 'ADD_QUESTION',
        payload: { bankId: activeBankId, question: questionData }
      })
    }
    setShowQuestionModal(false)
  }

  const handleSaveBank = (bankData) => {
    if (editingBank) {
      dispatch({
        type: 'UPDATE_QUESTION_BANK',
        payload: { bankId: editingBank.id, updates: bankData }
      })
    } else {
      dispatch({
        type: 'ADD_QUESTION_BANK',
        payload: { ...bankData, questions: [] }
      })
    }
    setShowAddModal(false)
    setEditingBank(null)
  }

  return (
    <div className="question-bank-page">
      <header className="bank-header">
        <h1 className="bank-title">题库管理</h1>
        <button className="add-bank-btn" onClick={() => { setEditingBank(null); setShowAddModal(true); }}>
          + 新建题库
        </button>
      </header>

      <div className="bank-content">
        {state.questionBanks.length === 0 ? (
          <section className="empty-banks">
            <div className="empty-icon">📚</div>
            <h2 className="empty-title">还没有题库</h2>
            <p className="empty-text">导入 JSON 文件或手动创建题库</p>
          </section>
        ) : (
          <section className="bank-list">
            {state.questionBanks.map(bank => (
              <div
                key={bank.id}
                className={`bank-item ${state.currentBankId === bank.id ? 'active' : ''}`}
              >
                <div className="bank-item-header" onClick={() => handleSelectBank(bank.id)}>
                  <div className="bank-info">
                    <h3 className="bank-name">{bank.name}</h3>
                    <span className="bank-count">{bank.questions.length} 道题目</span>
                  </div>
                  <div className="bank-actions">
                    <button className="action-btn-small" onClick={(e) => { e.stopPropagation(); handleAddQuestion(bank.id); }}>
                      +
                    </button>
                    <button className="action-btn-small" onClick={(e) => { e.stopPropagation(); setEditingBank(bank); setShowAddModal(true); }}>
                      ✎
                    </button>
                    <button className="action-btn-small delete" onClick={(e) => { e.stopPropagation(); handleDeleteBank(bank.id, bank.name); }}>
                      ✕
                    </button>
                  </div>
                </div>

                {state.currentBankId === bank.id && bank.questions.length > 0 && (
                  <div className="question-list">
                    {bank.questions.map((q, idx) => (
                      <div key={q.id} className="question-item">
                        <span className="question-index">{idx + 1}</span>
                        <span className="question-preview">
                          [{q.type === 'single' ? '单选' : q.type === 'multiple' ? '多选' : q.type === 'boolean' ? '判断' : '简答'}]
                          {q.question.substring(0, 30)}{q.question.length > 30 ? '...' : ''}
                        </span>
                        <div className="question-item-actions">
                          <button onClick={() => handleEditQuestion(q)}>编辑</button>
                          <button className="delete" onClick={() => handleDeleteQuestion(bank.id, q.id)}>删除</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        <section
          className={`import-zone ${isDragging ? 'dragging' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          <div className="import-icon">📂</div>
          <p className="import-text">导入题库文件</p>
          <p className="import-hint">拖拽或点击选择 JSON 文件</p>
        </section>

        <section className="format-example">
          <h3 className="example-title">题库 JSON 格式</h3>
          <pre className="example-code">{`{
  "name": "题库名称",
  "description": "题库描述",
  "questions": [
    {
      "type": "single",
      "question": "题目内容",
      "options": ["选项A", "选项B", "选项C", "选项D"],
      "answer": "选项A",
      "explanation": "解析说明"
    },
    {
      "type": "multiple",
      "question": "多选题内容",
      "options": ["A", "B", "C", "D"],
      "answer": ["A", "C"],
      "explanation": "多选解析"
    },
    {
      "type": "boolean",
      "question": "判断题内容",
      "answer": "正确",
      "explanation": "判断解析"
    }
  ]
}`}</pre>
        </section>
      </div>

      {showAddModal && (
        <BankModal
          bank={editingBank}
          onSave={handleSaveBank}
          onClose={() => { setShowAddModal(false); setEditingBank(null); }}
        />
      )}

      {showQuestionModal && (
        <QuestionModal
          question={editingQuestion}
          onSave={handleSaveQuestion}
          onClose={() => { setShowQuestionModal(false); setEditingQuestion(null); }}
        />
      )}
    </div>
  )
}

function BankModal({ bank, onSave, onClose }) {
  const [name, setName] = useState(bank?.name || '')
  const [description, setDescription] = useState(bank?.description || '')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    onSave({ name: name.trim(), description: description.trim() })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">{bank ? '编辑题库' : '新建题库'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>题库名称</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="例如：计算机基础知识"
              autoFocus
            />
          </div>
          <div className="form-group">
            <label>描述（可选）</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="题库简介..."
              rows={3}
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>取消</button>
            <button type="submit" className="btn-save" disabled={!name.trim()}>保存</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function QuestionModal({ question, onSave, onClose }) {
  const [type, setType] = useState(question?.type || 'single')
  const [qText, setQText] = useState(question?.question || '')
  const [options, setOptions] = useState(question?.options?.join('\n') || '')
  const [answer, setAnswer] = useState(
    question ? (Array.isArray(question.answer) ? question.answer.join('\n') : question.answer) : ''
  )
  const [explanation, setExplanation] = useState(question?.explanation || '')

  const optionList = options.split('\n').map(s => s.trim()).filter(Boolean)
  const answerList = type === 'multiple'
    ? answer.split('\n').map(s => s.trim()).filter(Boolean)
    : [answer.trim()]

  const switchType = (t) => {
    setType(t)
    if (t === 'boolean' && !answer.trim()) {
      setAnswer('正确')
    }
  }

  const toggleOption = (opt) => {
    if (type === 'single') {
      setAnswer(answer === opt ? '' : opt)
    } else if (type === 'multiple') {
      const list = answer.split('\n').map(s => s.trim()).filter(Boolean)
      const idx = list.indexOf(opt)
      if (idx >= 0) {
        list.splice(idx, 1)
      } else {
        list.push(opt)
      }
      setAnswer(list.join('\n'))
    }
  }

  const isOptionSelected = (opt) => answerList.includes(opt)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!qText.trim()) return

    const cleanOptions = options.split('\n').map(s => s.trim()).filter(Boolean)
    let processedAnswer = answer.trim()
    if (type === 'multiple') {
      processedAnswer = answer.split('\n').map(s => s.trim()).filter(Boolean)
    }

    const data = {
      type,
      question: qText.trim(),
      options: type === 'boolean' || type === 'short' ? undefined : cleanOptions,
      answer: processedAnswer,
      explanation: explanation.trim() || undefined
    }

    onSave(data)
  }

  const canSave = qText.trim() && (
    type === 'boolean'
      ? !!answer.trim()
      : type === 'short'
        ? !!answer.trim()
        : optionList.length >= 2 && answerList.length > 0
  )

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-large" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">{question ? '编辑题目' : '添加题目'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>题目类型</label>
            <div className="type-selector">
              {['single', 'multiple', 'boolean', 'short'].map(t => (
                <button
                  key={t}
                  type="button"
                  className={`type-btn ${type === t ? 'active' : ''}`}
                  onClick={() => switchType(t)}
                >
                  {t === 'single' ? '单选' : t === 'multiple' ? '多选' : t === 'boolean' ? '判断' : '简答'}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>题目内容</label>
            <textarea
              value={qText}
              onChange={e => setQText(e.target.value)}
              placeholder="输入题目内容..."
              rows={2}
              autoFocus
            />
          </div>

          {(type === 'single' || type === 'multiple') && (
            <div className="form-group">
              <label>选项（每行一个）</label>
              <textarea
                value={options}
                onChange={e => setOptions(e.target.value)}
                placeholder={"选项A\n选项B\n选项C\n选项D"}
                rows={4}
              />
              {optionList.length >= 2 && (
                <div className="option-pick">
                  <span className="option-pick-label">点选正确答案：</span>
                  <div className="option-pick-list">
                    {optionList.map((opt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`option-pick-btn ${isOptionSelected(opt) ? 'active' : ''}`}
                        onClick={() => toggleOption(opt)}
                      >
                        {String.fromCharCode(65 + idx)}. {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="form-group">
            <label>
              {type === 'multiple' ? '正确答案（点选，可多选）'
                : type === 'boolean' ? '正确答案'
                : type === 'short' ? '参考答案'
                : '正确答案（点选）'}
            </label>
            {type === 'single' && (
              <div className="option-pick">
                <div className="option-pick-list">
                  {optionList.map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`option-pick-btn ${isOptionSelected(opt) ? 'active' : ''}`}
                      onClick={() => toggleOption(opt)}
                    >
                      {String.fromCharCode(65 + idx)}. {opt}
                    </button>
                  ))}
                  {optionList.length < 2 && (
                    <span className="option-pick-hint">先在上方填写至少两个选项</span>
                  )}
                </div>
              </div>
            )}
            {type === 'multiple' && (
              <div className="option-pick">
                <div className="option-pick-list">
                  {optionList.map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`option-pick-btn ${isOptionSelected(opt) ? 'active' : ''}`}
                      onClick={() => toggleOption(opt)}
                    >
                      {String.fromCharCode(65 + idx)}. {opt}
                    </button>
                  ))}
                  {optionList.length < 2 && (
                    <span className="option-pick-hint">先在上方填写至少两个选项</span>
                  )}
                </div>
              </div>
            )}
            {type === 'short' && (
              <input
                type="text"
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                placeholder="输入参考答案"
              />
            )}
            {type === 'boolean' && (
              <div className="boolean-answer">
                <button type="button" className={`bool-btn ${answer === '正确' ? 'active' : ''}`} onClick={() => setAnswer('正确')}>正确</button>
                <button type="button" className={`bool-btn ${answer === '错误' ? 'active' : ''}`} onClick={() => setAnswer('错误')}>错误</button>
              </div>
            )}
          </div>

          <div className="form-group">
            <label>解析（可选）</label>
            <textarea
              value={explanation}
              onChange={e => setExplanation(e.target.value)}
              placeholder="题目解析..."
              rows={2}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>取消</button>
            <button type="submit" className="btn-save" disabled={!canSave}>保存</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default QuestionBankPage
