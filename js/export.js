class ExportManager {
    constructor(options = {}) {
        this.testId = options.testId;
        this.testData = options.testData;
    }
    
    async exportJSON() {
        if (!window.authService?.isAuthenticated()) {
            window.permissionService?.showAuthRequired('导出功能需要登录');
            return;
        }
        
        try {
            const response = await window.exportAPI.generateJSON(this.testId);
            if (response.success) {
                const dataStr = JSON.stringify(response.data, null, 2);
                const blob = new Blob([dataStr], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                
                const link = document.createElement('a');
                link.href = url;
                link.download = `mbti-test-result-${new Date().toISOString().slice(0, 10)}.json`;
                link.click();
                
                URL.revokeObjectURL(url);
                this.showToast('导出成功', 'success');
            }
        } catch (error) {
            this.showToast('导出失败', 'error');
        }
    }
    
    async exportPDF() {
        if (!window.authService?.isAuthenticated()) {
            window.permissionService?.showAuthRequired('导出功能需要登录');
            return;
        }
        
        try {
            const response = await window.exportAPI.generatePDF(this.testId);
            if (response.success) {
                const report = response.data;
                const pdfContent = this.generatePDFContent(report);
                
                const printWindow = window.open('', '_blank');
                printWindow.document.write(pdfContent);
                printWindow.document.close();
                
                setTimeout(() => {
                    printWindow.print();
                }, 500);
                
                this.showToast('正在生成PDF...', 'success');
            }
        } catch (error) {
            this.showToast('导出失败', 'error');
        }
    }
    
    generatePDFContent(report) {
        return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>${report.title}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
            padding: 40px;
            color: #333;
            line-height: 1.6;
        }
        .header { 
            text-align: center; 
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 2px solid #8b5cf6;
        }
        .header h1 { 
            font-size: 28px; 
            color: #8b5cf6;
            margin-bottom: 10px;
        }
        .header p { color: #666; }
        .section { margin-bottom: 30px; }
        .section h2 { 
            font-size: 20px; 
            color: #333;
            margin-bottom: 15px;
            padding-left: 10px;
            border-left: 4px solid #8b5cf6;
        }
        .info-grid { 
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
        }
        .info-item { 
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
        }
        .info-label { 
            font-size: 12px; 
            color: #666;
            margin-bottom: 5px;
        }
        .info-value { 
            font-size: 16px; 
            font-weight: bold;
            color: #333;
        }
        .dimension-item {
            margin-bottom: 15px;
        }
        .dimension-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
        }
        .dimension-bar {
            height: 20px;
            background: #e5e7eb;
            border-radius: 10px;
            overflow: hidden;
        }
        .dimension-fill {
            height: 100%;
            background: linear-gradient(90deg, #8b5cf6, #ec4899);
            border-radius: 10px;
        }
        .top-dimensions {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-top: 20px;
        }
        .top-dimension {
            text-align: center;
            padding: 20px;
            background: linear-gradient(135deg, #f3e8ff, #fce7f3);
            border-radius: 12px;
        }
        .top-dimension .icon {
            font-size: 32px;
            margin-bottom: 10px;
        }
        .top-dimension .name {
            font-weight: bold;
            margin-bottom: 5px;
        }
        .top-dimension .score {
            font-size: 24px;
            color: #8b5cf6;
            font-weight: bold;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            color: #666;
            font-size: 12px;
        }
        @media print {
            body { padding: 20px; }
            .section { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🚀 ${report.title}</h1>
        <p>用户：${report.user.username} | 测试时间：${new Date(report.user.testDate).toLocaleDateString()}</p>
    </div>
    
    <div class="section">
        <h2>📊 核心特质</h2>
        <div class="top-dimensions">
            ${report.test.topDimensions.map(dim => `
                <div class="top-dimension">
                    <div class="icon">${dim.icon}</div>
                    <div class="name">${dim.name}</div>
                    <div class="score">${dim.score}%</div>
                </div>
            `).join('')}
        </div>
    </div>
    
    <div class="section">
        <h2>📈 详细维度分析</h2>
        ${Object.entries(report.test.scores).map(([dim, score]) => `
            <div class="dimension-item">
                <div class="dimension-header">
                    <span>${dim}</span>
                    <span>${score}%</span>
                </div>
                <div class="dimension-bar">
                    <div class="dimension-fill" style="width: ${score}%"></div>
                </div>
            </div>
        `).join('')}
    </div>
    
    <div class="section">
        <h2>ℹ️ 测试信息</h2>
        <div class="info-grid">
            <div class="info-item">
                <div class="info-label">测试模式</div>
                <div class="info-value">${report.test.mode === 'quick' ? '闪电模式' : report.test.mode === 'standard' ? '标准模式' : '专家模式'}</div>
            </div>
            <div class="info-item">
                <div class="info-label">生成时间</div>
                <div class="info-value">${new Date(report.generatedAt).toLocaleString()}</div>
            </div>
        </div>
    </div>
    
    <div class="footer">
        <p>本报告由「人格星球探索」生成 | https://your-site.netlify.app</p>
        <p>报告生成时间：${new Date().toLocaleString()}</p>
    </div>
</body>
</html>
        `;
    }
    
    async exportImage() {
        if (!window.authService?.isAuthenticated()) {
            window.permissionService?.showAuthRequired('导出功能需要登录');
            return;
        }
        
        try {
            const canvas = await this.generateImageCanvas();
            if (canvas) {
                const link = document.createElement('a');
                link.download = `mbti-result-${new Date().toISOString().slice(0, 10)}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
                
                this.showToast('导出成功', 'success');
            }
        } catch (error) {
            this.showToast('导出失败', 'error');
        }
    }
    
    async generateImageCanvas() {
        const canvas = document.createElement('canvas');
        canvas.width = 1200;
        canvas.height = 630;
        const ctx = canvas.getContext('2d');
        
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(1, '#16213e');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 48px "Microsoft YaHei", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🚀 人格星球探索', canvas.width / 2, 80);
        
        ctx.font = '24px "Microsoft YaHei", sans-serif';
        ctx.fillStyle = '#a78bfa';
        ctx.fillText('我的测试结果', canvas.width / 2, 130);
        
        if (this.testData && this.testData.topDimensions) {
            const dims = this.testData.topDimensions.slice(0, 3);
            const startX = 200;
            const spacing = 300;
            
            dims.forEach((dim, index) => {
                const x = startX + index * spacing;
                
                ctx.fillStyle = 'rgba(139, 92, 246, 0.2)';
                ctx.beginPath();
                ctx.arc(x, 300, 80, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.font = '48px sans-serif';
                ctx.fillStyle = '#ffffff';
                ctx.textAlign = 'center';
                ctx.fillText(dim.icon, x, 310);
                
                ctx.font = 'bold 24px "Microsoft YaHei", sans-serif';
                ctx.fillText(dim.name, x, 420);
                
                ctx.font = 'bold 36px sans-serif';
                ctx.fillStyle = '#a78bfa';
                ctx.fillText(`${dim.score}%`, x, 470);
            });
        }
        
        ctx.font = '16px "Microsoft YaHei", sans-serif';
        ctx.fillStyle = '#6b7280';
        ctx.textAlign = 'center';
        ctx.fillText('人格星球探索 | 发现你的隐藏属性', canvas.width / 2, 580);
        
        return canvas;
    }
    
    showExportDialog() {
        const dialog = document.createElement('div');
        dialog.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
        dialog.innerHTML = `
            <div class="glass-card rounded-2xl p-8 max-w-md w-full mx-4 animate__animated animate__zoomIn">
                <h3 class="text-2xl font-bold mb-6 text-center">
                    <span class="text-3xl mr-2">📥</span>
                    导出测试结果
                </h3>
                
                <div class="space-y-4">
                    <button class="export-option w-full p-4 glass-card rounded-xl hover:bg-white/10 transition-all flex items-center gap-4" data-type="json">
                        <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-2xl">
                            📄
                        </div>
                        <div class="text-left">
                            <div class="font-bold">导出 JSON</div>
                            <div class="text-sm text-gray-400">完整数据，可用于备份或分析</div>
                        </div>
                    </button>
                    
                    <button class="export-option w-full p-4 glass-card rounded-xl hover:bg-white/10 transition-all flex items-center gap-4" data-type="pdf">
                        <div class="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl">
                            📑
                        </div>
                        <div class="text-left">
                            <div class="font-bold">导出 PDF</div>
                            <div class="text-sm text-gray-400">精美报告，适合打印或分享</div>
                        </div>
                    </button>
                    
                    <button class="export-option w-full p-4 glass-card rounded-xl hover:bg-white/10 transition-all flex items-center gap-4" data-type="image">
                        <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-2xl">
                            🖼️
                        </div>
                        <div class="text-left">
                            <div class="font-bold">导出图片</div>
                            <div class="text-sm text-gray-400">分享到社交媒体</div>
                        </div>
                    </button>
                </div>
                
                <button class="close-dialog w-full mt-6 py-3 glass-card rounded-xl hover:bg-white/10 transition-all">
                    取消
                </button>
            </div>
        `;
        
        document.body.appendChild(dialog);
        
        dialog.querySelectorAll('.export-option').forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.dataset.type;
                dialog.remove();
                
                switch (type) {
                    case 'json':
                        this.exportJSON();
                        break;
                    case 'pdf':
                        this.exportPDF();
                        break;
                    case 'image':
                        this.exportImage();
                        break;
                }
            });
        });
        
        dialog.querySelector('.close-dialog').addEventListener('click', () => {
            dialog.remove();
        });
        
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                dialog.remove();
            }
        });
    }
    
    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `fixed top-4 right-4 px-6 py-3 rounded-xl shadow-lg z-50 animate__animated animate__fadeInRight ${
            type === 'success' ? 'bg-green-500/90' : 'bg-red-500/90'
        } text-white`;
        toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle mr-2"></i>${message}`;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.remove('animate__fadeInRight');
            toast.classList.add('animate__fadeOutRight');
            setTimeout(() => toast.remove(), 500);
        }, 2000);
    }
}

window.ExportManager = ExportManager;
