import SQLite from 'react-native-sqlite-storage';

// Membuka database SQLite
const db = SQLite.openDatabase(
  {
    name: 'lokasi_toko.db',
    location: 'default',
  },
  () => {
    console.log('Database opened successfully.');
  },
  (error) => {
    console.error('Error opening database:', error);
  }
);

// Ambil data customer berdasarkan nama
export const getCustomerData = (customerName) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM lokasi_toko WHERE customer_name = ?',
        [customerName],
        (tx, results) => {
          if (results.rows.length > 0) {
            resolve(results.rows.item(0));
          } else {
            reject('Customer not found.');
          }
        },
        (error) => {
          reject('Error fetching customer data:', error);
        }
      );
    });
  });
};

// Ambil data employee
export const getEmployeeData = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM employees LIMIT 1',
        [],
        (tx, results) => {
          if (results.rows.length > 0) {
            resolve(results.rows.item(0));
          } else {
            reject('Employee not found.');
          }
        },
        (error) => {
          reject('Error fetching employee data:', error);
        }
      );
    });
  });
};

// Simpan data check-in ke dalam database lokal
export const saveCheckinData = (checkinData) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO checkin_logs (
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
          checkinData.update_toko,
        ],
        (_, result) => {
          resolve(result);
        },
        (error) => {
          reject('Error inserting check-in data into local DB:', error);
        }
      );
    });
  });
};
