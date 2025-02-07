import SQLite from 'react-native-sqlite-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const deleteDatabase = () => {
//   SQLite.deleteDatabase({ name: 'lokasi_toko.db', location: 'default' })
//     .then(() => {
//       console.log('Database deleted successfully!');
//     })
//     .catch((error) => {
//       console.error('Error deleting database:', error);
//     });
// };

//check table
// const checkTableStructure = () => {
//   db.transaction((tx) => {
//     tx.executeSql(
//       "PRAGMA table_info(lokasi_toko);",
//       [],
//       (_, results) => {
//         console.log("Table structure:", results.rows.raw());
//       },
//       (error) => {
//         console.error("Error checking table structure:", error);
//       }
//     );
//   });
// };

// Panggil saat aplikasi dimulai atau database terbuka
// checkTableStructure();


// Membuka database
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

// Fungsi untuk membuat tabel
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
      () => {
        console.log('Table lokasi_toko created successfully.');
      },
      (error) => {
        console.error('Error creating table lokasi_toko:', error);
      }
    );
  });
};

// Fungsi untuk memastikan tabel dibuat jika belum ada
const createTableIfNeeded = () => {
  db.transaction((tx) => {
    tx.executeSql(
      'SELECT name FROM sqlite_master WHERE type="table" AND name="lokasi_toko"',
      [],
      (tx, result) => {
        if (result.rows.length === 0) {
          tx.executeSql(
            `CREATE TABLE IF NOT EXISTS lokasi_toko (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
               customer_id TEXT,  -- Tambahkan kolom ini
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
            () => {
              console.log('Table lokasi_toko created successfully.');
            },
            (error) => console.error('Failed to create table:', error)
          );
        } else {
          console.log('Table lokasi_toko already exists.');
        }
      },
      (error) => console.error('Error checking table existence:', error)
    );
  });
};

// Fungsi untuk menyimpan data ke tabel
export const insertLokasi = (lokasi) => {
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
    project_id, // Tambahkan project_id
  } = lokasi;

  db.transaction((tx) => {
    tx.executeSql(
      `INSERT INTO lokasi_toko (
        customer_id,customer_name, owner_name, no_contact, address, village_id, district_id, city_id, latitude, longitude, photo, project_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [customer_id,customer_name, owner_name, no_contact, address, village_id, district_id, city_id, latitude, longitude, photo, project_id],
      (_, result) => {
        console.log('Data inserted successfully:', result);
        console.log('id:', customer_id);
      },
      (error) => {
        console.error('Error inserting data into lokasi_toko:', error);
      }
    );
  });
};

// Fungsi untuk mengambil semua data dari tabel
// export const getAllLokasi = (callback) => {
//   db.transaction((tx) => {
//     tx.executeSql(
//       `SELECT * FROM lokasi_toko;`,
//       [],
//       (_, results) => {
//         const rows = results.rows;
//         const data = [];

//         for (let i = 0; i < rows.length; i++) {
//           data.push(rows.item(i));
//         }

//         callback(data);
//       },
//       (error) => {
//         console.error('Error fetching data from lokasi_toko:', error);
//       }
//     );
//   });
// };

export const getAllLokasi = (project_id, callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      'SELECT * FROM lokasi WHERE project_id = ?',
      [project_id],
      (tx, results) => {
        const rows = results.rows.raw(); // Mengambil semua baris hasil query
        callback(rows); // Mengirim data hasil query ke callback
      },
      (error) => {
        console.error('Error getting locations:', error);
      }
    );
  });
};

// Fungsi untuk mengambil data berdasarkan project_id
// export const getLokasiByProjectId = (project_id, callback) => {
//   db.transaction((tx) => {
//     tx.executeSql(
//       `SELECT * FROM lokasi_toko WHERE project_id = ?;`,
//       [project_id],
//       (_, results) => {
//         const rows = results.rows;
//         const data = [];

//         for (let i = 0; i < rows.length; i++) {
//           data.push(rows.item(i));
//         }

//         callback(data);
//       },
//       (error) => {
//         console.error('Error fetching data from lokasi_toko:', error);
//       }
//     );
//   });
// };

// Fungsi untuk mengambil data berdasarkan project_id
export const getLokasiByProjectIdd = (projectId, callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      'SELECT * FROM lokasi WHERE project_id = ?',
      [projectId], // Parameter project_id
      (tx, results) => {
        let rows = results.rows.raw(); // Mendapatkan hasil query dalam bentuk array
        callback(rows);
      },
      (error) => {
        console.log('Error executing query', error);
        callback([]);
      }
    );
  });
};

