// swagger.js
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

// تنظیمات Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'API documentation for my Express application',
    },
    servers: [
      {
        url: 'http://localhost:3000', // URL سرور در حالت توسعه
      },
    ],
  },
  // apis: [path.join(__dirname, 'src', 'modules', '*.swagger.js')], // مسیر فایل‌های روت شما که باید مستنداتشان تولید شود
  apis: [process.cwd() + "/src/modules/**/*.swagger.js"], // مسیر فایل‌های روت شما که باید مستنداتشان تولید شود
};

// تولید مستندات Swagger
const swaggerSpec = swaggerJSDoc(swaggerOptions);

// ایجاد مسیر برای نمایش Swagger UI
const swaggerDocs = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = swaggerDocs;
