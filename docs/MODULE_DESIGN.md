# 模块设计文档

## 1. 项目概述

**项目名称**：人格星球探索 (MBTI Test)  
**版本**：3.1.0  
**技术栈**：原生JavaScript ES6+ / HTML5 / CSS3 / Tailwind CSS  
**架构模式**：模块化单页应用 (SPA)

---

## 2. 模块架构图

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           用户界面层 (UI Layer)                          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │
│  │  index.html │ │  style.css  │ │  Tailwind   │ │  Animations │       │
│  │  (主页面)   │ │  (样式表)   │ │  (CSS框架)  │ │  (动画效果) │       │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘       │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         业务逻辑层 (Business Layer)                      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │
│  │   core.js   │ │  fortune.js │ │  export.js  │ │ comments.js │       │
│  │  (核心测试) │ │  (运势抽签) │ │  (结果导出) │ │  (评论系统) │       │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘       │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │
│  │ messages.js │ │background.js│ │   guest.js  │ │   main.js   │       │
│  │  (留言板)   │ │  (背景管理) │ │  (访客系统) │ │  (初始化)   │       │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘       │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         数据服务层 (Data Layer)                          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐                       │
│  │   data.js   │ │ storage.js  │ │  utils.js   │                       │
│  │  (题库数据) │ │ (本地存储)  │ │  (工具函数) │                       │
│  └─────────────┘ └─────────────┘ └─────────────┘                       │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         基础设施层 (Infrastructure)                      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │
│  │ localStorage│ │ServiceWorker│ │   CDN资源   │ │  PWA配置    │       │
│  │  (本地存储) │ │  (离线缓存) │ │ (外部依赖)  │ │ (manifest)  │       │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘       │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3. 模块详细定义

### 3.1 核心模块 (Core Modules)

#### 3.1.1 core.js - 核心测试逻辑模块

**职责范围**：
- 测试流程控制（开始、暂停、继续、提交）
- 题目渲染与选项处理
- 分数计算与结果展示
- 页面导航与状态管理

**接口定义**：
```javascript
// 初始化函数
function init(): void

// 测试控制
function startTest(mode: 'quick' | 'standard' | 'expert'): void
function submitTest(): void
function handleResumeTest(): void

// 题目导航
function nextQuestion(): void
function prevQuestion(): void
function jumpToQuestion(index: number): void
function selectOption(idx: number): void

// 结果展示
function showResults(): void
function shareResults(): void

// 控制面板
function openControlPanel(): void
function renderSettings(): void
function renderHistory(): void
```

**依赖关系**：
- 依赖 `data.js` 获取题库数据
- 依赖 `storage.js` 保存进度和历史
- 依赖 `utils.js` 工具函数
- 依赖 `export.js` 导出功能

---

#### 3.1.2 data.js - 数据配置模块

**职责范围**：
- 定义测试维度配置
- 存储题库数据
- 提供职业/兴趣推荐数据
- 趣味测试数据

**接口定义**：
```javascript
// 维度配置
const dimensions: {
    quick: Dimension[],
    standard: Dimension[],
    expert: Dimension[]
}

// 题库数据
const questions: {
    quick: Question[],
    standard: Question[],
    expert: Question[]
}

// 趣味测试
const miniTests: {
    color: MiniTest,
    animal: MiniTest,
    element: MiniTest,
    emotion: MiniTest
}

// 推荐数据
const recommendations: {
    career: Record<string, string[]>,
    hobby: Record<string, string[]>
}
```

**数据结构**：
```typescript
interface Dimension {
    id: string;
    name: string;
    icon: string;
    desc: string;
}

interface Question {
    dimension: string;
    text: string;
    options: Array<{ text: string; score: number }>;
}

interface MiniTest {
    title: string;
    questions: MiniQuestion[];
    meanings: Record<string, { desc: string; emoji?: string; color?: string }>;
}
```

---

#### 3.1.3 storage.js - 存储管理模块

**职责范围**：
- localStorage读写封装
- 测试进度保存/恢复
- 测试历史管理
- 用户设置管理
- 数据导入/导出

**接口定义**：
```javascript
// 存储检查
function isStorageAvailable(): boolean
function checkExpiry(): boolean
function getStorageUsage(): StorageUsage | null

// 进度管理
function saveProgress(data: ProgressData): boolean
function loadProgress(): ProgressData | null
function clearProgress(): void
function checkResumeProgress(): void

// 历史管理
function saveTestHistory(result: TestResult): boolean
function loadTestHistory(): TestHistory[]
function clearTestHistory(): void

// 设置管理
function loadSettings(): Settings
function saveSettings(settings: Settings): boolean

// 数据管理
function exportData(): boolean
function importData(jsonData: string): boolean
function clearAllData(): boolean
```

---

#### 3.1.4 utils.js - 工具函数模块

**职责范围**：
- 通用工具函数
- DOM操作辅助
- 数据处理工具
- 安全验证函数

