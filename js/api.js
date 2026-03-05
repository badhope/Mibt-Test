const API_BASE = '/.netlify/functions';

const api = {
    async request(endpoint, options = {}) {
        const url = `${API_BASE}${endpoint}`;
        const token = localStorage.getItem('auth_token');
        
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            }
        };
        
        if (token) {
            defaultOptions.headers['Authorization'] = `Bearer ${token}`;
        }
        
        const finalOptions = {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...options.headers
            }
        };
        
        if (finalOptions.body && typeof finalOptions.body === 'object') {
            finalOptions.body = JSON.stringify(finalOptions.body);
        }
        
        try {
            const response = await fetch(url, finalOptions);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || '请求失败');
            }
            
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
    
    get(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'GET' });
    },
    
    post(endpoint, body, options = {}) {
        return this.request(endpoint, { ...options, method: 'POST', body });
    },
    
    put(endpoint, body, options = {}) {
        return this.request(endpoint, { ...options, method: 'PUT', body });
    },
    
    delete(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'DELETE' });
    }
};

const authAPI = {
    async register(userData) {
        return api.post('/auth-register', userData);
    },
    
    async login(credentials) {
        return api.post('/auth-login', credentials);
    },
    
    async logout() {
        return api.post('/auth-logout');
    },
    
    async getProfile() {
        return api.get('/auth-profile');
    },
    
    async updateProfile(data) {
        return api.put('/auth-profile', data);
    },
    
    async forgotPassword(email) {
        return api.post('/auth-forgot', { email });
    }
};

const commentsAPI = {
    async list(testId, options = {}) {
        const params = new URLSearchParams(options).toString();
        return api.get(`/comments-list?testId=${testId}&${params}`);
    },
    
    async create(data) {
        return api.post('/comments-create', data);
    },
    
    async update(id, data) {
        return api.put(`/comments-update?id=${id}`, data);
    },
    
    async delete(id) {
        return api.delete(`/comments-delete?id=${id}`);
    },
    
    async like(id) {
        return api.post(`/comments-like?id=${id}`);
    }
};

const messagesAPI = {
    async list(options = {}) {
        const params = new URLSearchParams(options).toString();
        return api.get(`/messages-list?${params}`);
    },
    
    async create(data) {
        return api.post('/messages-create', data);
    },
    
    async delete(id) {
        return api.delete(`/messages-delete?id=${id}`);
    },
    
    async addReply(messageId, data) {
        return api.post(`/messages-reply?id=${messageId}`, data);
    },
    
    async like(id) {
        return api.post(`/messages-like?id=${id}`);
    },
    
    async pin(id) {
        return api.post(`/messages-pin?id=${id}`);
    }
};

const exportAPI = {
    async generatePDF(testId) {
        return api.get(`/export-pdf?testId=${testId}`);
    },
    
    async generateJSON(testId) {
        return api.get(`/export-json?testId=${testId}`);
    },
    
    async generateImage(testId) {
        return api.get(`/export-image?testId=${testId}`);
    },
    
    async exportAll() {
        return api.get('/export-all');
    }
};

const backgroundsAPI = {
    async list() {
        return api.get('/backgrounds-list');
    },
    
    async upload(formData) {
        return api.post('/backgrounds-upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
    
    async delete(id) {
        return api.delete(`/backgrounds-delete?id=${id}`);
    },
    
    async setDefault(id) {
        return api.post('/backgrounds-default', { id });
    }
};

const userAPI = {
    async getTestHistory() {
        return api.get('/user-history');
    },
    
    async saveTestResult(data) {
        return api.post('/user-result', data);
    },
    
    async updateSettings(settings) {
        return api.put('/user-settings', settings);
    },
    
    async getStats() {
        return api.get('/user-stats');
    }
};

window.api = api;
window.authAPI = authAPI;
window.commentsAPI = commentsAPI;
window.messagesAPI = messagesAPI;
window.exportAPI = exportAPI;
window.backgroundsAPI = backgroundsAPI;
window.userAPI = userAPI;