// Fungsi untuk menghapus semua data dari tabel
export const clearTable = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `DELETE FROM lokasi_toko;`,
      [],
      () => {
        console.log('Table lokasi_toko cleared successfully.');
      },
      (error) => {
        console.error('Error clearing table lokasi_toko:', error);
      }
    );
  });
};

// Panggil fungsi ini untuk memastikan tabel dibuat jika belum ada
createTableIfNeeded();



export const getLokasiFromDatabase = (project_id, callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      `SELECT * FROM lokasi_toko WHERE project_id = ? LIMIT 1;`, 
      [project_id], 
      (_, results) => {
        if (results.rows.length > 0) {
          callback(results.rows.item(0));
        } else {
          callback(null);
        }
      },
      (error) => {
        console.error('Error fetching lokasi from database:', error);
        callback(null);
      }
    );
  });
};

// Fungsi untuk mengambil data lokasi berdasarkan project_id
export const getLokasiByProjectId = (project_id, callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      `SELECT * FROM lokasi_toko WHERE project_id = ?;`,
      [project_id],
      (_, results) => {
        const rows = results.rows;
        const data = [];
        for (let i = 0; i < rows.length; i++) {
          data.push(rows.item(i));
        }
        callback(data);
      },
      (error) => {
        console.error('Error fetching data from lokasi_toko:', error);
      }
    );
  });
};

// Helper fetchAllData di sqliteservice.js
// const fetchAllData = (callback) => {
//   db.transaction((tx) => {
//     tx.executeSql(
//       'SELECT * FROM toko', // Ambil semua data toko
//       [],
//       (tx, result) => {
//         const rows = result.rows.raw(); // Ambil data sebagai array
//         callback(rows); // Kirim data ke callback
//       },
//       (tx, error) => {
//         console.log('Error fetching data:', error);
//       }
//     );
//   });
// };

export const fetchAllData = (project_id, callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      'SELECT * FROM lokasi_toko WHERE project_id = ?;', // Gunakan project_id untuk filter data
      [project_id],
      (tx, result) => {
        const rows = result.rows.raw();
        callback(rows);
      },
      (tx, error) => {
        console.log('Error fetching data:', error);
      }
    );
  });
};


const getEmployeeIdFromStorage = async () => {
  try {
    const userData = await AsyncStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      return user?.employee_id; 
    }
    return null;
  } catch (error) {
    console.error('Error retrieving employee_id:', error);
    return null;
  }
};


export const getTokoByUser = (employee_id, callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      `SELECT * FROM lokasi_toko WHERE createdby = ? LIMIT 5`, // Tambahkan LIMIT 5
      [employee_id], 
      (_, results) => {
        const rows = results.rows.raw(); // Ambil data sebagai array
        callback(rows);
      },
      (error) => {
        console.error('Error fetching toko by user:', error);
        callback([]); // Jika error, kirimkan array kosong
      }
    );
  });
};


  export const getTokoByUserAsync = (employee_id) => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          `SELECT * FROM lokasi_toko WHERE createdby = ?`, 
          [employee_id], 
          (_, results) => resolve(results.rows.raw()), 
          (_, error) => reject(error)
        );
      });
    });
  };



