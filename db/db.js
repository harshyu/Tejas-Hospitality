const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');
const dbPath = path.join(__dirname, 'app.db');
function init() {
  const exists = fs.existsSync(dbPath);
  const db = new Database(dbPath);
  if (!exists) {
    const initSql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
    db.exec(initSql);
  }
  return db;
}
const db = init();
module.exports = {
  getMenu: function() {
    const stmt = db.prepare('SELECT id, name, category, price FROM menu_items ORDER BY category, name');
    return stmt.all();
  },
  saveInvoice: function(created_at, total, dataJson) {
    const stmt = db.prepare('INSERT INTO invoices (created_at, total, data) VALUES (?, ?, ?)');
    const info = stmt.run(created_at, total, dataJson);
    return info.lastInsertRowid;
  },
  getInvoices: function() {
    const stmt = db.prepare('SELECT id, created_at, total FROM invoices ORDER BY id DESC');
    return stmt.all();
  }
};
