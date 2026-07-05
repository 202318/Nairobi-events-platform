const db = require("./config/db");

const sql = `
ALTER TABLE organizer_applications
ADD COLUMN sponsors TEXT,
ADD COLUMN target_audience VARCHAR(200),
ADD COLUMN expected_attendance INT;
`;

db.query(sql, (err) => {
  if (err) {
    if (err.message.includes("Duplicate column")) {
      console.log("Some columns already exist.");
      process.exit();
    }

    console.error("Failed to update organizer_applications table:", err.message);
    return;
  }

  console.log("organizer_applications table updated successfully.");
  process.exit();
});