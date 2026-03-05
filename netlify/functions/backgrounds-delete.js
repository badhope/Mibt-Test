const { getDatabase } = require('../utils/db');
const { 
    successResponse, 
    errorResponse, 
    getUserFromToken 
} = require('../utils/helpers');

exports.handler = async (event, context) => {
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers: { ...require('../utils/helpers').headers }, body: '' };
    }
    
    if (event.httpMethod !== 'DELETE') {
        return errorResponse('Method not allowed', 405);
    }
    
    const user = getUserFromToken(event);
    
    if (!user) {
        return errorResponse('请先登录', 401);
    }
    
    try {
        const db = getDatabase();
        const params = event.queryStringParameters || {};
        const { id } = params;
        
        if (!id) {
            return errorResponse('缺少背景ID');
        }
        
        const background = await db.findBackgroundById(id);
        
        if (!background) {
            return errorResponse('背景不存在', 404);
        }
        
        if (background.category === 'preset') {
            return errorResponse('预设背景不能删除');
        }
        
        if (background.userId && background.userId !== user.id && user.role !== 'ADMIN') {
            return errorResponse('无权删除此背景', 403);
        }
        
        await db.deleteBackground(id);
        
        return successResponse({ message: '删除成功' });
        
    } catch (error) {
        console.error('Delete background error:', error);
        return errorResponse('删除失败', 500);
    }
};
