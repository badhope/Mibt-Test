/**
 * @fileoverview 测试运行器
 * @description 简单的测试框架，用于验证核心功能
 */

const fs = require('fs');
const path = require('path');

const testResults = {
    passed: 0,
    failed: 0,
    errors: []
};

function describe(suiteName, fn) {
    console.log(`\n📦 ${suiteName}`);
    console.log('─'.repeat(50));
    fn();
}

function it(testName, fn) {
    try {
        fn();
        testResults.passed++;
        console.log(`  ✅ ${testName}`);
    } catch (error) {
        testResults.failed++;
        testResults.errors.push({ testName, error: error.message });
        console.log(`  ❌ ${testName}`);
        console.log(`     Error: ${error.message}`);
    }
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message || 'Assertion failed');
    }
}

assert.equal = function(actual, expected, message) {
    if (actual !== expected) {
        throw new Error(message || `Expected ${expected}, but got ${actual}`);
    }
};

assert.typeOf = function(value, type, message) {
    if (typeof value !== type) {
        throw new Error(message || `Expected type ${type}, but got ${typeof value}`);
    }
};

assert.isArray = function(value, message) {
    if (!Array.isArray(value)) {
        throw new Error(message || 'Expected an array');
    }
};

assert.isObject = function(value, message) {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        throw new Error(message || 'Expected an object');
    }
};

assert.includes = function(haystack, needle, message) {
    if (!haystack.includes(needle)) {
        throw new Error(message || `Expected to include "${needle}"`);
    }
};

describe('数据模块测试', () => {
    const dataPath = path.join(__dirname, '..', 'js', 'data.js');
    const dataContent = fs.readFileSync(dataPath, 'utf8');
    
    it('应该定义dimensions对象', () => {
        assert.includes(dataContent, 'const dimensions', '缺少dimensions定义');
    });
    
    it('应该定义questions对象', () => {
        assert.includes(dataContent, 'const questions', '缺少questions定义');
    });
    
    it('应该定义miniTests对象', () => {
        assert.includes(dataContent, 'const miniTests', '缺少miniTests定义');
    });
    
    it('应该定义recommendations对象', () => {
        assert.includes(dataContent, 'const recommendations', '缺少recommendations定义');
    });
    
    it('应该包含quick模式数据', () => {
        assert.includes(dataContent, 'quick:', '缺少quick模式');
    });
    
    it('应该包含standard模式数据', () => {
        assert.includes(dataContent, 'standard:', '缺少standard模式');
    });
    
    it('应该包含expert模式数据', () => {
        assert.includes(dataContent, 'expert:', '缺少expert模式');
    });
});

describe('存储模块测试', () => {
    const storagePath = path.join(__dirname, '..', 'js', 'storage.js');
    const storageContent = fs.readFileSync(storagePath, 'utf8');
    
    it('应该定义saveProgress函数', () => {
        assert.includes(storageContent, 'function saveProgress', '缺少saveProgress函数');
    });
    
    it('应该定义loadProgress函数', () => {
        assert.includes(storageContent, 'function loadProgress', '缺少loadProgress函数');
    });
    
    it('应该定义clearProgress函数', () => {
        assert.includes(storageContent, 'function clearProgress', '缺少clearProgress函数');
    });
    
    it('应该定义saveTestHistory函数', () => {
        assert.includes(storageContent, 'function saveTestHistory', '缺少saveTestHistory函数');
    });
    
    it('应该定义loadTestHistory函数', () => {
        assert.includes(storageContent, 'function loadTestHistory', '缺少loadTestHistory函数');
    });
    
    it('应该定义getStorageUsage函数', () => {
        assert.includes(storageContent, 'function getStorageUsage', '缺少getStorageUsage函数');
    });
    
    it('应该有过期时间检查', () => {
        assert.includes(storageContent, 'EXPIRY_TIME', '缺少过期时间检查');
    });
});

describe('工具模块测试', () => {
    const utilsPath = path.join(__dirname, '..', 'js', 'utils.js');
    const utilsContent = fs.readFileSync(utilsPath, 'utf8');
    
    it('应该定义showToast函数', () => {
        assert.includes(utilsContent, 'function showToast', '缺少showToast函数');
    });
    
    it('应该定义formatTime函数', () => {
        assert.includes(utilsContent, 'function formatTime', '缺少formatTime函数');
    });
    
    it('应该定义escapeHtml函数', () => {
        assert.includes(utilsContent, 'function escapeHtml', '缺少escapeHtml函数');
    });
    
    it('应该定义generateId函数', () => {
        assert.includes(utilsContent, 'function generateId', '缺少generateId函数');
    });
    
    it('应该定义safeGetItem函数', () => {
        assert.includes(utilsContent, 'function safeGetItem', '缺少safeGetItem函数');
    });
    
    it('应该定义safeSetItem函数', () => {
        assert.includes(utilsContent, 'function safeSetItem', '缺少safeSetItem函数');
    });
    
    it('应该定义debounce函数', () => {
        assert.includes(utilsContent, 'function debounce', '缺少debounce函数');
    });
    
    it('应该定义throttle函数', () => {
        assert.includes(utilsContent, 'function throttle', '缺少throttle函数');
    });
    
    it('应该定义deepClone函数', () => {
        assert.includes(utilsContent, 'function deepClone', '缺少deepClone函数');
    });
    
    it('应该有JSDoc注释', () => {
        assert.includes(utilsContent, '@fileoverview', '缺少文件级JSDoc注释');
        assert.includes(utilsContent, '@param', '缺少参数JSDoc注释');
        assert.includes(utilsContent, '@returns', '缺少返回值JSDoc注释');
    });
});

