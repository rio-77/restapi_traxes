import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

// Membuat koneksi ke database SQLite
const db = SQLite.openDatabase({ name: 'app_db.db', location: 'default' });

// Membuat tabel pengguna jika belum ada
export const createTable = async () => {
  await db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS user (nip TEXT PRIMARY KEY, employee_id TEXT, name TEXT, position TEXT, token TEXT)',
    );
  });
};

// Menyimpan data pengguna ke dalam SQLite
export const saveUserData = async (userData) => {
  await createTable();
  const { nip, employee_id, name, position, token } = userData;

  await db.transaction(tx => {
    tx.executeSql(
      'INSERT OR REPLACE INTO user (nip, employee_id, name, position, token) VALUES (?, ?, ?, ?, ?)',
      [nip, employee_id, name, position, token],
    );
  });
};

// Menyimpan data pelanggan (misalnya)
export const insertCustomers = async (customers) => {
  await db.transaction(tx => {
    customers.forEach(customer => {
      tx.executeSql(
        'INSERT INTO customers (id, name) VALUES (?, ?)',
        [customer.id, customer.name],
      );
    });
  });
};

// Mengambil profil pengguna dari SQLite
export const getusersprofile = async () => {
  const results = await db.executeSql('SELECT * FROM user LIMIT 1');
  if (results[0].rows.length > 0) {
    return results[0].rows.item(0); // Mengembalikan data pengguna pertama
  }
  return null; // Jika tidak ada data pengguna
};

// Mengecek apakah ada data pengguna yang tersimpan di SQLite
export const checkSavedUserData = async () => {
  const results = await db.executeSql('SELECT * FROM user LIMIT 1');
  return results[0].rows.length > 0;
};
