const STORAGE_KEY = 'personality_test_v2';
const HISTORY_KEY = 'personality_test_history';
const SETTINGS_KEY = 'personality_test_settings';
const EXPIRY_TIME = 7 * 24 * 60 * 60 * 1000; // 7天过期

// 检查并清理过期数据
function checkExpiry() {
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

// 检查存储大小
function checkStorageSize(data) {
    const dataSize = new Blob([JSON.stringify(data)]).size;
    const maxSize = 50 * 1024; // 50KB 上限
    return dataSize < maxSize;
}

function saveProgress(data) {
    const saveData = {
        mode: data.mode,
        index: data.index,
        answers: data.answers,
        scores: data.scores || {},
        timestamp: Date.now()
    };
    
    if (checkStorageSize(saveData)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
        return true;
    }
    return false;
}

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

function clearProgress() {
    localStorage.removeItem(STORAGE_KEY);
}

function checkResumeProgress() {
    const progress = loadProgress();
    if (progress) {
        const card = document.getElementById('resume-card');
        const info = document.getElementById('resume-info');
        const date = new Date(progress.timestamp);
        info.textContent = `上次进度：${progress.mode === 'quick' ? '闪电' : progress.mode === 'standard' ? '标准' : '专家'}模式 - 第 ${progress.index + 1} 题 (${date.toLocaleString()})`;
        card.classList.remove('hidden');
        card.classList.add('animate__animated', 'animate__fadeIn');
    } else {
        const card = document.getElementById('resume-card');
        if (card) {
            card.classList.add('hidden');
        }
    }
}

function resumeTest() {
    return loadProgress();
}

function clearSavedData() {
    clearProgress();
    const card = document.getElementById('resume-card');
    if (card) {
        card.classList.add('hidden');
    }
}

// 保存测试历史
function saveTestHistory(result) {
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
        // 只保留最近10条记录
        if (history.length > 10) {
            history.splice(10);
        }
        
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (e) {
        console.error('保存测试历史失败:', e);
    }
}

// 加载测试历史
function loadTestHistory() {
    try {
        const data = localStorage.getItem(HISTORY_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('加载测试历史失败:', e);
        return [];
    }
}

// 清除测试历史
function clearTestHistory() {
    localStorage.removeItem(HISTORY_KEY);
}

// 导出数据
function exportData() {
    try {
        const data = {
            progress: loadProgress(),
            history: loadTestHistory(),
            settings: loadSettings(),
            exportTime: Date.now()
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `personality-test-backup-${new Date().toISOString().slice(0, 10)}.json`;
        link.click();
        URL.revokeObjectURL(url);
        return true;
    } catch (e) {
        console.error('导出数据失败:', e);
        return false;
    }
}

// 导入数据
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

// 加载设置
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

// 保存设置
function saveSettings(settings) {
    try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        return true;
    } catch (e) {
        console.error('保存设置失败:', e);
        return false;
    }
}

// 清除所有数据
function clearAllData() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(HISTORY_KEY);
        localStorage.removeItem(SETTINGS_KEY);
        return true;
    } catch (e) {
        console.error('清除数据失败:', e);
        return false;
    }
}

// 获取存储使用情况
function getStorageUsage() {
    try {
        let totalSize = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                totalSize += localStorage[key].length;
            }
        }
        return {
            used: totalSize,
            total: 5 * 1024 * 1024, // 5MB 浏览器默认限制
            percentage: (totalSize / (5 * 1024 * 1024)) * 100
        };
    } catch (e) {
        console.error('获取存储使用情况失败:', e);
        return null;
    }
}

// 暴露函数到全局
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
window.loadSettings = loadSettings;
window.saveSettings = saveSettings;
window.clearAllData = clearAllData;
window.getStorageUsage = getStorageUsage;