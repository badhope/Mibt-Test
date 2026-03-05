const { successResponse, errorResponse, generateId, sanitizeInput } = require('../utils/helpers');

let db = null;

function getDatabase() {
  if (!db) {
    db = new InMemoryDatabase();
  }
  return db;
}

class InMemoryDatabase {
  constructor() {
    this.users = new Map();
    this.comments = new Map();
    this.messages = new Map();
    this.testResults = new Map();
    this.backgrounds = new Map();
    this.sessions = new Map();
    
    this.initDefaultData();
  }
  
  initDefaultData() {
    this.backgrounds.set('default', {
      id: 'default',
      name: '默认星空',
      url: '',
      thumbnail: '',
      category: 'preset',
      createdAt: new Date().toISOString()
    });
    
    this.backgrounds.set('galaxy', {
      id: 'galaxy',
      name: '银河系',
      url: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1920',
      thumbnail: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=400',
      category: 'preset',
      createdAt: new Date().toISOString()
    });
    
    this.backgrounds.set('ocean', {
      id: 'ocean',
      name: '深海',
      url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920',
      thumbnail: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400',
      category: 'preset',
      createdAt: new Date().toISOString()
    });
    
    this.backgrounds.set('forest', {
      id: 'forest',
      name: '森林',
      url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920',
      thumbnail: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400',
      category: 'preset',
      createdAt: new Date().toISOString()
    });
    
    this.backgrounds.set('mountain', {
      id: 'mountain',
      name: '雪山',
      url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920',
      thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400',
      category: 'preset',
      createdAt: new Date().toISOString()
    });
  }
  
  async createUser(userData) {
    const id = generateId();
    const user = {
      id,
      ...userData,
      role: userData.role || 'user',
      avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      settings: {
        darkMode: true,
        animations: true,
        customBackground: null
      },
      stats: {
        testsCompleted: 0,
        commentsCount: 0
      }
    };
    
    this.users.set(id, user);
    return user;
  }
  
  async findUserById(id) {
    return this.users.get(id) || null;
  }
  
  async findUserByEmail(email) {
    for (const user of this.users.values()) {
      if (user.email === email) return user;
    }
    return null;
  }
  
  async findUserByUsername(username) {
    for (const user of this.users.values()) {
      if (user.username === username) return user;
    }
    return null;
  }
  
  async updateUser(id, updates) {
    const user = this.users.get(id);
    if (!user) return null;
    
    const updatedUser = {
      ...user,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async deleteUser(id) {
    return this.users.delete(id);
  }
  
  async createComment(commentData) {
    const id = generateId();
    const comment = {
      id,
      ...commentData,
      likes: 0,
      likedBy: [],
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.comments.set(id, comment);
    return comment;
  }
  
  async findCommentsByTestId(testId, options = {}) {
    const comments = Array.from(this.comments.values())
      .filter(c => c.testId === testId && c.status === 'active')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return comments;
  }
  
  async findCommentById(id) {
    return this.comments.get(id) || null;
  }
  
  async updateComment(id, updates) {
    const comment = this.comments.get(id);
    if (!comment) return null;
    
    const updatedComment = {
      ...comment,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    this.comments.set(id, updatedComment);
    return updatedComment;
  }
  
  async deleteComment(id) {
    return this.comments.delete(id);
  }
  
  async createMessage(messageData) {
    const id = generateId();
    const message = {
      id,
      ...messageData,
      replies: [],
      likes: 0,
      likedBy: [],
      isPinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.messages.set(id, message);
    return message;
  }
  
  async findAllMessages(options = {}) {
    const messages = Array.from(this.messages.values())
      .sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    
    return messages;
  }
  
  async findMessageById(id) {
    return this.messages.get(id) || null;
  }
  
  async updateMessage(id, updates) {
    const message = this.messages.get(id);
    if (!message) return null;
    
    const updatedMessage = {
      ...message,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    this.messages.set(id, updatedMessage);
    return updatedMessage;
  }
  
  async deleteMessage(id) {
    return this.messages.delete(id);
  }
  
  async addReplyToMessage(messageId, replyData) {
    const message = this.messages.get(messageId);
    if (!message) return null;
    
    const reply = {
      id: generateId(),
      ...replyData,
      createdAt: new Date().toISOString()
    };
    
    message.replies.push(reply);
    message.updatedAt = new Date().toISOString();
    
    return reply;
  }
  
  async saveTestResult(userId, resultData) {
    const id = generateId();
    const result = {
      id,
      userId,
      ...resultData,
      createdAt: new Date().toISOString()
    };
    
    this.testResults.set(id, result);
    
    const user = this.users.get(userId);
    if (user) {
      user.stats.testsCompleted = (user.stats.testsCompleted || 0) + 1;
      this.users.set(userId, user);
    }
    
    return result;
  }
  
  async findTestResultsByUser(userId) {
    return Array.from(this.testResults.values())
      .filter(r => r.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
  
  async findAllBackgrounds() {
    return Array.from(this.backgrounds.values());
  }
  
  async findBackgroundById(id) {
    return this.backgrounds.get(id) || null;
  }
  
  async createBackground(backgroundData) {
    const id = generateId();
    const background = {
      id,
      ...backgroundData,
      category: 'custom',
      createdAt: new Date().toISOString()
    };
    
    this.backgrounds.set(id, background);
    return background;
  }
  
  async deleteBackground(id) {
    if (this.backgrounds.get(id)?.category === 'preset') {
      return false;
    }
    return this.backgrounds.delete(id);
  }
  
  async createSession(userId, token) {
    const id = generateId();
    const session = {
      id,
      userId,
      token,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };
    
    this.sessions.set(id, session);
    return session;
  }
  
  async findSessionByToken(token) {
    for (const session of this.sessions.values()) {
      if (session.token === token) {
        if (new Date(session.expiresAt) > new Date()) {
          return session;
        }
        this.sessions.delete(session.id);
      }
    }
    return null;
  }
  
  async deleteSession(token) {
    for (const [id, session] of this.sessions.entries()) {
      if (session.token === token) {
        this.sessions.delete(id);
        return true;
      }
    }
    return false;
  }
}

module.exports = {
  getDatabase
};
