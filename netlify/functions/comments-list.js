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
            const { testId, page = 1, limit = 20 } = params;
            
            if (!testId) {
                return errorResponse('缺少测试ID参数');
            }
            
            const comments = await db.findCommentsByTestId(testId);
            const result = paginate(comments, parseInt(page), parseInt(limit));
            
            return successResponse(result);
        }
        
        if (event.httpMethod === 'POST') {
            const user = getUserFromToken(event);
            
            if (!user) {
                return errorResponse('请先登录', 401);
            }
            
            const body = JSON.parse(event.body);
            const { testId, content, parentId } = body;
            
            if (!testId || !content) {
                return errorResponse('缺少必要参数');
            }
            
            if (content.length > 1000) {
                return errorResponse('评论内容不能超过1000字');
            }
            
            const comment = await db.createComment({
                testId,
                userId: user.id,
                username: user.username || user.email,
                content: sanitizeInput(content),
                parentId: parentId || null
            });
            
            return successResponse(comment, 201);
        }
        
        return errorResponse('Method not allowed', 405);
        
    } catch (error) {
        console.error('Comments list error:', error);
        return errorResponse('操作失败', 500);
    }
};
