import { dimensions, questions, miniTests, recommendations } from './data.js';
import { saveProgress, loadProgress, clearProgress, saveTestHistory, loadTestHistory, clearTestHistory, exportData, importData, loadSettings, saveSettings, clearAllData, getStorageUsage } from './storage.js';

// 全局状态变量
let currentTestMode = 'standard';
let currentQuestionIndex = 0;
let userAnswers = {};
let dimensionScores = {};
let miniTestUserAnswers = {};
let currentMiniTestType = null;
let currentMiniQuestionIndex = 0;

export function init() {
    window.startTest = startTest;
    window.selectOption = selectOption;
    window.nextQuestion = nextQuestion;
    window.prevQuestion = prevQuestion;
    window.resumeTest = handleResumeTest;
    window.clearSavedData = window.clearSavedData;
    window.confirmSaveAndExit = confirmSaveAndExit;
    window.startMiniTest = startMiniTest;
    window.backToHome = backToHome;
    window.selectMiniOption = selectMiniOption;
    window.nextMiniQuestion = nextMiniQuestion;
    window.showMiniTestResult = showMiniTestResult;
    window.shareResults = shareResults;
    window.openControlPanel = openControlPanel;
    window.toggleSetting = toggleSetting;
    window.handleImport = handleImport;
    window.clearAllUserData = clearAllUserData;
}

// 显示加载动画
function showLoading(message = '加载中...') {
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = `
        <div class="loading-spinner"></div>
        <div class="loading-text">${message}</div>
    `;
    document.body.appendChild(loadingOverlay);
    return loadingOverlay;
}

// 隐藏加载动画
function hideLoading() {
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.style.opacity = '0';
        setTimeout(() => loadingOverlay.remove(), 300);
    }
}

export function startTest(mode) {
    const loading = showLoading('准备测试...');
    
    setTimeout(() => {
        currentTestMode = mode;
        currentQuestionIndex = 0;
        userAnswers = {};
        dimensionScores = {};
        clearProgress();
        
        showTestPage();
        renderQuestion();
        
        // 优化动画性能
        const questionContainer = document.getElementById('question-container');
        if (questionContainer) {
            // 使用CSS动画代替JS动画，减少性能消耗
            questionContainer.style.opacity = '0';
            questionContainer.style.transform = 'translateX(50px)';
            questionContainer.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
            
            // 触发重排后应用新样式
            requestAnimationFrame(() => {
                questionContainer.style.opacity = '1';
                questionContainer.style.transform = 'translateX(0)';
            });
        }
        
        hideLoading();
    }, 800);
}

export function showTestPage() {
    document.getElementById('home-page').classList.add('hidden');
    document.getElementById('result-page').classList.add('hidden');
    document.getElementById('mini-test-page').classList.add('hidden');
    document.getElementById('test-page').classList.remove('hidden');
}

// 缓存DOM元素以减少重复查询
const DOM = {
    progressText: document.getElementById('progress-text'),
    progressBar: document.getElementById('progress-bar'),
    dimensionIcon: document.getElementById('dimension-icon'),
    dimensionLabel: document.getElementById('dimension-label'),
    questionText: document.getElementById('question-text'),
    optionsContainer: document.getElementById('options-container'),
    prevBtn: document.getElementById('prev-btn'),
    nextBtn: document.getElementById('next-btn')
};

// 绑定事件委托
if (DOM.optionsContainer) {
    DOM.optionsContainer.addEventListener('click', (e) => {
        const optionItem = e.target.closest('.option-item');
        if (optionItem) {
            const idx = parseInt(optionItem.dataset.index);
            selectOption(idx);
        }
    });
}

