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
    
    try {
        const token = event.headers.authorization?.replace('Bearer ', '');
        
        if (token) {
            const db = getDatabase();
            await db.deleteSession(token);
        }
        
        return successResponse({ message: '登出成功' });
        
    } catch (error) {
        console.error('Logout error:', error);
        return errorResponse('登出失败', 500);
    }
};
