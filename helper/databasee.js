import SQLite from 'react-native-sqlite-storage';

// Membuka database
export const db = SQLite.openDatabase(
  { name: 'appDB', location: 'default' },
  () => console.log('Database opened'),
  (error) => console.error('Failed to open database:', error)
);

// Buat tabel user jika belum ada
export const createUserTable = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nik TEXT,
        employee_id TEXT,
        fullname TEXT,
        type_id TEXT,
        project_id TEXT
      )`,
      [],
      () => console.log('Table "user" created successfully'),
      (error) => console.error('Failed to create table "user":', error)
    );
  });
};

// Fungsi untuk mendapatkan data pengguna
export const getUserProfile = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM user LIMIT 1',
        [],
        (tx, results) => {
          if (results.rows.length > 0) {
            resolve(results.rows.item(0));
          } else {
            reject('No user data found');
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  });
};

// Buat tabel check-in jika belum ada
export const createCheckInTable = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS checkin (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_id TEXT,
        jabatan_id TEXT,
        project_id TEXT,
        date_cio TEXT,
        datetimephone_in TEXT,
        latitude_in TEXT,
        longitude_in TEXT,
        radius_in REAL,
        distance_in REAL,
        foto_in TEXT,
        keterangan TEXT
      )`,
      [],
      () => console.log('Table "checkin" created successfully'),
      (error) => console.error('Failed to create table "checkin":', error)
    );
  });
};

// Simpan data check-in ke SQLite
export const saveCheckInToSQLite = (data) => {
  db.transaction((tx) => {
    tx.executeSql(
      `INSERT INTO checkin 
      (employee_id, jabatan_id, project_id, date_cio, datetimephone_in, latitude_in, longitude_in, radius_in, distance_in, foto_in, keterangan) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.employee_id,
        data.jabatan_id,
        data.project_id,
        data.date_cio,
        data.datetimephone_in,
        data.latitude_in,
        data.longitude_in,
        data.radius_in,
        data.distance_in,
        data.foto_in,
        data.keterangan,
      ],
      () => console.log('Check-in data saved to SQLite'),
      (error) => console.error('Failed to save check-in data to SQLite:', error)
    );
  });
};
