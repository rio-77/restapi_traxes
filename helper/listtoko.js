import { openDatabase } from 'react-native-sqlite-storage';
import { Alert } from 'react-native';

const db = openDatabase({ name: 'localDB.db', location: 'default' });

// Create the table if it doesn't exist
export const createTable = () => {
  db.transaction((tx) => {
    tx.executeSql(  
      `CREATE TABLE IF NOT EXISTS customer (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id TEXT,
        customer_name TEXT,
        longitude TEXT,
        latitude TEXT
      );`,
      [],
      () => console.log('Table Customer List Toko created successfully'),
      (error) => console.error('Error creating table:', error)
    );
  });
};

// Insert data into the table
export const saveDataToSQLite = (customers) => {
Alert.alert('Sukses', 'Masuk fungsi save data customer');
  db.transaction((tx) => {
    customers.forEach((customer) => {
      tx.executeSql(
        `INSERT INTO customer (customer_id, customer_name, longitude, latitude) 
         VALUES (?, ?, ?, ?);`,
        [
          customer.customer_id,
          customer.customer_name || 'Tidak ditulis nama',
          customer.longitude,
          customer.latitude,
        ],
        () =>console.log('Data berhasil diunduh dan disimpan ke SQLite!'),
        (error) => console.error('Error inserting data:', error)
      );
    });
  });
};

// Fetch all data from the table
export const fetchAllData = (callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      `SELECT * FROM customer;`,
      [],
      (_, results) => {
        let rows = [];
        for (let i = 0; i < results.rows.length; i++) {
          rows.push(results.rows.item(i));
        }
        callback(rows);
      },
      (error) => console.error('Error fetching data:', error)
    );
  });
};
