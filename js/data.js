// 维度定义
const dimensions = {
    quick: [
        { id: 'E', name: '外向性', icon: '🌐', desc: '社交能量' },
        { id: 'O', name: '开放性', icon: '💡', desc: '创新思维' },
        { id: 'C', name: '尽责性', icon: '✅', desc: '自律执行' },
        { id: 'A', name: '宜人性', icon: '💝', desc: '合作同理' },
        { id: 'N', name: '情绪稳定', icon: '⚖️', desc: '抗压能力' }
    ],
    standard: [
        { id: 'E', name: '外向性', icon: '🌐', desc: '社交能量' },
        { id: 'O', name: '开放性', icon: '💡', desc: '创新思维' },
        { id: 'C', name: '尽责性', icon: '✅', desc: '自律执行' },
        { id: 'A', name: '宜人性', icon: '💝', desc: '合作同理' },
        { id: 'N', name: '情绪稳定', icon: '⚖️', desc: '抗压能力' },
        { id: 'T', name: '思维风格', icon: '🧠', desc: '决策方式' },
        { id: 'Cr', name: '创造力', icon: '🎨', desc: '艺术表达' },
        { id: 'L', name: '领导力', icon: '👑', desc: '团队影响' },
        { id: 'S', name: '社交力', icon: '💬', desc: '人际网络' },
        { id: 'Em', name: '同理心', icon: '🤝', desc: '情感共鸣' },
        { id: 'P', name: '抗压性', icon: '🛡️', desc: '逆境应对' },
        { id: 'G', name: '成长性', icon: '🌱', desc: '学习心态' }
    ],
    expert: [
        { id: 'E', name: '外向性', icon: '🌐', desc: '社交能量' },
        { id: 'O', name: '开放性', icon: '💡', desc: '创新思维' },
        { id: 'C', name: '尽责性', icon: '✅', desc: '自律执行' },
        { id: 'A', name: '宜人性', icon: '💝', desc: '合作同理' },
        { id: 'N', name: '情绪稳定', icon: '⚖️', desc: '抗压能力' },
        { id: 'T', name: '思维风格', icon: '🧠', desc: '决策方式' },
        { id: 'Cr', name: '创造力', icon: '🎨', desc: '艺术表达' },
        { id: 'L', name: '领导力', icon: '👑', desc: '团队影响' },
        { id: 'S', name: '社交力', icon: '💬', desc: '人际网络' },
        { id: 'Em', name: '同理心', icon: '🤝', desc: '情感共鸣' },
        { id: 'P', name: '抗压性', icon: '🛡️', desc: '逆境应对' },
        { id: 'G', name: '成长性', icon: '🌱', desc: '学习心态' }
    ]
};

