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
    
    if (event.httpMethod !== 'POST') {
        return errorResponse('Method not allowed', 405);
    }
    
    const user = getUserFromToken(event);
    
    if (!user || user.role !== 'ADMIN') {
        return errorResponse('无权执行此操作', 403);
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
        
        const updatedMessage = await db.updateMessage(id, {
            isPinned: !message.isPinned
        });
        
        return successResponse({
            isPinned: updatedMessage.isPinned
        });
        
    } catch (error) {
        console.error('Pin message error:', error);
        return errorResponse('操作失败', 500);
    }
};
