/**
 * @fileoverview 测试运行器
 * @description 简单的测试框架，用于验证核心功能
 * @version 2.0.0
 */

const fs = require('fs');
const path = require('path');

const testResults = {
    passed: 0,
    failed: 0,
    skipped: 0,
    errors: [],
    suites: {}
};

let currentSuite = null;

function describe(suiteName, fn) {
    currentSuite = suiteName;
    testResults.suites[suiteName] = { passed: 0, failed: 0, skipped: 0 };
    console.log(`\n📦 ${suiteName}`);
    console.log('─'.repeat(50));
    fn();
    currentSuite = null;
}

function it(testName, fn) {
    try {
        fn();
        testResults.passed++;
        testResults.suites[currentSuite].passed++;
        console.log(`  ✅ ${testName}`);
    } catch (error) {
        testResults.failed++;
        testResults.suites[currentSuite].failed++;
        testResults.errors.push({ suite: currentSuite, testName, error: error.message });
        console.log(`  ❌ ${testName}`);
        console.log(`     Error: ${error.message}`);
    }
}

function skip(testName, fn) {
    testResults.skipped++;
    testResults.suites[currentSuite].skipped++;
    console.log(`  ⏭️ ${testName} (跳过)`);
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

assert.notIncludes = function(haystack, needle, message) {
    if (haystack.includes(needle)) {
        throw new Error(message || `Expected not to include "${needle}"`);
    }
};

assert.isTrue = function(value, message) {
    if (value !== true) {
        throw new Error(message || `Expected true, but got ${value}`);
    }
};

assert.isFalse = function(value, message) {
    if (value !== false) {
        throw new Error(message || `Expected false, but got ${value}`);
    }
};

assert.exists = function(value, message) {
    if (value === undefined || value === null) {
        throw new Error(message || 'Expected value to exist');
    }
};

assert.fileExists = function(filePath, message) {
    if (!fs.existsSync(filePath)) {
        throw new Error(message || `File does not exist: ${filePath}`);
    }
};

assert.directoryExists = function(dirPath, message) {
    if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
        throw new Error(message || `Directory does not exist: ${dirPath}`);
    }
};

assert.fileContains = function(filePath, content, message) {
    assert.fileExists(filePath);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    if (!fileContent.includes(content)) {
        throw new Error(message || `File does not contain expected content: ${content}`);
    }
};

