const FORTUNE_STORAGE_KEY = 'daily_fortune';
const DRAW_LOTS_STORAGE_KEY = 'daily_lots';

const fortuneData = {
    overall: [
        { level: 5, text: '大吉', desc: '今日运势极佳，诸事顺遂，贵人相助！', emoji: '🌟' },
        { level: 4, text: '中吉', desc: '今日运势良好，把握机会，心想事成！', emoji: '✨' },
        { level: 3, text: '小吉', desc: '今日运势平稳，稳中求进，小有收获！', emoji: '💫' },
        { level: 2, text: '平', desc: '今日运势一般，保持平常心，稳扎稳打。', emoji: '⭐' },
        { level: 1, text: '小凶', desc: '今日需谨慎行事，多加小心，逢凶化吉。', emoji: '🌙' }
    ],
    aspects: {
        love: {
            name: '感情运势',
            icon: '💕',
            predictions: [
                { level: 5, text: '桃花运旺盛，单身者有望邂逅良缘！', color: 'pink' },
                { level: 4, text: '感情甜蜜升温，适合表达心意。', color: 'pink' },
                { level: 3, text: '感情平稳，适合培养默契。', color: 'pink' },
                { level: 2, text: '感情平淡，需要多一些主动。', color: 'gray' },
                { level: 1, text: '感情易生波折，需多加沟通。', color: 'gray' }
            ]
        },
        career: {
            name: '事业运势',
            icon: '💼',
            predictions: [
                { level: 5, text: '事业蒸蒸日上，贵人相助，升职加薪有望！', color: 'blue' },
                { level: 4, text: '工作顺利，表现突出，获得认可。', color: 'blue' },
                { level: 3, text: '工作稳定，适合学习新技能。', color: 'blue' },
                { level: 2, text: '工作平淡，需要更多耐心。', color: 'gray' },
                { level: 1, text: '工作压力较大，注意调节心态。', color: 'gray' }
            ]
        },
        wealth: {
            name: '财运',
            icon: '💰',
            predictions: [
                { level: 5, text: '财运亨通，正财偏财皆旺！', color: 'yellow' },
                { level: 4, text: '财运不错，有意外收获。', color: 'yellow' },
                { level: 3, text: '财运平稳，适合稳健理财。', color: 'yellow' },
                { level: 2, text: '财运一般，不宜冒险投资。', color: 'gray' },
                { level: 1, text: '财运欠佳，需谨慎消费。', color: 'gray' }
            ]
        },
        health: {
            name: '健康运势',
            icon: '🏃',
            predictions: [
                { level: 5, text: '精力充沛，状态极佳！', color: 'green' },
                { level: 4, text: '身体状况良好，适合运动。', color: 'green' },
                { level: 3, text: '健康平稳，注意作息规律。', color: 'green' },
                { level: 2, text: '略显疲惫，需要适当休息。', color: 'gray' },
                { level: 1, text: '身体欠佳，注意防寒保暖。', color: 'gray' }
            ]
        },
        study: {
            name: '学业运势',
            icon: '📚',
            predictions: [
                { level: 5, text: '思维敏捷，学习效率极高！', color: 'purple' },
                { level: 4, text: '学习状态良好，适合攻克难题。', color: 'purple' },
                { level: 3, text: '学习平稳，适合复习巩固。', color: 'purple' },
                { level: 2, text: '学习效率一般，需要调整方法。', color: 'gray' },
                { level: 1, text: '学习注意力不集中，需调整状态。', color: 'gray' }
            ]
        }
    },
    luckyItems: {
        colors: ['红色', '橙色', '黄色', '绿色', '蓝色', '紫色', '粉色', '白色', '黑色', '金色'],
        numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        directions: ['东方', '南方', '西方', '北方', '东南', '西南', '东北', '西北'],
        foods: ['水果', '蔬菜', '海鲜', '肉类', '甜点', '茶饮', '咖啡', '汤品', '面食', '米饭']
    }
};