describe('核心模块测试', () => {
    const corePath = path.join(__dirname, '..', 'js', 'core.js');
    const coreContent = fs.readFileSync(corePath, 'utf8');
    
    it('应该定义startTest函数', () => {
        assert.includes(coreContent, 'function startTest', '缺少startTest函数');
    });
    
    it('应该定义renderQuestion函数', () => {
        assert.includes(coreContent, 'function renderQuestion', '缺少renderQuestion函数');
    });
    
    it('应该定义selectOption函数', () => {
        assert.includes(coreContent, 'function selectOption', '缺少selectOption函数');
    });
    
    it('应该定义nextQuestion函数', () => {
        assert.includes(coreContent, 'function nextQuestion', '缺少nextQuestion函数');
    });
    
    it('应该定义prevQuestion函数', () => {
        assert.includes(coreContent, 'function prevQuestion', '缺少prevQuestion函数');
    });
    
    it('应该定义submitTest函数', () => {
        assert.includes(coreContent, 'function submitTest', '缺少submitTest函数');
    });
    
    it('应该定义showResults函数', () => {
        assert.includes(coreContent, 'function showResults', '缺少showResults函数');
    });
    
    it('应该有DOM初始化函数', () => {
        assert.includes(coreContent, 'function initDOM', '缺少initDOM函数');
    });
});

describe('HTML文件测试', () => {
    const indexPath = path.join(__dirname, '..', 'index.html');
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    
    it('应该有正确的DOCTYPE声明', () => {
        assert.includes(indexContent, '<!DOCTYPE html>', '缺少DOCTYPE声明');
    });
    
    it('应该设置正确的语言', () => {
        assert.includes(indexContent, 'lang="zh-CN"', '语言设置不正确');
    });
    
    it('应该引入utils.js', () => {
        assert.includes(indexContent, 'js/utils.js', '未引入utils.js');
    });
    
    it('应该引入所有必要的JS模块', () => {
        assert.includes(indexContent, 'js/data.js', '未引入data.js');
        assert.includes(indexContent, 'js/storage.js', '未引入storage.js');
        assert.includes(indexContent, 'js/core.js', '未引入core.js');
        assert.includes(indexContent, 'js/main.js', '未引入main.js');
    });
    
    it('应该有PWA manifest', () => {
        assert.includes(indexContent, 'manifest.json', '缺少PWA manifest引用');
    });
    
    it('应该有Service Worker注册', () => {
        assert.includes(indexContent, 'serviceWorker.register', '缺少Service Worker注册');
    });
});

describe('文件结构测试', () => {
    const rootPath = path.join(__dirname, '..');
    
    it('应该存在README.md', () => {
        const readmePath = path.join(rootPath, 'README.md');
        assert(fs.existsSync(readmePath), 'README.md不存在');
    });
    
    it('应该存在package.json', () => {
        const packagePath = path.join(rootPath, 'package.json');
        assert(fs.existsSync(packagePath), 'package.json不存在');
    });
    
    it('应该存在.eslintrc.json', () => {
        const eslintPath = path.join(rootPath, '.eslintrc.json');
        assert(fs.existsSync(eslintPath), '.eslintrc.json不存在');
    });
    
    it('应该存在manifest.json', () => {
        const manifestPath = path.join(rootPath, 'manifest.json');
        assert(fs.existsSync(manifestPath), 'manifest.json不存在');
    });
    
    it('应该存在service-worker.js', () => {
        const swPath = path.join(rootPath, 'service-worker.js');
        assert(fs.existsSync(swPath), 'service-worker.js不存在');
    });
    
    it('应该存在js目录', () => {
        const jsPath = path.join(rootPath, 'js');
        assert(fs.existsSync(jsPath) && fs.statSync(jsPath).isDirectory(), 'js目录不存在');
    });
    
    it('应该存在tests目录', () => {
        const testsPath = path.join(rootPath, 'tests');
        assert(fs.existsSync(testsPath) && fs.statSync(testsPath).isDirectory(), 'tests目录不存在');
    });
});

console.log('\n' + '═'.repeat(50));
console.log('📊 测试结果汇总');
console.log('═'.repeat(50));
console.log(`✅ 通过: ${testResults.passed}`);
console.log(`❌ 失败: ${testResults.failed}`);
console.log(`📝 总计: ${testResults.passed + testResults.failed}`);

if (testResults.failed > 0) {
    console.log('\n❌ 失败的测试:');
    testResults.errors.forEach(({ testName, error }) => {
        console.log(`   - ${testName}: ${error}`);
    });
    process.exit(1);
} else {
    console.log('\n🎉 所有测试通过！');
    process.exit(0);
}
