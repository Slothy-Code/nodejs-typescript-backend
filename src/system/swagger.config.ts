require('dotenv').config();

const serverURL = (process.env.USE_SSL === 'true' ? 'https://' : 'http://') + process.env.HOST + ':' + process.env.PORT;
const serverDescription = process.env.PROD === 'true' ? 'Production server' : 'Development server';

const swaggerConfig = {
    'swaggerDefinition': {
        'info': {
            'title': 'Node Swagger API',
            'version': '1.0.0',
            'description': 'Hello i am swagger . I am one step ahead of postman. My job is to provide API description'
        },
        'servers': [
            {
                'url': serverURL,
                'description': serverDescription
            }
        ],
        'openapi': '3.0.0'
    },
    'apis': [
        './src/interfaces/schemas/*.ts',
        './src/controllers/swagger/*.yaml',
        './src/system/*.yaml'
    ]
};


export default swaggerConfig;