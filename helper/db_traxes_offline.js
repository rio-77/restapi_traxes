import SQLite from 'react-native-sqlite-storage';

// Membuka atau membuat database
export const db = SQLite.openDatabase(
  { name: 'traxes.db', location: 'default' }, // Nama database dan lokasinya
  () => console.log('Database berhasil dibuka'), // Callback sukses
  (error) => console.error('Database gagal dibuka', error) // Callback error
);

export const createTable = () => {
  db.transaction((tx) => {
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

export const saveUserData = (userData) => {
  const { nik, name, employee_id, device_id } = userData;
  const loginTime = new Date().toISOString();

  db.transaction((tx) => {
    tx.executeSql(
      'INSERT INTO user (nik, name, employee_id, device_id, login_time) VALUES (?, ?, ?, ?, ?);',
      [nik, name, employee_id, device_id, loginTime],
      () => console.log('Data pengguna berhasil disimpan'),
      (error) => console.error('Error saving user data:', error)
    );
  });
};

export const getUserData = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM user LIMIT 1;',
        [],
        (_, results) => {
          if (results.rows.length > 0) {
            resolve(results.rows.item(0));
          } else {
            resolve(null);
          }
        },
        (error) => reject(error)
      );
    });
  });
};
