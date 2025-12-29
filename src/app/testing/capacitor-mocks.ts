// Mock for @capacitor/network
export const Network = {
  getStatus: jasmine.createSpy('getStatus').and.returnValue(Promise.resolve({connected: true})),
  addListener: jasmine.createSpy('addListener')
};

// Mock for @capacitor-community/sqlite
export const CapacitorSQLite = {
  createConnection: jasmine.createSpy('createConnection'),
  closeConnection: jasmine.createSpy('closeConnection'),
  isConnection: jasmine.createSpy('isConnection')
};

export class SQLiteConnection {
  createConnection = jasmine.createSpy('createConnection');
  closeConnection = jasmine.createSpy('closeConnection');
}

export class SQLiteDBConnection {
  open = jasmine.createSpy('open');
  close = jasmine.createSpy('close');
  query = jasmine.createSpy('query');
  run = jasmine.createSpy('run');
}
