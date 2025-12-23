import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbDir = path.join(process.cwd(), 'data');
const dbPath = path.join(dbDir, 'webhooks.db');

// Ensure data directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS webhooks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    method TEXT NOT NULL,
    url TEXT NOT NULL,
    headers TEXT NOT NULL,
    body TEXT,
    query TEXT,
    ip TEXT,
    created_at INTEGER NOT NULL
  )
`);

// Create index on created_at for faster queries
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_created_at ON webhooks(created_at)
`);

export interface WebhookLog {
  id: number;
  method: string;
  url: string;
  headers: string;
  body: string | null;
  query: string | null;
  ip: string | null;
  created_at: number;
}

export function insertWebhook(data: {
  method: string;
  url: string;
  headers: string;
  body?: string;
  query?: string;
  ip?: string;
}): number {
  const stmt = db.prepare(`
    INSERT INTO webhooks (method, url, headers, body, query, ip, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  
  const result = stmt.run(
    data.method,
    data.url,
    data.headers,
    data.body || null,
    data.query || null,
    data.ip || null,
    Date.now()
  );
  
  return result.lastInsertRowid as number;
}

export function getWebhooks(minutesAgo: number): WebhookLog[] {
  const timestamp = Date.now() - (minutesAgo * 60 * 1000);
  const stmt = db.prepare(`
    SELECT * FROM webhooks 
    WHERE created_at >= ? 
    ORDER BY created_at DESC
  `);
  
  return stmt.all(timestamp) as WebhookLog[];
}

export function deleteOldWebhooks(): number {
  const timestamp = Date.now() - (24 * 60 * 60 * 1000); // 24 hours ago
  const stmt = db.prepare(`
    DELETE FROM webhooks WHERE created_at < ?
  `);
  
  const result = stmt.run(timestamp);
  return result.changes;
}

export default db;
