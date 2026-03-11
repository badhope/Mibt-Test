/**
 * @fileoverview 本地存储管理模块
 * @description 提供测试进度、历史记录和设置的本地存储功能
 * @version 1.1.0
 */

const STORAGE_KEY = 'personality_test_v2';
const HISTORY_KEY = 'personality_test_history';
const SETTINGS_KEY = 'personality_test_settings';
const EXPIRY_TIME = 7 * 24 * 60 * 60 * 1000;

/**
 * 检查localStorage是否可用
 * @returns {boolean}
 */
function isStorageAvailable() {
    try {
        const testKey = '__storage_test__';
        localStorage.setItem(testKey, testKey);
        localStorage.removeItem(testKey);
        return true;
    } catch (e) {
        return false;
    }
}

/**
 * 检查并清理过期数据
 * @returns {boolean}
 */
function checkExpiry() {
    if (!isStorageAvailable()) {
        return false;
    }
    
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
        try {
            const parsedData = JSON.parse(data);
            if (Date.now() - parsedData.timestamp > EXPIRY_TIME) {
                localStorage.removeItem(STORAGE_KEY);
                return false;
            }
            return true;
        } catch (e) {
            localStorage.removeItem(STORAGE_KEY);
            return false;
        }
    }
    return false;
}

/**
 * 检查存储大小
 * @param {Object} data - 要存储的数据
 * @returns {boolean}
 */
function checkStorageSize(data) {
    try {
        const dataSize = new Blob([JSON.stringify(data)]).size;
        const maxSize = 50 * 1024;
        return dataSize < maxSize;
    } catch (e) {
        return false;
    }
}

/**
 * 保存测试进度
 * @param {Object} data - 进度数据
 * @param {string} data.mode - 测试模式
 * @param {number} data.index - 当前题目索引
 * @param {Object} data.answers - 答案对象
 * @param {Object} [data.scores] - 分数对象
 * @returns {boolean} 是否保存成功
 */
function saveProgress(data) {
    if (!isStorageAvailable()) {
        console.warn('localStorage不可用，无法保存进度');
        return false;
    }
    
    try {
        const saveData = {
            mode: data.mode,
            index: data.index,
            answers: data.answers,
            scores: data.scores || {},
            timestamp: Date.now()
        };
        
        if (!checkStorageSize(saveData)) {
            console.warn('数据过大，无法保存');
            return false;
        }
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
        return true;
    } catch (e) {
        if (e.name === 'QuotaExceededError') {
            console.error('存储空间已满');
            if (typeof showToast === 'function') {
                showToast('本地存储空间已满，请清理部分数据', 'warning');
            }
        } else {
            console.error('保存进度失败:', e);
        }
        return false;
    }
}

/**
 * 加载测试进度
 * @returns {Object|null} 进度数据或null
 */
function loadProgress() {
    if (!checkExpiry()) {
        return null;
    }
    
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
        try {
            return JSON.parse(data);
        } catch (e) {
            localStorage.removeItem(STORAGE_KEY);
            return null;
        }
    }
    return null;
}

/**
 * 清除测试进度
 */
function clearProgress() {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
        console.error('清除进度失败:', e);
    }
}

/**
 * 检查是否有可恢复的进度
 */
function checkResumeProgress() {
    const progress = loadProgress();
    if (progress) {
        const card = document.getElementById('resume-card');
        const info = document.getElementById('resume-info');
        if (card && info) {
            const date = new Date(progress.timestamp);
            const modeNames = { quick: '闪电', standard: '标准', expert: '专家' };
            info.textContent = `上次进度：${modeNames[progress.mode] || progress.mode}模式 - 第 ${progress.index + 1} 题 (${date.toLocaleString()})`;
            card.classList.remove('hidden');
            card.classList.add('animate__animated', 'animate__fadeIn');
        }
    } else {
        const card = document.getElementById('resume-card');
        if (card) {
            card.classList.add('hidden');
        }
    }
}

/**
 * 恢复测试
 * @returns {Object|null}
 */
function resumeTest() {
    return loadProgress();
}

/**
 * 清除保存的数据
 */
function clearSavedData() {
    clearProgress();
    const card = document.getElementById('resume-card');
    if (card) {
        card.classList.add('hidden');
    }
}

/**
 * 保存测试历史
 * @param {Object} result - 测试结果
 * @param {string} result.mode - 测试模式
 * @param {Object} result.scores - 分数对象
 * @param {Array} result.topDimensions - 顶级维度数组
 * @returns {boolean}
 */
