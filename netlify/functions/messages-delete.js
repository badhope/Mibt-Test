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
            return errorResponse('缺少留言ID');
        }
        
        const message = await db.findMessageById(id);
        
        if (!message) {
            return errorResponse('留言不存在', 404);
        }
        
        if (message.userId !== user.id && user.role !== 'ADMIN') {
            return errorResponse('无权删除此留言', 403);
        }
        
        await db.deleteMessage(id);
        
        return successResponse({ message: '删除成功' });
        
    } catch (error) {
        console.error('Delete message error:', error);
        return errorResponse('删除失败', 500);
    }
};
