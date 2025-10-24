import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

const dbDir = path.join('/tmp', 'data')
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

const dbPath = path.join(dbDir, 'database.db')
const db = new Database(dbPath)

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS summaries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    contact_name TEXT NOT NULL,
    email TEXT NOT NULL,
    description TEXT NOT NULL,
    photos_before TEXT, -- JSON array of photo URLs
    photos_after TEXT,  -- JSON array of photo URLs
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`)

// Prepared statements
export const dbStatements = {
  // Contacts
  insertContact: db.prepare(`
    INSERT INTO contacts (name, email, phone, notes)
    VALUES (?, ?, ?, ?)
  `),

  getAllContacts: db.prepare(`
    SELECT * FROM contacts ORDER BY created_at DESC
  `),

  getContactByEmail: db.prepare(`
    SELECT * FROM contacts WHERE email = ?
  `),

  deleteContact: db.prepare(`
    DELETE FROM contacts WHERE id = ?
  `),

  // Summaries
  insertSummary: db.prepare(`
    INSERT INTO summaries (contact_name, email, description, photos_before, photos_after)
    VALUES (?, ?, ?, ?, ?)
  `),

  getAllSummaries: db.prepare(`
    SELECT * FROM summaries ORDER BY sent_at DESC
  `)
}

export default db