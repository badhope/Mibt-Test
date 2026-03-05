const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';

const authService = {
    currentUser: null,
    
    async init() {
        const token = this.getToken();
        if (token) {
            try {
                const response = await authAPI.getProfile();
                if (response.success) {
                    this.currentUser = response.data;
                    this.saveUserData(response.data);
                    return true;
                }
            } catch (error) {
                this.logout();
            }
        }
        return false;
    },
    
    getToken() {
        return localStorage.getItem(AUTH_TOKEN_KEY);
    },
    
    setToken(token) {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
    },
    
    removeToken() {
        localStorage.removeItem(AUTH_TOKEN_KEY);
    },
    
    getUserData() {
        const data = localStorage.getItem(USER_DATA_KEY);
        return data ? JSON.parse(data) : null;
    },
    
    saveUserData(user) {
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
    },
    
    removeUserData() {
        localStorage.removeItem(USER_DATA_KEY);
    },
    
    isAuthenticated() {
        return !!this.getToken() && !!this.currentUser;
    },
    
    getCurrentUser() {
        return this.currentUser || this.getUserData();
    },
    
    async register(userData) {
        try {
            const response = await authAPI.register(userData);
            if (response.success) {
                this.setToken(response.data.token);
                this.currentUser = response.data.user;
                this.saveUserData(response.data.user);
                return { success: true, user: response.data.user };
            }
            return { success: false, error: response.error };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    
    async login(credentials) {
        try {
            const response = await authAPI.login(credentials);
            if (response.success) {
                this.setToken(response.data.token);
                this.currentUser = response.data.user;
                this.saveUserData(response.data.user);
                return { success: true, user: response.data.user };
            }
            return { success: false, error: response.error };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    
    async logout() {
        try {
            await authAPI.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.removeToken();
            this.removeUserData();
            this.currentUser = null;
        }
    },
    
    async updateProfile(data) {
        try {
            const response = await authAPI.updateProfile(data);
            if (response.success) {
                this.currentUser = response.data;
                this.saveUserData(response.data);
                return { success: true, user: response.data };
            }
            return { success: false, error: response.error };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    
    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = 'auth.html';
            return false;
        }
        return true;
    },
    
    requireGuest() {
        if (this.isAuthenticated()) {
            window.location.href = 'index.html';
            return false;
        }
        return true;
    }
};

const permissionService = {
    ROLES: {
        GUEST: {
            canViewTest: true,
            canViewResults: true,
            canComment: false,
            canExport: false,
            canCustomize: false,
            canDeleteOwnComments: false,
            canPinMessages: false,
            canBanUsers: false
        },
        USER: {
            canViewTest: true,
            canViewResults: true,
            canComment: true,
            canExport: true,
            canCustomize: true,
            canDeleteOwnComments: true,
            canPinMessages: false,
            canBanUsers: false
        },
        ADMIN: {
            canViewTest: true,
            canViewResults: true,
            canComment: true,
            canExport: true,
            canCustomize: true,
            canDeleteOwnComments: true,
            canDeleteAnyComment: true,
            canPinMessages: true,
            canBanUsers: true
        }
    },
    
    checkPermission(action) {
        const user = authService.getCurrentUser();
        if (!user) {
            return this.ROLES.GUEST[action] || false;
        }
        const role = user.role || 'USER';
        return this.ROLES[role][action] || false;
    },
    
    canComment() {
        return this.checkPermission('canComment');
    },
    
    canExport() {
        return this.checkPermission('canExport');
    },
    
    canCustomize() {
        return this.checkPermission('canCustomize');
    },
    
    canDeleteComment(commentUserId) {
        const user = authService.getCurrentUser();
        if (!user) return false;
        
        if (user.role === 'ADMIN') return true;
        if (user.id === commentUserId && this.checkPermission('canDeleteOwnComments')) return true;
        
        return false;
    },
    
    canPinMessages() {
        return this.checkPermission('canPinMessages');
    },
    
    showAuthRequired(message = '此功能需要登录后使用') {
        const toast = document.createElement('div');
        toast.className = 'fixed top-4 right-4 bg-yellow-500/90 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate__animated animate__fadeInRight';
        toast.innerHTML = `
            <div class="flex items-center gap-3">
                <i class="fas fa-lock"></i>
                <span>${message}</span>
                <a href="auth.html" class="ml-2 underline hover:no-underline">立即登录</a>
            </div>
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.remove('animate__fadeInRight');
            toast.classList.add('animate__fadeOutRight');
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }
};

function initAuthPage() {
    if (!authService.requireGuest()) return;
    
    initParticles();
    initTabs();
    initForms();
    initPasswordToggles();
    initPasswordStrength();
}

function initTabs() {
    const tabs = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            
            tabs.forEach(t => t.classList.remove('active'));
            forms.forEach(f => f.classList.remove('active'));
            
            tab.classList.add('active');
            document.getElementById(`${targetTab}-form`).classList.add('active');
        });
    });
}

function initForms() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleLogin();
    });
    
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleRegister();
    });
}

function initPasswordToggles() {
    const toggles = document.querySelectorAll('.password-toggle');
    
    toggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const targetId = toggle.dataset.target;
            const input = document.getElementById(targetId);
            const icon = toggle.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
}

function initPasswordStrength() {
    const passwordInput = document.getElementById('register-password');
    const strengthBars = document.querySelectorAll('#password-strength .strength-bar');
    
    passwordInput.addEventListener('input', () => {
        const password = passwordInput.value;
        const strength = calculatePasswordStrength(password);
        
        strengthBars.forEach((bar, index) => {
            bar.classList.remove('weak', 'medium', 'strong');
            if (index < strength.score) {
                bar.classList.add(strength.level);
            }
        });
    });
}

function calculatePasswordStrength(password) {
    let score = 0;
    
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    let level = 'weak';
    if (score >= 4) level = 'strong';
    else if (score >= 2) level = 'medium';
    
    return { score: Math.min(score, 4), level };
}

function validateForm(formType) {
    let isValid = true;
    
    if (formType === 'login') {
        const identifier = document.getElementById('login-identifier').value.trim();
        const password = document.getElementById('login-password').value;
        
        if (!identifier) {
            showFieldError('login-identifier', '请输入邮箱或用户名');
            isValid = false;
        } else {
            clearFieldError('login-identifier');
        }
        
        if (!password) {
            showFieldError('login-password', '请输入密码');
            isValid = false;
        } else {
            clearFieldError('login-password');
        }
    } else if (formType === 'register') {
        const username = document.getElementById('register-username').value.trim();
        const email = document.getElementById('register-email').value.trim();
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        const agreeTerms = document.getElementById('agree-terms').checked;
        
        if (!username || !/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
            showFieldError('register-username', '用户名格式不正确（3-20个字符，仅字母数字下划线）');
            isValid = false;
        } else {
            clearFieldError('register-username');
        }
        
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showFieldError('register-email', '请输入有效的邮箱地址');
            isValid = false;
        } else {
            clearFieldError('register-email');
        }
        
        if (!password || password.length < 8) {
            showFieldError('register-password', '密码至少需要8个字符');
            isValid = false;
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
            showFieldError('register-password', '密码需包含大小写字母和数字');
            isValid = false;
        } else {
            clearFieldError('register-password');
        }
        
        if (password !== confirmPassword) {
            showFieldError('register-confirm-password', '两次密码输入不一致');
            isValid = false;
        } else {
            clearFieldError('register-confirm-password');
        }
        
        if (!agreeTerms) {
            showFieldError('agree-terms', '请先同意服务条款');
            isValid = false;
        } else {
            clearFieldError('agree-terms');
        }
    }
    
    return isValid;
}

function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}-error`);
    
    if (field) {
        field.classList.add('error');
        field.classList.remove('success');
    }
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}-error`);
    
    if (field) {
        field.classList.remove('error');
        field.classList.add('success');
    }
    
    if (errorElement) {
        errorElement.classList.remove('show');
    }
}

async function handleLogin() {
    if (!validateForm('login')) return;
    
    const btn = document.querySelector('#login-form .auth-btn');
    btn.classList.add('loading');
    btn.disabled = true;
    
    const identifier = document.getElementById('login-identifier').value.trim();
    const password = document.getElementById('login-password').value;
    
    const result = await authService.login({
        identifier,
        password
    });
    
    btn.classList.remove('loading');
    btn.disabled = false;
    
    if (result.success) {
        showToast('登录成功！正在跳转...', 'success');
        setTimeout(() => {
            const redirect = new URLSearchParams(window.location.search).get('redirect') || 'index.html';
            window.location.href = redirect;
        }, 1000);
    } else {
        showToast(result.error || '登录失败，请重试', 'error');
    }
}

async function handleRegister() {
    if (!validateForm('register')) return;
    
    const btn = document.querySelector('#register-form .auth-btn');
    btn.classList.add('loading');
    btn.disabled = true;
    
    const username = document.getElementById('register-username').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    
    const result = await authService.register({
        username,
        email,
        password
    });
    
    btn.classList.remove('loading');
    btn.disabled = false;
    
    if (result.success) {
        showToast('注册成功！正在跳转...', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    } else {
        showToast(result.error || '注册失败，请重试', 'error');
    }
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 20, density: { enable: true, value_area: 800 } },
                color: { value: ['#8b5cf6', '#ec4899', '#00f0ff'] },
                shape: { type: 'circle' },
                opacity: { value: 0.3, random: true },
                size: { value: 3, random: true },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#8b5cf6',
                    opacity: 0.1,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 0.5,
                    direction: 'none',
                    random: true,
                    out_mode: 'out'
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: { enable: true, mode: 'grab' },
                    onclick: { enable: true, mode: 'push' }
                },
                modes: {
                    grab: { distance: 120, line_linked: { opacity: 0.3 } },
                    push: { particles_nb: 2 }
                }
            },
            retina_detect: true
        });
    }
}

window.authService = authService;
window.permissionService = permissionService;
window.initAuthPage = initAuthPage;
