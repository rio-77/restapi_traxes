import SQLite from 'react-native-sqlite-storage';

// Membuka atau membuat database
const db = SQLite.openDatabase(
  {
    name: 'checkin.db',
    location: 'default',
  },
  () => console.log('Database opened successfully'),
  error => console.error('Error opening database', error)
);

// Membuat tabel check-in jika belum ada
export const createCheckinTable = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS checkin (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_id TEXT,
        customer_id TEXT,
        jabatan_id TEXT,
        date_cio TEXT,
        status_emp TEXT,
        datetimephone_in TEXT,
        project_id TEXT,
        latitude_in REAL,
        longitude_in REAL,
        radius_in REAL,
        distance_in REAL,
        foto_in TEXT,
        keterangan TEXT,
        apk TEXT,
        update_toko TEXT
      );`,
      [],
      () => console.log('Check-in table created successfully'),
      error => console.error('Error creating check-in table', error)
    );
  });
};

// Menyimpan data check-in ke database lokal
export const saveCheckinToLocalDB = (checkinData) => {
  db.transaction(tx => {
    tx.executeSql(
      `INSERT INTO checkin (
        employee_id, customer_id, jabatan_id, date_cio, status_emp,
        datetimephone_in, project_id, latitude_in, longitude_in,
        radius_in, distance_in, foto_in, keterangan, apk, update_toko
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        checkinData.employee_id,
        checkinData.customer_id,
        checkinData.jabatan_id,
        checkinData.date_cio,
        checkinData.status_emp,
        checkinData.datetimephone_in,
        checkinData.project_id,
        checkinData.latitude_in,
        checkinData.longitude_in,
        checkinData.radius_in,
        checkinData.distance_in,
        checkinData.foto_in,
        checkinData.keterangan,
        checkinData.apk,
        checkinData.update_toko
      ],
      (_, result) => console.log('Check-in saved to local SQLite:', result),
      error => console.error('Error saving check-in to SQLite:', error)
    );
  });
};

// Mengambil semua data check-in dari database lokal
export const getCheckinData = (callback) => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM checkin',
      [],
      (_, results) => {
        const rows = results.rows;
        let data = [];
        for (let i = 0; i < rows.length; i++) {
          data.push(rows.item(i));
        }
        callback(data);
      },
      error => console.error('Error fetching check-in data:', error)
    );
  });
};

// Hapus semua data check-in (opsional)
export const clearCheckinTable = () => {
  db.transaction(tx => {
    tx.executeSql(
      'DELETE FROM checkin',
      [],
      () => console.log('Check-in table cleared successfully'),
      error => console.error('Error clearing check-in table:', error)
    );
  });
};
