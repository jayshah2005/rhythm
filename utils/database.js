import * as SQLite from 'expo-sqlite';

const DB_NAME = 'rhythm.db';

// Initialize database
export const initDatabase = () => {
  const db = SQLite.openDatabaseSync(DB_NAME);
  
  db.execSync(`
    CREATE TABLE IF NOT EXISTS cycles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      duration INTEGER NOT NULL,
      mood TEXT,
      completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  return db;
};

// Add a completed cycle
export const addCycle = (db, type, duration, mood = null) => {
  try {
    const result = db.runSync('INSERT INTO cycles (type, duration, mood) VALUES (?, ?, ?)', [type, duration, mood]);
    console.log('Cycle added:', { type, duration, mood, id: result.lastInsertRowId });
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error adding cycle:', error);
    throw error;
  }
};

// Get all cycles
export const getAllCycles = (db) => {
  try {
    return db.getAllSync('SELECT * FROM cycles ORDER BY completed_at DESC');
  } catch (error) {
    console.error('Error fetching cycles:', error);
    throw error;
  }
};

// Get cycles by date range
export const getCyclesByDateRange = (db, startDate, endDate) => {
  try {
    return db.getAllSync('SELECT * FROM cycles WHERE completed_at BETWEEN ? AND ? ORDER BY completed_at DESC', [startDate, endDate]);
  } catch (error) {
    console.error('Error fetching cycles by date range:', error);
    throw error;
  }
};

// Get cycles by type
export const getCyclesByType = (db, type) => {
  try {
    return db.getAllSync('SELECT * FROM cycles WHERE type = ? ORDER BY completed_at DESC', [type]);
  } catch (error) {
    console.error('Error fetching cycles by type:', error);
    throw error;
  }
};

// Get statistics
export const getStatistics = (db) => {
    try {
      const totalRow = db.getAllSync('SELECT CAST(COUNT(*) AS INTEGER) AS total FROM cycles')[0];
      const workRow = db.getAllSync('SELECT CAST(COUNT(*) AS INTEGER) AS work FROM cycles HAVING type = "work"')[0];
      const breakRow = db.getAllSync('SELECT CAST(COUNT(*) AS INTEGER) AS breaks FROM cycles HAVING type = "break"')[0];
      const todayRow = db.getAllSync('SELECT CAST(COUNT(*) AS INTEGER) AS today FROM cycles HAVING DATE(completed_at) = DATE("now")')[0];
  
      return {
        total: totalRow?.total ?? 0,
        work: workRow?.work ?? 0,
        breaks: breakRow?.breaks ?? 0,
        today: todayRow?.today ?? 0,
      };
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw error;
    }
  };
  
  
// Delete all cycles (for testing/reset)
export const clearAllCycles = (db) => {
  try {
    const result = db.runSync('DELETE FROM cycles');
    console.log('All cycles cleared');
    return result;
  } catch (error) {
    console.error('Error clearing cycles:', error);
    throw error;
  }
};
