
<div align="center">
  <img src="https://img.shields.io/github/stars/badhope/Mbti-Test?logo=github&label=✨ 星星数&color=ffcb47&style=for-the-badge" alt="Stars">
  <img src="https://img.shields.io/github/forks/badhope/Mbti-Test?logo=github&label=🍴 叉子数&color=4cc9f0&style=for-the-badge" alt="Forks">
  <img src="https://img.shields.io/github/license/badhope/Mbti-Test?logo=github&label=📜 许可证&color=7209b7&style=for-the-badge" alt="License">
  <img src="https://img.shields.io/github/languages/top/badhope/Mbti-Test?logo=github&label=💻 主语言&color=560bad&style=for-the-badge" alt="Language">
  <img src="https://img.shields.io/github/languages/code-size/badhope/Mbti-Test?logo=github&label=📦 代码体积&color=38b000&style=for-the-badge" alt="Code Size">
  <br>
  <img src="https://img.shields.io/github/actions/workflow/status/badhope/Mbti-Test/ci.yml?branch=main&label=CI&logo=github&style=for-the-badge" alt="CI Status">
  <img src="https://img.shields.io/github/actions/workflow/status/badhope/Mbti-Test/deploy.yml?branch=main&label=Deploy&logo=github&style=for-the-badge" alt="Deploy Status">
</div>

# 🎭 人格星球探索 | 深度心理测评系统

一个专业且有趣的MBTI人格测试Web应用，帮助用户探索内心宇宙，发现隐藏的性格属性。

## ✨ 功能特性

- 🚀 **三种测试模式**：闪电模式(5分钟)、标准模式(15分钟)、专家模式(30分钟)
- 🎨 **趣味小游戏**：性格色彩测试、动物灵魂测试、元素属性测试
- 🔮 **每日运势**：运势预测和抽签功能
- 💬 **社区互动**：留言板和评论功能
- 📤 **结果导出**：支持JSON、PDF、图片三种格式
- 📱 **PWA支持**：可离线使用，支持安装到桌面
- 🌙 **响应式设计**：完美适配手机、平板、电脑
- ⚡ **CI/CD自动化**：自动测试、代码检查、部署

## 💻 技术栈

### 核心技术
| 技术 | 版本 | 用途 |
|------|------|------|
| HTML5 | - | 页面结构 |
| CSS3 | - | 样式设计（Tailwind CSS + 自定义样式） |
| JavaScript (ES6+) | - | 核心逻辑，原生实现无框架依赖 |

### 外部依赖
| 库 | 版本 | 用途 |
|---|------|------|
| Tailwind CSS | CDN | 样式框架 |
| particles.js | 2.0.0 | 粒子背景效果 |
| anime.js | 3.2.1 | 动画效果 |
| canvas-confetti | 1.6.0 | 庆祝动画 |
| animate.css | 4.1.1 | CSS动画库 |
| Font Awesome | 6.4.0 | 图标库 |

### 项目特点
- ✅ **纯前端实现**：无需后端服务器，本地即可运行
- ✅ **模块化设计**：功能模块分离，代码结构清晰
- ✅ **本地存储**：使用localStorage保存用户数据和测试历史
- ✅ **Service Worker**：支持离线访问和资源缓存
- ✅ **自动化CI/CD**：GitHub Actions自动测试和部署

## 🚀 快速开始

### 方式一：直接打开
克隆仓库后，直接在浏览器中打开 `index.html` 文件即可使用。

### 方式二：本地服务器
```bash
# 克隆仓库
git clone https://github.com/badhope/Mbti-Test.git

# 进入项目目录
cd Mbti-Test

# 安装依赖
npm install

# 启动本地服务器
npm start
```

访问 `http://localhost:8080` 即可使用。

## 📁 项目结构

