import { BaseComponent } from './BaseComponent.js';
import { formatDuration } from '../utils/helpers.js';

/**
 * 测试卡片组件
 * 展示测试模式选项
 */
export class TestCard extends BaseComponent {
    constructor({ mode, title, description, duration, questionCount, onSelect }) {
        super({ mode, title, description, duration, questionCount });
        this.onSelect = onSelect;
    }

    render() {
        this.element = document.createElement('div');
        this.element.className = 'test-card glass-card rounded-xl p-6 cursor-pointer hover-effect';
        this.element.dataset.mode = this.props.mode;
        this.element.dataset.testid = `test-card-${this.props.mode}`;

        this.element.innerHTML = `
      <div class="flex justify-between items-start mb-4">
        <h3 class="text-xl font-bold text-white">${this.props.title}</h3>
        <span class="badge badge-purple">${this.props.mode}</span>
      </div>
      
      <p class="text-gray-300 mb-4">${this.props.description}</p>
      
      <div class="flex gap-4 text-sm text-gray-400">
        <span>⏱️ ${formatDuration(this.props.duration)}</span>
        <span>📝 ${this.props.questionCount}题</span>
      </div>
      
      <button class="btn btn-primary w-full mt-4" data-action="select">
        开始测试
      </button>
    `;

        // 绑定事件
        const button = this.element.querySelector('[data-action="select"]');
        this.on(button, 'click', () => {
            this.onSelect?.(this.props.mode);
        });

        return this.element;
    }
}
