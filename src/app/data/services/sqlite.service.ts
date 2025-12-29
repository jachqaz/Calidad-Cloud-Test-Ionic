import {Injectable, signal} from '@angular/core';
import {CapacitorSQLite, SQLiteConnection, SQLiteDBConnection} from '@capacitor-community/sqlite';
import {Capacitor} from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class SqliteService {
  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db: SQLiteDBConnection | null = null;
  private isInitialized = signal(false);
  private isWebPlatform = Capacitor.getPlatform() === 'web';
  private static instance: SqliteService;

  constructor() {
    if (SqliteService.instance) {
      return SqliteService.instance;
    }
    SqliteService.instance = this;
  }

  async initializeDatabase(): Promise<void> {
    if (this.isInitialized()) return;

    try {
      console.log('Initializing SQLite database...');

      if (this.isWebPlatform) {
        console.log('Using localStorage fallback for web platform');
        this.isInitialized.set(true);
        return;
      }

      this.db = await this.sqlite.createConnection(
        'library_db',
        false,
        'no-encryption',
        1,
        false
      );

      await this.db.open();
      console.log('Database connection opened');

      await this.createTables();
      console.log('Tables created successfully');

      this.isInitialized.set(true);
      console.log('Database initialization completed');
    } catch (error) {
      // If connection already exists, just mark as initialized
      if ((error as any)?.message?.includes('already exists')) {
        this.isInitialized.set(true);
        console.log('Database already initialized');
        return;
      }
      console.error('Database initialization failed:', error);
      throw error;
    }
  }

  async executeQuery(query: string, values?: any[]): Promise<any> {
    if (this.isWebPlatform) {
      return {values: []};
    }

    if (!this.isInitialized()) {
      await this.initializeDatabase();
    }

    // If still no db after initialization, return empty result
    if (!this.db) {
      return {values: []};
    }

    return await this.db.query(query, values);
  }

  async executeRun(query: string, values?: any[]): Promise<any> {
    if (this.isWebPlatform) {
      return {changes: {changes: 0}};
    }

    if (!this.isInitialized()) {
      await this.initializeDatabase();
    }

    // If still no db after initialization, return empty result
    if (!this.db) {
      return {changes: {changes: 0}};
    }

    return await this.db.run(query, values);
  }

  async close(): Promise<void> {
    if (this.db) {
      await this.db.close();
      this.db = null;
      this.isInitialized.set(false);
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const queries = [
      // Selected genres table
      `CREATE TABLE IF NOT EXISTS selected_genres
       (
         id
         TEXT
         PRIMARY
         KEY,
         name
         TEXT
         NOT
         NULL,
         key
         TEXT
         NOT
         NULL
         UNIQUE,
         created_at
         DATETIME
         DEFAULT
         CURRENT_TIMESTAMP
       )`,

      // Cached books table
      `CREATE TABLE IF NOT EXISTS cached_books
       (
         id
         TEXT
         PRIMARY
         KEY,
         key
         TEXT
         NOT
         NULL
         UNIQUE,
         title
         TEXT
         NOT
         NULL,
         author
         TEXT,
         authors
         TEXT,
         cover_id
         INTEGER,
         cover_url
         TEXT,
         first_publish_year
         INTEGER,
         published_year
         INTEGER,
         subjects
         TEXT,
         genre
         TEXT,
         description
         TEXT,
         edition_count
         INTEGER,
         isbn
         TEXT,
         language
         TEXT,
         publish_date
         TEXT,
         publisher
         TEXT,
         pages
         INTEGER,
         rating
         REAL,
         availability
         TEXT,
         created_at
         DATETIME
         DEFAULT
         CURRENT_TIMESTAMP,
         updated_at
         DATETIME
         DEFAULT
         CURRENT_TIMESTAMP
       )`,

      // Custom lists table
      `CREATE TABLE IF NOT EXISTS custom_lists
       (
         id
         TEXT
         PRIMARY
         KEY,
         name
         TEXT
         NOT
         NULL
         UNIQUE,
         description
         TEXT,
         book_count
         INTEGER
         DEFAULT
         0,
         created_at
         DATETIME
         DEFAULT
         CURRENT_TIMESTAMP,
         updated_at
         DATETIME
         DEFAULT
         CURRENT_TIMESTAMP
       )`,

      // List books junction table
      `CREATE TABLE IF NOT EXISTS list_books
      (
        id
        TEXT
        PRIMARY
        KEY,
        list_id
        TEXT
        NOT
        NULL,
        book_id
        TEXT
        NOT
        NULL,
        added_at
        DATETIME
        DEFAULT
        CURRENT_TIMESTAMP,
        FOREIGN
        KEY
       (
        list_id
       ) REFERENCES custom_lists
       (
         id
       ) ON DELETE CASCADE,
        FOREIGN KEY
       (
         book_id
       ) REFERENCES cached_books
       (
         id
       )
         ON DELETE CASCADE,
        UNIQUE
       (
         list_id,
         book_id
       )
        )`
    ];

    for (const query of queries) {
      await this.db.execute(query);
    }

    // Add missing columns if they don't exist
    try {
      await this.db.execute('ALTER TABLE cached_books ADD COLUMN author TEXT');
    } catch (e) {
      // Column already exists
    }

    try {
      await this.db.execute('ALTER TABLE cached_books ADD COLUMN published_year INTEGER');
    } catch (e) {
      // Column already exists
    }
  }
}