const drawLotsData = {
    lots: [
        { id: 1, type: '上上签', emoji: '🌟', title: '龙凤呈祥', poem: '龙飞凤舞在云端，\n吉星高照福无边。\n贵人相助前程好，\n万事如意乐无边。', meaning: '此签大吉，预示着好运将至。事业上有贵人相助，感情上甜蜜美满，财运亨通。把握机会，勇往直前，必有所成。', advice: '积极进取，把握机遇，贵人将至，万事顺遂。' },
        { id: 2, type: '上签', emoji: '✨', title: '春风得意', poem: '春风得意马蹄疾，\n一日看尽长安花。\n前程似锦无限好，\n步步高升展宏图。', meaning: '此签为吉，预示着近期运势上升。工作上有新的机遇，感情上会有好的发展，适合开展新计划。', advice: '把握当下，积极行动，好运自来，心想事成。' },
        { id: 3, type: '上签', emoji: '💫', title: '紫气东来', poem: '紫气东来祥瑞现，\n福星高照好运连。\n守得云开见月明，\n苦尽甘来福无边。', meaning: '此签为吉，预示着困境即将过去，好运即将到来。坚持下去，必能看到希望的曙光。', advice: '坚持不懈，守得云开，转机将至，否极泰来。' },
        { id: 4, type: '中上签', emoji: '🌙', title: '稳中求进', poem: '稳扎稳打步步高，\n循序渐进不急躁。\n水到渠成自然事，\n功到自然成大道。', meaning: '此签为中吉，提示需要脚踏实地，稳中求进。不要急于求成，循序渐进方能成功。', advice: '脚踏实地，稳扎稳打，循序渐进，功到自然成。' },
        { id: 5, type: '中签', emoji: '⭐', title: '守正待时', poem: '守正不移待时机，\n静待花开自有期。\n莫急莫躁心安定，\n水到渠成事自成。', meaning: '此签为中平，提示当前需要保持稳定，等待时机。不宜冒进，静待花开。', advice: '保持耐心，静待时机，不宜冒进，稳中求胜。' },
        { id: 6, type: '中签', emoji: '🌊', title: '波澜不惊', poem: '波澜不惊心如水，\n泰然处之见智慧。\n风浪过后见彩虹，\n守得初心得始终。', meaning: '此签为中平，提示面对变化要保持平静，泰然处之。风浪过后必有彩虹。', advice: '保持冷静，泰然处之，风雨过后，必有彩虹。' },
        { id: 7, type: '中下签', emoji: '🍃', title: '谨慎行事', poem: '行路难时需谨慎，\n步步为营莫急进。\n小心驶得万年船，\n稳中求进方为真。', meaning: '此签提示近期需要谨慎行事，不宜冒险。小心谨慎，方能化险为夷。', advice: '谨慎行事，步步为营，不宜冒险，稳中求进。' },
        { id: 8, type: '下签', emoji: '🌧️', title: '守得云开', poem: '乌云遮日暂无光，\n守得云开见太阳。\n风雨过后彩虹现，\n否极泰来好运长。', meaning: '此签提示近期可能遇到一些困难，但不要灰心。风雨过后必有彩虹，坚持就是胜利。', advice: '坚定信心，迎难而上，风雨过后，必有转机。' },
        { id: 9, type: '下签', emoji: '🌙', title: '韬光养晦', poem: '韬光养晦待时机，\n厚积薄发显真力。\n不鸣则已一鸣惊，\n蓄势待发终有成。', meaning: '此签提示当前适合低调行事，积蓄力量。韬光养晦，厚积薄发，日后必有大成。', advice: '低调行事，积蓄力量，厚积薄发，终有所成。' },
        { id: 10, type: '特殊签', emoji: '🎯', title: '命运之轮', poem: '命运之轮在转动，\n机遇挑战并存中。\n把握当下勇向前，\n命运掌握在手中。', meaning: '此签为特殊签，提示命运掌握在自己手中。无论顺境逆境，都要积极面对，勇往直前。', advice: '命运自主，把握当下，积极进取，创造未来。' }
    ]
};

