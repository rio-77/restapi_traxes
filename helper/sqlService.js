import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'checkin.db', location: 'default' },
  () => console.log('Database opened'),
  (err) => console.error('Error opening database:', err)
);

export const initializeDatabase = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS Checkin (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_id TEXT,
        customer_id TEXT,
        jabatan_id TEXT,
        date_cio TEXT,
        status_emp TEXT,
        datetimephone_in TEXT,
        project_id TEXT,
        latitude_in TEXT,
        longitude_in TEXT,
        radius_in REAL,
        distance_in REAL,
        foto_in TEXT,
        keterangan TEXT,
        apk TEXT,
        update_toko TEXT
      );`
    );
  });
};

export const saveToDatabase = (data, successCallback, errorCallback) => {
  db.transaction((tx) => {
    tx.executeSql(
      `INSERT INTO Checkin (employee_id, customer_id, jabatan_id, date_cio, status_emp, datetimephone_in, project_id, latitude_in, longitude_in, radius_in, distance_in, foto_in, keterangan, apk, update_toko) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        data.employee_id,
        data.customer_id,
        data.jabatan_id,
        data.date_cio,
        data.status_emp,
        data.datetimephone_in,
        data.project_id,
        data.latitude_in,
        data.longitude_in,
        data.radius_in,
        data.distance_in,
        data.foto_in || '',
        data.keterangan,
        data.apk,
        data.update_toko,
      ],
      (tx, results) => {
        if (results.rowsAffected > 0) {
          successCallback && successCallback();
        } else {
          errorCallback && errorCallback('Failed to insert data.');
        }
      },
      (tx, error) => {
        errorCallback && errorCallback(error.message);
      }
    );
  });
};
