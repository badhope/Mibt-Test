class MessageBoard {
    constructor(options = {}) {
        this.container = options.container;
        this.currentUser = null;
        this.messages = [];
        this.page = 1;
        this.limit = 20;
        this.hasMore = true;
        this.loading = false;
        
        this.init();
    }
    
    async init() {
        this.currentUser = window.authService?.getCurrentUser();
        this.render();
        await this.loadMessages();
    }
    
    render() {
        this.container.innerHTML = `
            <div class="message-board">
                <div class="message-board-header text-center mb-8">
                    <h2 class="text-3xl font-bold mb-2">
                        <span class="text-4xl mr-2">💬</span>
                        留言板
                    </h2>
                    <p class="text-gray-400">与其他探索者交流互动</p>
                </div>
                
                <div class="message-form-container glass-card rounded-2xl p-6 mb-8">
                    ${this.currentUser ? `
                        <div class="flex items-start gap-4">
                            <img src="${this.currentUser.avatar}" alt="avatar" class="w-12 h-12 rounded-full">
                            <div class="flex-1">
                                <textarea 
                                    id="message-input" 
                                    class="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white resize-none focus:border-purple-500 focus:outline-none transition-all"
                                    placeholder="分享你的想法、建议或故事..."
                                    rows="4"
                                    maxlength="500"
                                ></textarea>
                                <div class="flex justify-between items-center mt-3">
                                    <span class="text-sm text-gray-500">
                                        <span id="msg-char-count">0</span>/500
                                    </span>
                                    <button 
                                        id="submit-message" 
                                        class="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-bold hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2"
                                    >
                                        <i class="fas fa-paper-plane"></i>
                                        发表留言
                                    </button>
                                </div>
                            </div>
                        </div>
                    ` : `
                        <div class="text-center py-8">
                            <div class="text-6xl mb-4">🔒</div>
                            <p class="text-gray-400 mb-4">登录后即可发表留言</p>
                            <a href="auth.html" class="inline-block px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-bold hover:opacity-90 transition-all">
                                立即登录
                            </a>
                        </div>
                    `}
                </div>
                
                <div id="messages-list" class="space-y-6">
                    <div class="text-center py-12 text-gray-400">
                        <i class="fas fa-spinner fa-spin text-3xl mb-3"></i>
                        <p>加载中...</p>
                    </div>
                </div>
                
                <div id="load-more-msg-container" class="text-center mt-8 hidden">
                    <button id="load-more-msg-btn" class="px-8 py-3 glass-card rounded-xl hover:bg-white/10 transition-all font-medium">
                        加载更多留言
                    </button>
                </div>
            </div>
        `;
        
        this.bindEvents();
    }
    
    bindEvents() {
        const input = document.getElementById('message-input');
        const submitBtn = document.getElementById('submit-message');
        const loadMoreBtn = document.getElementById('load-more-msg-btn');
        
        if (input) {
            input.addEventListener('input', () => {
                document.getElementById('msg-char-count').textContent = input.value.length;
            });
            
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                    this.submitMessage();
                }
            });
        }
        
        if (submitBtn) {
            submitBtn.addEventListener('click', () => this.submitMessage());
        }
        
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => this.loadMore());
        }
    }
    
    async loadMessages() {
        if (this.loading) return;
        this.loading = true;
        
        try {
            const response = await window.messagesAPI.list({
                page: this.page,
                limit: this.limit
            });
            
            if (response.success) {
                this.messages = [...this.messages, ...response.data.data];
                this.hasMore = response.data.pagination.page < response.data.pagination.totalPages;
                
                this.renderMessages();
            }
        } catch (error) {
            console.error('Load messages error:', error);
            this.showError('加载留言失败');
        } finally {
            this.loading = false;
        }
    }
    
    renderMessages() {
        const list = document.getElementById('messages-list');
        const loadMoreContainer = document.getElementById('load-more-msg-container');
        
        if (this.messages.length === 0) {
            list.innerHTML = `
                <div class="text-center py-12 text-gray-400">
                    <div class="text-6xl mb-4">📝</div>
                    <p class="text-lg">还没有留言</p>
                    <p class="text-sm">成为第一个留言的人吧！</p>
                </div>
            `;
            return;
        }
        
        list.innerHTML = this.messages.map(message => this.renderMessageItem(message)).join('');
        
        if (this.hasMore) {
            loadMoreContainer.classList.remove('hidden');
        } else {
            loadMoreContainer.classList.add('hidden');
        }
        
        this.bindMessageEvents();
    }
    
    renderMessageItem(message) {
        const isOwner = this.currentUser && this.currentUser.id === message.userId;
        const isAdmin = this.currentUser && this.currentUser.role === 'ADMIN';
        const hasLiked = this.currentUser && message.likedBy?.includes(this.currentUser.id);
        
        return `
            <div class="message-item glass-card rounded-2xl p-6 ${message.isPinned ? 'border-2 border-yellow-500/50' : ''}" data-id="${message.id}">
                ${message.isPinned ? `
                    <div class="flex items-center gap-2 text-yellow-400 text-sm mb-3">
                        <i class="fas fa-thumbtack"></i>
                        <span>置顶留言</span>
                    </div>
                ` : ''}
                
                <div class="flex items-start gap-4">
                    <img src="${message.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${message.userId}`}" alt="avatar" class="w-12 h-12 rounded-full">
                    <div class="flex-1">
                        <div class="flex items-center gap-3 mb-2">
                            <span class="font-bold text-lg">${message.username}</span>
                            <span class="text-sm text-gray-500">${this.formatTime(message.createdAt)}</span>
                        </div>
                        <p class="text-gray-300 mb-4 leading-relaxed">${this.escapeHtml(message.content)}</p>
                        
                        <div class="flex items-center gap-4 text-sm">
                            <button class="msg-like-btn flex items-center gap-2 ${hasLiked ? 'text-red-400' : 'text-gray-400'} hover:text-red-400 transition-colors" data-id="${message.id}">
                                <i class="fas fa-heart"></i>
                                <span>${message.likes || 0}</span>
                            </button>
                            
                            ${this.currentUser ? `
                                <button class="msg-reply-btn text-gray-400 hover:text-purple-400 transition-colors" data-id="${message.id}">
                                    <i class="fas fa-reply"></i> 回复
                                </button>
                            ` : ''}
                            
                            ${isOwner || isAdmin ? `
                                <button class="msg-delete-btn text-gray-400 hover:text-red-400 transition-colors" data-id="${message.id}">
                                    <i class="fas fa-trash"></i> 删除
                                </button>
                            ` : ''}
                            
                            ${isAdmin ? `
                                <button class="msg-pin-btn text-gray-400 hover:text-yellow-400 transition-colors" data-id="${message.id}" data-pinned="${message.isPinned}">
                                    <i class="fas fa-thumbtack"></i> ${message.isPinned ? '取消置顶' : '置顶'}
                                </button>
                            ` : ''}
                        </div>
                        
                        ${message.replies && message.replies.length > 0 ? `
                            <div class="replies-container mt-4 pl-4 border-l-2 border-purple-500/30 space-y-3">
                                ${message.replies.map(reply => `
                                    <div class="reply-item">
                                        <div class="flex items-center gap-2 mb-1">
                                            <img src="${reply.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${reply.userId}`}" alt="avatar" class="w-6 h-6 rounded-full">
                                            <span class="font-medium text-sm">${reply.username}</span>
                                            <span class="text-xs text-gray-500">${this.formatTime(reply.createdAt)}</span>
                                        </div>
                                        <p class="text-gray-400 text-sm">${this.escapeHtml(reply.content)}</p>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                        
                        <div class="reply-form-container hidden mt-4" data-message-id="${message.id}">
                            <div class="flex items-start gap-3">
                                <img src="${this.currentUser?.avatar}" alt="avatar" class="w-8 h-8 rounded-full">
                                <div class="flex-1">
                                    <textarea 
                                        class="reply-input w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white text-sm resize-none focus:border-purple-500 focus:outline-none transition-all"
                                        placeholder="写下你的回复..."
                                        rows="2"
                                        maxlength="300"
                                    ></textarea>
                                    <div class="flex justify-end gap-2 mt-2">
                                        <button class="cancel-reply-btn px-4 py-1 text-sm text-gray-400 hover:text-white transition-colors">取消</button>
                                        <button class="submit-reply-btn px-4 py-1 bg-purple-500 rounded-lg text-sm text-white hover:bg-purple-600 transition-colors">回复</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    bindMessageEvents() {
        document.querySelectorAll('.msg-like-btn').forEach(btn => {
            btn.addEventListener('click', () => this.likeMessage(btn.dataset.id));
        });
        
        document.querySelectorAll('.msg-reply-btn').forEach(btn => {
            btn.addEventListener('click', () => this.showReplyForm(btn.dataset.id));
        });
        
        document.querySelectorAll('.msg-delete-btn').forEach(btn => {
            btn.addEventListener('click', () => this.deleteMessage(btn.dataset.id));
        });
        
        document.querySelectorAll('.msg-pin-btn').forEach(btn => {
            btn.addEventListener('click', () => this.pinMessage(btn.dataset.id, btn.dataset.pinned === 'true'));
        });
        
        document.querySelectorAll('.cancel-reply-btn').forEach(btn => {
            btn.addEventListener('click', () => this.hideReplyForm(btn));
        });
        
        document.querySelectorAll('.submit-reply-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const container = e.target.closest('.reply-form-container');
                this.submitReply(container.dataset.messageId, container.querySelector('.reply-input').value);
            });
        });
    }
    
    async submitMessage() {
        const input = document.getElementById('message-input');
        const content = input.value.trim();
        
        if (!content) {
            this.showToast('请输入留言内容', 'error');
            return;
        }
        
        const btn = document.getElementById('submit-message');
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 发表中...';
        
        try {
            const response = await window.messagesAPI.create({ content });
            
            if (response.success) {
                this.messages.unshift(response.data);
                this.renderMessages();
                input.value = '';
                document.getElementById('msg-char-count').textContent = '0';
                this.showToast('留言发表成功', 'success');
            }
        } catch (error) {
            this.showToast(error.message || '发表失败', 'error');
        } finally {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-paper-plane"></i> 发表留言';
        }
    }
    
    async likeMessage(messageId) {
        if (!this.currentUser) {
            window.permissionService?.showAuthRequired();
            return;
        }
        
        try {
            const response = await window.messagesAPI.like(messageId);
            if (response.success) {
                const message = this.messages.find(m => m.id === messageId);
                if (message) {
                    message.likes = response.data.likes;
                    message.likedBy = response.data.hasLiked 
                        ? [...(message.likedBy || []), this.currentUser.id]
                        : (message.likedBy || []).filter(id => id !== this.currentUser.id);
                    this.renderMessages();
                }
            }
        } catch (error) {
            this.showToast('操作失败', 'error');
        }
    }
    
    showReplyForm(messageId) {
        this.hideAllReplyForms();
        const container = document.querySelector(`.reply-form-container[data-message-id="${messageId}"]`);
        if (container) {
            container.classList.remove('hidden');
            container.querySelector('.reply-input').focus();
        }
    }
    
    hideReplyForm(btn) {
        const container = btn.closest('.reply-form-container');
        if (container) {
            container.classList.add('hidden');
            container.querySelector('.reply-input').value = '';
        }
    }
    
    hideAllReplyForms() {
        document.querySelectorAll('.reply-form-container').forEach(container => {
            container.classList.add('hidden');
        });
    }
    
    async submitReply(messageId, content) {
        if (!content.trim()) {
            this.showToast('请输入回复内容', 'error');
            return;
        }
        
        try {
            const response = await window.messagesAPI.addReply(messageId, { content });
            if (response.success) {
                const message = this.messages.find(m => m.id === messageId);
                if (message) {
                    message.replies = message.replies || [];
                    message.replies.push(response.data);
                    this.renderMessages();
                    this.showToast('回复成功', 'success');
                }
            }
        } catch (error) {
            this.showToast(error.message || '回复失败', 'error');
        }
    }
    
    async deleteMessage(messageId) {
        if (!confirm('确定要删除这条留言吗？')) return;
        
        try {
            const response = await window.messagesAPI.delete(messageId);
            if (response.success) {
                this.messages = this.messages.filter(m => m.id !== messageId);
                this.renderMessages();
                this.showToast('删除成功', 'success');
            }
        } catch (error) {
            this.showToast('删除失败', 'error');
        }
    }
    
    async pinMessage(messageId, isPinned) {
        try {
            const response = await window.messagesAPI.pin(messageId);
            if (response.success) {
                const message = this.messages.find(m => m.id === messageId);
                if (message) {
                    message.isPinned = !isPinned;
                    this.renderMessages();
                    this.showToast(isPinned ? '已取消置顶' : '已置顶', 'success');
                }
            }
        } catch (error) {
            this.showToast('操作失败', 'error');
        }
    }
    
    async loadMore() {
        this.page++;
        await this.loadMessages();
    }
    
    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 1) return '刚刚';
        if (minutes < 60) return `${minutes}分钟前`;
        if (hours < 24) return `${hours}小时前`;
        if (days < 7) return `${days}天前`;
        
        return date.toLocaleDateString();
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
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
    
    showError(message) {
        document.getElementById('messages-list').innerHTML = `
            <div class="text-center py-12 text-red-400">
                <i class="fas fa-exclamation-triangle text-3xl mb-3"></i>
                <p>${message}</p>
            </div>
        `;
    }
}

window.MessageBoard = MessageBoard;
