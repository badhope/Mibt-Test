const { getDatabase } = require('../utils/db');
const { 
    successResponse, 
    errorResponse, 
    getUserFromToken,
    sanitizeInput,
    paginate
} = require('../utils/helpers');

exports.handler = async (event, context) => {
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers: { ...require('../utils/helpers').headers }, body: '' };
    }
    
    try {
        const db = getDatabase();
        const params = event.queryStringParameters || {};
        
        if (event.httpMethod === 'GET') {
            const { page = 1, limit = 20 } = params;
            
            const messages = await db.findAllMessages();
            const result = paginate(messages, parseInt(page), parseInt(limit));
            
            return successResponse(result);
        }
        
        if (event.httpMethod === 'POST') {
            const user = getUserFromToken(event);
            
            if (!user) {
                return errorResponse('请先登录', 401);
            }
            
            const body = JSON.parse(event.body);
            const { content } = body;
            
            if (!content) {
                return errorResponse('内容不能为空');
            }
            
            if (content.length > 500) {
                return errorResponse('留言内容不能超过500字');
            }
            
            const message = await db.createMessage({
                userId: user.id,
                username: user.username || user.email,
                avatar: user.avatar,
                content: sanitizeInput(content)
            });
            
            return successResponse(message, 201);
        }
        
        return errorResponse('Method not allowed', 405);
        
    } catch (error) {
        console.error('Messages list error:', error);
        return errorResponse('操作失败', 500);
    }
};
