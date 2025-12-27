import {Injectable} from '@angular/core';
import {CapacitorSQLite, SQLiteConnection, SQLiteDBConnection} from '@capacitor-community/sqlite';

@Injectable({
  providedIn: 'root'
})
export class SQLiteService {
  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db: SQLiteDBConnection | null = null;
  private readonly DB_NAME = 'open_library_manager.db';

  async initializeDatabase(): Promise<void> {
    try {
      this.db = await this.sqlite.createConnection(
        this.DB_NAME,
        false,
        'no-encryption',
        1,
        false
      );

      await this.db.open();
      await this.createTables();
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw error;
    }
  }

  getDatabase(): SQLiteDBConnection {
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    return this.db;
  }

  private async createTables(): Promise<void> {
    const createBooksTable = `
      CREATE TABLE IF NOT EXISTS books
      (
        id
        TEXT
        PRIMARY
        KEY,
        title
        TEXT
        NOT
        NULL,
        author
        TEXT
        NOT
        NULL,
        genre
        TEXT
        NOT
        NULL,
        isbn
        TEXT,
        published_year
        INTEGER,
        description
        TEXT,
        cover_url
        TEXT,
        rating
        REAL,
        created_at
        TEXT
        NOT
        NULL,
        updated_at
        TEXT
        NOT
        NULL
      );
    `;

    const createListsTable = `
      CREATE TABLE IF NOT EXISTS custom_lists
      (
        id
        TEXT
        PRIMARY
        KEY,
        name
        TEXT
        NOT
        NULL,
        description
        TEXT,
        book_ids
        TEXT
        NOT
        NULL,
        created_at
        TEXT
        NOT
        NULL,
        updated_at
        TEXT
        NOT
        NULL
      );
    `;

    await this.db!.execute(createBooksTable);
    await this.db!.execute(createListsTable);
  }
}
