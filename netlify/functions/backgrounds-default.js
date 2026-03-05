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
    
    if (event.httpMethod !== 'POST') {
        return errorResponse('Method not allowed', 405);
    }
    
    const user = getUserFromToken(event);
    
    if (!user) {
        return errorResponse('请先登录', 401);
    }
    
    try {
        const db = getDatabase();
        const body = JSON.parse(event.body);
        const { id } = body;
        
        if (!id) {
            return errorResponse('缺少背景ID');
        }
        
        const background = await db.findBackgroundById(id);
        
        if (!background) {
            return errorResponse('背景不存在', 404);
        }
        
        const updatedUser = await db.updateUser(user.id, {
            settings: {
                customBackground: id
            }
        });
        
        return successResponse({
            background,
            user: updatedUser
        });
        
    } catch (error) {
        console.error('Set default background error:', error);
        return errorResponse('操作失败', 500);
    }
};