// 简化版题库
const questions = {
    quick: [
        { dimension: 'E', text: '在热闹的聚会上，你通常会：', options: [
            { text: '🎉 主动结识新朋友，享受其中', score: 5 },
            { text: '😊 和熟人聊天，偶尔认识新人', score: 3 },
            { text: '🏠 找个安静角落，想早点回家', score: 1 }
        ]},
        { dimension: 'E', text: '周末时光，你更倾向于：', options: [
            { text: '🎊 参加聚会或集体活动', score: 5 },
            { text: '☕ 约几个好友小聚', score: 3 },
            { text: '📚 独自在家享受宁静', score: 1 }
        ]},
        { dimension: 'O', text: '对于从未尝试过的新鲜事物：', options: [
            { text: '🚀 充满好奇，迫不及待想试', score: 5 },
            { text: '🤔 保持开放，谨慎尝试', score: 3 },
            { text: '🔒 比较保守，偏好熟悉的', score: 1 }
        ]},
        { dimension: 'O', text: '你更喜欢哪种活动：', options: [
            { text: '🌍 探索未知的地方或文化', score: 5 },
            { text: '🍽️ 偶尔尝试新餐厅或爱好', score: 3 },
            { text: '📍 坚持已知的喜好', score: 1 }
        ]},
        { dimension: 'C', text: '对于待办事项，你通常：', options: [
            { text: '📋 制定详细计划并严格执行', score: 5 },
            { text: '📝 有个大致规划，灵活调整', score: 3 },
            { text: '🎲 随性而为，想到什么做什么', score: 1 }
        ]},
        { dimension: 'C', text: '面对长期目标：', options: [
            { text: '🎯 坚持不懈，直到达成', score: 5 },
            { text: '💪 会努力但有时会分心', score: 3 },
            { text: '🔄 容易被短期诱惑影响', score: 1 }
        ]},
        { dimension: 'A', text: '当朋友需要帮助时：', options: [
            { text: '🤝 毫不犹豫伸出援手', score: 5 },
            { text: '🤔 根据情况提供帮助', score: 3 },
            { text: '💭 先考虑自己的情况', score: 1 }
        ]},
        { dimension: 'A', text: '在冲突中，你倾向于：', options: [
            { text: '☮️ 寻求妥协，维护关系', score: 5 },
            { text: '⚖️ 坚持原则但保持礼貌', score: 3 },
            { text: '👊 坚持自己的立场', score: 1 }
        ]},
        { dimension: 'N', text: '面对压力时，你通常会：', options: [
            { text: '🧘 保持冷静，理性应对', score: 5 },
            { text: '😰 有些焦虑但能处理', score: 3 },
            { text: '🔥 感到明显的不适', score: 1 }
        ]},
        { dimension: 'N', text: '当事情不如预期：', options: [
            { text: '🔄 能快速调整心态', score: 5 },
            { text: '⏳ 需要一些时间适应', score: 3 },
            { text: '😔 会长时间感到沮丧', score: 1 }
        ]},
        { dimension: 'E', text: '在团队讨论中，你通常：', options: [
            { text: '📢 积极发言，主导话题', score: 5 },
            { text: '💬 适时表达观点', score: 3 },
            { text: '👂 更多时候倾听', score: 1 }
        ]},
        { dimension: 'O', text: '在艺术和文化方面：', options: [
            { text: '🎭 我欣赏各种形式的艺术', score: 5 },
            { text: '🎨 对某些艺术感兴趣', score: 3 },
            { text: '🔧 更关注实用性事物', score: 1 }
        ]},
        { dimension: 'C', text: '你的生活/工作环境通常是：', options: [
            { text: '✨ 整洁有序，井井有条', score: 5 },
            { text: '📁 大致整洁，偶尔凌乱', score: 3 },
            { text: '🌀 比较随意，创意性混乱', score: 1 }
        ]},
        { dimension: 'A', text: '对于他人的错误：', options: [
            { text: '💚 很容易原谅并理解', score: 5 },
            { text: '🤷 会根据情况判断', score: 3 },
            { text: '⏰ 需要时间才能释怀', score: 1 }
        ]},
        { dimension: 'N', text: '你的情绪波动通常是：', options: [
            { text: '🌊 相对稳定，起伏不大', score: 5 },
            { text: '🌤️ 有时会有波动', score: 3 },
            { text: '⛈️ 比较敏感，容易受影响', score: 1 }
        ]}
    ],
    standard: [
        // E
        { dimension: 'E', text: '在大型社交场合中，你通常会感到：', options: [
            { text: '⚡ 充满活力，享受其中', score: 5 },
            { text: '😊 比较舒适，可以应对', score: 4 },
            { text: '😐 有些疲惫但还行', score: 3 },
            { text: '😴 相当消耗精力', score: 2 },
            { text: '😫 非常疲惫，想尽快离开', score: 1 }
        ]},
        { dimension: 'E', text: '当你有想法要表达时：', options: [
            { text: '📢 我会立即说出来', score: 5 },
            { text: '💡 我会找合适的时机说', score: 4 },
            { text: '🤔 我会等待被问到再说', score: 3 },
            { text: '😅 我会犹豫要不要说', score: 2 },
            { text: '😶 我通常保持沉默', score: 1 }
        ]},
        { dimension: 'E', text: '对于认识新朋友：', options: [
            { text: '🎉 我非常享受这个过程', score: 5 },
            { text: '😊 我比较积极主动', score: 4 },
            { text: '👌 我可以接受但不主动', score: 3 },
            { text: '😬 我有些抗拒', score: 2 },
            { text: '🚫 我尽量避免', score: 1 }
        ]},
        { dimension: 'E', text: '在团队合作中，你更倾向于：', options: [
            { text: '👑 担任领导者或协调者', score: 5 },
            { text: '💪 积极参与讨论', score: 4 },
            { text: '✅ 完成自己的部分', score: 3 },
            { text: '🤝 配合他人工作', score: 2 },
            { text: '🔒 独立完成分配的任务', score: 1 }
        ]},
        { dimension: 'E', text: '你更喜欢哪种休闲方式：', options: [
            { text: '🎪 参加大型聚会或活动', score: 5 },
            { text: '👥 与一群朋友外出', score: 4 },
            { text: '☕ 与几个好友小聚', score: 3 },
            { text: '👫 与一两个朋友相处', score: 2 },
            { text: '🏠 独自享受安静时光', score: 1 }
        ]},
        // O
        { dimension: 'O', text: '对于前卫的艺术形式：', options: [
            { text: '🎨 我非常欣赏和感兴趣', score: 5 },
            { text: '👀 我持开放态度去了解', score: 4 },
            { text: '🤷 有些我能接受', score: 3 },
            { text: '😕 大部分不太能理解', score: 2 },
            { text: '❌ 我不太感兴趣', score: 1 }
        ]},
        { dimension: 'O', text: '当遇到与自己完全不同的观点时：', options: [
            { text: '🔍 我很好奇想深入了解', score: 5 },
            { text: '👂 我愿意倾听和理解', score: 4 },
            { text: '🙏 我会保持尊重但坚持己见', score: 3 },
            { text: '😤 我有些难以接受', score: 2 },
            { text: '🙅 我认为它是错误的', score: 1 }
        ]},
        { dimension: 'O', text: '对于生活中的变化：', options: [
            { text: '🚀 我主动寻求变化', score: 5 },
            { text: '✨ 我欢迎积极的变化', score: 4 },
            { text: '👌 我可以适应变化', score: 3 },
            { text: '🛡️ 我对变化有些抗拒', score: 2 },
            { text: '🏠 我更喜欢稳定不变', score: 1 }
        ]},
        { dimension: 'O', text: '在思考问题时：', options: [
            { text: '🌐 我喜欢探索各种可能性', score: 5 },
            { text: '👀 我会考虑多种角度', score: 4 },
            { text: '⚖️ 我会权衡几个主要选项', score: 3 },
            { text: '📋 我倾向于找标准答案', score: 2 },
            { text: '🎯 我喜欢明确的解决方案', score: 1 }
        ]},
        { dimension: 'O', text: '你对外国文化和异国风情的态度：', options: [
            { text: '🌏 非常着迷，想深入了解', score: 5 },
            { text: '✈️ 很感兴趣，愿意体验', score: 4 },
            { text: '🤔 有些好奇', score: 3 },
            { text: '😐 兴趣一般', score: 2 },
            { text: '🇨🇳 更喜欢本国文化', score: 1 }
        ]},
        // C
        { dimension: 'C', text: '对于日常计划和安排：', options: [
            { text: '📅 我有详细的日程规划', score: 5 },
            { text: '📝 我有大致的计划', score: 4 },
            { text: '✔️ 我有一些基本安排', score: 3 },
            { text: '🎲 我很少做计划', score: 2 },
            { text: '🏄 我完全随性而为', score: 1 }
        ]},
        { dimension: 'C', text: '当需要完成一项重要任务时：', options: [
            { text: '🚀 我会立即开始并提前完成', score: 5 },
            { text: '📊 我会制定计划按时完成', score: 4 },
            { text: '✅ 我会按时完成', score: 3 },
            { text: '⏰ 我会在截止前完成', score: 2 },
            { text: '🔥 我经常拖延到最后一刻', score: 1 }
        ]},
        { dimension: 'C', text: '对于自己的承诺：', options: [
            { text: '💯 我从不食言', score: 5 },
            { text: '🤝 我几乎总是信守承诺', score: 4 },
            { text: '👍 我大多数时候会遵守', score: 3 },
            { text: '😅 我有时会忘记或改变', score: 2 },
            { text: '😬 我经常无法兑现', score: 1 }
        ]},
        { dimension: 'C', text: '你的个人物品通常：', options: [
            { text: '✨ 非常整洁，井井有条', score: 5 },
            { text: '📁 比较整齐有序', score: 4 },
            { text: '📂 大致整洁', score: 3 },
            { text: '🌀 有些凌乱', score: 2 },
            { text: '🌪️ 相当混乱', score: 1 }
        ]},
        { dimension: 'C', text: '对于长期目标：', options: [
            { text: '🎯 我有清晰的目标并持续努力', score: 5 },
            { text: '📊 我有目标并定期检查进度', score: 4 },
            { text: '🧭 我有目标但进展不稳定', score: 3 },
            { text: '🔄 我的目标经常改变', score: 2 },
            { text: '❓ 我没有明确的目标', score: 1 }
        ]},
        // A
        { dimension: 'A', text: '当别人向你倾诉烦恼时：', options: [
            { text: '💝 我全心全意地倾听和帮助', score: 5 },
            { text: '🤝 我会尽力提供支持', score: 4 },
            { text: '💬 我会倾听并给一些建议', score: 3 },
            { text: '🤷 我会听但不知如何回应', score: 2 },
            { text: '😰 我有些不知所措', score: 1 }
        ]},
        { dimension: 'A', text: '对于竞争与合作：', options: [
            { text: '🤝 我更倾向于合作共赢', score: 5 },
            { text: '⚖️ 我偏好合作但接受竞争', score: 4 },
            { text: '🎲 我看情况选择', score: 3 },
            { text: '💪 我有些竞争意识', score: 2 },
            { text: '🏆 我喜欢竞争和赢', score: 1 }
        ]},
        { dimension: 'A', text: '当有人批评你时：', options: [
            { text: '🙏 我虚心接受并反思', score: 5 },
            { text: '👂 我会认真考虑', score: 4 },
            { text: '🤔 我会听但可能不认同', score: 3 },
            { text: '😤 我会为自己辩护', score: 2 },
            { text: '😢 我感到受伤或愤怒', score: 1 }
        ]},
        { dimension: 'A', text: '你更相信：', options: [
            { text: '💖 大多数人都是善良的', score: 5 },
            { text: '👍 大部分人值得信任', score: 4 },
            { text: '⏰ 需要时间建立信任', score: 3 },
            { text: '🛡️ 对陌生人保持警惕', score: 2 },
            { text: '🔍 人心难测，要小心', score: 1 }
        ]},
        { dimension: 'A', text: '在团队决策中：', options: [
            { text: '👥 我优先考虑大家的需求', score: 5 },
            { text: '⚖️ 我寻求各方平衡', score: 4 },
            { text: '🎯 我关注公平性', score: 3 },
            { text: '💪 我坚持自己的立场', score: 2 },
            { text: '🤷 我优先考虑自己的利益', score: 1 }
        ]},
        // N
        { dimension: 'N', text: '当你面临重大压力时：', options: [
            { text: '🧘 我能保持冷静和专注', score: 5 },
            { text: '😰 我有些紧张但能应对', score: 4 },
            { text: '⏳ 我需要一些时间调整', score: 3 },
            { text: '😟 我感到明显的焦虑', score: 2 },
            { text: '🔥 我几乎无法正常运作', score: 1 }
        ]},
        { dimension: 'N', text: '对于未来的不确定性：', options: [
            { text: '🌟 我感到好奇和期待', score: 5 },
            { text: '👍 我能接受并适应', score: 4 },
            { text: '🤔 我有些担忧但能面对', score: 3 },
            { text: '😰 我感到不安', score: 2 },
            { text: '😱 我非常焦虑和恐惧', score: 1 }
        ]},
        { dimension: 'N', text: '当你犯错时：', options: [
            { text: '🎓 我坦然接受并学习', score: 5 },
            { text: '📝 我能接受并改进', score: 4 },
            { text: '😔 我有些自责', score: 3 },
            { text: '🔄 我会反复思考', score: 2 },
            { text: '😫 我很难释怀', score: 1 }
        ]},
        { dimension: 'N', text: '你的情绪变化通常是：', options: [
            { text: '🌊 非常稳定，起伏很小', score: 5 },
            { text: '🌤️ 比较平稳', score: 4 },
            { text: '⛅ 有一定波动', score: 3 },
            { text: '🌧️ 波动比较明显', score: 2 },
            { text: '⛈️ 起伏很大，难以预测', score: 1 }
        ]},
        { dimension: 'N', text: '面对挫折时：', options: [
            { text: '🚀 我很快就能振作起来', score: 5 },
            { text: '💪 我能较快恢复', score: 4 },
            { text: '⏳ 我需要一些时间', score: 3 },
            { text: '😔 我会消沉一段时间', score: 2 },
            { text: '😢 我很难走出阴影', score: 1 }
        ]},
        // T
        { dimension: 'T', text: '做重要决定时，你更依赖：', options: [
            { text: '📊 全面的数据和逻辑分析', score: 5 },
            { text: '🧠 理性分析为主，直觉为辅', score: 4 },
            { text: '⚖️ 理性与直觉各半', score: 3 },
            { text: '💡 直觉为主，理性为辅', score: 2 },
            { text: '❤️ 主要依靠直觉和感受', score: 1 }
        ]},
        { dimension: 'T', text: '你更喜欢哪种工作方式：', options: [
            { text: '📋 有明确的规则和流程', score: 5 },
            { text: '🔧 有框架但允许灵活', score: 4 },
            { text: '🎯 有一定的自由度', score: 3 },
            { text: '🎨 较大的创造空间', score: 2 },
            { text: '🌀 完全自由发挥', score: 1 }
        ]},
        { dimension: 'T', text: '学习新知识时：', options: [
            { text: '📚 我喜欢系统性的课程', score: 5 },
            { text: '📖 我喜欢有结构的学习', score: 4 },
            { text: '👌 我可以接受不同方式', score: 3 },
            { text: '🔍 我更喜欢探索式学习', score: 2 },
            { text: '🎮 我喜欢在实践中学习', score: 1 }
        ]},
        { dimension: 'T', text: '你认为成功更多取决于：', options: [
            { text: '📋 周密的计划和执行', score: 5 },
            { text: '💪 努力和机遇的结合', score: 4 },
            { text: '🎯 个人能力和运气', score: 3 },
            { text: '🚀 抓住机会的能力', score: 2 },
            { text: '✨ 灵感和时机', score: 1 }
        ]},
        { dimension: 'T', text: '你更欣赏哪种表达方式：', options: [
            { text: '📊 精确、逻辑清晰', score: 5 },
            { text: '✅ 清晰有条理', score: 4 },
            { text: '💝 真诚有内容', score: 3 },
            { text: '🎭 生动有趣', score: 2 },
            { text: '🌈 富有感染力和想象力', score: 1 }
        ]},
        // Cr
        { dimension: 'Cr', text: '当你需要解决问题时：', options: [
            { text: '💡 我喜欢想出独特的方案', score: 5 },
            { text: '🔧 我会尝试新的方法', score: 4 },
            { text: '⚖️ 我会结合新旧方法', score: 3 },
            { text: '📋 我倾向于用已知方法', score: 2 },
            { text: '📖 我遵循标准流程', score: 1 }
        ]},
        { dimension: 'Cr', text: '对于艺术创作活动：', options: [
            { text: '🎨 我经常参与并乐在其中', score: 5 },
            { text: '✨ 我有时会尝试', score: 4 },
            { text: '👀 我偶尔感兴趣', score: 3 },
            { text: '🤷 我很少参与', score: 2 },
            { text: '❌ 我不太感兴趣', score: 1 }
        ]},
        { dimension: 'Cr', text: '你的想法通常是：', options: [
            { text: '🌟 非常独特和原创', score: 5 },
            { text: '💡 有新意的', score: 4 },
            { text: '📊 中规中矩的', score: 3 },
            { text: '📖 比较传统的', score: 2 },
            { text: '🔄 很常规的', score: 1 }
        ]},
        { dimension: 'Cr', text: '对于"打破常规"：', options: [
            { text: '🚀 我经常这样做', score: 5 },
            { text: '🎯 我在适当时候会', score: 4 },
            { text: '🤔 我偶尔会尝试', score: 3 },
            { text: '⚠️ 我很少这样做', score: 2 },
            { text: '🚫 我从不这样做', score: 1 }
        ]},
        { dimension: 'Cr', text: '在头脑风暴中：', options: [
            { text: '💡 我能提出很多创意点子', score: 5 },
            { text: '💭 我能贡献一些想法', score: 4 },
            { text: '🤔 我能提出一些观点', score: 3 },
            { text: '👂 我更多是倾听', score: 2 },
            { text: '😶 我很难想出新点子', score: 1 }
        ]},
        // L
        { dimension: 'L', text: '当团队需要有人负责时：', options: [
            { text: '👑 我会主动站出来', score: 5 },
            { text: '💪 我会积极考虑', score: 4 },
            { text: '✅ 如果需要我可以', score: 3 },
            { text: '🤝 我更愿意配合', score: 2 },
            { text: '🏃 我不想承担责任', score: 1 }
        ]},
        { dimension: 'L', text: '你影响他人的方式通常是：', options: [
            { text: '🌟 激励和鼓舞', score: 5 },
            { text: '💡 说服和引导', score: 4 },
            { text: '🤝 沟通和协商', score: 3 },
            { text: '📋 请求和建议', score: 2 },
            { text: '❌ 我很少试图影响他人', score: 1 }
        ]},
        { dimension: 'L', text: '面对团队冲突：', options: [
            { text: '⚖️ 我能有效调解并解决', score: 5 },
            { text: '🤝 我能帮助缓解', score: 4 },
            { text: '🔧 我会尝试处理', score: 3 },
            { text: '📞 我会寻求帮助', score: 2 },
            { text: '🏃 我倾向于回避', score: 1 }
        ]},
        { dimension: 'L', text: '对于承担责任：', options: [
            { text: '💪 我乐于承担重大责任', score: 5 },
            { text: '✅ 我愿意承担责任', score: 4 },
            { text: '👌 我可以接受责任', score: 3 },
            { text: '😅 我有些犹豫', score: 2 },
            { text: '🙅 我尽量避免', score: 1 }
        ]},
        { dimension: 'L', text: '你做决策时：', options: [
            { text: '⚡ 果断且自信', score: 5 },
            { text: '✅ 比较果断', score: 4 },
            { text: '🤔 会考虑后决定', score: 3 },
            { text: '😅 会犹豫不决', score: 2 },
            { text: '😰 很难做出决定', score: 1 }
        ]},
        // S
        { dimension: 'S', text: '在社交场合中建立新关系：', options: [
            { text: '🤝 对我来说很容易', score: 5 },
            { text: '👍 我比较擅长', score: 4 },
            { text: '👌 我可以做到', score: 3 },
            { text: '😅 我有些困难', score: 2 },
            { text: '😰 我非常困难', score: 1 }
        ]},
        { dimension: 'S', text: '你维持友谊的方式：', options: [
            { text: '📞 主动联系和安排聚会', score: 5 },
            { text: '💬 经常保持联系', score: 4 },
            { text: '📆 定期联系', score: 3 },
            { text: '📱 偶尔联系', score: 2 },
            { text: '🙈 很少主动联系', score: 1 }
        ]},
        { dimension: 'S', text: '理解他人的社交暗示：', options: [
            { text: '🎯 我非常敏锐', score: 5 },
            { text: '👀 我比较擅长', score: 4 },
            { text: '🤔 我能基本理解', score: 3 },
            { text: '😅 我有时会误解', score: 2 },
            { text: '🤷 我经常误解', score: 1 }
        ]},
        { dimension: 'S', text: '在社交网络中的角色：', options: [
            { text: '🌐 我是连接不同圈子的桥梁', score: 5 },
            { text: '👥 我有广泛的社交圈', score: 4 },
            { text: '🤝 我有稳定的社交圈', score: 3 },
            { text: '👥 我的社交圈较小', score: 2 },
            { text: '👤 我几乎没有社交圈', score: 1 }
        ]},
        { dimension: 'S', text: '处理人际关系的复杂情况：', options: [
            { text: '🎭 我游刃有余', score: 5 },
            { text: '🤝 我能较好处理', score: 4 },
            { text: '✅ 我能应对', score: 3 },
            { text: '😅 我有些吃力', score: 2 },
            { text: '😰 我非常困难', score: 1 }
        ]},
        // Em
        { dimension: 'Em', text: '当看到他人难过时：', options: [
            { text: '💝 我能深切感受到他们的情绪', score: 5 },
            { text: '❤️ 我能理解并感同身受', score: 4 },
            { text: '🤝 我能理解他们的感受', score: 3 },
            { text: '👀 我能意识到但不太能感受', score: 2 },
            { text: '❓ 我很难理解他们的感受', score: 1 }
        ]},
        { dimension: 'Em', text: '在倾听他人时：', options: [
            { text: '🌍 我完全投入他们的世界', score: 5 },
            { text: '💝 我能深刻理解他们的处境', score: 4 },
            { text: '👂 我能理解他们的观点', score: 3 },
            { text: '🤔 我在听但有时会分心', score: 2 },
            { text: '📵 我很难集中注意力', score: 1 }
        ]},
        { dimension: 'Em', text: '对于他人的非语言表达：', options: [
            { text: '🎯 我能准确解读', score: 5 },
            { text: '👀 我能较好理解', score: 4 },
            { text: '👌 我能基本识别', score: 3 },
            { text: '🤔 我有时能注意到', score: 2 },
            { text: '🙈 我经常忽略', score: 1 }
        ]},
        { dimension: 'Em', text: '当你关心的人开心时：', options: [
            { text: '🎉 我也会感到非常开心', score: 5 },
            { text: '😊 我会为他们高兴', score: 4 },
            { text: '🙂 我会感到愉快', score: 3 },
            { text: '😐 我会为他们感到好', score: 2 },
            { text: '😶 我没有特别的感觉', score: 1 }
        ]},
        { dimension: 'Em', text: '在争论中理解对方立场：', options: [
            { text: '🤝 即使不同意我也能完全理解', score: 5 },
            { text: '👂 我能较好理解', score: 4 },
            { text: '🤔 我能理解主要观点', score: 3 },
            { text: '😅 我有些困难', score: 2 },
            { text: '❌ 我很难理解', score: 1 }
        ]},
        // P
        { dimension: 'P', text: '在高压环境下工作：', options: [
            { text: '⚡ 我能保持高效', score: 5 },
            { text: '💪 我能较好应对', score: 4 },
            { text: '✅ 我能正常工作', score: 3 },
            { text: '😰 我的效率会下降', score: 2 },
            { text: '🔥 我几乎无法工作', score: 1 }
        ]},
        { dimension: 'P', text: '面对突发危机：', options: [
            { text: '🧘 我能冷静处理', score: 5 },
            { text: '⚡ 我能较快调整', score: 4 },
            { text: '✅ 我能应对', score: 3 },
            { text: '😅 我会有些慌乱', score: 2 },
            { text: '😰 我会非常紧张', score: 1 }
        ]},
        { dimension: 'P', text: '当同时面对多个任务时：', options: [
            { text: '🎯 我能从容应对', score: 5 },
            { text: '✅ 我能较好管理', score: 4 },
            { text: '👌 我能处理', score: 3 },
            { text: '😰 我会感到压力', score: 2 },
            { text: '🔥 我会不堪重负', score: 1 }
        ]},
        { dimension: 'P', text: '失败后你的恢复速度：', options: [
            { text: '🚀 非常快，立即振作', score: 5 },
            { text: '⚡ 较快恢复', score: 4 },
            { text: '⏳ 需要一些时间', score: 3 },
            { text: '😔 恢复较慢', score: 2 },
            { text: '😢 很难恢复', score: 1 }
        ]},
        { dimension: 'P', text: '面对批评和否定：', options: [
            { text: '🎓 我能客观看待并成长', score: 5 },
            { text: '📝 我能接受并改进', score: 4 },
            { text: '😔 我能接受但会难过', score: 3 },
            { text: '😢 我会感到受伤', score: 2 },
            { text: '💔 我会深受打击', score: 1 }
        ]},
        // G
        { dimension: 'G', text: '对于新的挑战：', options: [
            { text: '🚀 我积极迎接并期待成长', score: 5 },
            { text: '💪 我愿意尝试', score: 4 },
            { text: '🤔 我会考虑后决定', score: 3 },
            { text: '😅 我有些犹豫', score: 2 },
            { text: '🏃 我倾向于回避', score: 1 }
        ]},
        { dimension: 'G', text: '当遇到不擅长的事情：', options: [
            { text: '📈 我相信通过努力可以提高', score: 5 },
            { text: '📚 我愿意学习和改进', score: 4 },
            { text: '🔧 我会尝试提升', score: 3 },
            { text: '🤷 我可能放弃', score: 2 },
            { text: '❌ 我认为无法改变', score: 1 }
        ]},
        { dimension: 'G', text: '对于反馈和建议：', options: [
            { text: '💡 我非常欢迎并积极采纳', score: 5 },
            { text: '👍 我乐于接受', score: 4 },
            { text: '🤔 我会考虑', score: 3 },
            { text: '😅 我有些抵触', score: 2 },
            { text: '🚫 我不太接受', score: 1 }
        ]},
        { dimension: 'G', text: '你认为能力是：', options: [
            { text: '📈 可以通过努力不断发展', score: 5 },
            { text: '🔧 可以提升的', score: 4 },
            { text: '⚖️ 部分可以改变', score: 3 },
            { text: '🧬 大部分是天生的', score: 2 },
            { text: '🔒 固定不变的', score: 1 }
        ]},
        { dimension: 'G', text: '面对困难任务时：', options: [
            { text: '🎯 我视为学习成长的机会', score: 5 },
            { text: '💪 我愿意挑战自己', score: 4 },
            { text: '✅ 我会尝试完成', score: 3 },
            { text: '😅 我会有些退缩', score: 2 },
            { text: '🏃 我会尽量避免', score: 1 }
        ]}
    ],
    expert: []
};

