/**
 * 本地存储服务
 * 封装 localStorage 和 IndexedDB 操作
 */
export class StorageService {
    constructor(prefix = 'mbti_') {
        this.prefix = prefix;
    }

    /**
   * 获取存储项
   * @param {string} key - 键名
   * @returns {any} 存储的值
   */
    get(key) {
        try {
            const item = localStorage.getItem(`${this.prefix}${key}`);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('StorageService.get error:', error);
            return null;
        }
    }

    /**
   * 设置存储项
   * @param {string} key - 键名
   * @param {any} value - 存储的值
   * @returns {boolean} 是否成功
   */
    set(key, value) {
        try {
            localStorage.setItem(`${this.prefix}${key}`, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('StorageService.set error:', error);
            return false;
        }
    }

    /**
   * 删除存储项
   * @param {string} key - 键名
   * @returns {boolean} 是否成功
   */
    remove(key) {
        try {
            localStorage.removeItem(`${this.prefix}${key}`);
            return true;
        } catch (error) {
            console.error('StorageService.remove error:', error);
            return false;
        }
    }

    /**
   * 清空所有存储
   * @returns {boolean} 是否成功
   */
    clear() {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(this.prefix)) {
                    localStorage.removeItem(key);
                }
            });
            return true;
        } catch (error) {
            console.error('StorageService.clear error:', error);
            return false;
        }
    }

    /**
   * 保存测试进度
   * @param {string} testId - 测试 ID
   * @param {Object} progress - 进度数据
   */
    saveTestProgress(testId, progress) {
        return this.set(`test_progress_${testId}`, {
            ...progress,
            savedAt: new Date().toISOString(),
        });
    }

    /**
   * 获取测试进度
   * @param {string} testId - 测试 ID
   * @returns {Object|null} 进度数据
   */
    getTestProgress(testId) {
        return this.get(`test_progress_${testId}`);
    }

    /**
   * 保存测试结果
   * @param {string} testId - 测试 ID
   * @param {Object} result - 结果数据
   */
    saveTestResult(testId, result) {
        return this.set(`test_result_${testId}`, {
            ...result,
            completedAt: new Date().toISOString(),
        });
    }

    /**
   * 获取所有测试结果
   * @returns {Array} 结果数组
   */
    getAllTestResults() {
        const results = [];
        const keys = Object.keys(localStorage);

        keys.forEach(key => {
            if (key.startsWith(`${this.prefix}test_result_`)) {
                try {
                    const item = localStorage.getItem(key);
                    if (item) {
                        results.push(JSON.parse(item));
                    }
                } catch (error) {
                    console.error('Error parsing test result:', error);
                }
            }
        });

        return results.sort((a, b) => {
            return new Date(b.completedAt) - new Date(a.completedAt);
        });
    }

    /**
   * 检查是否支持 localStorage
   * @returns {boolean} 是否支持
   */
    static isSupported() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (error) {
            return false;
        }
    }
}
