class BackgroundManager {
    constructor(options = {}) {
        this.container = options.container;
        this.currentUser = null;
        this.backgrounds = { presets: [], custom: [] };
        this.selectedBackground = null;
        this.onSelect = options.onSelect || (() => {});
        
        this.init();
    }
    
    async init() {
        this.currentUser = window.authService?.getCurrentUser();
        await this.loadBackgrounds();
        this.render();
    }
    
    async loadBackgrounds() {
        try {
            const response = await window.backgroundsAPI.list();
            if (response.success) {
                this.backgrounds = response.data;
                
                if (this.currentUser?.settings?.customBackground) {
                    this.selectedBackground = this.currentUser.settings.customBackground;
                }
            }
        } catch (error) {
            console.error('Load backgrounds error:', error);
        }
    }
    
    render() {
        this.container.innerHTML = `
            <div class="background-manager">
                <div class="bg-header mb-6">
                    <h3 class="text-xl font-bold flex items-center gap-2">
                        <i class="fas fa-image text-purple-400"></i>
                        背景设置
                    </h3>
                    <p class="text-sm text-gray-400 mt-1">选择或上传你喜欢的背景</p>
                </div>
                
                <div class="bg-section mb-6">
                    <h4 class="text-lg font-medium mb-3 flex items-center gap-2">
                        <span class="text-purple-400">🎨</span> 预设背景
                    </h4>
                    <div class="bg-grid grid grid-cols-2 md:grid-cols-3 gap-4">
                        ${this.backgrounds.presets.map(bg => this.renderBackgroundItem(bg)).join('')}
                    </div>
                </div>
                
                ${this.currentUser ? `
                    <div class="bg-section mb-6">
                        <h4 class="text-lg font-medium mb-3 flex items-center gap-2">
                            <span class="text-cyan-400">⬆️</span> 自定义背景
                        </h4>
                        <div class="upload-area glass-card rounded-xl p-6 text-center cursor-pointer hover:bg-white/5 transition-all" id="upload-area">
                            <input type="file" id="bg-file-input" accept="image/*" class="hidden">
                            <div class="text-4xl mb-2">📁</div>
                            <p class="text-gray-400">点击或拖拽图片到此处上传</p>
                            <p class="text-xs text-gray-500 mt-1">支持 JPG、PNG、WebP，最大 5MB</p>
                        </div>
                        <div class="custom-bg-grid grid grid-cols-2 md:grid-cols-3 gap-4 mt-4" id="custom-bg-grid">
                            ${this.backgrounds.custom.map(bg => this.renderBackgroundItem(bg, true)).join('')}
                        </div>
                    </div>
                ` : `
                    <div class="text-center py-6 glass-card rounded-xl">
                        <p class="text-gray-400 mb-3">登录后可上传自定义背景</p>
                        <a href="auth.html" class="inline-block px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-medium hover:opacity-90 transition-all">
                            立即登录
                        </a>
                    </div>
                `}
                
                <div class="flex justify-end gap-3 mt-6">
                    <button id="reset-bg-btn" class="px-6 py-2 glass-card rounded-lg hover:bg-white/10 transition-all">
                        恢复默认
                    </button>
                    <button id="save-bg-btn" class="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-medium hover:opacity-90 transition-all">
                        保存设置
                    </button>
                </div>
            </div>
        `;
        
        this.bindEvents();
    }
    
    renderBackgroundItem(bg, isCustom = false) {
        const isSelected = this.selectedBackground === bg.id;
        
        return `
            <div class="bg-item relative rounded-xl overflow-hidden cursor-pointer group ${isSelected ? 'ring-2 ring-purple-500' : ''}" data-id="${bg.id}" data-custom="${isCustom}">
                <div class="aspect-video bg-cover bg-center" style="background-image: url('${bg.thumbnail || bg.url}')">
                    ${!bg.thumbnail && !bg.url ? `
                        <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                            <span class="text-2xl">🖼️</span>
                        </div>
                    ` : ''}
                </div>
                <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    ${isSelected ? `
                        <span class="text-white font-medium"><i class="fas fa-check mr-1"></i> 已选择</span>
                    ` : `
                        <span class="text-white font-medium">选择此背景</span>
                    `}
                </div>
                ${isCustom ? `
                    <button class="delete-bg-btn absolute top-2 right-2 w-8 h-8 bg-red-500/80 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center" data-id="${bg.id}">
                        <i class="fas fa-trash text-sm"></i>
                    </button>
                ` : ''}
                <div class="absolute bottom-0 left-0 right-0 bg-black/60 px-3 py-2">
                    <p class="text-sm text-white truncate">${bg.name}</p>
                </div>
            </div>
        `;
    }
    
    bindEvents() {
        document.querySelectorAll('.bg-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.delete-bg-btn')) {
                    this.selectBackground(item.dataset.id);
                }
            });
        });
        
        document.querySelectorAll('.delete-bg-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteBackground(btn.dataset.id);
            });
        });
        
        const uploadArea = document.getElementById('upload-area');
        const fileInput = document.getElementById('bg-file-input');
        
        if (uploadArea && fileInput) {
            uploadArea.addEventListener('click', () => fileInput.click());
            
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.classList.add('bg-white/10');
            });
            
            uploadArea.addEventListener('dragleave', () => {
                uploadArea.classList.remove('bg-white/10');
            });
            
            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('bg-white/10');
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    this.handleFileUpload(files[0]);
                }
            });
            
            fileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    this.handleFileUpload(e.target.files[0]);
                }
            });
        }
        
        const resetBtn = document.getElementById('reset-bg-btn');
        const saveBtn = document.getElementById('save-bg-btn');
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetBackground());
        }
        
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveBackground());
        }
    }
    
    selectBackground(id) {
        this.selectedBackground = id;
        this.render();
        
        const bg = [...this.backgrounds.presets, ...this.backgrounds.custom].find(b => b.id === id);
        if (bg) {
            this.onSelect(bg);
        }
    }
    
    async handleFileUpload(file) {
        if (!file.type.startsWith('image/')) {
            this.showToast('请上传图片文件', 'error');
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) {
            this.showToast('图片大小不能超过5MB', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const response = await window.backgroundsAPI.upload({
                    name: file.name,
                    url: e.target.result,
                    thumbnail: e.target.result
                });
                
                if (response.success) {
                    this.backgrounds.custom.push(response.data);
                    this.render();
                    this.showToast('上传成功', 'success');
                }
            } catch (error) {
                this.showToast('上传失败', 'error');
            }
        };
        
        reader.readAsDataURL(file);
    }
    
    async deleteBackground(id) {
        if (!confirm('确定要删除这个背景吗？')) return;
        
        try {
            const response = await window.backgroundsAPI.delete(id);
            if (response.success) {
                this.backgrounds.custom = this.backgrounds.custom.filter(b => b.id !== id);
                if (this.selectedBackground === id) {
                    this.selectedBackground = null;
                }
                this.render();
                this.showToast('删除成功', 'success');
            }
        } catch (error) {
            this.showToast('删除失败', 'error');
        }
    }
    
    async saveBackground() {
        if (!this.selectedBackground) {
            this.showToast('请先选择一个背景', 'error');
            return;
        }
        
        try {
            const response = await window.backgroundsAPI.setDefault(this.selectedBackground);
            if (response.success) {
                this.showToast('背景设置已保存', 'success');
            }
        } catch (error) {
            this.showToast('保存失败', 'error');
        }
    }
    
    resetBackground() {
        this.selectedBackground = null;
        this.render();
        this.onSelect(null);
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

window.BackgroundManager = BackgroundManager;