**接口定义**：
```javascript
// Toast消息
const ToastType = { SUCCESS, ERROR, WARNING, INFO }
function showToast(message: string, type?: ToastType, duration?: number): void

// 时间格式化
function formatTime(timestamp: number): string

// 安全处理
function escapeHtml(text: string): string
function generateId(prefix?: string): string

// 存储工具
function safeGetItem(key: string, defaultValue?: any): any
function safeSetItem(key: string, value: any): boolean
function safeRemoveItem(key: string): boolean
function isLocalStorageAvailable(): boolean
function getStorageUsage(): StorageUsage

// 函数工具
function debounce(func: Function, wait?: number): Function
function throttle(func: Function, limit?: number): Function
function deepClone(obj: any): any
function delay(ms: number): Promise<void>

// 设备检测
function detectDevice(): DeviceInfo

// 剪贴板
function copyToClipboard(text: string): Promise<boolean>

// 验证工具
function isValidEmail(email: string): boolean
function formatFileSize(bytes: number): string
function getUrlParams(name?: string): string | Object | null
```

---

### 3.2 功能模块 (Feature Modules)

#### 3.2.1 guest.js - 访客身份模块

**职责范围**：
- 访客身份生成
- 昵称管理
- 头像生成
- 统计数据追踪

**接口定义**：
```javascript
const guestSystem = {
    generateGuestId(): string,
    generateRandomNickname(): string,
    getGuestInfo(): GuestInfo,
    updateGuestInfo(data: Partial<GuestInfo>): GuestInfo | null,
    updateStats(statKey: string, increment?: number): GuestInfo | null,
    getDisplayName(): string,
    getAvatar(): string,
    getId(): string,
    clearGuestInfo(): void,
    isGuest(): boolean,
    formatGuestInfo(): FormattedGuestInfo
}
```

---

#### 3.2.2 comments.js - 评论系统模块

**职责范围**：
- 评论CRUD操作
- 点赞功能
- 本地存储评论

**类定义**：
```javascript
class CommentsManager {
    constructor(options: { testId: string; container: HTMLElement })
    
    // 公共方法
    init(): Promise<void>
    render(): void
    submitComment(): void
    likeComment(commentId: string): void
    deleteComment(commentId: string): void
    
    // 私有方法
    loadLocalComments(): void
    saveLocalComments(): void
    renderComments(): void
    bindEvents(): void
}
```

---

#### 3.2.3 messages.js - 留言板模块

**职责范围**：
- 留言CRUD操作
- 回复功能
- 点赞功能
- 置顶管理

**类定义**：
```javascript
class MessageBoard {
    constructor(options: { container: HTMLElement })
    
    // 公共方法
    init(): void
    render(): void
    submitMessage(): void
    likeMessage(messageId: string): void
    deleteMessage(messageId: string): void
    submitReply(messageId: string, content: string): void
    
    // 私有方法
    loadLocalMessages(): void
    saveLocalMessages(): void
    renderMessages(): void
    bindEvents(): void
}
```

---

#### 3.2.4 export.js - 导出功能模块

**职责范围**：
- JSON导出
- PDF生成
- 图片生成

**类定义**：
```javascript
class ExportManager {
    constructor(options: { testId: string; testData: TestData })
    
    // 导出方法
    exportJSON(): Promise<void>
    exportPDF(): Promise<void>
    exportImage(): Promise<void>
    showExportDialog(): void
    
    // 生成方法
    generateReportData(): ReportData
    generatePDFContent(report: ReportData): string
    generateImageCanvas(): Promise<HTMLCanvasElement>
}
```

---

#### 3.2.5 fortune.js - 运势抽签模块

**职责范围**：
- 每日运势生成
- 抽签功能
- 运势数据管理

**接口定义**：
```javascript
// 运势功能
function generateDailyFortune(): FortuneData
function getStoredFortune(): FortuneData | null
function saveFortune(fortune: FortuneData): void
function showDailyFortune(): void
function closeFortuneModal(): void

// 抽签功能
function drawLot(): LotData
function getStoredLot(): { date: string; lot: LotData } | null
function saveLot(lot: LotData): void
function showDrawLots(): void
function performDrawLot(): void
function displayLotResult(lot: LotData, isViewed: boolean): void
```

---

#### 3.2.6 background.js - 背景管理模块

**职责范围**：
- 背景预设管理
- 自定义背景上传
- 背景选择与应用

**类定义**：
```javascript
class BackgroundManager {
    constructor(options: { container: HTMLElement; onSelect?: Function })
    
    // 公共方法
    init(): Promise<void>
    render(): void
    selectBackground(id: string): void
    saveBackground(): Promise<void>
    resetBackground(): void
    
    // 文件处理
    handleFileUpload(file: File): Promise<void>
    deleteBackground(id: string): Promise<void>
}
```

---

## 4. 数据流转图

