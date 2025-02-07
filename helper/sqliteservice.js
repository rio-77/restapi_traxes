import { openDatabase } from 'react-native-sqlite-storage';

const db = openDatabase({ name: 'lokasi_toko.db', location: 'default' });

// Buat tabel jika belum ada
// export const createTable = () => {
//   db.transaction((tx) => {
//     tx.executeSql(
//       `CREATE TABLE IF NOT EXISTS customer (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         customer_id TEXT,
//         customer_name TEXT,
//         longitude TEXT,
//         latitude TEXT
//       );`,
//       [],
//       () => console.log('Table created successfully'),
//       (error) => console.error('Error creating table:', error)
//     );
//   });
// };

// Simpan data dari API ke SQLite
export const saveDataToSQLite = (customers, onSuccess, onError) => {
  db.transaction((tx) => {
    customers.forEach((customer) => {
      tx.executeSql(
        `INSERT INTO lokasi_toko (customer_id, customer_name, longitude, latitude) 
         VALUES (?, ?, ?, ?);`,
        [
          customer.customer_id,
          customer.customer_name || 'Tidak ditulis nama',
          customer.longitude,
          customer.latitude,
        ],
        () => console.log(`Customer ${customer.customer_id} inserted successfully`),
        (error) => console.error('Error inserting data:', error)
      );
    });
  },
  (error) => {
    console.error('Transaction error:', error);
    if (onError) onError(error);
  },
  () => {
    console.log('All data inserted successfully');
    if (onSuccess) onSuccess();
  });
};

// Ambil semua data dari SQLite
// export const fetchAllData = (callback) => {
//   db.transaction((tx) => {
//     tx.executeSql(
//       `SELECT * FROM customer;`,
//       [],
//       (_, results) => {
//         const rows = [];
//         for (let i = 0; i < results.rows.length; i++) {
//           rows.push(results.rows.item(i));
//         }
//         callback(rows);
//       },
//       (error) => console.error('Error fetching data:', error)
//     );
//   });
// };

export const fetchAllData = (callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      `SELECT * FROM lokasi_toko;`,
      [],
      (_, results) => {
        const rows = [];
        for (let i = 0; i < results.rows.length; i++) {
          rows.push(results.rows.item(i));
        }
        callback(rows);
      },
      (error) => console.error('Error fetching data:', error)
    );
  });
};


// Ambil data berdasarkan pencarian
export const fetchFilteredData = (query, callback) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM customer WHERE customer_name LIKE ?;`,
        [`%${query}%`],
        (_, results) => {
          const rows = [];
          for (let i = 0; i < results.rows.length; i++) {
            rows.push(results.rows.item(i));
          }
          callback(rows);
        },
        (error) => console.error('Error fetching filtered data:', error)
      );
    });
  };

  // Ambil data berdasarkan pencarian dengan limit
// export const fetchFilteredDataWithLimit = (query, limit, callback) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         `SELECT * FROM lokasi_toko WHERE customer_name LIKE ? LIMIT ?;`,
//         [`%${query}%`, limit],
//         (_, results) => {
//           const rows = [];
//           for (let i = 0; i < results.rows.length; i++) {
//             rows.push(results.rows.item(i));
//           }
//           callback(rows);
//         },
//         (error) => console.error('Download data dulu..', error)
//       );
//     });
//   };

// tampilkan data toko //
export const fetchFilteredDataWithLimit = (query, limit, callback) => {
  db.transaction((tx) => {
      let sqlQuery;
      let sqlParams;

      if (query.trim() === '') {
          // Jika query kosong, ambil 25 toko terbaru
          sqlQuery = `SELECT * FROM lokasi_toko ORDER BY id DESC LIMIT ?;`;
          sqlParams = [limit];
      } else {
          // Jika ada query pencarian, filter berdasarkan nama
          sqlQuery = `SELECT * FROM lokasi_toko WHERE customer_name LIKE ? ORDER BY id DESC LIMIT ?;`;
          sqlParams = [`%${query}%`, limit];
      }

      tx.executeSql(
          sqlQuery,
          sqlParams,
          (_, results) => {
              const rows = [];
              for (let i = 0; i < results.rows.length; i++) {
                  rows.push(results.rows.item(i));
              }
              callback(rows);
          },
          (error) => console.error('Error fetching filtered data:', error)
      );
  });
}

  export const getTokoByUser = (employee_id, callback) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM lokasi_toko WHERE createdby = ?`, 
        [employee_id], 
        (_, results) => {
          const rows = results.rows.raw(); // Ambil data sebagai array
          callback(rows);
        },
        (error) => {
          console.error('Error fetching toko by user:', error);
          callback([]);
        }
      );
    });
  };

  export const getTokoByProjectId = (project_id, callback) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM lokasi_toko WHERE project_id = ?`, 
        [project_id], 
        (_, results) => {
          const rows = results.rows.raw(); // Ambil data sebagai array
          callback(rows);
        },
        (error) => {
          console.error('Error fetching toko by project_id:', error);
          callback([]); // Mengembalikan array kosong jika terjadi error
        }
      );
    });
  };



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



  export const fetchStoresByProjectId = (projectId, limit, callback) => {
    db.transaction((tx) => {
        tx.executeSql(
            'SELECT * FROM lokasi_toko WHERE project_id = ? ORDER BY created_at DESC LIMIT ?',
            [projectId, limit],
            (_, results) => {
                const rows = [];
                for (let i = 0; i < results.rows.length; i++) {
                    rows.push(results.rows.item(i));
                }
                callback(rows);
            },
            (error) => {
                console.error('Error fetching stores by project_id:', error);
            }
        );
    });
};




