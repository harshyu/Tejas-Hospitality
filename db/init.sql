CREATE TABLE IF NOT EXISTS menu_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT,
  price REAL NOT NULL
);
CREATE TABLE IF NOT EXISTS invoices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT,
  total REAL,
  data TEXT
);
INSERT INTO menu_items (name, category, price) VALUES ('Margherita Pizza', 'Pizza', 250);
INSERT INTO menu_items (name, category, price) VALUES ('Farmhouse Pizza', 'Pizza', 320);
INSERT INTO menu_items (name, category, price) VALUES ('Veg Burger', 'Burger', 120);
INSERT INTO menu_items (name, category, price) VALUES ('Chicken Burger', 'Burger', 160);
INSERT INTO menu_items (name, category, price) VALUES ('French Fries', 'Sides', 80);
INSERT INTO menu_items (name, category, price) VALUES ('Coke 330ml', 'Beverage', 40);
INSERT INTO menu_items (name, category, price) VALUES ('Pepsi 330ml', 'Beverage', 40);
INSERT INTO menu_items (name, category, price) VALUES ('Veg Manchurian', 'Main', 200);
INSERT INTO menu_items (name, category, price) VALUES ('Fried Rice', 'Main', 180);
INSERT INTO menu_items (name, category, price) VALUES ('Gulab Jamun', 'Dessert', 60);