export function renderQuestion() {
    const q = questions[currentTestMode][currentQuestionIndex];
    const total = questions[currentTestMode].length;
    const dim = dimensions[currentTestMode].find(d => d.id === q.dimension);
    
    // 批量更新DOM
    DOM.progressText.textContent = `${currentQuestionIndex + 1} / ${total}`;
    DOM.progressBar.style.width = `${((currentQuestionIndex + 1) / total) * 100}%`;
    
    DOM.dimensionIcon.textContent = dim.icon;
    DOM.dimensionLabel.textContent = dim.name;
    
    DOM.questionText.textContent = q.text;
    
    // 优化选项渲染
    const optionsHTML = q.options.map((opt, idx) => {
        const isSelected = userAnswers[currentQuestionIndex] === idx;
        return `
            <div class="option-item glass-card p-4 rounded-xl ${isSelected ? 'selected' : ''}" data-index="${idx}">
                <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-full border-2 ${isSelected ? 'border-purple-500 bg-purple-500/20' : 'border-gray-600'} flex items-center justify-center text-lg font-bold transition-all">
                        ${isSelected ? '✓' : String.fromCharCode(65 + idx)}
                    </div>
                    <span class="flex-1">${opt.text}</span>
                </div>
            </div>
        `;
    }).join('');
    
    DOM.optionsContainer.innerHTML = optionsHTML;
    
    DOM.prevBtn.disabled = currentQuestionIndex === 0;
    DOM.nextBtn.disabled = userAnswers[currentQuestionIndex] === undefined;
    DOM.nextBtn.innerHTML = currentQuestionIndex === total - 1 
        ? '查看结果 <i class="fas fa-chart-pie ml-2"></i>'
        : '下一题 <i class="fas fa-arrow-right ml-2"></i>';
}

export function selectOption(idx) {
    userAnswers[currentQuestionIndex] = idx;
    saveProgress({
        mode: currentTestMode,
        index: currentQuestionIndex,
        answers: userAnswers,
        scores: dimensionScores
    });
    
    anime({
        targets: `.option-item:nth-child(${idx + 1})`,
        scale: [1, 1.02, 1],
        duration: 300,
        easing: 'easeInOutQuad'
    });
    
    renderQuestion();
}

export function nextQuestion() {
    if (userAnswers[currentQuestionIndex] === undefined) return;
    
    const q = questions[currentTestMode][currentQuestionIndex];
    if (!dimensionScores[q.dimension]) dimensionScores[q.dimension] = 0;
    dimensionScores[q.dimension] += q.options[userAnswers[currentQuestionIndex]].score;
    
    if (currentQuestionIndex < questions[currentTestMode].length - 1) {
        currentQuestionIndex++;
        saveProgress({
            mode: currentTestMode,
            index: currentQuestionIndex,
            answers: userAnswers,
            scores: dimensionScores
        });
        
        // 优化动画性能
        const questionContainer = document.getElementById('question-container');
        if (questionContainer) {
            questionContainer.style.opacity = '0';
            questionContainer.style.transform = 'translateX(30px)';
            questionContainer.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';
            
            requestAnimationFrame(() => {
                renderQuestion();
                requestAnimationFrame(() => {
                    questionContainer.style.opacity = '1';
                    questionContainer.style.transform = 'translateX(0)';
                });
            });
        } else {
            renderQuestion();
        }
    } else {
        finishTest();
    }
}

export function prevQuestion() {
    if (currentQuestionIndex > 0) {
        const q = questions[currentTestMode][currentQuestionIndex];
        if (userAnswers[currentQuestionIndex] !== undefined) {
            dimensionScores[q.dimension] -= q.options[userAnswers[currentQuestionIndex]].score;
        }
        
        currentQuestionIndex--;
        saveProgress({
            mode: currentTestMode,
            index: currentQuestionIndex,
            answers: userAnswers,
            scores: dimensionScores
        });
        
        // 优化动画性能
        const questionContainer = document.getElementById('question-container');
        if (questionContainer) {
            questionContainer.style.opacity = '0';
            questionContainer.style.transform = 'translateX(-30px)';
            questionContainer.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';
            
            requestAnimationFrame(() => {
                renderQuestion();
                requestAnimationFrame(() => {
                    questionContainer.style.opacity = '1';
                    questionContainer.style.transform = 'translateX(0)';
                });
            });
        } else {
            renderQuestion();
        }
    }
}

export function handleResumeTest() {
    const progress = loadProgress();
    if (progress) {
        currentTestMode = progress.mode;
        currentQuestionIndex = progress.index;
        userAnswers = progress.answers;
        dimensionScores = progress.scores || {};
        
        showTestPage();
        renderQuestion();
    }
}