// 专家模式独特题库
questions.expert = [
    // E - 外向性
    { dimension: 'E', text: '在社交场合中，你会主动与陌生人攀谈吗？', options: [
        { text: '🌟 非常主动，享受认识新朋友', score: 5 },
        { text: '😊 会根据情况主动交流', score: 4 },
        { text: '😐 偶尔会主动，视心情而定', score: 3 },
        { text: '😔 不太主动，等待别人接近', score: 2 },
        { text: '🚫 几乎不会主动与陌生人交流', score: 1 }
    ]},
    { dimension: 'E', text: '你如何看待社交网络上的互动？', options: [
        { text: '🌐 非常活跃，经常分享和互动', score: 5 },
        { text: '📱 比较活跃，定期更新状态', score: 4 },
        { text: '👀 偶尔浏览，较少互动', score: 3 },
        { text: '📵 很少使用，只是偶尔查看', score: 2 },
        { text: '🚫 几乎不使用社交网络', score: 1 }
    ]},
    // O - 开放性
    { dimension: 'O', text: '你对新兴科技和创新概念的态度是？', options: [
        { text: '🚀 非常感兴趣，积极尝试', score: 5 },
        { text: '💡 感兴趣，愿意了解和学习', score: 4 },
        { text: '🤔 保持中立，视情况而定', score: 3 },
        { text: '😐 兴趣一般，被动接受', score: 2 },
        { text: '🛡️ 比较保守，倾向于传统方式', score: 1 }
    ]},
    { dimension: 'O', text: '你如何处理生活中的不确定性？', options: [
        { text: '🌟 视为机遇，积极应对', score: 5 },
        { text: '🔄 接受变化，灵活适应', score: 4 },
        { text: '🤔 谨慎面对，逐步适应', score: 3 },
        { text: '😰 有些焦虑，但能应对', score: 2 },
        { text: '🚫 非常不适，尽量避免', score: 1 }
    ]},
    // C - 尽责性
    { dimension: 'C', text: '你如何管理个人时间和任务？', options: [
        { text: '📅 严格规划，精确执行', score: 5 },
        { text: '📝 有计划，基本按计划执行', score: 4 },
        { text: '✅ 大致安排，灵活调整', score: 3 },
        { text: '🎯 目标明确，但执行不够严格', score: 2 },
        { text: '🎲 随性而为，较少规划', score: 1 }
    ]},
    { dimension: 'C', text: '面对截止日期，你通常会？', options: [
        { text: '🚀 提前完成，留有充足时间', score: 5 },
        { text: '📊 按计划进行，准时完成', score: 4 },
        { text: '⏰ 基本按时完成，偶尔需要加班', score: 3 },
        { text: '🔥 经常在截止前赶工完成', score: 2 },
        { text: '😰 经常延迟，需要他人提醒', score: 1 }
    ]},
    // A - 宜人性
    { dimension: 'A', text: '在团队合作中，你更注重？', options: [
        { text: '🤝 团队和谐与成员感受', score: 5 },
        { text: '⚖️ 平衡个人与团队利益', score: 4 },
        { text: '🎯 任务完成与效率', score: 3 },
        { text: '💪 个人贡献与表现', score: 2 },
        { text: '🏆 个人成就与竞争', score: 1 }
    ]},
    { dimension: 'A', text: '你如何看待他人的不同观点？', options: [
        { text: '🌍 非常尊重，愿意深入了解', score: 5 },
        { text: '👂 尊重并尝试理解', score: 4 },
        { text: '🤔 保持中立，不轻易评判', score: 3 },
        { text: '😕 难以理解，但保持尊重', score: 2 },
        { text: '🚫 难以接受，坚持自己观点', score: 1 }
    ]},
    // N - 情绪稳定性
    { dimension: 'N', text: '面对批评和否定，你会？', options: [
        { text: '🎓 客观分析，从中学习', score: 5 },
        { text: '📝 接受并努力改进', score: 4 },
        { text: '😔 感到难过，但能调整', score: 3 },
        { text: '😢 情绪受到明显影响', score: 2 },
        { text: '💔 深受打击，难以释怀', score: 1 }
    ]},
    { dimension: 'N', text: '你的情绪状态通常是？', options: [
        { text: '🌊 非常稳定，很少波动', score: 5 },
        { text: '🌤️ 比较稳定，偶尔波动', score: 4 },
        { text: '⛅ 有一定波动，但可控', score: 3 },
        { text: '🌧️ 波动较大，有时影响生活', score: 2 },
        { text: '⛈️ 情绪起伏很大，难以控制', score: 1 }
    ]},
    // 从标准模式中选择部分题目，确保专家模式有足够的题目数量
    ...questions.standard.slice(0, 40)
];

