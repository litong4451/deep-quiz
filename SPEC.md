# 深题 - 产品设计规范

## 1. Concept & Vision

一款专注于深度学习的深题应用，采用「记忆宫殿」理念设计。界面沉稳、专注，帮助用户高效记忆知识点。通过卡片翻转的交互方式，让用户在「回忆-验证」循环中巩固记忆。

**核心特点**：无预设题库、完全由用户管理、题库持久化存储。

## 2. Design Language

### 2.1 Aesthetic Direction
**风格定位**: 深夜书房 - 深色背景配暖色点缀，营造专注沉浸的学习氛围。卡片式布局模拟实体卡片翻阅的触感体验。

### 2.2 Color Palette
```css
--bg-primary: #0f0f0f;      /* 深黑背景 */
--bg-card: #1a1a1a;         /* 卡片背景 */
--bg-card-hover: #252525;   /* 卡片悬停 */
--text-primary: #f5f5f5;    /* 主要文字 */
--text-secondary: #8a8a8a;  /* 次要文字 */
--accent-primary: #e6a054;   /* 琥珀色 - 主强调 */
--accent-success: #4ade80;  /* 绿色 - 掌握 */
--accent-warning: #fbbf24;  /* 黄色 - 待复习 */
--accent-error: #f87171;    /* 红色 - 不会 */
--border-subtle: #2a2a2a;   /* 微妙边框 */
```

### 2.3 Typography
- **标题**: "Noto Serif SC" (思源宋体) - 古典学习感
- **正文**: "Noto Sans SC" (思源黑体) - 清晰易读
- **字号系统**: 14px基准，标题 24px，按钮 16px

### 2.4 Motion Philosophy
- **翻卡动画**: 3D翻转 400ms ease-in-out
- **状态切换**: 150ms 渐变
- **进度条**: 平滑增长 300ms
- **模态框**: 从底部滑入动画

## 3. Layout & Structure

### 3.1 页面结构
```
┌─────────────────────────┐
│ Header: 标题 + 操作按钮  │  48px
├─────────────────────────┤
│                         │
│   内容区域（题库列表/表单）│  flex-1
│                         │
├─────────────────────────┤
│ 底部导航                 │  56px
│ [学习] [题库] [统计]     │
└─────────────────────────┘
```

### 3.2 响应式策略
- **Mobile First**: 优先适配375px-428px宽度
- **卡片宽度**: min(90vw, 400px)
- **触控优化**: 最小点击区域 44x44px

## 4. Features & Interactions

### 4.1 题库管理（核心功能）
1. **创建题库**
   - 点击「新建题库」按钮
   - 填写题库名称和描述
   - 保存后自动切换为当前题库

2. **编辑题库**
   - 点击题库右侧编辑按钮
   - 修改名称和描述

3. **删除题库**
   - 点击题库右侧删除按钮
   - 确认后删除题库及所有题目

4. **题库导入**
   - 支持拖拽或点击上传 JSON 文件
   - 自动识别并导入题库
   - 导入后无需再次导入（已持久化）

5. **题目管理**
   - 在题库内添加、编辑、删除题目
   - 支持单选题、多选题、判断题
   - 点击题库展开查看题目列表

### 4.2 学习功能
1. **题目展示**
   - 点击卡片翻转查看答案
   - 三档记忆反馈：不会、模糊、掌握

2. **进度追踪**
   - 今日学习数量
   - 总体掌握率
   - 题目状态分布

### 4.3 数据持久化
- 所有题库和题目存储在 localStorage
- 学习进度独立存储
- 刷新页面数据不丢失

## 5. Component Inventory

### 5.1 BankItem (题库卡片)
- 显示题库名称和题目数量
- 展开显示题目列表
- 操作按钮：添加题目、编辑、删除

### 5.2 QuestionItem (题目项)
- 显示题目序号和内容预览
- 操作按钮：编辑、删除

### 5.3 Modal (模态框)
- 底部滑入动画
- 支持表单输入
- 类型选择器

### 5.4 FlipCard (翻转卡片)
- 3D翻转动画
- 支持多种题型

## 6. Technical Approach

### 6.1 技术栈
- **框架**: React 18 + Vite
- **样式**: CSS + CSS Variables
- **状态管理**: React Context + useReducer
- **存储**: localStorage (持久化所有数据)

### 6.2 数据结构
```typescript
interface Question {
  id: string;
  type: 'single' | 'multiple' | 'boolean';
  question: string;
  answer: string | string[];
  options?: string[];
  explanation?: string;
}

interface QuestionBank {
  id: string;
  name: string;
  description?: string;
  questions: Question[];
  createdAt: number;
}

interface LearningProgress {
  [questionId: string]: {
    status: 'unknown' | 'fuzzy' | 'mastered';
    lastReviewed: number;
    reviewCount: number;
  }
}

interface AppState {
  questionBanks: QuestionBank[];
  currentBankId: string | null;
  progress: LearningProgress;
  todayReviewed: number;
  lastStudyDate: string | null;
  currentIndex: number;
  isFlipped: boolean;
}
```

### 6.3 文件结构
```
/workspace/
├── index.html
├── package.json
├── vite.config.js
├── SPEC.md
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── App.css
    ├── index.css
    ├── context/
    │   └── LearningContext.jsx
    ├── components/
    │   ├── FlipCard.jsx / FlipCard.css
    │   ├── ActionButtons.jsx / ActionButtons.css
    │   ├── ProgressHeader.jsx / ProgressHeader.css
    │   └── BottomNav (内置于 App.jsx)
    └── pages/
        ├── StudyPage.jsx / StudyPage.css
        ├── QuestionBankPage.jsx / QuestionBankPage.css
        └── StatsPage.jsx / StatsPage.css
```