export function finishTest() {
    clearProgress();
    calculateFinalScores();
    
    // 保存测试历史
    const topDimensions = Object.entries(dimensionScores)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([dim, score]) => {
            const dimensionInfo = dimensions[currentTestMode].find(d => d.id === dim);
            return {
                id: dim,
                name: dimensionInfo.name,
                score: score,
                icon: dimensionInfo.icon
            };
        });
    
    saveTestHistory({
        mode: currentTestMode,
        scores: dimensionScores,
        topDimensions: topDimensions
    });
    
    showResults();
    
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8b5cf6', '#ec4899', '#00f0ff', '#fbbf24']
    });
}

export function calculateFinalScores() {
    const maxScores = {};
    questions[currentTestMode].forEach(q => {
        maxScores[q.dimension] = (maxScores[q.dimension] || 0) + 5;
    });
    
    Object.keys(dimensionScores).forEach(k => {
        const max = maxScores[k] || 20;
        dimensionScores[k] = Math.round((dimensionScores[k] / max) * 100);
    });
}

export function showResults() {
    const resultPage = document.getElementById('result-page');
    resultPage.classList.remove('hidden');
    document.getElementById('test-page').classList.add('hidden');
    
    const topDimensions = Object.entries(dimensionScores)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);
    
    const careerRecommendations = [];
    const hobbyRecommendations = [];
    
    topDimensions.forEach(([dim, score]) => {
        if (score > 70) {
            if (recommendations.career[`high_${dim}`]) {
                careerRecommendations.push(...recommendations.career[`high_${dim}`]);
            }
            if (recommendations.hobby[`high_${dim}`]) {
                hobbyRecommendations.push(...recommendations.hobby[`high_${dim}`]);
            }
        } else if (score < 30) {
            if (recommendations.career[`low_${dim}`]) {
                careerRecommendations.push(...recommendations.career[`low_${dim}`]);
            }
            if (recommendations.hobby[`low_${dim}`]) {
                hobbyRecommendations.push(...recommendations.hobby[`low_${dim}`]);
            }
        }
    });
    
    resultPage.innerHTML = `
        <div class="text-center mb-8 animate__animated animate__fadeInDown">
            <h2 class="text-3xl md:text-4xl font-bold mb-4">你的人格分析报告</h2>
            <p class="text-gray-400">探索你的内心宇宙，发现未知的自己</p>
        </div>
        
        <div class="glass-card rounded-2xl p-6 mb-8 animate__animated animate__fadeIn">
            <h3 class="text-xl font-bold mb-4">核心特质</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                ${topDimensions.map(([dim, score]) => {
                    const dimensionInfo = dimensions[currentTestMode].find(d => d.id === dim);
                    return `
                        <div class="bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-4 rounded-xl text-center">
                            <div class="text-3xl mb-2">${dimensionInfo.icon}</div>
                            <h4 class="font-bold mb-1">${dimensionInfo.name}</h4>
                            <div class="text-2xl font-bold text-purple-400">${score}%</div>
                            <div class="text-xs text-gray-500">${dimensionInfo.desc}</div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div class="glass-card rounded-2xl p-6 animate__animated animate__fadeInLeft">
                <h3 class="text-xl font-bold mb-4 flex items-center gap-2">
                    <i class="fas fa-briefcase text-blue-400"></i> 职业推荐
                </h3>
                <ul class="space-y-2">
                    ${careerRecommendations.slice(0, 5).map(career => `
                        <li class="flex items-center gap-2 text-gray-300">
                            <i class="fas fa-check text-green-400"></i>
                            ${career}
                        </li>
                    `).join('')}
                </ul>
            </div>
            
            <div class="glass-card rounded-2xl p-6 animate__animated animate__fadeInRight">
                <h3 class="text-xl font-bold mb-4 flex items-center gap-2">
                    <i class="fas fa-heart text-pink-400"></i> 兴趣推荐
                </h3>
                <ul class="space-y-2">
                    ${hobbyRecommendations.slice(0, 5).map(hobby => `
                        <li class="flex items-center gap-2 text-gray-300">
                            <i class="fas fa-star text-yellow-400"></i>
                            ${hobby}
                        </li>
                    `).join('')}
                </ul>
            </div>
        </div>
        
        <div class="glass-card rounded-2xl p-6 animate__animated animate__fadeInUp">
            <h3 class="text-xl font-bold mb-4">详细维度分析</h3>
            <div class="space-y-4">
                ${Object.entries(dimensionScores).map(([dim, score]) => {
                    const dimensionInfo = dimensions[currentTestMode].find(d => d.id === dim);
                    return `
                        <div>
                            <div class="flex justify-between mb-2">
                                <span class="flex items-center gap-2">
                                    <span>${dimensionInfo.icon}</span>
                                    <span>${dimensionInfo.name}</span>
                                </span>
                                <span>${score}%</span>
                            </div>
                            <div class="w-full bg-gray-800/50 rounded-full h-2 overflow-hidden">
                                <div class="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500" style="width: ${score}%"></div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
        
        <div class="text-center mt-8 animate__animated animate__fadeIn space-y-4">
            <div class="flex flex-wrap justify-center gap-4">
                <button onclick="shareResults()" class="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl font-bold hover:opacity-90 transition-all">
                    分享结果 <i class="fas fa-share-alt ml-2"></i>
                </button>
                <button onclick="backToHome()" class="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold hover:opacity-90 transition-all">
                    返回首页 <i class="fas fa-home ml-2"></i>
                </button>
            </div>
        </div>
    `;
}

export function confirmSaveAndExit() {
    saveProgress({
        mode: currentTestMode,
        index: currentQuestionIndex,
        answers: userAnswers,
        scores: dimensionScores
    });
    
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-green-500/90 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate__animated animate__fadeInRight';
    toast.innerHTML = '<i class="fas fa-check-circle mr-2"></i> 进度已保存！';
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.remove('animate__fadeInRight');
        toast.classList.add('animate__fadeOutRight');
        setTimeout(() => toast.remove(), 500);
    }, 2000);
    
    setTimeout(() => location.reload(), 1000);
}

