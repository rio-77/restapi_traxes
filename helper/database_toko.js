import SQLite from 'react-native-sqlite-storage';

const database_name = 'tokoDatabase.db';
const database_version = '1.0';
const database_displayname = 'Toko Database';
const database_size = 200000;

const db = SQLite.openDatabase(
  { name: database_name, location: 'default' },
  () => console.log('Database berhasil dibuka'),
  error => console.log('Database gagal dibuka: ', error)
);

export const createTable = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id TEXT,
        customer_name TEXT,
        owner_name TEXT,
        no_contact TEXT,
        address TEXT,
        village_id TEXT,
        district_id TEXT,
        city_id TEXT,
        latitude REAL,
        longitude REAL,
        photo TEXT,
        createdby TEXT
      );`,
      [],
      () => console.log('Tabel berhasil dibuat'),
      error => console.log('Error membuat tabel: ', error)
    );
  });
};

export const saveCustomerToDB = (customerData) => {
  const {
    customer_id,
    customer_name,
    owner_name,
    no_contact,
    address,
    village_id,
    district_id,
    city_id,
    latitude,
    longitude,
    photo,
    createdby,
  } = customerData;

  db.transaction(tx => {
    tx.executeSql(
      `INSERT INTO customers (
        customer_id, customer_name, owner_name, no_contact, address, village_id, district_id, city_id, latitude, longitude, photo, createdby
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        customer_id,
        customer_name,
        owner_name,
        no_contact,
        address,
        village_id,
        district_id,
        city_id,
        latitude,
        longitude,
        photo,
        createdby,
      ],
      () => console.log('Data berhasil disimpan ke database'),
      error => console.log('Error menyimpan data: ', error)
    );
  });
};

export const getAllCustomersFromDB = (callback) => {
  db.transaction(tx => {
    tx.executeSql(
      `SELECT * FROM customers;`,
      [],
      (tx, results) => {
        const customers = [];
        for (let i = 0; i < results.rows.length; i++) {
          customers.push(results.rows.item(i));
        }
        callback(customers); // Kembalikan semua data pelanggan
      },
      error => console.log('Error mengambil data: ', error)
    );
  });
};

export const deleteCustomerFromDB = (customerId) => {
  db.transaction(tx => {
    tx.executeSql(
      `DELETE FROM customers WHERE customer_id = ?;`,
      [customerId],
      () => console.log('Data berhasil dihapus'),
      error => console.log('Error menghapus data: ', error)
    );
  });
};

export const updateCustomerInDB = (customerData) => {
  const {
    customer_id,
    customer_name,
    owner_name,
    no_contact,
    address,
    village_id,
    district_id,
    city_id,
    latitude,
    longitude,
    photo,
    createdby,
  } = customerData;

  db.transaction(tx => {
    tx.executeSql(
      `UPDATE customers SET
        customer_name = ?, owner_name = ?, no_contact = ?, address = ?, village_id = ?, district_id = ?, city_id = ?, latitude = ?, longitude = ?, photo = ?, createdby = ?
      WHERE customer_id = ?;`,
      [
        customer_name,
        owner_name,
        no_contact,
        address,
        village_id,
        district_id,
        city_id,
        latitude,
        longitude,
        photo,
        createdby,
        customer_id,
      ],
      () => console.log('Data berhasil diperbarui'),
      error => console.log('Error memperbarui data: ', error)
    );
  });
};
