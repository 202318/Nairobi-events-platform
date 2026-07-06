const db = require("./config/db");

const sql = `
INSERT INTO categories (id, category_name)
VALUES
(1, 'Technology'),
(2, 'Business'),
(3, 'Education'),
(4, 'Music'),
(5, 'Sports'),
(6, 'Art'),
(7, 'Culture'),
(8, 'Food & Drink'),
(9, 'Fashion'),
(10, 'Community & Charity')
ON DUPLICATE KEY UPDATE category_name = VALUES(category_name);
`;

db.query(sql, (err) => {
  if (err) {
    console.error("Failed to update categories:", err.message);
    return;
  }

  console.log("Categories updated successfully.");
  process.exit();
});