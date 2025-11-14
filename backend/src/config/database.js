import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database file path
const DB_PATH = process.env.DB_PATH || join(__dirname, '../../database.db');

/**
 * Initialize database connection
 * @returns {sqlite3.Database} Database instance
 */
export const initDatabase = () => {
  const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
      process.exit(1);
    }
    console.log('✅ Connected to SQLite database');
  });

  // Enable foreign keys
  db.run('PRAGMA foreign_keys = ON');
  
  return db;
};

/**
 * Create database tables
 * @param {sqlite3.Database} db - Database instance
 */
export const createTables = (db) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Categories table
      db.run(`
        CREATE TABLE IF NOT EXISTS categories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE,
          description TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Subcategories table
      db.run(`
        CREATE TABLE IF NOT EXISTS subcategories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          category_id INTEGER NOT NULL,
          name TEXT NOT NULL,
          description TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
          UNIQUE(category_id, name)
        )
      `);

      // Products table
      db.run(`
        CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          subcategory_id INTEGER NOT NULL,
          product_id TEXT NOT NULL UNIQUE,
          title TEXT NOT NULL,
          description TEXT,
          price REAL NOT NULL,
          color TEXT,
          image_url TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (subcategory_id) REFERENCES subcategories(id) ON DELETE CASCADE
        )
      `, (err) => {
        if (err) {
          console.error('Error creating tables:', err.message);
          reject(err);
        } else {
          console.log('✅ Database tables created successfully');
          resolve();
        }
      });
    });
  });
};

/**
 * Promisify database operations for cleaner async/await syntax
 */
export const dbAll = (db, query, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const dbRun = (db, query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

export const dbGet = (db, query, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export default { initDatabase, createTables, dbAll, dbRun, dbGet };
