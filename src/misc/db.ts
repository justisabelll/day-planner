import { Database } from 'bun:sqlite';
import type { Task } from './types';

let db: Database;

export const initDB = (): Database => {
  if (!db) {
    db = new Database(':memory:');
    db.run(
      'CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT, isDone BOOLEAN)'
    );
  }
  return db;
};

export function addNewTask(task: string): Task[] {
  db.run('INSERT INTO tasks (text, isDone) VALUES (?, ?)', [task, false]);
  return db.query('SELECT * FROM tasks').all() as Task[];
}

export function getTasks(): Task[] {
  return db.query('SELECT * FROM tasks').all() as Task[];
}

export function deleteTask(id: number): Task[] {
  db.run('DELETE FROM tasks WHERE id = ?', [id]);
  return db.query('SELECT * FROM tasks').all() as Task[];
}

export function toggleTask(id: number, isDone: boolean): Task[] {
  db.run('UPDATE tasks SET isDone = ? WHERE id = ?', [isDone, id]);
  return db.query('SELECT * FROM tasks').all() as Task[];
}

export function updateTask(
  id: number,
  text?: string,
  isDone?: boolean
): Task[] {
  const updates = [];
  const values = [];

  if (text !== undefined) {
    updates.push('text = ?');
    values.push(text);
  }
  if (isDone !== undefined) {
    updates.push('isDone = ?');
    values.push(isDone);
  }

  if (updates.length > 0) {
    const sql = `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`;
    values.push(id);
    db.run(sql, values);
  }
  return db.query('SELECT * FROM tasks').all() as Task[];
}
