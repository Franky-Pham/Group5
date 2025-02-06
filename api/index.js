const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const port = 3000;

const dbConfig = {
  host: 'localhost',
  user: 'apiuser',
  password: '123456',
  database: 'apidb'
};

app.use(express.json());

async function initDatabase() {
  try {
    const conn = await mysql.createConnection(dbConfig);
    const [tables] = await conn.query("SHOW TABLES LIKE 'images'");
    if (tables.length === 0) {
      const createTableQuery = `
        CREATE TABLE images (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          image_url VARCHAR(255) NOT NULL,
          description TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      await conn.query(createTableQuery);
      console.log("Table 'images' created");
    }
    await conn.end();
  } catch (error) {
    console.error("Database ERROR:", error);
    process.exit(1);
  }
}

initDatabase().then(() => {
  app.listen(port, () => {
    console.log(`The server is running on PORT: ${port}`);
  });
});

app.post('/api/images', async (req, res) => {
  const { title, image_url, description } = req.body;
  if (!title || !image_url) {
    return res.status(400).json({ error: 'Title and image_url are required' });
  }
  try {
    const conn = await mysql.createConnection(dbConfig);
    const query = "INSERT INTO images (title, image_url, description) VALUES (?, ?, ?)";
    const [result] = await conn.execute(query, [title, image_url, description || '']);
    await conn.end();
    res.status(201).json({ message: 'Image added successfully', id: result.insertId });
  } catch (error) {
    console.error("Error inserting image:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get('/api/images', async (req, res) => {
  try {
    const conn = await mysql.createConnection(dbConfig);
    const [rows] = await conn.execute("SELECT * FROM images");
    await conn.end();
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error retrieving images:", error);
    res.status(500).json({ error: "Failed to retrieve images" });
  }
});
