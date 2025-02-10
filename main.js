const express = require('express')
const dotenv = require('dotenv');
const path = require("path");
dotenv.config();

const connectDB = require(path.join(__dirname, "config", "mongo.config"));
const swaggerDocs = require(path.join(__dirname, "config", "swagger.config"));

async function main() {
  const app = express()
  const port = process.env.PORT || 3000

  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  // اتصال به دیتابیس
  await connectDB();

  // راه‌اندازی Swagger
  swaggerDocs(app);

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}

main().catch((err) => {
  console.error("❌ Error occurred while running the application:", err);
  process.exit(1); //باعث متوقف شدن یک بار برنامه می‌شود
});
