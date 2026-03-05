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
    
    if (event.httpMethod !== 'GET') {
        return errorResponse('Method not allowed', 405);
    }
    
    const user = getUserFromToken(event);
    
    if (!user) {
        return errorResponse('请先登录', 401);
    }
    
    try {
        const db = getDatabase();
        const params = event.queryStringParameters || {};
        const { testId } = params;
        
        const userData = await db.findUserById(user.id);
        const testHistory = await db.findTestResultsByUser(user.id);
        
        const exportData = {
            user: {
                username: userData.username,
                email: userData.email,
                createdAt: userData.createdAt,
                stats: userData.stats
            },
            testHistory: testHistory,
            settings: userData.settings,
            exportedAt: new Date().toISOString(),
            version: '2.0'
        };
        
        if (testId) {
            const specificTest = testHistory.find(t => t.id === testId);
            if (specificTest) {
                exportData.specificTest = specificTest;
            }
        }
        
        return successResponse(exportData);
        
    } catch (error) {
        console.error('Export JSON error:', error);
        return errorResponse('导出失败', 500);
    }
};
