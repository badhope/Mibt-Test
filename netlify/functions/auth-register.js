const { getDatabase } = require('../utils/db');
const { 
    successResponse, 
    errorResponse, 
    hashPassword, 
    comparePassword, 
    generateToken,
    validateEmail,
    validateUsername,
    validatePassword,
    sanitizeInput
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
        const { username, email, password } = body;
        
        if (!username || !email || !password) {
            return errorResponse('请填写所有必填字段');
        }
        
        const sanitizedUsername = sanitizeInput(username);
        const sanitizedEmail = sanitizeInput(email).toLowerCase();
        
        if (!validateUsername(sanitizedUsername)) {
            return errorResponse('用户名格式不正确（3-20个字符，仅字母数字下划线）');
        }
        
        if (!validateEmail(sanitizedEmail)) {
            return errorResponse('请输入有效的邮箱地址');
        }
        
        if (!validatePassword(password)) {
            return errorResponse('密码强度不足（需8-32位，包含大小写字母和数字）');
        }
        
        const db = getDatabase();
        
        const existingUser = await db.findUserByEmail(sanitizedEmail);
        if (existingUser) {
            return errorResponse('该邮箱已被注册');
        }
        
        const existingUsername = await db.findUserByUsername(sanitizedUsername);
        if (existingUsername) {
            return errorResponse('该用户名已被使用');
        }
        
        const hashedPassword = hashPassword(password);
        
        const user = await db.createUser({
            username: sanitizedUsername,
            email: sanitizedEmail,
            passwordHash: hashedPassword,
            role: 'user'
        });
        
        const token = generateToken({ 
            id: user.id, 
            email: user.email, 
            role: user.role 
        });
        
        await db.createSession(user.id, token);
        
        const { passwordHash, ...userWithoutPassword } = user;
        
        return successResponse({
            user: userWithoutPassword,
            token
        }, 201);
        
    } catch (error) {
        console.error('Register error:', error);
        return errorResponse('注册失败，请稍后重试', 500);
    }
};
