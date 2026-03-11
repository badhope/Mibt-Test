/**
 * @fileoverview 公共工具函数模块
 * @description 提供项目中通用的工具函数，避免代码重复
 * @version 1.0.0
 * @author BadHope
 */

/**
 * Toast消息类型枚举
 * @readonly
 * @enum {string}
 */
const ToastType = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
};

/**
 * 显示Toast提示消息
 * @param {string} message - 要显示的消息内容
 * @param {ToastType|string} [type='success'] - 消息类型：success, error, warning, info
 * @param {number} [duration=2000] - 显示持续时间（毫秒）
 * @returns {void}
 * @example
 * showToast('操作成功', 'success');
 * showToast('操作失败', 'error', 3000);
 */
function showToast(message, type = ToastType.SUCCESS, duration = 2000) {
    const toast = document.createElement('div');
    
    const typeConfig = {
        [ToastType.SUCCESS]: { bg: 'bg-green-500/90', icon: 'check' },
        [ToastType.ERROR]: { bg: 'bg-red-500/90', icon: 'exclamation' },
        [ToastType.WARNING]: { bg: 'bg-yellow-500/90', icon: 'exclamation-triangle' },
        [ToastType.INFO]: { bg: 'bg-blue-500/90', icon: 'info' }
    };
    
    const config = typeConfig[type] || typeConfig[ToastType.SUCCESS];
    
    toast.className = `fixed top-4 right-4 px-6 py-3 rounded-xl shadow-lg z-50 animate__animated animate__fadeInRight ${config.bg} text-white`;
    toast.innerHTML = `<i class="fas fa-${config.icon}-circle mr-2"></i>${escapeHtml(message)}`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.remove('animate__fadeInRight');
        toast.classList.add('animate__fadeOutRight');
        setTimeout(() => toast.remove(), 500);
    }, duration);
}

/**
 * 格式化时间戳为相对时间字符串
 * @param {number} timestamp - 时间戳（毫秒）
 * @returns {string} 格式化后的时间字符串
 * @example
 * formatTime(Date.now() - 60000); // "1分钟前"
 * formatTime(Date.now() - 3600000); // "1小时前"
 */
function formatTime(timestamp) {
    if (!timestamp || typeof timestamp !== 'number') {
        return '未知时间';
    }
    
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 0) return '刚刚';
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    if (days < 30) return `${Math.floor(days / 7)}周前`;
    if (days < 365) return `${Math.floor(days / 30)}个月前`;
    
    return date.toLocaleDateString('zh-CN');
}

/**
 * HTML转义函数，防止XSS攻击
 * @param {string} text - 需要转义的文本
 * @returns {string} 转义后的安全文本
 * @example
 * escapeHtml('<script>alert("xss")</script>'); // "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;"
 */
function escapeHtml(text) {
    if (typeof text !== 'string') {
        return '';
    }
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * 生成唯一ID
 * @param {string} [prefix=''] - ID前缀
 * @returns {string} 唯一ID字符串
 * @example
 * generateId('user'); // "user_1699999999999_abc123def"
 */
function generateId(prefix = '') {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 11);
    return prefix ? `${prefix}_${timestamp}_${random}` : `${timestamp}_${random}`;
}

/**
 * 安全获取localStorage数据
 * @param {string} key - 存储键名
 * @param {*} [defaultValue=null] - 默认值
 * @returns {*} 解析后的数据或默认值
 */
function safeGetItem(key, defaultValue = null) {
    try {
        const data = localStorage.getItem(key);
        if (data === null) return defaultValue;
        return JSON.parse(data);
    } catch (error) {
        console.error(`读取localStorage失败 [${key}]:`, error);
        return defaultValue;
    }
}

/**
 * 安全设置localStorage数据
 * @param {string} key - 存储键名
 * @param {*} value - 要存储的值
 * @returns {boolean} 是否存储成功
 */
function safeSetItem(key, value) {
    try {
        const data = JSON.stringify(value);
        const size = new Blob([data]).size;
        
        if (size > 5 * 1024 * 1024) {
            console.warn(`数据过大，无法存储 [${key}]: ${size} bytes`);
            return false;
        }
        
        localStorage.setItem(key, data);
        return true;
    } catch (error) {
        if (error.name === 'QuotaExceededError') {
            console.error('localStorage存储空间已满');
            showToast('本地存储空间已满，请清理部分数据', ToastType.WARNING);
        } else {
            console.error(`写入localStorage失败 [${key}]:`, error);
        }
        return false;
    }
}

