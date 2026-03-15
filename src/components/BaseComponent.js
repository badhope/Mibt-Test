/**
 * 组件基类
 * 提供生命周期、状态管理、事件处理等基础功能
 */
export class BaseComponent {
    constructor(props = {}) {
        this.props = props;
        this.state = {};
        this.element = null;
        this.eventListeners = new Map();
    }

    // 生命周期
    async mount() {
        await this.beforeMount();
        const element = await this.render();
        if (element) {
            this.element = element;
        }
        this.afterMount();
        return this;
    }

    beforeMount() {}
    afterMount() {}

    unmount() {
        this.cleanup();
    }

    // 清理资源
    cleanup() {
    // 移除所有事件监听
        this.eventListeners.forEach((listeners, element) => {
            listeners.forEach(({ event, handler }) => {
                element.removeEventListener(event, handler);
            });
        });
        this.eventListeners.clear();
    }

    // 状态更新
    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.render();
    }

    // 事件绑定（自动清理）
    on(element, event, handler) {
        if (!this.eventListeners.has(element)) {
            this.eventListeners.set(element, []);
        }
        this.eventListeners.get(element).push({ event, handler });
        element.addEventListener(event, handler);
    }

    // 渲染方法（子类实现）
    render() {
        throw new Error('render() must be implemented by subclass');
    }
}