```
┌──────────────────────────────────────────────────────────────────────┐
│                          用户交互流程                                 │
└──────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────────┐
│  1. 用户选择测试模式                                                  │
│     ┌─────────┐                                                      │
│     │ 点击开始 │ ──────► core.startTest(mode)                         │
│     └─────────┘           │                                          │
│                           ▼                                          │
│                    storage.saveProgress()                            │
└──────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────────┐
│  2. 答题过程                                                          │
│     ┌─────────────┐                                                  │
│     │ 选择选项     │ ──────► core.selectOption(idx)                   │
│     └─────────────┘           │                                      │
│                               ▼                                      │
│                        storage.saveProgress()                        │
│                               │                                      │
│     ┌─────────────┐           ▼                                      │
│     │ 下一题      │ ──────► core.nextQuestion()                      │
│     └─────────────┘                                                  │
└──────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────────┐
│  3. 提交测试                                                          │
│     ┌─────────────┐                                                  │
│     │ 提交测试     │ ──────► core.submitTest()                        │
│     └─────────────┘           │                                      │
│                               ▼                                      │
│                        core.calculateFinalScores()                   │
│                               │                                      │
│                               ▼                                      │
│                        storage.saveTestHistory()                     │
│                               │                                      │
│                               ▼                                      │
│                        core.showResults()                            │
└──────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────────┐
│  4. 结果展示与导出                                                    │
│     ┌─────────────┐                                                  │
│     │ 导出报告     │ ──────► export.showExportDialog()                │
│     └─────────────┘           │                                      │
│                               ▼                                      │
│                        export.exportJSON/PDF/Image()                 │
│                               │                                      │
│     ┌─────────────┐           ▼                                      │
│     │ 分享结果     │ ──────► core.shareResults()                      │
│     └─────────────┘           │                                      │
│                               ▼                                      │
│                        utils.copyToClipboard()                       │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 5. 模块依赖关系图

```
                    ┌─────────────┐
                    │   main.js   │ (入口)
                    └──────┬──────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
           ▼               ▼               ▼
    ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
    │   core.js   │ │  fortune.js │ │   guest.js  │
    └──────┬──────┘ └──────┬──────┘ └──────┬──────┘
           │               │               │
           ├───────────────┼───────────────┤
           │               │               │
           ▼               ▼               ▼
    ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
    │   data.js   │ │ storage.js  │ │  utils.js   │
    └─────────────┘ └──────┬──────┘ └─────────────┘
                           │
    ┌──────────────────────┼──────────────────────┐
    │                      │                      │
    ▼                      ▼                      ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ comments.js │     │ messages.js │     │  export.js  │
    └──────┬──────┘     └──────┬──────┘     └──────┬──────┘
           │                   │                   │
           └───────────────────┼───────────────────┘
                               │
                               ▼
                        ┌─────────────┐
                        │background.js│
                        └─────────────┘
```

---

## 6. 存储键名规范

| 键名 | 用途 | 数据类型 |
|------|------|----------|
| `personality_test_v2` | 测试进度 | ProgressData |
| `personality_test_history` | 测试历史 | TestHistory[] |
| `personality_test_settings` | 用户设置 | Settings |
| `guest_info` | 访客信息 | GuestInfo |
| `daily_fortune` | 每日运势 | FortuneData |
| `daily_lots` | 每日抽签 | LotStorage |
| `message_board_messages` | 留言板 | Message[] |
| `comments_{testId}` | 评论数据 | Comment[] |
| `backgrounds` | 背景配置 | Backgrounds |
| `selectedBackground` | 选中的背景 | string |

---

## 7. 全局变量暴露规范

所有模块通过 `window` 对象暴露公共接口：

```javascript
// 数据模块
window.dimensions = dimensions;
window.questions = questions;
window.miniTests = miniTests;
window.recommendations = recommendations;

// 存储模块
window.saveProgress = saveProgress;
window.loadProgress = loadProgress;
// ... 其他存储函数

// 工具模块
window.showToast = showToast;
window.formatTime = formatTime;
// ... 其他工具函数

// 类模块
window.CommentsManager = CommentsManager;
window.MessageBoard = MessageBoard;
window.ExportManager = ExportManager;
window.BackgroundManager = BackgroundManager;
window.guestSystem = guestSystem;
```

---

## 8. 待优化项

### 8.1 架构优化
- [ ] 引入事件总线模式，解耦模块间通信
- [ ] 实现模块懒加载，优化首屏性能
- [ ] 添加状态管理机制，统一管理全局状态

### 8.2 代码优化
- [ ] 消除重复的Toast实现（多处存在相同代码）
- [ ] 统一错误处理机制
- [ ] 添加TypeScript类型定义

### 8.3 功能增强
- [ ] 添加国际化支持 (i18n)
- [ ] 实现数据云端同步
- [ ] 添加用户认证系统

---

**文档版本**: 1.0.0  
**最后更新**: 2026-03-11