/**
 * 安全删除localStorage数据
 * @param {string} key - 存储键名
 * @returns {boolean} 是否删除成功
 */
function safeRemoveItem(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error(`删除localStorage失败 [${key}]:`, error);
        return false;
    }
}

/**
 * 检查localStorage是否可用
 * @returns {boolean} localStorage是否可用
 */
function isLocalStorageAvailable() {
    try {
        const testKey = '__storage_test__';
        localStorage.setItem(testKey, testKey);
        localStorage.removeItem(testKey);
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * 获取localStorage使用情况
 * @returns {{used: number, total: number, percentage: number, available: boolean}} 存储使用情况
 */
function getStorageUsage() {
    if (!isLocalStorageAvailable()) {
        return { used: 0, total: 0, percentage: 0, available: false };
    }
    
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
    } catch (error) {
        console.error('获取存储使用情况失败:', error);
        return { used: 0, total: 0, percentage: 0, available: false };
    }
}

/**
 * 防抖函数
 * @param {Function} func - 需要防抖的函数
 * @param {number} [wait=300] - 等待时间（毫秒）
 * @returns {Function} 防抖后的函数
 */
function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * 节流函数
 * @param {Function} func - 需要节流的函数
 * @param {number} [limit=300] - 时间限制（毫秒）
 * @returns {Function} 节流后的函数
 */
function throttle(func, limit = 300) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * 深拷贝对象
 * @param {*} obj - 需要拷贝的对象
 * @returns {*} 拷贝后的新对象
 */
function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    
    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }
    
    if (obj instanceof Array) {
        return obj.map(item => deepClone(item));
    }
    
    if (obj instanceof Object) {
        const copy = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                copy[key] = deepClone(obj[key]);
            }
        }
        return copy;
    }
    
    return obj;
}

/**
 * 检测设备类型
 * @returns {{isMobile: boolean, isTablet: boolean, isDesktop: boolean, isLowPerformance: boolean}} 设备信息
 */
function detectDevice() {
    const ua = navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const isTablet = /iPad|Android/i.test(ua) && !/Mobile/i.test(ua);
    const isDesktop = !isMobile && !isTablet;
    const isLowPerformance = isMobile || navigator.deviceMemory < 4 || navigator.hardwareConcurrency < 4;
    
    return { isMobile, isTablet, isDesktop, isLowPerformance };
}

/**
 * 复制文本到剪贴板
 * @param {string} text - 需要复制的文本
 * @returns {Promise<boolean>} 是否复制成功
 */
async function copyToClipboard(text) {
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
            return true;
        }
        
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textarea);
        return success;
    } catch (error) {
        console.error('复制失败:', error);
        return false;
    }
}

/**
 * 延迟执行
 * @param {number} ms - 延迟时间（毫秒）
 * @returns {Promise<void>}
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 格式化文件大小
 * @param {number} bytes - 字节数
 * @returns {string} 格式化后的大小字符串
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    
    const units = ['B', 'KB', 'MB', 'GB'];
    const k = 1024;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + units[i];
}

/**
 * 验证邮箱格式
 * @param {string} email - 邮箱地址
 * @returns {boolean} 是否为有效邮箱
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * 获取URL参数
 * @param {string} [name] - 参数名，不传则返回所有参数
 * @returns {string|Object|null} 参数值或参数对象
 */
function getUrlParams(name) {
    const params = new URLSearchParams(window.location.search);
    
    if (name) {
        return params.get(name);
    }
    
    const result = {};
    params.forEach((value, key) => {
        result[key] = value;
    });
    return result;
}

window.ToastType = ToastType;
window.showToast = showToast;
window.formatTime = formatTime;
window.escapeHtml = escapeHtml;
window.generateId = generateId;
window.safeGetItem = safeGetItem;
window.safeSetItem = safeSetItem;
window.safeRemoveItem = safeRemoveItem;
window.isLocalStorageAvailable = isLocalStorageAvailable;
window.getStorageUsage = getStorageUsage;
window.debounce = debounce;
window.throttle = throttle;
window.deepClone = deepClone;
window.detectDevice = detectDevice;
window.copyToClipboard = copyToClipboard;
window.delay = delay;
window.formatFileSize = formatFileSize;
window.isValidEmail = isValidEmail;
window.getUrlParams = getUrlParams;
