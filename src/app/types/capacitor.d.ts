declare module '@capacitor/network' {
  export interface ConnectionStatus {
    connected: boolean;
    connectionType: string;
  }

  export const Network: {
    getStatus(): Promise<ConnectionStatus>;
    addListener(eventName: string, listenerFunc: Function): any;
  };
}

declare module '@capacitor-community/sqlite' {
  export interface SQLiteValues {
    values?: any[];
  }

  export class SQLiteDBConnection {
    open(): Promise<void>;

    close(): Promise<void>;

    query(statement: string, values?: any[]): Promise<SQLiteValues>;

    run(statement: string, values?: any[]): Promise<any>;

    execute(statement: string): Promise<any>;
  }

  export class SQLiteConnection {
    constructor(sqlite?: any);

    createConnection(database: string, encrypted?: boolean, mode?: string, version?: number, readonly?: boolean): Promise<SQLiteDBConnection>;

    closeConnection(database: string): Promise<void>;
  }

  export const CapacitorSQLite: {
    createConnection(options: any): Promise<void>;
    closeConnection(options: any): Promise<void>;
    isConnection(options: any): Promise<any>;
  };
}