function saveTestHistory(result) {
    if (!isStorageAvailable()) {
        console.warn('localStorage不可用，无法保存历史');
        return false;
    }
    
    try {
        const history = loadTestHistory();
        const newEntry = {
            id: Date.now(),
            timestamp: Date.now(),
            mode: result.mode,
            scores: result.scores,
            topDimensions: result.topDimensions
        };
        
        history.unshift(newEntry);
        
        if (history.length > 10) {
            history.splice(10);
        }
        
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
        return true;
    } catch (e) {
        if (e.name === 'QuotaExceededError') {
            console.error('存储空间已满，无法保存历史');
        } else {
            console.error('保存测试历史失败:', e);
        }
        return false;
    }
}

/**
 * 加载测试历史
 * @returns {Array}
 */
function loadTestHistory() {
    try {
        const data = localStorage.getItem(HISTORY_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('加载测试历史失败:', e);
        return [];
    }
}

/**
 * 清除测试历史
 */
function clearTestHistory() {
    try {
        localStorage.removeItem(HISTORY_KEY);
    } catch (e) {
        console.error('清除测试历史失败:', e);
    }
}

/**
 * 导出数据
 * @returns {boolean}
 */
function exportData() {
    try {
        const data = {
            progress: loadProgress(),
            history: loadTestHistory(),
            settings: loadSettings(),
            exportTime: Date.now(),
            version: '3.1.0'
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `personality-test-backup-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        if (typeof showToast === 'function') {
            showToast('数据导出成功', 'success');
        }
        return true;
    } catch (e) {
        console.error('导出数据失败:', e);
        if (typeof showToast === 'function') {
            showToast('导出失败，请重试', 'error');
        }
        return false;
    }
}

/**
 * 处理导入文件
 * @param {Event} event - 文件输入事件
 */
function handleImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const success = importData(e.target.result);
            if (success) {
                if (typeof showToast === 'function') {
                    showToast('数据导入成功', 'success');
                }
                setTimeout(() => window.location.reload(), 1000);
            } else {
                if (typeof showToast === 'function') {
                    showToast('数据格式无效', 'error');
                }
            }
        } catch (err) {
            console.error('导入失败:', err);
            if (typeof showToast === 'function') {
                showToast('导入失败，请检查文件格式', 'error');
            }
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

/**
 * 导入数据
 * @param {string} jsonData - JSON字符串
 * @returns {boolean}
 */
function importData(jsonData) {
    try {
        const data = JSON.parse(jsonData);
        
        if (data.progress) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data.progress));
        }
        
        if (data.history) {
            localStorage.setItem(HISTORY_KEY, JSON.stringify(data.history));
        }
        
        if (data.settings) {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(data.settings));
        }
        
        return true;
    } catch (e) {
        console.error('导入数据失败:', e);
        return false;
    }
}

/**
 * 加载设置
 * @returns {Object}
 */
function loadSettings() {
    try {
        const data = localStorage.getItem(SETTINGS_KEY);
        return data ? JSON.parse(data) : {
            soundEnabled: true,
            animationEnabled: true,
            darkMode: true
        };
    } catch (e) {
        console.error('加载设置失败:', e);
        return {
            soundEnabled: true,
            animationEnabled: true,
            darkMode: true
        };
    }
}

/**
 * 保存设置
 * @param {Object} settings - 设置对象
 * @returns {boolean}
 */
function saveSettings(settings) {
    try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        return true;
    } catch (e) {
        console.error('保存设置失败:', e);
        return false;
    }
}

/**
 * 清除所有数据
 * @returns {boolean}
 */
function clearAllData() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(HISTORY_KEY);
        localStorage.removeItem(SETTINGS_KEY);
        localStorage.removeItem('guest_info');
        return true;
    } catch (e) {
        console.error('清除数据失败:', e);
        return false;
    }
}

/**
 * 获取存储使用情况
 * @returns {Object|null}
 */
function getStorageUsage() {
    try {
        let totalSize = 0;
        for (const key in localStorage) {
            if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
                totalSize += localStorage[key].length * 2;
            }
        }
        
        const total = 5 * 1024 * 1024;
        return {
            used: totalSize,
            total: total,
            percentage: (totalSize / total) * 100,
            available: true
        };
    } catch (e) {
        console.error('获取存储使用情况失败:', e);
        return { used: 0, total: 0, percentage: 0, available: false };
    }
}

window.saveProgress = saveProgress;
window.loadProgress = loadProgress;
window.clearProgress = clearProgress;
window.checkResumeProgress = checkResumeProgress;
window.resumeTest = resumeTest;
window.clearSavedData = clearSavedData;
window.saveTestHistory = saveTestHistory;
window.loadTestHistory = loadTestHistory;
window.clearTestHistory = clearTestHistory;
window.exportData = exportData;
window.importData = importData;
window.handleImport = handleImport;
window.loadSettings = loadSettings;
window.saveSettings = saveSettings;
window.clearAllData = clearAllData;
window.getStorageUsage = getStorageUsage;
