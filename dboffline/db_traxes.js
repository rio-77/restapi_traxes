import SQLite from 'react-native-sqlite-storage';

// Membuka database
export const db = SQLite.openDatabase(
  { name: 'userDB', location: 'default' },
  () => console.log('Database opened'),
  (error) => console.error('Failed to open database:', error)
);

// Membuat tabel `user` jika belum ada
export const createTable = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nik TEXT,
        employee_id TEXT,
        fullname TEXT,
        type_id TEXT,
        project_id TEXT,
        company_id TEXT,
        area_id TEXT,
        server_env TEXT,
        area_id_extra1 TEXT,
        area_id_extra2 TEXT,
        login_time TEXT
      )`,
      [],
      () => console.log('Table "user" created successfully'),
      (error) => console.error('Failed to create table "user":', error)
    );
  });
};

// Fungsi untuk menyimpan data pengguna
// export const saveUserData = (userData) => {
//   const loginTime = new Date().toISOString(); // Waktu login saat ini
//   db.transaction((tx) => {
//     tx.executeSql(
//       `INSERT INTO user 
//         (nik, employee_id, fullname, type_id, project_id, company_id, area_id, server_env, area_id_extra1, area_id_extra2, login_time) 
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [
//         userData.nik,
//         userData.employee_id,
//         userData.fullname,
//         userData.type_id.trim(),
//         userData.project_id,
//         userData.company_id,
//         userData.area_id,
//         userData.server_env,
//         userData.area_id_extra1,
//         userData.area_id_extra2,
//         loginTime,
//       ],
//       () => console.log('User data saved successfully'),
//       (error) => console.error('Error saving user data:', error)
//     );
//   });
// };

// Mengambil data user pertama dari database
export const getusersprofile = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM user LIMIT 1', // Mengambil user pertama
        [],
        (tx, results) => {
          if (results.rows.length > 0) {
            resolve(results.rows.item(0));
          } else {
            reject('Tidak ada data user');
          }
        },
        (error) => {
          console.error('Error fetching user profile:', error);
          reject(error);
        }
      );
    });
  });
};

// Membuat tabel `lokasi_toko` jika belum ada
export const createTableToko = () => {
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
        createdby TEXT
      )`,
      [],
      () => console.log('Table "lokasi_toko" created successfully'),
      (error) => console.error('Error creating "lokasi_toko" table:', error)
    );
  });
};

// Menyimpan lokasi toko ke SQLite
export const insertLocation = (data) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO lokasi_toko 
        (customer_id, customer_name, owner_name, no_contact, address, village_id, district_id, city_id, latitude, longitude, photo, createdby) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.customer_id,
          data.customer_name,
          data.owner_name,
          data.no_contact,
          data.address,
          data.village_id,
          data.district_id,
          data.city_id,
          data.latitude,
          data.longitude,
          data.photo,
          data.createdby,
        ],
        (tx, result) => {
          console.log('Location data saved successfully to SQLite:', result);
          resolve(result);
        },
        (tx, error) => {
          console.error('Error while inserting location data into SQLite:', error);
          reject(error); // Reject promise if error occurs
        }
      );
    });
  });
};




// Membuat tabel untuk data pelanggan
export const createCustomerTable = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS customers (
        secid INTEGER PRIMARY KEY,
        customer_id TEXT NOT NULL,
        customer_name TEXT NOT NULL,
        longitude TEXT NOT NULL,
        latitude TEXT NOT NULL
      );`
    );
  });
};

// Menyimpan data pelanggan ke tabel SQLite
export const insertCustomers = (customers) => {
  db.transaction((tx) => {
    customers.forEach((customer) => {
      tx.executeSql(
        `INSERT OR REPLACE INTO customers (secid, customer_id, customer_name, longitude, latitude) 
         VALUES (?, ?, ?, ?, ?)`,
        [customer.secid, customer.customer_id, customer.customer_name, customer.longitude, customer.latitude]
      );
    });
  });
};

// Mendapatkan semua data pelanggan
export const getCustomers = (callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      `SELECT * FROM customers`,
      [],
      (_, { rows }) => {
        callback(rows._array);
      },
      (error) => {
        console.error('Error fetching customers:', error);
      }
    );
  });
};

export const saveUserData = (userData) => {
    const loginTime = new Date().toISOString();
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO users 
            (nik, employee_id, fullname, type_id, project_id, company_id, area_id, server_env, area_id_extra1, area_id_extra2, login_time) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userData.nik || '',
          userData.employee_id || '',
          userData.fullname || '',
          userData.type_id || '',
          userData.project_id || '',
          userData.company_id || '',
          userData.area_id || '',
          userData.server_env || '',
          userData.area_id_extra1 || '',
          userData.area_id_extra2 || '',
          loginTime,
        ],
        () => {
          console.log('User data saved successfully');
        },
        (error) => {
          console.error('Error saving user data:', error);
        }
      );
    });
  };

