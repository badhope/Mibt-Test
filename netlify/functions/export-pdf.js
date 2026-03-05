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
        
        if (!testId) {
            return errorResponse('缺少测试ID');
        }
        
        const testResults = await db.findTestResultsByUser(user.id);
        const test = testResults.find(t => t.id === testId);
        
        if (!test) {
            return errorResponse('测试结果不存在', 404);
        }
        
        const userData = await db.findUserById(user.id);
        
        const reportData = {
            title: '人格星球探索 - 测试报告',
            user: {
                username: userData.username,
                testDate: test.createdAt
            },
            test: {
                mode: test.mode,
                scores: test.scores,
                topDimensions: test.topDimensions
            },
            generatedAt: new Date().toISOString()
        };
        
        return successResponse(reportData);
        
    } catch (error) {
        console.error('Export PDF error:', error);
        return errorResponse('导出失败', 500);
    }
};
