const express = require('express')
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const path = require("path");
const cors = require('cors');
dotenv.config();

const connectDB = require(path.join(__dirname, "src", "config", "mongo.config"));
const swaggerDocs = require(path.join(__dirname, "src", "config", "swagger.config"));
const mainRouter = require("./src/app.routes");
const AllExceptionHandler = require("./src/common/exception/all-exception.handler");
const notFoundError = require("./src/common/exception/not-found.handler");

async function main() {
  const app = express()
  const port = process.env.PORT || 3000

  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  app.use(cookieParser());

  // فعال‌سازی CORS
  app.use(cors({
    origin: 'http://localhost:4000',  // فقط درخواست‌ها از این دامنه مجاز هستند
    methods: ['GET', 'POST'],         // فقط متدهای GET و POST مجاز هستند
    allowedHeaders: ['Content-Type', 'Authorization'],  // فقط هدرهای خاص مجاز هستند
  }));

  // اتصال به دیتابیس
  await connectDB();

  // راه‌اندازی Swagger
  swaggerDocs(app);

  app.use(mainRouter)

  // هندل کردن استثناها (خطاهای عمومی)
  app.use(AllExceptionHandler);

  // هندل کردن خطای 404 (مسیر پیدا نشد)
  app.use(notFoundError);
  // NotFoundHandler(app); // به این روش هم می شه نوشت

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}

main().catch((err) => {
  console.error("❌ Error occurred while running the application:", err);
  process.exit(1); //باعث متوقف شدن یک بار برنامه می‌شود
});