export function startMiniTest(type) {
    currentMiniTestType = type;
    currentMiniQuestionIndex = 0;
    miniTestUserAnswers = {};
    
    const miniTestPage = document.getElementById('mini-test-page');
    miniTestPage.classList.remove('hidden');
    document.getElementById('home-page').classList.add('hidden');
    
    renderMiniQuestion();
}

export function renderMiniQuestion() {
    const miniTest = miniTests[currentMiniTestType];
    const question = miniTest.questions[currentMiniQuestionIndex];
    
    document.getElementById('mini-test-title').textContent = miniTest.title;
    
    const content = document.getElementById('mini-test-content');
    content.innerHTML = `
        <div class="mb-6">
            <h3 class="text-lg font-bold mb-4">${question.text}</h3>
            <div class="space-y-3">
                ${question.options.map((opt, idx) => `
                    <div class="option-item glass-card p-3 rounded-xl cursor-pointer hover:bg-white/10 transition-all" onclick="selectMiniOption(${idx})">
                        <div class="flex items-center gap-3">
                            <span class="text-2xl">${opt.emoji}</span>
                            <span>${opt.text}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        ${currentMiniQuestionIndex < miniTest.questions.length - 1 ? `
            <button onclick="nextMiniQuestion()" class="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold hover:opacity-90 transition-all">
                下一题 <i class="fas fa-arrow-right ml-2"></i>
            </button>
        ` : `
            <button onclick="showMiniTestResult()" class="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold hover:opacity-90 transition-all">
                查看结果 <i class="fas fa-chart-pie ml-2"></i>
            </button>
        `}
    `;
}

export function selectMiniOption(idx) {
    miniTestUserAnswers[currentMiniQuestionIndex] = idx;
    
    anime({
        targets: `.option-item:nth-child(${idx + 1})`,
        scale: [1, 1.02, 1],
        duration: 300,
        easing: 'easeInOutQuad'
    });
}

export function nextMiniQuestion() {
    if (miniTestUserAnswers[currentMiniQuestionIndex] === undefined) return;
    
    currentMiniQuestionIndex++;
    renderMiniQuestion();
}

export function showMiniTestResult() {
    if (miniTestUserAnswers[currentMiniQuestionIndex] === undefined) return;
    
    const miniTest = miniTests[currentMiniTestType];
    const answers = Object.values(miniTestUserAnswers).map(idx => miniTest.questions[idx].options[idx].value);
    
    const resultCounts = {};
    answers.forEach(answer => {
        resultCounts[answer] = (resultCounts[answer] || 0) + 1;
    });
    
    const finalResult = Object.entries(resultCounts)
        .sort((a, b) => b[1] - a[1])[0][0];
    
    const resultInfo = miniTest.meanings[finalResult];
    
    const content = document.getElementById('mini-test-content');
    content.innerHTML = `
        <div class="text-center">
            <div class="text-6xl mb-4">${resultInfo.emoji || finalResult}</div>
            <h3 class="text-2xl font-bold mb-4">${finalResult}</h3>
            <p class="text-gray-300 mb-6">${resultInfo.desc}</p>
            ${resultInfo.color ? `
                <div class="w-20 h-20 rounded-full mx-auto mb-6" style="background-color: ${resultInfo.color}"></div>
            ` : ''}
            <button onclick="backToHome()" class="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold hover:opacity-90 transition-all">
                返回首页 <i class="fas fa-home ml-2"></i>
            </button>
        </div>
    `;
}

export function backToHome() {
    document.getElementById('test-page').classList.add('hidden');
    document.getElementById('result-page').classList.add('hidden');
    document.getElementById('mini-test-page').classList.add('hidden');
    document.getElementById('control-panel-page').classList.add('hidden');
    document.getElementById('home-page').classList.remove('hidden');
}

export function shareResults() {
    const topDimensions = Object.entries(dimensionScores)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);
    
    const topTraits = topDimensions.map(([dim, score]) => {
        const dimensionInfo = dimensions[currentTestMode].find(d => d.id === dim);
        return `${dimensionInfo.name}: ${score}%`;
    }).join('\n');
    
    const shareText = `我的MBTI人格测试结果：\n\n${topTraits}\n\n来测试你的人格类型吧！`;
    const shareUrl = window.location.origin + window.location.pathname;
    
    if (navigator.share) {
        navigator.share({
            title: '我的MBTI人格测试结果',
            text: shareText,
            url: shareUrl
        }).catch(err => {
            console.log('分享失败:', err);
            copyShareLink(shareText, shareUrl);
        });
    } else {
        copyShareLink(shareText, shareUrl);
    }
}

function copyShareLink(text, url) {
    const shareContent = `${text}\n\n测试链接: ${url}`;
    
    navigator.clipboard.writeText(shareContent).then(() => {
        const toast = document.createElement('div');
        toast.className = 'fixed top-4 right-4 bg-green-500/90 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate__animated animate__fadeInRight';
        toast.innerHTML = '<i class="fas fa-check-circle mr-2"></i> 分享链接已复制到剪贴板！';
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.remove('animate__fadeInRight');
            toast.classList.add('animate__fadeOutRight');
            setTimeout(() => toast.remove(), 500);
        }, 2000);
    }).catch(err => {
        console.error('复制失败:', err);
        alert('复制失败，请手动复制链接');
    });
}

// 打开控制面板
export function openControlPanel() {
    document.getElementById('home-page').classList.add('hidden');
    document.getElementById('control-panel-page').classList.remove('hidden');
    
    renderSettings();
    renderHistory();
    renderStorageInfo();
}

// 渲染设置项
function renderSettings() {
    const settings = loadSettings();
    const container = document.getElementById('settings-container');
    
    const settingsItems = [
        {
            id: 'soundEnabled',
            label: '音效',
            description: '启用测试过程中的音效',
            type: 'toggle',
            value: settings.soundEnabled
        },
        {
            id: 'animationEnabled',
            label: '动画效果',
            description: '启用页面动画效果',
            type: 'toggle',
            value: settings.animationEnabled
        },
        {
            id: 'darkMode',
            label: '深色模式',
            description: '使用深色主题',
            type: 'toggle',
            value: settings.darkMode
        }
    ];
    
    container.innerHTML = settingsItems.map(item => `
        <div class="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div>
                <h4 class="font-bold">${item.label}</h4>
                <p class="text-sm text-gray-400">${item.description}</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" class="sr-only peer" id="${item.id}" ${item.value ? 'checked' : ''} onchange="toggleSetting('${item.id}')">
                <div class="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
            </label>
        </div>
    `).join('');
}

// 切换设置
export function toggleSetting(key) {
    const checkbox = document.getElementById(key);
    const settings = loadSettings();
    settings[key] = checkbox.checked;
    saveSettings(settings);
    
    // 显示保存成功提示
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-green-500/90 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate__animated animate__fadeInRight';
    toast.innerHTML = '<i class="fas fa-check-circle mr-2"></i> 设置已保存！';
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.remove('animate__fadeInRight');
        toast.classList.add('animate__fadeOutRight');
        setTimeout(() => toast.remove(), 500);
    }, 2000);
}

// 渲染测试历史
function renderHistory() {
    const history = loadTestHistory();
    const container = document.getElementById('history-container');
    
    if (history.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8 text-gray-400">
                <div class="text-4xl mb-4">📋</div>
                <p>暂无测试历史记录</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = history.map(entry => {
        const date = new Date(entry.timestamp);
        return `
            <div class="p-4 bg-white/5 rounded-xl">
                <div class="flex justify-between items-center mb-2">
                    <h4 class="font-bold">${entry.mode === 'quick' ? '闪电模式' : entry.mode === 'standard' ? '标准模式' : '专家模式'}</h4>
                    <span class="text-sm text-gray-400">${date.toLocaleString()}</span>
                </div>
                <div class="grid grid-cols-3 gap-2 mb-2">
                    ${entry.topDimensions.map(dim => `
                        <div class="text-center p-2 bg-white/5 rounded-lg">
                            <div class="text-xl mb-1">${dim.icon}</div>
                            <div class="text-xs font-bold">${dim.name}</div>
                            <div class="text-xs text-purple-400">${dim.score}%</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }).join('');
}

// 渲染存储信息
function renderStorageInfo() {
    const usage = getStorageUsage();
    const container = document.getElementById('storage-info');
    
    if (usage) {
        container.innerHTML = `
            <div class="flex justify-between items-center mb-2">
                <span>存储使用量</span>
                <span>${(usage.used / 1024).toFixed(2)}KB / 5MB</span>
            </div>
            <div class="w-full bg-gray-800/50 rounded-full h-2 overflow-hidden">
                <div class="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500" style="width: ${usage.percentage}%"></div>
            </div>
            <div class="mt-2 text-sm text-gray-400">
                <p>测试历史记录: ${loadTestHistory().length} 条</p>
                <p>本地设置: 已保存</p>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="text-center py-4 text-gray-400">
                <p>无法获取存储信息</p>
            </div>
        `;
    }
}

// 处理数据导入
export function handleImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const result = importData(e.target.result);
            if (result) {
                const toast = document.createElement('div');
                toast.className = 'fixed top-4 right-4 bg-green-500/90 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate__animated animate__fadeInRight';
                toast.innerHTML = '<i class="fas fa-check-circle mr-2"></i> 数据导入成功！';
                document.body.appendChild(toast);
                
                setTimeout(() => {
                    toast.classList.remove('animate__fadeInRight');
                    toast.classList.add('animate__fadeOutRight');
                    setTimeout(() => toast.remove(), 500);
                }, 2000);
                
                // 重新渲染控制面板
                setTimeout(() => {
                    renderSettings();
                    renderHistory();
                    renderStorageInfo();
                }, 500);
            } else {
                alert('数据导入失败，请检查文件格式');
            }
        } catch (error) {
            alert('数据导入失败: ' + error.message);
        }
    };
    reader.readAsText(file);
    
    // 重置文件输入
    event.target.value = '';
}

// 清除所有数据
export function clearAllUserData() {
    if (confirm('确定要清除所有数据吗？此操作不可恢复！')) {
        const result = window.clearAllData();
        if (result) {
            const toast = document.createElement('div');
            toast.className = 'fixed top-4 right-4 bg-green-500/90 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate__animated animate__fadeInRight';
            toast.innerHTML = '<i class="fas fa-check-circle mr-2"></i> 所有数据已清除！';
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.classList.remove('animate__fadeInRight');
                toast.classList.add('animate__fadeOutRight');
                setTimeout(() => toast.remove(), 500);
            }, 2000);
            
            // 重新渲染控制面板
            setTimeout(() => {
                renderSettings();
                renderHistory();
                renderStorageInfo();
            }, 500);
        } else {
            alert('清除数据失败');
        }
    }
}