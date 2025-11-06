import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export const openDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (db) {
    return db;
  }

  db = await SQLite.openDatabaseAsync('qr_codes.db');
  
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS qr_codes (
      id TEXT PRIMARY KEY,
      name TEXT,
      type TEXT,
      data_json TEXT,
      style_json TEXT,
      is_pinned INTEGER DEFAULT 0,
      created_at INTEGER
    );
  `);

  return db;
};

export const getDatabase = (): SQLite.SQLiteDatabase => {
  if (!db) {
    throw new Error('Database not initialized. Call openDatabase first.');
  }
  return db;
};
