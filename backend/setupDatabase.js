const db = require("./config/db");

const schema = `
CREATE DATABASE IF NOT EXISTS nairobi_events;
USE nairobi_events;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('user','organizer','admin') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_name VARCHAR(100) NOT NULL
);

INSERT IGNORE INTO categories (id, category_name) VALUES
(1, 'Technology'),
(2, 'Music'),
(3, 'Sports'),
(4, 'Business'),
(5, 'Education');

CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  event_date DATE,
  location VARCHAR(200),
  price DECIMAL(10,2),
  image VARCHAR(500),
  tickets_available INT DEFAULT 100,
  category_id INT,
  organizer_id INT,
  FOREIGN KEY(category_id) REFERENCES categories(id),
  FOREIGN KEY(organizer_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  event_id INT,
  quantity INT,
  total_amount DECIMAL(10,2),
  booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(event_id) REFERENCES events(id)
);

CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  rating INT,
  comment TEXT,
  user_id INT,
  event_id INT,
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(event_id) REFERENCES events(id)
);
`;

db.query(schema, (err) => {
  if (err) {
    console.error("Database setup failed:", err.message);
    return;
  }

  console.log("Database and tables created successfully.");
  process.exit();
});