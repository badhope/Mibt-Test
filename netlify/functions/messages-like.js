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
        
        const likedBy = message.likedBy || [];
        const hasLiked = likedBy.includes(user.id);
        
        let updatedMessage;
        if (hasLiked) {
            updatedMessage = await db.updateMessage(id, {
                likes: Math.max(0, message.likes - 1),
                likedBy: likedBy.filter(uid => uid !== user.id)
            });
        } else {
            updatedMessage = await db.updateMessage(id, {
                likes: (message.likes || 0) + 1,
                likedBy: [...likedBy, user.id]
            });
        }
        
        return successResponse({
            likes: updatedMessage.likes,
            hasLiked: !hasLiked
        });
        
    } catch (error) {
        console.error('Like message error:', error);
        return errorResponse('操作失败', 500);
    }
};
