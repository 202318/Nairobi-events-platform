const db = require("./config/db");

const sql = `
ALTER TABLE users
ADD COLUMN organizer_status ENUM('none', 'pending', 'approved', 'rejected')
DEFAULT 'none';
`;

db.query(sql, (err) => {
  if (err) {
    if (err.message.includes("Duplicate column")) {
      console.log("organizer_status column already exists.");
      process.exit();
    }

    console.error("Failed to update users table:", err.message);
    return;
  }

  console.log("Users table updated successfully.");
  process.exit();
});