function getTodayKey() {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
}

function seededRandom(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

function generateDailyFortune() {
    const today = getTodayKey();
    const seed = today.split('-').reduce((a, b) => a + parseInt(b), 0);
    const userSeed = (localStorage.getItem('user_data') ? JSON.parse(localStorage.getItem('user_data')).id : 'guest') + seed;
    
    let hash = 0;
    for (let i = 0; i < userSeed.length; i++) {
        hash = ((hash << 5) - hash) + userSeed.charCodeAt(i);
        hash = hash & hash;
    }
    
    const overallIndex = Math.abs(Math.floor(seededRandom(hash) * fortuneData.overall.length));
    const overall = fortuneData.overall[overallIndex];
    
    const aspects = {};
    Object.keys(fortuneData.aspects).forEach(key => {
        const aspectSeed = hash + key.charCodeAt(0);
        const index = Math.abs(Math.floor(seededRandom(aspectSeed) * 5));
        aspects[key] = {
            ...fortuneData.aspects[key],
            prediction: fortuneData.aspects[key].predictions[index]
        };
    });
    
    const luckyItems = {
        color: fortuneData.luckyItems.colors[Math.abs(Math.floor(seededRandom(hash + 1) * fortuneData.luckyItems.colors.length))],
        number: fortuneData.luckyItems.numbers[Math.abs(Math.floor(seededRandom(hash + 2) * fortuneData.luckyItems.numbers.length))],
        direction: fortuneData.luckyItems.directions[Math.abs(Math.floor(seededRandom(hash + 3) * fortuneData.luckyItems.directions.length))],
        food: fortuneData.luckyItems.foods[Math.abs(Math.floor(seededRandom(hash + 4) * fortuneData.luckyItems.foods.length))]
    };
    
    return {
        date: today,
        overall,
        aspects,
        luckyItems
    };
}

function getStoredFortune() {
    const stored = localStorage.getItem(FORTUNE_STORAGE_KEY);
    if (stored) {
        const data = JSON.parse(stored);
        if (data.date === getTodayKey()) {
            return data;
        }
    }
    return null;
}

function saveFortune(fortune) {
    localStorage.setItem(FORTUNE_STORAGE_KEY, JSON.stringify(fortune));
}

function showDailyFortune() {
    let fortune = getStoredFortune();
    if (!fortune) {
        fortune = generateDailyFortune();
        saveFortune(fortune);
    }
    
    const modal = document.createElement('div');
    modal.id = 'fortune-modal';
    modal.className = 'fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="glass-card rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate__animated animate__zoomIn">
            <div class="text-center mb-6">
                <div class="text-5xl mb-4">${fortune.overall.emoji}</div>
                <h2 class="text-3xl font-bold mb-2">今日运势</h2>
                <p class="text-gray-400">${fortune.date}</p>
            </div>
            
            <div class="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl p-6 mb-6 text-center">
                <div class="text-4xl font-bold text-yellow-400 mb-2">${fortune.overall.text}</div>
                <p class="text-gray-300">${fortune.overall.desc}</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                ${Object.entries(fortune.aspects).map(([key, aspect]) => `
                    <div class="bg-white/5 rounded-xl p-4">
                        <div class="flex items-center gap-2 mb-2">
                            <span class="text-2xl">${aspect.icon}</span>
                            <span class="font-bold">${aspect.name}</span>
                            <div class="ml-auto flex gap-1">
                                ${Array(5).fill(0).map((_, i) => `
                                    <span class="text-sm ${i < aspect.prediction.level ? 'text-yellow-400' : 'text-gray-600'}">★</span>
                                `).join('')}
                            </div>
                        </div>
                        <p class="text-sm text-gray-400">${aspect.prediction.text}</p>
                    </div>
                `).join('')}
            </div>
            
            <div class="bg-white/5 rounded-xl p-4 mb-6">
                <h3 class="font-bold mb-3 flex items-center gap-2">
                    <span>🍀</span> 幸运指南
                </h3>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                        <div class="text-2xl mb-1">🎨</div>
                        <div class="text-xs text-gray-500">幸运颜色</div>
                        <div class="font-bold text-purple-400">${fortune.luckyItems.color}</div>
                    </div>
                    <div>
                        <div class="text-2xl mb-1">🔢</div>
                        <div class="text-xs text-gray-500">幸运数字</div>
                        <div class="font-bold text-blue-400">${fortune.luckyItems.number}</div>
                    </div>
                    <div>
                        <div class="text-2xl mb-1">🧭</div>
                        <div class="text-xs text-gray-500">幸运方位</div>
                        <div class="font-bold text-green-400">${fortune.luckyItems.direction}</div>
                    </div>
                    <div>
                        <div class="text-2xl mb-1">🍜</div>
                        <div class="text-xs text-gray-500">幸运食物</div>
                        <div class="font-bold text-orange-400">${fortune.luckyItems.food}</div>
                    </div>
                </div>
            </div>
            
            <div class="text-center">
                <button onclick="closeFortuneModal()" class="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold hover:opacity-90 transition-all">
                    知道了 <i class="fas fa-check ml-2"></i>
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeFortuneModal();
        }
    });
    
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#fbbf24', '#f59e0b', '#d97706']
        });
    }
}

