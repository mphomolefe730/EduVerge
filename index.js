import express from "express";
import mysql from "mysql2";

const app = express();
const port = 3306;

const db = mysql.createConnection({
  host: 'eduverge.cl0g8i8qykzl.eu-north-1.rds.amazonaws.com',
  user: 'admin',
  password: 'IAMKKO22',
  database: 'EduVerge',
  port: 3306
});

db.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.stack);
    return;
  }
  console.log('✅ Connected to AWS RDS!');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
