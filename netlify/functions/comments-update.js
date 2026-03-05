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
    
    if (event.httpMethod !== 'PUT') {
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
            return errorResponse('缺少评论ID');
        }
        
        const comment = await db.findCommentById(id);
        
        if (!comment) {
            return errorResponse('评论不存在', 404);
        }
        
        if (comment.userId !== user.id && user.role !== 'ADMIN') {
            return errorResponse('无权修改此评论', 403);
        }
        
        const body = JSON.parse(event.body);
        const { content } = body;
        
        if (!content || content.length > 1000) {
            return errorResponse('评论内容无效');
        }
        
        const updatedComment = await db.updateComment(id, {
            content: sanitizeInput(content)
        });
        
        return successResponse(updatedComment);
        
    } catch (error) {
        console.error('Update comment error:', error);
        return errorResponse('更新失败', 500);
    }
};