function closeFortuneModal() {
    const modal = document.getElementById('fortune-modal');
    if (modal) {
        modal.classList.add('animate__animated', 'animate__zoomOut');
        setTimeout(() => modal.remove(), 300);
    }
}

function getStoredLot() {
    const stored = localStorage.getItem(DRAW_LOTS_STORAGE_KEY);
    if (stored) {
        const data = JSON.parse(stored);
        if (data.date === getTodayKey()) {
            return data;
        }
    }
    return null;
}

function saveLot(lot) {
    localStorage.setItem(DRAW_LOTS_STORAGE_KEY, JSON.stringify({
        date: getTodayKey(),
        lot
    }));
}

function drawLot() {
    const seed = Date.now();
    const index = Math.floor(seededRandom(seed) * drawLotsData.lots.length);
    return drawLotsData.lots[index];
}

function showDrawLots() {
    const storedLot = getStoredLot();
    
    if (storedLot) {
        displayLotResult(storedLot.lot, true);
        return;
    }
    
    const modal = document.createElement('div');
    modal.id = 'draw-lots-modal';
    modal.className = 'fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="glass-card rounded-3xl p-8 max-w-md w-full text-center animate__animated animate__zoomIn">
            <div class="text-6xl mb-6 animate__animated animate__bounce animate__infinite">🎋</div>
            <h2 class="text-2xl font-bold mb-4">每日抽签</h2>
            <p class="text-gray-400 mb-6">心诚则灵，诚心祈愿后点击抽签</p>
            
            <div id="lot-animation-container" class="mb-6">
                <div class="flex justify-center gap-2 flex-wrap">
                    ${Array(10).fill(0).map((_, i) => `
                        <div class="w-12 h-20 bg-gradient-to-b from-red-800 to-red-900 rounded-t-lg flex items-center justify-center text-yellow-400 text-xs cursor-pointer hover:scale-110 transition-transform lot-stick" data-index="${i}">
                            签
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <button id="draw-lot-btn" onclick="performDrawLot()" class="px-8 py-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl font-bold hover:opacity-90 transition-all">
                <i class="fas fa-hand-pointer mr-2"></i> 开始抽签
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeDrawLotsModal();
        }
    });
}

function performDrawLot() {
    const existingLot = getStoredLot();
    if (existingLot) {
        closeDrawLotsModal();
        displayLotResult(existingLot.lot, true);
        return;
    }
    
    const btn = document.getElementById('draw-lot-btn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> 抽签中...';
    
    const sticks = document.querySelectorAll('.lot-stick');
    let count = 0;
    const interval = setInterval(() => {
        sticks.forEach(s => s.classList.remove('ring-2', 'ring-yellow-400'));
        const randomStick = sticks[Math.floor(Math.random() * sticks.length)];
        randomStick.classList.add('ring-2', 'ring-yellow-400');
        count++;
        
        if (count > 20) {
            clearInterval(interval);
            
            const selectedLot = drawLot();
            saveLot(selectedLot);
            
            setTimeout(() => {
                closeDrawLotsModal();
                displayLotResult(selectedLot, false);
            }, 500);
        }
    }, 100);
}

function displayLotResult(lot, isViewed) {
    const typeColors = {
        '上上签': 'from-yellow-500 to-orange-500',
        '上签': 'from-green-500 to-teal-500',
        '中上签': 'from-blue-500 to-cyan-500',
        '中签': 'from-purple-500 to-pink-500',
        '中下签': 'from-gray-500 to-slate-500',
        '下签': 'from-gray-600 to-gray-700',
        '特殊签': 'from-indigo-500 to-purple-500'
    };
    
    const modal = document.createElement('div');
    modal.id = 'lot-result-modal';
    modal.className = 'fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="glass-card rounded-3xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto animate__animated animate__zoomIn">
            <div class="text-center mb-6">
                <div class="text-6xl mb-4">${lot.emoji}</div>
                <div class="inline-block px-4 py-1 rounded-full bg-gradient-to-r ${typeColors[lot.type] || 'from-gray-500 to-gray-600'} text-white font-bold mb-2">
                    ${lot.type}
                </div>
                <h2 class="text-2xl font-bold">${lot.title}</h2>
                ${isViewed ? '<p class="text-xs text-gray-500 mt-1">今日已抽签</p>' : ''}
            </div>
            
            <div class="bg-gradient-to-br from-amber-900/30 to-orange-900/30 rounded-2xl p-6 mb-6 border border-amber-500/20">
                <h3 class="font-bold text-amber-400 mb-3 flex items-center gap-2">
                    <span>📜</span> 签文
                </h3>
                <p class="text-gray-200 whitespace-pre-line text-center leading-relaxed">${lot.poem}</p>
            </div>
            
            <div class="bg-white/5 rounded-xl p-4 mb-6">
                <h3 class="font-bold mb-2 flex items-center gap-2">
                    <span>📖</span> 解签
                </h3>
                <p class="text-gray-300 text-sm leading-relaxed">${lot.meaning}</p>
            </div>
            
            <div class="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-4 mb-6">
                <h3 class="font-bold mb-2 flex items-center gap-2">
                    <span>💡</span> 指引
                </h3>
                <p class="text-purple-300 text-sm">${lot.advice}</p>
            </div>
            
            <div class="text-center">
                <button onclick="closeLotResultModal()" class="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold hover:opacity-90 transition-all">
                    收下签文 <i class="fas fa-pray ml-2"></i>
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeLotResultModal();
        }
    });
    
    if (!isViewed && typeof confetti === 'function') {
        confetti({
            particleCount: 30,
            spread: 50,
            origin: { y: 0.6 },
            colors: ['#ef4444', '#f97316', '#eab308']
        });
    }
}

function closeDrawLotsModal() {
    const modal = document.getElementById('draw-lots-modal');
    if (modal) {
        modal.classList.add('animate__animated', 'animate__zoomOut');
        setTimeout(() => modal.remove(), 300);
    }
}

function closeLotResultModal() {
    const modal = document.getElementById('lot-result-modal');
    if (modal) {
        modal.classList.add('animate__animated', 'animate__zoomOut');
        setTimeout(() => modal.remove(), 300);
    }
}

window.showDailyFortune = showDailyFortune;
window.showDrawLots = showDrawLots;
window.performDrawLot = performDrawLot;
window.closeFortuneModal = closeFortuneModal;
window.closeDrawLotsModal = closeDrawLotsModal;
window.closeLotResultModal = closeLotResultModal;
