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
    
    try {
        const db = getDatabase();
        
        if (event.httpMethod === 'GET') {
            const backgrounds = await db.findAllBackgrounds();
            
            const grouped = {
                presets: backgrounds.filter(b => b.category === 'preset'),
                custom: backgrounds.filter(b => b.category === 'custom')
            };
            
            return successResponse(grouped);
        }
        
        return errorResponse('Method not allowed', 405);
        
    } catch (error) {
        console.error('Backgrounds list error:', error);
        return errorResponse('操作失败', 500);
    }
};