// 趣味测试数据
const miniTests = {
    color: {
        title: '🎨 性格色彩测试',
        questions: [
            { text: '你更喜欢哪种场景？', options: [
                { text: '🌊 宁静的湖边', value: '蓝色', emoji: '🌊' },
                { text: '🎪 热闹的市集', value: '橙色', emoji: '🎪' },
                { text: '🌲 神秘的森林', value: '绿色', emoji: '🌲' },
                { text: '⛰️ 壮丽的高山', value: '红色', emoji: '⛰️' }
            ]},
            { text: '遇到困难时，你的第一反应是？', options: [
                { text: '🧠 冷静分析', value: '蓝色', emoji: '🧠' },
                { text: '🤝 寻求帮助', value: '黄色', emoji: '🤝' },
                { text: '⚡ 积极行动', value: '红色', emoji: '⚡' },
                { text: '🧘 调整心态', value: '绿色', emoji: '🧘' }
            ]},
            { text: '你更喜欢哪种休闲方式？', options: [
                { text: '📚 阅读思考', value: '蓝色', emoji: '📚' },
                { text: '🎉 聚会社交', value: '橙色', emoji: '🎉' },
                { text: '🏕️ 户外探险', value: '绿色', emoji: '🏕️' },
                { text: '🎨 艺术创作', value: '紫色', emoji: '🎨' }
            ]}
        ],
        meanings: {
            '蓝色': { desc: '你是一个平静、理性的人，善于思考和分析。', color: '#3b82f6' },
            '橙色': { desc: '你充满活力和热情，喜欢与人交往。', color: '#f97316' },
            '绿色': { desc: '你热爱自然，富有创造力和生命力。', color: '#22c55e' },
            '红色': { desc: '你充满力量和决心，是一个天生的领导者。', color: '#ef4444' },
            '黄色': { desc: '你乐观开朗，善于与人合作。', color: '#eab308' },
            '紫色': { desc: '你富有创意和艺术气质，追求独特表达。', color: '#a855f7' }
        }
    },
    animal: {
        title: '🦁 动物性格测试',
        questions: [
            { text: '面对挑战时，你更像哪种动物？', options: [
                { text: '🦁 狮子 - 勇敢面对', value: '狮子', emoji: '🦁' },
                { text: '🦉 猫头鹰 - 智慧分析', value: '猫头鹰', emoji: '🦉' },
                { text: '🐬 海豚 - 灵活应对', value: '海豚', emoji: '🐬' },
                { text: '🐢 乌龟 - 稳健前行', value: '乌龟', emoji: '🐢' }
            ]},
            { text: '在团队中，你通常扮演什么角色？', options: [
                { text: '🐺 领导者', value: '狼', emoji: '🐺' },
                { text: '🐝 协调者', value: '蜜蜂', emoji: '🐝' },
                { text: '🦊 创新者', value: '狐狸', emoji: '🦊' },
                { text: '🐜 执行者', value: '蚂蚁', emoji: '🐜' }
            ]},
            { text: '周末你更倾向于？', options: [
                { text: '🦚 组织活动', value: '孔雀', emoji: '🦚' },
                { text: '🐱 独处休息', value: '猫', emoji: '🐱' },
                { text: '🐒 学习新知', value: '猴子', emoji: '🐒' },
                { text: '🦌 亲近自然', value: '鹿', emoji: '🦌' }
            ]}
        ],
        meanings: {
            '狮子': { desc: '你是一个天生的领导者，勇敢果断。', emoji: '🦁' },
            '猫头鹰': { desc: '你智慧深沉，善于分析和思考。', emoji: '🦉' },
            '海豚': { desc: '你灵活聪明，善于适应各种环境。', emoji: '🐬' },
            '乌龟': { desc: '你稳健踏实，做事有条不紊。', emoji: '🐢' },
            '狼': { desc: '你有很强的团队意识，是天生的领袖。', emoji: '🐺' },
            '蜜蜂': { desc: '你勤劳踏实，善于团队合作。', emoji: '🐝' },
            '狐狸': { desc: '你聪明机智，富有创造力。', emoji: '🦊' },
            '蚂蚁': { desc: '你踏实肯干，是值得信赖的伙伴。', emoji: '🐜' },
            '孔雀': { desc: '你魅力四射，喜欢成为焦点。', emoji: '🦚' },
            '猫': { desc: '你独立自主，有自己的节奏。', emoji: '🐱' },
            '猴子': { desc: '你聪明好奇，喜欢探索新事物。', emoji: '🐒' },
            '鹿': { desc: '你温和自然，与人为善。', emoji: '🦌' }
        }
    },
    element: {
        title: '🔥 元素属性测试',
        questions: [
            { text: '你的能量来源是？', options: [
                { text: '🔥 内心的激情', value: '火', emoji: '🔥' },
                { text: '💧 平静的思考', value: '水', emoji: '💧' },
                { text: '🌬️ 自由的探索', value: '风', emoji: '🌬️' },
                { text: '🌍 稳定的根基', value: '土', emoji: '🌍' }
            ]},
            { text: '面对压力时，你会？', options: [
                { text: '🔥 燃烧斗志，直面挑战', value: '火', emoji: '🔥' },
                { text: '💧 冷静分析，以柔克刚', value: '水', emoji: '💧' },
                { text: '🌬️ 灵活变通，寻找出路', value: '风', emoji: '🌬️' },
                { text: '🌍 稳扎稳打，步步为营', value: '土', emoji: '🌍' }
            ]}
        ],
        meanings: {
            '火': { desc: '你充满激情和能量，是天生的行动派！', emoji: '🔥' },
            '水': { desc: '你深沉智慧，善于适应和治愈。', emoji: '💧' },
            '风': { desc: '你自由灵活，追求创新和变化。', emoji: '🌬️' },
            '土': { desc: '你稳定可靠，是值得信赖的支柱。', emoji: '🌍' }
        }
    },
    emotion: {
        title: '💝 情绪光谱测试',
        questions: [
            { text: '你的情绪通常是？', options: [
                { text: '🌈 多彩丰富', value: '彩虹', emoji: '🌈' },
                { text: '☀️ 明亮积极', value: '阳光', emoji: '☀️' },
                { text: '🌙 深沉内敛', value: '月光', emoji: '🌙' },
                { text: '⚡ 强烈快速', value: '闪电', emoji: '⚡' }
            ]},
            { text: '你如何处理负面情绪？', options: [
                { text: '🎭 表达和释放', value: '彩虹', emoji: '🎭' },
                { text: '💪 积极转化', value: '阳光', emoji: '💪' },
                { text: '🧘 内在消化', value: '月光', emoji: '🧘' },
                { text: '⚡ 快速行动', value: '闪电', emoji: '⚡' }
            ]}
        ],
        meanings: {
            '彩虹': { desc: '你的情绪丰富多彩，富有同理心和创造力。', emoji: '🌈' },
            '阳光': { desc: '你乐观积极，总能带来温暖和希望。', emoji: '☀️' },
            '月光': { desc: '你内省深刻，有着丰富的内心世界。', emoji: '🌙' },
            '闪电': { desc: '你反应迅速，能量强大，敢爱敢恨。', emoji: '⚡' }
        }
    }
};

