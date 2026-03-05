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
            return errorResponse('缺少评论ID');
        }
        
        const comment = await db.findCommentById(id);
        
        if (!comment) {
            return errorResponse('评论不存在', 404);
        }
        
        const likedBy = comment.likedBy || [];
        const hasLiked = likedBy.includes(user.id);
        
        let updatedComment;
        if (hasLiked) {
            updatedComment = await db.updateComment(id, {
                likes: Math.max(0, comment.likes - 1),
                likedBy: likedBy.filter(uid => uid !== user.id)
            });
        } else {
            updatedComment = await db.updateComment(id, {
                likes: (comment.likes || 0) + 1,
                likedBy: [...likedBy, user.id]
            });
        }
        
        return successResponse({
            likes: updatedComment.likes,
            hasLiked: !hasLiked
        });
        
    } catch (error) {
        console.error('Like comment error:', error);
        return errorResponse('操作失败', 500);
    }
};
