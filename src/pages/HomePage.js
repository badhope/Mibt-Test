import { BaseComponent } from '../components/BaseComponent.js';
import { TestCard } from '../components/TestCard.js';

/**
 * 首页组件
 */
export class HomePage extends BaseComponent {
    constructor({ onModeSelect }) {
        super();
        this.onModeSelect = onModeSelect;
    }

    async render() {
        this.element = document.createElement('div');
        this.element.id = 'home-page';
        this.element.className = 'container mx-auto px-4 py-8';

        // 页面内容
        this.element.innerHTML = `
      <header class="text-center mb-12">
        <h1 class="text-4xl font-bold text-white mb-4">
          人格星球探索
        </h1>
        <p class="text-xl text-gray-300">
          专业 MBTI 心理测评系统
        </p>
      </header>
      
      <div class="test-cards-grid" id="test-cards"></div>
    `;

        // 渲染测试卡片
        const cardsContainer = this.element.querySelector('#test-cards');
        await this.renderTestCards(cardsContainer);

        return this.element;
    }

    async renderTestCards(container) {
        const modes = [
            {
                mode: 'quick',
                title: '闪电模式',
                description: '快速了解你的性格类型',
                duration: 3,
                questionCount: 20,
            },
            {
                mode: 'standard',
                title: '标准模式',
                description: '完整的 MBTI 测试体验',
                duration: 10,
                questionCount: 60,
            },
            {
                mode: 'expert',
                title: '专家模式',
                description: '深度性格维度分析',
                duration: 20,
                questionCount: 120,
            },
        ];

        for (const mode of modes) {
            const card = new TestCard({
                ...mode,
                onSelect: this.onModeSelect,
            });
            await card.mount();
            container.appendChild(card.element);
        }
    }
}
