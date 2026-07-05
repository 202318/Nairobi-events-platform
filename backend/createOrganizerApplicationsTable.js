const db = require("./config/db");

const sql = `
CREATE TABLE IF NOT EXISTS organizer_applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  organizer_name VARCHAR(150) NOT NULL,
  event_title VARCHAR(200) NOT NULL,
  event_category VARCHAR(100) NOT NULL,
  event_description TEXT,
  proposed_date DATE,
  location VARCHAR(200),
  expected_price DECIMAL(10,2),
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
`;

db.query(sql, (err) => {
  if (err) {
    console.error("Failed to create organizer_applications table:", err.message);
    return;
  }

  console.log("organizer_applications table created successfully.");
  process.exit();
});