```
Mbti-Test/
├── .github/
│   └── workflows/         # GitHub Actions工作流
│       ├── ci.yml         # 持续集成
│       ├── deploy.yml     # 自动部署
│       └── lighthouse.yml # 性能审计
├── docs/                  # 项目文档
│   ├── MODULE_DESIGN.md   # 模块设计文档
│   ├── TASK_BREAKDOWN.md  # 任务分解文档
│   ├── DEVELOPMENT_PROCESS.md # 开发过程文档
│   └── CHECKLIST.md       # 检查清单
├── js/                    # JavaScript模块
│   ├── main.js           # 入口文件，初始化
│   ├── core.js           # 核心测试逻辑
│   ├── data.js           # 题库和配置数据
│   ├── storage.js        # 本地存储管理
│   ├── utils.js          # 公共工具函数
│   ├── guest.js          # 访客身份系统
│   ├── comments.js       # 评论功能
│   ├── messages.js       # 留言板功能
│   ├── export.js         # 结果导出功能
│   ├── fortune.js        # 运势和抽签功能
│   └── background.js     # 背景管理
├── tests/                 # 测试文件
│   └── test-runner.js    # 测试运行器
├── index.html            # 主页面
├── style.css             # 样式文件
├── manifest.json         # PWA配置
├── service-worker.js     # Service Worker
├── package.json          # 项目配置
├── .eslintrc.json        # ESLint配置
├── lighthouse-budget.json # 性能预算配置
└── README.md             # 项目文档
```

## 🎮 功能说明

### 测试模式
- **闪电模式**：15道题目，快速了解核心性格关键词
- **标准模式**：60道题目，全面剖析12个维度
- **专家模式**：150+道题目，专业级深度测评

### 维度分析
测试涵盖以下人格维度：
- 🌐 外向性 (E) - 社交能量
- 💡 开放性 (O) - 创新思维
- ✅ 尽责性 (C) - 自律执行
- 💝 宜人性 (A) - 合作同理
- ⚖️ 情绪稳定 (N) - 抗压能力
- 🧠 思维风格 (T) - 决策方式
- 🎨 创造力 (Cr) - 艺术表达
- 👑 领导力 (L) - 团队影响
- 💬 社交力 (S) - 人际网络
- 🤝 同理心 (Em) - 情感共鸣
- 🛡️ 抗压性 (P) - 逆境应对
- 🌱 成长性 (G) - 学习心态

## 🔧 开发指南

### 代码规范
项目使用ESLint进行代码规范检查：
```bash
npm run lint        # 检查并修复
npm run lint:check  # 仅检查
```

### 运行测试
```bash
npm test            # 运行测试
npm run validate    # 完整验证（lint + test）
```

### NPM脚本
| 脚本 | 说明 |
|------|------|
| `npm start` | 启动本地服务器 |
| `npm test` | 运行测试套件 |
| `npm run lint` | 代码检查并修复 |
| `npm run validate` | 完整验证 |
| `npm run serve` | 启动服务器（不打开浏览器） |

## 📊 CI/CD流程

项目配置了完整的CI/CD流水线：

1. **持续集成 (CI)**
   - 代码检查 (ESLint)
   - 单元测试运行
   - 安全审计

2. **自动部署**
   - main分支自动部署到GitHub Pages
   - 部署前自动运行测试

3. **性能监控**
   - Lighthouse性能审计
   - 性能预算检查

## 📚 文档

- [模块设计文档](docs/MODULE_DESIGN.md) - 详细的模块架构和接口定义
- [任务分解文档](docs/TASK_BREAKDOWN.md) - 开发任务和优先级
- [开发过程文档](docs/DEVELOPMENT_PROCESS.md) - 完整的开发记录
- [检查清单](docs/CHECKLIST.md) - 项目验收检查项

## 📄 许可证

本项目采用 MIT 许可证，详见 [LICENSE](LICENSE) 文件。

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

1. Fork本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交Pull Request

## 📌 免责声明

本测试仅供娱乐参考，所有MBTI相关内容均为趣味解读，不代表专业心理学结论。

---

<div align="center">
  <p>⭐ 如果这个项目对你有帮助，请给一个Star支持一下！</p>
</div>
