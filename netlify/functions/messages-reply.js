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
        const params = event.queryStringParameters || {};
        const { id } = params;
        
        if (!id) {
            return errorResponse('缺少留言ID');
        }
        
        const message = await db.findMessageById(id);
        
        if (!message) {
            return errorResponse('留言不存在', 404);
        }
        
        const body = JSON.parse(event.body);
        const { content } = body;
        
        if (!content || content.length > 300) {
            return errorResponse('回复内容无效');
        }
        
        const reply = await db.addReplyToMessage(id, {
            userId: user.id,
            username: user.username || user.email,
            avatar: user.avatar,
            content: sanitizeInput(content)
        });
        
        return successResponse(reply, 201);
        
    } catch (error) {
        console.error('Reply message error:', error);
        return errorResponse('回复失败', 500);
    }
};
