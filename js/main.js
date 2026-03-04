// 移除ES模块导入，使用全局函数

// 初始化粒子背景
function initParticles() {
    // 检测设备性能，根据设备性能调整粒子效果
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isLowPerformance = isMobile || navigator.userAgent.includes('Mobi') || navigator.deviceMemory < 4;
    
    // 根据性能调整粒子参数
    const particleCount = isLowPerformance ? 15 : 30;
    const particleSize = isLowPerformance ? 2 : 3;
    const lineDistance = isLowPerformance ? 80 : 150;
    const particleSpeed = isLowPerformance ? 0.5 : 0.8;
    
    // 延迟初始化，确保页面加载完成
    setTimeout(() => {
        particlesJS('particles-js', {
            particles: {
                number: { value: particleCount, density: { enable: true, value_area: 800 } },
                color: { value: ['#8b5cf6', '#ec4899', '#00f0ff'] },
                shape: { type: 'circle' },
                opacity: { value: 0.4, random: true },
                size: { value: particleSize, random: true },
                line_linked: {
                    enable: !isLowPerformance,
                    distance: lineDistance,
                    color: '#8b5cf6',
                    opacity: 0.15,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: particleSpeed,
                    direction: 'none',
                    random: true,
                    out_mode: 'out'
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: { enable: !isLowPerformance, mode: 'grab' },
                    onclick: { enable: true, mode: 'push' }
                },
                modes: {
                    grab: { distance: 120, line_linked: { opacity: 0.4 } },
                    push: { particles_nb: 2 }
                }
            },
            retina_detect: true
        });
    }, 500);
}

// 测试代码
console.log('main.js loaded');
console.log('init function:', typeof init);
console.log('checkResumeProgress function:', typeof checkResumeProgress);

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded event fired');
    initParticles();
    checkResumeProgress();
    if (typeof init === 'function') {
        init();
        console.log('init function executed successfully');
    } else {
        console.log('init function not found');
    }
});