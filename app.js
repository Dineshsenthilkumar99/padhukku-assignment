const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "padhakku.db");
let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE
      );

      CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        content TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES users (id)
      );
    `);

    app.listen(3000, () => {
      console.log("Server Is Running at http://localhost:3000");
    });
  } catch (e) {
    console.log(`DB Error ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

// User Sign-Up API
app.post("/api/signup", async (request, response) => {
  const { name, email } = request.body;
  try {
    const insertUserQuery = `INSERT INTO users (name, email) VALUES ('${name}', '${email}')`;
    await db.run(insertUserQuery);
    response.status(200).json({ message: "Successful user sign-up." });
  } catch (error) {
    response.status(400).json({ error: "User registration failed." });
  }
});

app.post("/api/posts", async (request, response) => {
  const { userId, content } = request.body;
  
  const isUserExistQuery = `SELECT * FROM posts WHERE userId = ${userId}`;
  const existingUser = await db.get(isUserExistQuery);

  if (existingUser === undefined) {
    response.status(404).json({ status: 404, message: "User ID not found." });
  } else if (content === "") {
    response.status(400).json({ status: 400, message: "Content cannot be empty." });
  } else {
    const insertPostQuery = `INSERT INTO posts (userId, content) VALUES (userId, "content")`;
    await db.run(insertPostQuery);
    response.status(200).json({ status: 200, message: "Successfully created." });
  }
});

// Delete Post API
app.delete("/api/deletepost/:postId", async (request, response) => {
  const { postId } = request.params;
  const isPostExistQuery = `SELECT * FROM posts WHERE postId = ?`;
  const existingPost = await db.get(isPostExistQuery, [postId]);

  if (!existingPost) {
    response.status(404).json({ status: 404, message: "Post ID not found." });
  } else {
    const deletePostQuery = `DELETE FROM posts WHERE postId = ?`;
    await db.run(deletePostQuery, [postId]);
    response.status(200).json({ status: 200, message: "Successful post deletion." });
  }
});

app.get("/api/posts/:userId", async (request, response) => {
  const { userId } = request.params;

  const isUserExistQuery = `SELECT * FROM users WHERE id = ?`;
  const existingUser = await db.get(isUserExistQuery, [userId]);

  if (existingUser === undefined) {
    response.status(404).json({ status: 404, message: "User ID not found." });
  } else {
    const getUserPostsQuery = `SELECT postId, content FROM posts WHERE userId = ?`;
    const posts = await db.all(getUserPostsQuery, [userId]);

    if (posts.length === 0) {
      response.status(404).json({ status: 404, message: "No posts found for this user." });
    } else {
      response.status(200).json({ status: 200, posts });
    }
  }
});




function isValidEmail(email) {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailPattern.test(email);
}
