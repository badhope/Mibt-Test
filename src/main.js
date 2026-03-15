import { HomePage } from './pages/HomePage.js';
import { StorageService } from './services/StorageService.js';

/**
 * 应用主入口
 */
class App {
    constructor() {
        this.app = document.getElementById('app');
        this.storage = new StorageService();
        this.currentPage = null;

        this.init();
    }

    async init() {
        console.log('App initializing...');

        // 注册 Service Worker
        if ('serviceWorker' in navigator) {
            try {
                await navigator.serviceWorker.register('/service-worker.js');
                console.log('Service Worker registered');
            } catch (error) {
                console.error('Service Worker registration failed:', error);
            }
        }

        // 渲染首页
        await this.renderHomePage();

        console.log('App initialized');
    }

    /**
   * 渲染首页
   */
    async renderHomePage() {
        if (this.currentPage) {
            this.currentPage.unmount();
        }

        this.currentPage = new HomePage({
            onModeSelect: (mode) => this.handleModeSelect(mode),
        });

        // 先清空再添加
        this.app.innerHTML = '';
        await this.currentPage.mount();
        this.app.appendChild(this.currentPage.element);
    }

    /**
   * 处理模式选择
   * @param {string} mode - 测试模式
   */
    handleModeSelect(mode) {
        console.log('Selected mode:', mode);

        // 保存选择的模式
        this.storage.set('selected_mode', mode);

        // TODO: 跳转到测试页面
        // this.renderTestPage(mode);

        alert(`即将开始${mode}模式测试`);
    }

    /**
   * 渲染测试页面
   * @param {string} mode - 测试模式
   */
    renderTestPage(mode) {
    // TODO: 实现测试页面
        console.log('Rendering test page for mode:', mode);
    }

    /**
   * 渲染结果页面
   * @param {Object} result - 测试结果
   */
    renderResultPage(result) {
    // TODO: 实现结果页面
        console.log('Rendering result page:', result);
    }
}

// 启动应用
new App();