// 职业推荐
const recommendations = {
    career: {
        high_E: ['🎯 销售总监', '📢 公关经理', '🎪 活动策划', '🎤 主持人', '📚 企业培训师'],
        low_E: ['💻 数据分析师', '✍️ 作家', '👨‍💻 程序员', '🔬 研究员', '📚 图书管理员'],
        high_O: ['🎨 产品经理', '🖌️ UI设计师', '💡 广告创意', '🏛️ 建筑师', '🎭 艺术总监'],
        low_O: ['📊 会计师', '📝 审计师', '📋 行政助理', '🔍 质检员', '🏦 银行柜员'],
        high_C: ['📋 项目经理', '⚖️ 律师', '🏥 医生', '📈 运营总监', '💰 财务经理'],
        low_C: ['🎭 自由职业', '🎨 插画师', '✈️ 旅游博主', '🎵 DJ', '🍸 调酒师'],
        high_A: ['💝 心理咨询师', '👩‍⚕️ 护士', '🤝 社工', '👶 幼儿园教师', '📞 客服经理'],
        low_A: ['⚖️ 法官', '💰 风险投资人', '🏆 竞技选手', '📣 评论员', '🚀 创业者'],
        high_N: ['🚑 急诊医生', '✈️ 飞行员', '🔥 危机公关', '📈 操盘手', '📰 战地记者'],
        low_N: ['🎨 艺术家', '✈️ 诗人', '🎵 音乐家', '🧘 心理咨询', '🧘‍♂️ 冥想导师'],
        high_T: ['🔬 科学家', '🤖 算法工程师', '📊 逻辑学家', '📈 投资分析师', '🏗️ 架构师'],
        low_T: ['🎭 演员', '👶 幼儿园老师', '🤝 社工', '🌏 导游', '💐 花艺师'],
        high_Cr: ['🎮 游戏设计师', '📝 编剧', '👗 时装设计师', '👨‍🍳 主厨', '💡 发明家'],
        high_L: ['👑 CEO', '🏛️ 政客', '🎬 导演', '⚽ 运动教练', '🎖️ 军事指挥官'],
        high_S: ['🌍 外交官', '👔 猎头顾问', '👥 社区经理', '🤝 商务拓展', '📊 销售代表'],
        high_Em: ['💝 心理治疗师', '🧑‍🏫 特殊教育', '👩‍⚕️ 护士', '👥 人力资源', '🤝 志愿者协调员'],
        high_P: ['🚒 消防员', '🚑 急救人员', '📈 股票交易员', '👮 刑警', '✈️ 空中管制员'],
        high_G: ['🚀 创业者', '🔬 研发专家', '📊 战略顾问', '🎓 教育创新者', '🎯 职业教练']
    },
    hobby: {
        high_E: ['⚽ 团队运动', '🎉 派对策划', '🎤 脱口秀', '🎭 即兴剧', '👥 社群运营'],
        low_E: ['📖 阅读', '🧘 瑜伽', '✒️ 书法', '🧩 拼图', '🚶 独自旅行'],
        high_O: ['🏛️ 博物馆打卡', '🗣️ 学习新语言', '📷 摄影', '🍳 烹饪实验', '🎵 即兴音乐'],
        low_O: ['🎁 收藏', '🎣 钓鱼', '♟️ 传统棋类', '🌱 园艺', '🎬 观看经典电影'],
        high_C: ['💪 健身打卡', '📦 整理收纳', '💰 理财规划', '📜 技能考证', '🌅 早起打卡'],
        low_C: ['🎒 随机旅行', '🎮 游戏马拉松', '🌃 夜生活', '🚶 闲逛', '😴 发呆'],
        high_A: ['🤝 志愿服务', '🐾 宠物救助', '🏘️ 社区活动', '🍪 烘焙分享', '👨‍🏫 辅导他人'],
        low_A: ['🎮 竞技游戏', '🏃 个人运动', '🎨 独自创作', '🏕️ 生存训练', '🧗 极限运动'],
        high_Cr: ['🎨 绘画', '🎹 乐器', '✍️ 写作', '🧵 手工艺', '🎬 视频剪辑'],
        high_L: ['🎉 组织聚会', '🎤 公开演讲', '👥 社团管理', '👨‍🏫 指导新人', '♟️ 策略游戏'],
        high_S: ['📱 社交软件', '🎪 俱乐部活动', '💑 相亲角', '🤝 团建组织', '💬 聊天'],
        high_Em: ['👂 倾听', '🤝 助人', '📚 心理咨询学习', '🎬 看感人电影', '🐾 动物互动'],
        high_P: ['🧗 极限运动', '🥊 格斗训练', '🎮 高难度游戏', '🎤 公开辩论', '🎯 挑战极限'],
        high_G: ['📚 读书会', '💻 在线课程', '🔄 技能交换', '🎯 挑战新事物', '📝 写日记']
    }
};

// 暴露数据到全局
window.dimensions = dimensions;
window.questions = questions;
window.miniTests = miniTests;
window.recommendations = recommendations;