import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({ name: 'userDatabase.db', location: 'default' });

export const createTable = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nik TEXT NOT NULL,
        name TEXT,
        email TEXT,
        deviceID TEXT,
        created_at TEXT
      );`,
      [],
      () => {
        console.log('Tabel `user` berhasil dibuat atau sudah ada');
      },
      (error) => {
        console.error('Error saat membuat tabel:', error);
      }
    );
  });
};

export const saveUserData = (userData) => {
  db.transaction((tx) => {
    tx.executeSql(
      'INSERT INTO user (nik, name, email, deviceID, created_at) VALUES (?, ?, ?, ?, ?)',
      [userData.nik, userData.name, userData.email, userData.deviceID, new Date().toISOString()],
      (_, result) => {
        console.log('Data pengguna berhasil disimpan');
      },
      (error) => {
        console.error('Error saat menyimpan data pengguna:', error);
      }
    );
  });
};

export default db;
