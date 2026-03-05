const { getDatabase } = require('../utils/db');
const { 
    successResponse, 
    errorResponse, 
    getUserFromToken,
    sanitizeInput
} = require('../utils/helpers');

exports.handler = async (event, context) => {
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers: { ...require('../utils/helpers').headers }, body: '' };
    }
    
    const user = getUserFromToken(event);
    
    if (!user) {
        return errorResponse('未授权访问', 401);
    }
    
    try {
        const db = getDatabase();
        
        if (event.httpMethod === 'GET') {
            const userData = await db.findUserById(user.id);
            
            if (!userData) {
                return errorResponse('用户不存在', 404);
            }
            
            const { passwordHash, ...userWithoutPassword } = userData;
            
            return successResponse(userWithoutPassword);
        }
        
        if (event.httpMethod === 'PUT') {
            const body = JSON.parse(event.body);
            const { avatar, settings } = body;
            
            const updates = {};
            
            if (avatar) {
                updates.avatar = sanitizeInput(avatar);
            }
            
            if (settings) {
                updates.settings = {
                    darkMode: settings.darkMode ?? true,
                    animations: settings.animations ?? true,
                    customBackground: settings.customBackground || null
                };
            }
            
            const updatedUser = await db.updateUser(user.id, updates);
            
            if (!updatedUser) {
                return errorResponse('更新失败', 400);
            }
            
            const { passwordHash, ...userWithoutPassword } = updatedUser;
            
            return successResponse(userWithoutPassword);
        }
        
        return errorResponse('Method not allowed', 405);
        
    } catch (error) {
        console.error('Profile error:', error);
        return errorResponse('操作失败', 500);
    }
};
