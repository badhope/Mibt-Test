const { getDatabase } = require('../utils/db');
const { 
    successResponse, 
    errorResponse, 
    comparePassword, 
    generateToken
} = require('../utils/helpers');

exports.handler = async (event, context) => {
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers: { ...require('../utils/helpers').headers }, body: '' };
    }
    
    if (event.httpMethod !== 'POST') {
        return errorResponse('Method not allowed', 405);
    }
    
    try {
        const body = JSON.parse(event.body);
        const { identifier, password } = body;
        
        if (!identifier || !password) {
            return errorResponse('请填写所有必填字段');
        }
        
        const db = getDatabase();
        
        let user = await db.findUserByEmail(identifier.toLowerCase());
        
        if (!user) {
            user = await db.findUserByUsername(identifier);
        }
        
        if (!user) {
            return errorResponse('用户名或密码错误');
        }
        
        const isPasswordValid = comparePassword(password, user.passwordHash);
        
        if (!isPasswordValid) {
            return errorResponse('用户名或密码错误');
        }
        
        const token = generateToken({ 
            id: user.id, 
            email: user.email, 
            role: user.role 
        });
        
        await db.createSession(user.id, token);
        
        await db.updateUser(user.id, {
            lastLogin: new Date().toISOString()
        });
        
        const { passwordHash, ...userWithoutPassword } = user;
        
        return successResponse({
            user: userWithoutPassword,
            token
        });
        
    } catch (error) {
        console.error('Login error:', error);
        return errorResponse('登录失败，请稍后重试', 500);
    }
};
