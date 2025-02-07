import { db } from '../helper/db_traxes_offline'; // Sesuaikan dengan lokasi database Anda

export const createTable = () => {
  db.transaction((tx) => {
    // Buat tabel jika belum ada
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nik TEXT,
        name TEXT,
        employee_id TEXT,
        device_id TEXT,
        login_time TEXT
      );`,
      [],
      () => console.log('Tabel user berhasil dibuat atau sudah ada'),
      (error) => console.error('Error creating table:', error)
    );
  });
};

// Fungsi untuk menyimpan data user
export const saveUserData = (userData) => {
  const { nik, name, employee_id, device_id } = userData;
  const loginTime = new Date().toISOString(); // Simpan waktu login dalam format ISO 8601

  db.transaction((tx) => {
    tx.executeSql(
      'INSERT INTO user (nik, name, employee_id, device_id, login_time) VALUES (?, ?, ?, ?, ?);',
      [nik, name, employee_id, device_id, loginTime],
      () => console.log('Data pengguna berhasil disimpan'),
      (error) => console.error('Error saving user data:', error)
    );
  });
};

// Fungsi untuk mengambil data user yang login
export const getUserData = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM user LIMIT 1;',
        [],
        (_, results) => {
          if (results.rows.length > 0) {
            resolve(results.rows.item(0)); // Mengembalikan data user yang pertama ditemukan
          } else {
            resolve(null); // Jika tidak ada data
          }
        },
        (error) => reject(error)
      );
    });
  });
};