assert.validJson = function(filePath, message) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        JSON.parse(content);
    } catch (e) {
        throw new Error(message || `Invalid JSON in file: ${filePath}`);
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
    
    it('应该包含职业推荐数据', () => {
        assert.includes(dataContent, 'career:', '缺少career推荐');
    });
    
    it('应该包含兴趣推荐数据', () => {
        assert.includes(dataContent, 'hobby:', '缺少hobby推荐');
    });
    
    it('应该暴露数据到window对象', () => {
        assert.includes(dataContent, 'window.dimensions', '未暴露dimensions到window');
        assert.includes(dataContent, 'window.questions', '未暴露questions到window');
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
    
    it('应该有存储可用性检查', () => {
        assert.includes(storageContent, 'isStorageAvailable', '缺少存储可用性检查');
    });
    
    it('应该有数据导入导出功能', () => {
        assert.includes(storageContent, 'function exportData', '缺少exportData函数');
        assert.includes(storageContent, 'function importData', '缺少importData函数');
    });
    
    it('应该有JSDoc文档注释', () => {
        assert.includes(storageContent, '@fileoverview', '缺少文件级JSDoc注释');
        assert.includes(storageContent, '@description', '缺少描述注释');
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
    
    it('应该定义detectDevice函数', () => {
        assert.includes(utilsContent, 'function detectDevice', '缺少detectDevice函数');
    });
    
    it('应该定义copyToClipboard函数', () => {
        assert.includes(utilsContent, 'function copyToClipboard', '缺少copyToClipboard函数');
    });
    
    it('应该有JSDoc注释', () => {
        assert.includes(utilsContent, '@fileoverview', '缺少文件级JSDoc注释');
        assert.includes(utilsContent, '@param', '缺少参数JSDoc注释');
        assert.includes(utilsContent, '@returns', '缺少返回值JSDoc注释');
    });
    
    it('应该定义ToastType枚举', () => {
        assert.includes(utilsContent, 'const ToastType', '缺少ToastType枚举');
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
    
    it('应该有进度保存逻辑', () => {
        assert.includes(coreContent, 'saveProgress', '缺少进度保存调用');
    });
    
    it('应该有分数计算逻辑', () => {
        assert.includes(coreContent, 'calculateFinalScores', '缺少分数计算函数');
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
    
    it('应该有SEO meta标签', () => {
        assert.includes(indexContent, 'meta name="description"', '缺少description meta标签');
        assert.includes(indexContent, 'meta name="keywords"', '缺少keywords meta标签');
    });
    
    it('应该有Open Graph标签', () => {
        assert.includes(indexContent, 'og:title', '缺少og:title标签');
        assert.includes(indexContent, 'og:description', '缺少og:description标签');
    });
    
    it('应该有CDN资源的SRI校验', () => {
        assert.includes(indexContent, 'integrity=', '缺少SRI完整性校验');
    });
});

describe('PWA配置测试', () => {
    const manifestPath = path.join(__dirname, '..', 'manifest.json');
    const swPath = path.join(__dirname, '..', 'service-worker.js');
    
    it('manifest.json应该是有效的JSON', () => {
        assert.validJson(manifestPath, 'manifest.json格式无效');
    });
    
    it('manifest.json应该包含必要字段', () => {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        assert.exists(manifest.name, '缺少name字段');
        assert.exists(manifest.short_name, '缺少short_name字段');
        assert.exists(manifest.start_url, '缺少start_url字段');
        assert.exists(manifest.display, '缺少display字段');
        assert.exists(manifest.icons, '缺少icons字段');
    });
    
    it('manifest.json应该有正确的主题色', () => {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        assert.exists(manifest.theme_color, '缺少theme_color字段');
        assert.exists(manifest.background_color, '缺少background_color字段');
    });
    
    it('service-worker.js应该存在', () => {
        assert.fileExists(swPath, 'service-worker.js不存在');
    });
    
    it('Service Worker应该有缓存版本控制', () => {
        const swContent = fs.readFileSync(swPath, 'utf8');
        assert.includes(swContent, 'CACHE_VERSION', '缺少缓存版本控制');
    });
    
    it('Service Worker应该有缓存策略', () => {
        const swContent = fs.readFileSync(swPath, 'utf8');
        assert.includes(swContent, 'CACHE_STRATEGIES', '缺少缓存策略定义');
    });
});

describe('文件结构测试', () => {
    const rootPath = path.join(__dirname, '..');
    
    it('应该存在README.md', () => {
        assert.fileExists(path.join(rootPath, 'README.md'), 'README.md不存在');
    });
    
    it('应该存在package.json', () => {
        assert.fileExists(path.join(rootPath, 'package.json'), 'package.json不存在');
    });
    
    it('package.json应该是有效的JSON', () => {
        assert.validJson(path.join(rootPath, 'package.json'), 'package.json格式无效');
    });
    
    it('应该存在.eslintrc.json', () => {
        assert.fileExists(path.join(rootPath, '.eslintrc.json'), '.eslintrc.json不存在');
    });
    
    it('应该存在manifest.json', () => {
        assert.fileExists(path.join(rootPath, 'manifest.json'), 'manifest.json不存在');
    });
    
    it('应该存在service-worker.js', () => {
        assert.fileExists(path.join(rootPath, 'service-worker.js'), 'service-worker.js不存在');
    });
    
    it('应该存在js目录', () => {
        assert.directoryExists(path.join(rootPath, 'js'), 'js目录不存在');
    });
    
    it('应该存在tests目录', () => {
        assert.directoryExists(path.join(rootPath, 'tests'), 'tests目录不存在');
    });
    
    it('应该存在docs目录', () => {
        assert.directoryExists(path.join(rootPath, 'docs'), 'docs目录不存在');
    });
    
    it('应该存在GitHub Actions工作流目录', () => {
        assert.directoryExists(path.join(rootPath, '.github', 'workflows'), '.github/workflows目录不存在');
    });
});

describe('GitHub Actions配置测试', () => {
    const workflowsPath = path.join(__dirname, '..', '.github', 'workflows');
    
    it('应该存在CI工作流', () => {
        assert.fileExists(path.join(workflowsPath, 'ci.yml'), 'ci.yml不存在');
    });
    
    it('应该存在部署工作流', () => {
        assert.fileExists(path.join(workflowsPath, 'deploy.yml'), 'deploy.yml不存在');
    });
    
    it('应该存在Lighthouse工作流', () => {
        assert.fileExists(path.join(workflowsPath, 'lighthouse.yml'), 'lighthouse.yml不存在');
    });
});

describe('文档完整性测试', () => {
    const docsPath = path.join(__dirname, '..', 'docs');
    
    it('应该存在模块设计文档', () => {
        assert.fileExists(path.join(docsPath, 'MODULE_DESIGN.md'), 'MODULE_DESIGN.md不存在');
    });
    
    it('应该存在任务分解文档', () => {
        assert.fileExists(path.join(docsPath, 'TASK_BREAKDOWN.md'), 'TASK_BREAKDOWN.md不存在');
    });
    
    it('README应该包含项目描述', () => {
        const readmePath = path.join(__dirname, '..', 'README.md');
        assert.fileContains(readmePath, '人格星球探索', 'README缺少项目名称');
    });
    
    it('README应该包含技术栈说明', () => {
        const readmePath = path.join(__dirname, '..', 'README.md');
        assert.fileContains(readmePath, '技术栈', 'README缺少技术栈说明');
    });
    
    it('README应该包含快速开始指南', () => {
        const readmePath = path.join(__dirname, '..', 'README.md');
        assert.fileContains(readmePath, '快速开始', 'README缺少快速开始指南');
    });
});

describe('代码规范测试', () => {
    const jsDir = path.join(__dirname, '..', 'js');
    const jsFiles = fs.readdirSync(jsDir).filter(f => f.endsWith('.js'));
    
    it('所有JS文件应该存在', () => {
        assert.isTrue(jsFiles.length > 0, 'js目录中没有JS文件');
    });
    
    it('JS文件应该使用const/let而非var', () => {
        jsFiles.forEach(file => {
            const content = fs.readFileSync(path.join(jsDir, file), 'utf8');
            const varCount = (content.match(/\bvar\s+/g) || []).length;
            assert.isTrue(varCount === 0, `${file}中使用了var关键字(${varCount}处)`);
        });
    });
    
    it('JS文件应该有严格模式或ES6+语法', () => {
        jsFiles.forEach(file => {
            const content = fs.readFileSync(path.join(jsDir, file), 'utf8');
            const hasES6 = content.includes('const ') || content.includes('let ') || content.includes('=>');
            assert.isTrue(hasES6, `${file}未使用ES6+语法`);
        });
    });
});

console.log('\n' + '═'.repeat(60));
console.log('📊 测试结果汇总');
console.log('═'.repeat(60));

Object.entries(testResults.suites).forEach(([suite, results]) => {
    const total = results.passed + results.failed + results.skipped;
    console.log(`\n📦 ${suite}: ${results.passed}/${total} 通过`);
});

console.log('\n' + '─'.repeat(60));
console.log(`✅ 通过: ${testResults.passed}`);
console.log(`❌ 失败: ${testResults.failed}`);
console.log(`⏭️ 跳过: ${testResults.skipped}`);
console.log(`📝 总计: ${testResults.passed + testResults.failed + testResults.skipped}`);

const coverage = ((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1);
console.log(`📈 覆盖率: ${coverage}%`);

if (testResults.failed > 0) {
    console.log('\n❌ 失败的测试:');
    testResults.errors.forEach(({ suite, testName, error }) => {
        console.log(`   [${suite}] ${testName}: ${error}`);
    });
    process.exit(1);
} else {
    console.log('\n🎉 所有测试通过！');
    process.exit(0);
}
