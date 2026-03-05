const { getDatabase } = require('../utils/db');
const { 
    successResponse, 
    errorResponse, 
    getUserFromToken,
    generateId
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
        
        let body;
        try {
            body = JSON.parse(event.body);
        } catch (e) {
            return errorResponse('无效的请求数据');
        }
        
        const { name, url, thumbnail } = body;
        
        if (!url) {
            return errorResponse('缺少图片URL');
        }
        
        if (url.length > 2000) {
            return errorResponse('URL过长');
        }
        
        const background = await db.createBackground({
            name: name || `自定义背景 ${Date.now()}`,
            url,
            thumbnail: thumbnail || url,
            userId: user.id
        });
        
        return successResponse(background, 201);
        
    } catch (error) {
        console.error('Upload background error:', error);
        return errorResponse('上传失败', 500);
    }
};
