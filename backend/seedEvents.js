const db = require("./config/db");

const seedUsers = `
INSERT INTO users (id, full_name, email, password, role)
VALUES
(1, 'Demo Organizer', 'organizer@test.com', '12345', 'organizer'),
(2, 'Demo User', 'user@test.com', '12345', 'user'),
(3, 'System Admin', 'admin@test.com', '12345', 'admin')
ON DUPLICATE KEY UPDATE email = email;
`;

const seedEvents = `
INSERT INTO events 
(title, description, event_date, location, price, image, tickets_available, category_id, organizer_id)
VALUES
(
  'Nairobi Tech Summit',
  'A technology networking event bringing together developers, startups, students and innovators in Nairobi.',
  '2026-08-10',
  'KICC',
  1500,
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
  100,
  1,
  1
),
(
  'Blankets & Wine',
  'A lifestyle and music event featuring live performances, food, fashion and outdoor entertainment.',
  '2026-08-15',
  'Carnivore Grounds',
  3000,
  'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800',
  100,
  2,
  1
),
(
  'Nairobi Marathon',
  'A sports event for professional runners, fitness lovers and community participants across Nairobi.',
  '2026-09-20',
  'Nyayo Stadium',
  800,
  'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800',
  100,
  3,
  1
);
`;

db.query(seedUsers, (err) => {
  if (err) {
    console.error("User seeding failed:", err.message);
    return;
  }

  db.query(seedEvents, (err) => {
    if (err) {
      console.error("Event seeding failed:", err.message);
      return;
    }

    console.log("Sample users and events inserted successfully.");
    process.exit();
  });
});