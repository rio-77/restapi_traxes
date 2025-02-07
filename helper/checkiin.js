import { openDatabase } from 'react-native-sqlite-storage';

// Membuka database SQLite
const db = openDatabase({ name: 'lokasi_toko.db', location: 'default' });

// Fungsi untuk membuat tabel jika belum ada
export const createTable = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS lokasi_toko (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id TEXT,
        customer_name TEXT,
        owner_name TEXT,
        no_contact TEXT,
        address TEXT,
        village_id TEXT,
        district_id TEXT,
        city_id TEXT,
        latitude TEXT,
        longitude TEXT,
        photo TEXT,
        project_id TEXT
      );`,
      [],
      () => console.log('Table lokasi_toko created successfully.'),
      (error) => console.error('Error creating table lokasi_toko:', error)
    );
  });
};

// Fungsi untuk menyimpan data ke tabel SQLite
export const insertLokasi = (lokasi) => {
  const { customer_id, customer_name, owner_name, no_contact, address, village_id, district_id, city_id, latitude, longitude, photo } = lokasi;

  db.transaction((tx) => {
    tx.executeSql(
      `INSERT INTO lokasi_toko (customer_id, customer_name, owner_name, no_contact, address, village_id, district_id, city_id, latitude, longitude, photo) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [customer_id, customer_name, owner_name, no_contact, address, village_id, district_id, city_id, latitude, longitude, photo],
      () => console.log('Lokasi berhasil disimpan'),
      (error) => console.error('Error menyimpan lokasi:', error)
    );
  });
};

// Fungsi untuk menyimpan data check-in ke SQLite
export const insertCheckinData = (data) => {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS checkin_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_id TEXT,
        customer_id TEXT,
        jabatan_id TEXT,
        datetimephone_in TEXT,
        latitude_in TEXT,
        longitude_in TEXT,
        radius_in TEXT,
        distance_in TEXT,
        foto_in TEXT,
        keterangan TEXT,
        apk TEXT
      );`,
      [],
      () => console.log('Table checkin_data created successfully.'),
      (error) => console.error('Error creating table checkin_data:', error)
    );

    tx.executeSql(
      `INSERT INTO checkin_data (employee_id, customer_id, jabatan_id, datetimephone_in, latitude_in, longitude_in, radius_in, distance_in, foto_in, keterangan, apk) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.employee_id, 
        data.customer_id, 
        data.jabatan_id, 
        data.datetimephone_in, 
        data.latitude_in, 
        data.longitude_in, 
        data.radius_in, 
        data.distance_in, 
        data.foto_in, 
        data.keterangan,
        data.apk
      ],
      () => console.log('Check-in data berhasil disimpan'),
      (error) => console.error('Error menyimpan check-in data:', error)
    );
  });
};
