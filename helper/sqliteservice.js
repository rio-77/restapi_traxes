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
// export const saveDataToSQLite = (customers, projectId, onSuccess, onError) => {
//   db.transaction((tx) => {
//     tx.executeSql(
//       `delete from lokasi_toko;`,
//       () => console.log(`Customer ${customer.customer_id} inserted successfully`),
//       (error) => console.error('Error inserting data:', error)
//     );
//     customers.forEach((customer) => {
//       tx.executeSql(
//         `INSERT INTO lokasi_toko (customer_id, customer_name, longitude, latitude, project_id) 
//          VALUES (?, ?, ?, ?, ?);`,
//         [
//           customer.customer_id,
//           customer.customer_name,
//           customer.longitude,
//           customer.latitude,
//           projectId, // ✅ Tambahkan project_id agar tidak null
//         ],
//         () => console.log(`Customer ${customer.customer_id} inserted successfully`),
//         (error) => console.error('Error inserting data:', error)
//       );
//     });
//   },
//   (error) => {
//     console.error('Transaction error:', error);
//     if (onError) onError(error);
//   },
//   () => {
//     console.log('All data inserted successfully');
//     if (onSuccess) onSuccess();
//   });
// };]




// **Fungsi untuk Update Check-Out di SQLite**
export const updateCheckoutInLocalDB = (checkoutData, callback) => {
  console.log("📌 Data untuk update check-out:", checkoutData); // Debugging

  db.transaction((tx) => {
    tx.executeSql(
      `UPDATE checkin 
      SET datetimephone_out = ?, 
          status_emp = ?, 
          latitude_in = ?, 
          longitude_in = ?, 
          radius_in = ?, 
          distance_in = ? 
      WHERE employee_id = ? AND customer_id = ? AND date_cio = ?`,

      [
        checkoutData.datetimephone_out || new Date().toISOString(),
        "0", // Status check-out (ubah jadi tidak aktif)
        checkoutData.latitude_in || "",
        checkoutData.longitude_in || "",
        checkoutData.radius_in || "",
        checkoutData.distance_in || "",
        checkoutData.employee_id,
        checkoutData.customer_id,
        checkoutData.date_cio
      ],

      (_, results) => {
        console.log("✅ Check-out berhasil diupdate:", results);
        callback(true);
      },

      (error) => {
        console.log("❌ Gagal update check-out:", error);
        callback(false);
      }
    );
  });
};



export const createCheckinTable = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS checkin (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id TEXT,
        employee_id TEXT,
        latitude_in REAL,
        longitude_in REAL,
        distance_in REAL,
        foto_in TEXT,
        datetimephone_in TEXT
      );`,
      [],
      () => console.log('Tabel checkin berhasil dibuat'),
      error => console.log('Error membuat tabel checkin:', error)
    );
  });
};


export const saveDataToSQLite = (customers, projectId, onSuccess, onError) => {
  db.transaction((tx) => {
    // Hapus semua data lama sebelum menyimpan yang baru
    tx.executeSql(
      `DELETE FROM lokasi_toko;`,
      [],
      () => console.log('Data lama dihapus'),
      (error) => console.error('Error saat menghapus data:', error)
    );

    customers.forEach((customer) => {
      tx.executeSql(
        `INSERT INTO lokasi_toko (
          customer_id, customer_name, longitude, latitude, project_id, 
          address, owner_name, no_contact, photo
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          customer.customer_id,
          customer.customer_name || 'Tidak Ditulis Nama',
          customer.longitude || '0',
          customer.latitude || '0',
          projectId, 
          customer.address || 'Alamat tidak tersedia',
          customer.owner_name || 'Pemilik tidak diketahui',
          customer.no_contact || 'Kontak tidak tersedia',
          customer.photo || 'Foto tidak tersedia',
        ],
        () => console.log(`Customer ${customer.customer_id} berhasil disimpan`),
        (error) => console.error('Error saat menyimpan data:', error)
      );
    });
  },
  (error) => {
    console.error('Error transaksi SQLite:', error);
    if (onError) onError(error);
  },
  () => {
    console.log('Semua data berhasil disimpan');
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


// Fungsi untuk menyimpan lokasi ke SQLite
export const insertLocation = (customer_id, latitude, longitude) => {
  return new Promise((resolve, reject) => {
      db.transaction(tx => {
          tx.executeSql(
              `INSERT OR REPLACE INTO lokasi_toko (customer_id, latitude, longitude) VALUES (?, ?, ?);`,
              [customer_id, latitude, longitude],
              (_, result) => resolve(result),
              (_, error) => reject(error)
          );
      });
  });
};

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


export const getProjectId = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT project_id FROM lokasi_toko LIMIT 1',
        [],
        (_, result) => {
          if (result.rows.length > 0) {
            resolve(result.rows.item(0).project_id);
          } else {
            resolve(null);
          }
        },
        (_, error) => reject(error)
      );
    });
  });
};

// export const fetchFilteredDataWithLimit = (query, limit = 25, callback) => {
//   db.transaction((tx) => {
//       let sqlQuery;
//       let sqlParams;

//       if (!query.trim()) {
//           sqlQuery = `SELECT * FROM lokasi_toko ORDER BY id DESC LIMIT ?;`;
//           sqlParams = [limit];
//       } else {
//           sqlQuery = `SELECT * FROM lokasi_toko WHERE LOWER(customer_name) LIKE LOWER(?) ORDER BY id DESC LIMIT ?;`;
//           sqlParams = [`%${query}%`, limit];
//       }

//       tx.executeSql(
//           sqlQuery,
//           sqlParams,
//           (_, results) => {
//               const rows = [];
//               for (let i = 0; i < results.rows.length; i++) {
//                   rows.push(results.rows.item(i));
//               }
//               callback(null, rows); // Mengembalikan data dengan callback
//           },
//           (_, error) => {
//               console.error('Error fetching filtered data:', error);
//               callback(error, null); // Mengembalikan error ke callback
//           }
//       );
//   });
// };

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

  export const getDetailToko = (customer_id) => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          `SELECT * FROM lokasi_toko WHERE customer_id = ? LIMIT 1;`, // Hanya pakai customer_id
          [customer_id],
          (_, result) => {
            const rows = result.rows.raw();
            console.log('📌 Query Result:', rows);
            resolve(rows.length > 0 ? rows[0] : null);
          },
          (_, error) => {
            console.error('❌ Error fetching toko data:', error);
            reject(error);
          }
        );
      });
    });
  };

  const getDeviceLocation = () => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => reject(error),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    });
  };
  

  // export const getTokoByProjectId = (project_id, callback) => {
  //   db.transaction((tx) => {
  //     tx.executeSql(
  //       `SELECT * FROM lokasi_toko WHERE project_id = ?`, 
  //       [project_id], 
  //       (_, results) => {
  //         const rows = results.rows.raw(); // Ambil data sebagai array
  //         callback(rows);
  //       },
  //       (error) => {
  //         console.error('Error fetching toko by project_id:', error);
  //         callback([]); // Mengembalikan array kosong jika terjadi error
  //       }
  //     );
  //   });
  // };


// create table lokasi_toko
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
          console.log('Table Lokasi toko created successfully.');
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
      // full_address,  
      photo,
      project_id, // Tambahkan project_id
    } = lokasi;

    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO lokasi_toko (
          customer_id,customer_name, owner_name, no_contact, address, village_id, district_id, city_id, latitude, longitude, photo, project_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [customer_id,customer_name, owner_name, no_contact, address, village_id, district_id, city_id, latitude, longitude,  photo, project_id],
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


  // export const insertLokasi = (data) => {
  //   return new Promise((resolve, reject) => {
  //     const db = getDB();
  //     db.transaction((tx) => {
  //       tx.executeSql(
  //         `INSERT INTO lokasi_toko 
  //           (customer_id, customer_name, owner_name, no_contact, address, village_id, district_id, city_id, latitude, longitude, photo) 
  //         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  //         [
  //           data.customer_id || 'N/A',
  //           data.customer_name || 'N/A',
  //           data.owner_name || 'N/A',
  //           data.no_contact || 'N/A',
  //           data.address || 'N/A',
  //           data.village_id || 'N/A',
  //           data.district_id || 'N/A',
  //           data.city_id || 'N/A',
  //           data.latitude || '0',
  //           data.longitude || '0',
  //           data.photo || ''
  //         ],
  //         (_, result) => resolve(result),
  //         (_, error) => reject(error)
  //       );
  //     });
  //   });
  // };



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





// check-log-data-tambah-lokasi
export const getAllTokoData = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `SELECT * FROM lokasi_toko`,
      [],
      (_, result) => {
        const rows = result.rows;
        const tokoList = [];
        for (let i = 0; i < rows.length; i++) {
          tokoList.push(rows.item(i));
        }
        console.log('Data Toko di SQLite:', JSON.stringify(tokoList, null, 2));
      },
      (_, error) => {
        console.error('Gagal mengambil data toko:', error);
      }
    );
  });
};

// export const getAllLokasi = () => {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         "SELECT * FROM lokasi_toko",
//         [],
//         (_, result) => resolve(result.rows.raw()),
//         (_, error) => reject(error)
//       );
//     });
//   });
// };



// ambil param customer_id untuk detail screen
export const getLastCustomerId = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT project_id FROM lokasi_toko ORDER BY id DESC LIMIT 1',
        [],
        (_, result) => {
          if (result.rows.length > 0) {
            resolve(result.rows.item(0).project_id);
          } else {
            resolve(null);
          }
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};




// create-project
// Buat tabel untuk menyimpan project_id jika belum ada
export const createProjectTable = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS lokasi_toko (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         project_id TEXT
       );`,
      [],
      () => console.log('Tabel project berhasil dibuat'),
      error => console.error('Gagal membuat tabel project:', error)
    );
  });
};

// Fungsi untuk menyimpan project_id ke SQLite
export const insertProjectToSQLite = (project_id) => {
  db.transaction(tx => {
    tx.executeSql(
      `INSERT INTO lokasi_toko (project_id) VALUES (?);`,
      [project_id],
      () => console.log('project_id berhasil disimpan'),
      error => console.error('Gagal menyimpan project_id:', error)
    );
  });
};

// Fungsi untuk mengambil project_id dari SQLite
export const getProjectIdFromSQLite = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT project_id FROM lokasi_toko ORDER BY id DESC LIMIT 1;`,
        [],
        (_, result) => {
          if (result.rows.length > 0) {
            resolve(result.rows.item(0).project_id);
          } else {
            resolve(null);
          }
        },
        error => reject('Gagal mengambil project_id: ' + error.message)
      );
    });
  });
};




// Ambil Latitude dan Longitude Berdasarkan Project ID
// export const getLocationByProjectId = (projectId) => {
//   return new Promise((resolve, reject) => {
//     db.transaction(tx => {
//       tx.executeSql(
//         'SELECT latitude, longitude FROM lokasi_toko WHERE project_id = ? LIMIT 1;',
//         [projectId],
//         (_, results) => {
//           if (results.rows.length > 0) {
//             const item = results.rows.item(0);
//             resolve(item);
//           } else {
//             reject('Lokasi tidak ditemukan.');
//           }
//         },
//         error => reject(error)
//       );
//     });
//   });
// };


// Fungsi Hitung Jarak
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Radius bumi dalam km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c * 1000; // Hasil dalam meter
  return distance;
};

// Example di Screen Check-in
// const handleCheckIn = async (projectId, latitude, longitude, status) => {
//   try {
//     const lokasi = await getLocationByProjectId(projectId);
//     const distance = calculateDistance(
//       parseFloat(lokasi.latitude),
//       parseFloat(lokasi.longitude),
//       parseFloat(latitude),
//       parseFloat(longitude)
//     );

//     if (status === 1 && distance <= 500) {
//       console.log('Check-in berhasil dalam radius 500 meter.');
//     } else if (status === 1) {
//       console.log('Check-in berhasil (mode bebas).');
//     } else if (status === 0) {
//       console.log('Check-in ditolak, status 0.');
//     } else {
//       console.log('Status tidak valid.');
//     }
//   } catch (error) {
//     console.error('Gagal melakukan check-in:', error);
//   }
// };

// export const getLocationByCustomerId = (customer_id, callback) => {
//   db.transaction((tx) => {
//     tx.executeSql(
//       'SELECT latitude, longitude FROM lokasi_toko WHERE customer_id = ? LIMIT 1;',
//       [customer_id],
//       (_, result) => {
//         if (result.rows.length > 0) {
//           const { latitude, longitude } = result.rows.item(0);
//           callback({ latitude, longitude });
//         } else {
//           callback(null);
//         }
//       },
//       (_, error) => {
//         console.error('Gagal mengambil lokasi:', error);
//         callback(null);
//       }
//     );
//   });
// };




// Fungsi untuk mengambil data lokasi toko berdasarkan project_id
export const getTokoByProjectId = (project_id, callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      `SELECT latitude, longitude FROM lokasi_toko WHERE project_id = ?`, 
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




// Fungsi untuk mendapatkan lokasi toko berdasarkan project_id
export const getLokasiToko = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT owner_name, customer_id, address, customer_name, photo FROM lokasi_toko',
        [],
        (_, results) => {
          let data = [];
          for (let i = 0; i < results.rows.length; i++) {
            data.push(results.rows.item(i));
          }
          resolve(data);
        },
        error => reject(error)
      );
    });
  });
};







// checkin //
// **Inisialisasi tabel check-in**
// export const initCheckinTable = () => {
//   db.transaction((tx) => {
//     tx.executeSql(
//       `CREATE TABLE IF NOT EXISTS checkin (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         employee_id TEXT,
//         customer_id TEXT,
//         jabatan_id TEXT,
//         date_cio TEXT,
//         status_emp TEXT,
//         datetimephone_in TEXT,
//         project_id TEXT,
//         latitude_in REAL,
//         longitude_in REAL,
//         radius_in REAL,
//         distance_in REAL,
//         foto_in TEXT,
//         keterangan TEXT,
//         apk TEXT,
//         update_toko TEXT
//       )`,
//       [],
//       () => console.log('Tabel checkin berhasil dibuat'),
//       (error) => console.log('Gagal membuat tabel checkin:', error)
//     );
//   });
// };

// // **Simpan Check-In ke SQLite**
// export const saveCheckinToLocalDB = (checkinData, callback) => {
//   db.transaction((tx) => {
//     tx.executeSql(
//       `INSERT INTO checkin 
//       (employee_id, customer_id, jabatan_id, date_cio, status_emp, datetimephone_in, project_id, latitude_in, longitude_in, radius_in, distance_in, foto_in, keterangan, apk, update_toko) 
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [
//         checkinData.employee_id,
//         checkinData.customer_id,
//         checkinData.jabatan_id,
//         checkinData.date_cio,
//         checkinData.status_emp,
//         checkinData.datetimephone_in,
//         checkinData.project_id,
//         checkinData.latitude_in,
//         checkinData.longitude_in,
//         checkinData.radius_in,
//         checkinData.distance_in,
//         checkinData.foto_in,
//         checkinData.keterangan,
//         checkinData.apk,
//         checkinData.update_toko
//       ],
//       (_, results) => console.log('Check-in berhasil disimpan:', results),
//       (error) => console.log('Gagal menyimpan check-in:', error)
//     );
//   });


// **Inisialisasi tabel check-in**
// export const initCheckinTable = () => {
//   db.transaction((tx) => {
//     tx.executeSql(
//       `CREATE TABLE IF NOT EXISTS checkin (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         employee_id TEXT,
//         customer_id TEXT,
//         jabatan_id TEXT,
//         date_cio TEXT,
//         status_emp TEXT,
//         datetimephone_in TEXT,
//         project_id TEXT,
//         latitude_in REAL,
//         longitude_in REAL,
//         radius_in REAL,
//         distance_in REAL,
//         foto_in TEXT,
//         keterangan TEXT,
//         apk TEXT,
//         update_toko TEXT
//       )`,
//       [],
//       () => console.log('Tabel checkin berhasil dibuat'),
//       (error) => console.log('Gagal membuat tabel checkin:', error)
//     );
//   });
// };

export const initCheckinTable = () => {
  db.transaction((tx) => {
    tx.executeSql(`DROP TABLE IF EXISTS checkin`);

    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS checkin (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_id TEXT,
        customer_id TEXT,
        jabatan_id TEXT,
        date_cio TEXT,
        status_emp TEXT,
        datetimephone_in TEXT,
        datetimephone_out TEXT,
        project_id TEXT,
        latitude_in REAL,
        longitude_in REAL,
        radius_in REAL,
        distance_in REAL,
        latitude_out REAL,
        longitude_out REAL,
        radius_out REAL,
        distance_out REAL,
        foto_in TEXT,
        foto_out TEXT,
        keterangan TEXT,
        apk TEXT,
        update_toko TEXT,
        createdon_out TEXT,
        status_toko TEXT
      )`,
      [],
      () => console.log('✅ Tabel checkin dibuat ulang'),
      (error) => console.log('❌ Error membuat tabel checkin:', error)
    );
  });
};


// export const initCheckinTable = () => {
//   db.transaction((tx) => {
//     console.log('🧹 Drop table checkin dulu...'); // Tambahkan ini
//     tx.executeSql(`DROP TABLE IF EXISTS checkin;`, [], 
//       () => console.log('Tabel checkin lama dihapus'),
//       (error) => console.log('Gagal menghapus tabel checkin:', error)
//     );

//     tx.executeSql(
//       `CREATE TABLE IF NOT EXISTS checkin (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         employee_id TEXT,
//         customer_id TEXT,
//         jabatan_id TEXT,
//         date_cio TEXT,
//         status_emp TEXT,
//         datetimephone_in TEXT,
//         datetimephone_out TEXT, -- Tambahkan kolom ini
//         project_id TEXT,
//         latitude_in REAL,
//         longitude_in REAL,
//         radius_in REAL,
//         distance_in REAL,

//         latitude_out REAL,        -- ✅ Tambah ini
//         longitude_out REAL,       -- ✅ Tambah ini
//         distance_out REAL,        -- ✅ Tambah ini
//         foto_in TEXT,

//         keterangan TEXT,
//         apk TEXT,
//         update_toko TEXT
//       )`,
//       [],
//       () => console.log('Tabel checkin berhasil dibuat ulang'),
//       (error) => console.log('Gagal membuat tabel checkin:', error)
//     );
//   });
// };



export const saveCheckinToLocalDB = (checkinData, callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      `INSERT INTO checkin (
        employee_id, customer_id, jabatan_id, date_cio, status_emp,
        datetimephone_in, datetimephone_out, project_id,
        latitude_in, longitude_in, radius_in, distance_in,
        latitude_out, longitude_out, radius_out, distance_out,
        foto_in, foto_out, keterangan, apk, update_toko,
        createdon_out, status_toko
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        checkinData.employee_id,
        checkinData.customer_id,
        checkinData.jabatan_id,
        checkinData.date_cio,
        checkinData.status_emp,
        checkinData.datetimephone_in,
        checkinData.datetimephone_out,
        checkinData.project_id,
        checkinData.latitude_in,
        checkinData.longitude_in,
        checkinData.radius_in,
        checkinData.distance_in,
        null, // latitude_out
        null, // longitude_out
        null, // radius_out
        null, // distance_out
        checkinData.foto_in,
        null, // foto_out
        checkinData.keterangan,
        checkinData.apk,
        checkinData.update_toko,
        null, // createdon_out
        null  // status_toko
      ],
      (_, result) => {
        console.log('✅ Check-in berhasil disimpan:', result);
        callback(true);
      },
      (error) => {
        console.log('❌ Gagal menyimpan check-in:', error);
        callback(false);
      }
    );
  });
};



// **Simpan Check-In ke SQLite**
// export const saveCheckinToLocalDB = (checkinData, callback) => {
//   db.transaction((tx) => {
//     tx.executeSql(
//       `INSERT INTO checkin 
//       (employee_id, customer_id, jabatan_id, date_cio, status_emp, datetimephone_in, datetimephone_out, project_id, latitude_in, longitude_in, radius_in, distance_in, foto_in, keterangan, apk, update_toko) 
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,

//       [
//         checkinData.employee_id,
//         checkinData.customer_id,
//         checkinData.jabatan_id,
//         checkinData.date_cio,
//         checkinData.status_emp,
//         checkinData.datetimephone_in,
//         checkinData.datetimephone_out,
//         checkinData.project_id,
//         checkinData.latitude_in,
//         checkinData.longitude_in,
//         checkinData.radius_in,
//         checkinData.distance_in,
     
//         checkinData.foto_in,

//         checkinData.keterangan,
//         checkinData.apk,
//         checkinData.update_toko
//       ],

//       (_, results) => {
//         console.log('Check-in berhasil disimpan:', results);
//         callback(true); // Beri tahu UI bahwa penyimpanan berhasil
//       },

//       (error) => {
//         console.log('Gagal menyimpan check-in:', error);
//         callback(false);
//       }
//     );
//   });
// };

// **Ambil Data Check-in Terbaru**
export const getLatestCheckin = (callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      `SELECT * FROM checkin ORDER BY datetimephone_in DESC LIMIT 1`,
      [],
      (_, results) => {
        if (results.rows.length > 0) {
          console.log("Check-in terbaru:", results.rows.item(0));
          callback(results.rows.item(0));
        } else {
          console.log("Belum ada data check-in");
          callback(null);
        }
      },
      (error) => console.log("Gagal mengambil check-in:", error)
    );
  });
};



export const checkLastCheckinStatus = (callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      `SELECT is_checkin FROM checkin ORDER BY datetimephone_in DESC LIMIT 1`,
      [],
      (_, results) => {
        if (results.rows.length > 0) {
          const lastCheckin = results.rows.item(0).is_checkin;
          callback(lastCheckin === 1);
        } else {
          callback(false);
        }
      },
      (error) => {
        console.log('Gagal mengambil status check-in:', error);
        callback(false);
      }
    );
  });
};


// screen dashboard toko // 
export const getLokasiTokoByProjectId = (projectId) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM lokasi_toko WHERE project_id = ?',
        [projectId],
        (_, results) => {
          if (results.rows.length > 0) {
            resolve(results.rows.item(0)); // Ambil data pertama
          } else {
            resolve(null);
          }
        },
        (_, error) => reject(error)
      );
    });
  });
};




// checkout //
export const saveCheckoutToLocalDB = (checkoutData) => {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS checkouts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_id TEXT,
        customer_id TEXT,
        date_cio TEXT,
        datetimephone_out TEXT,
        latitude_out REAL,
        longitude_out REAL,
        radius_out INTEGER,
        distance_out REAL,
        status_toko INTEGER,
        createdon_out TEXT,
        foto_out TEXT
      )`,
      [],
      () => {
        console.log('Tabel checkouts siap');
      },
      (error) => {
        console.error('Error membuat tabel checkouts:', error);
      }
    );

    tx.executeSql(
      `INSERT INTO checkouts (employee_id, customer_id, date_cio, datetimephone_out, latitude_out, longitude_out, radius_out, distance_out, status_toko, createdon_out, foto_out) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        checkoutData.employee_id,
        checkoutData.customer_id,
        checkoutData.date_cio,
        checkoutData.datetimephone_out,
        checkoutData.latitude_out,
        checkoutData.longitude_out,
        checkoutData.radius_out,
        checkoutData.distance_out,
        checkoutData.status_toko,
        checkoutData.createdon_out,
        checkoutData.foto_out,
      ],
      (_, result) => {
        console.log('Check-out berhasil disimpan ke lokal', result.insertId);
      },
      (error) => {
        console.error('Gagal menyimpan check-out ke lokal:', error);
      }
    );
  });
};


export const getTotalRows = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT COUNT(*) AS total FROM lokasi_toko;',
        [],
        (_, results) => resolve(results.rows.item(0).total),
        error => reject(error)
      );
    });
  });
};

// Ambil data user terbaru dari SQLite
export const getUserLoginData = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM user ORDER BY login_time DESC LIMIT 1',
        [],
        (_, result) => {
          if (result.rows.length > 0) {
            console.log('User data fetched:', result.rows.item(0));
            resolve(result.rows.item(0));
          } else {
            console.log('No user data found');
            resolve(null);
          }
        },
        (error) => {
          console.error('Error fetching user data:', error);
          reject(error);
        }
      );
    });
  });
};


// // Fungsi untuk mengambil data login terbaru dari SQLite
// export const getUserLoginData = async () => {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         'SELECT * FROM user ORDER BY login_time DESC LIMIT 1',
//         [],
//         (_, results) => {
//           if (results.rows.length > 0) {
//             resolve(results.rows.item(0));  // Mengambil data login terbaru
//           } else {
//             resolve(null);
//           }
//         },
//         (_, error) => {
//           reject(error);
//         }
//       );
//     });
//   });
// };


// export const getProjectId = () => {
//   return new Promise((resolve, reject) => {
//     db.transaction(tx => {
//       tx.executeSql(
//         'SELECT project_id FROM user LIMIT 1;',
//         [],
//         (_, results) => {
//           if (results.rows.length > 0) {
//             resolve(results.rows.item(0).project_id);
//           } else {
//             resolve(null);
//           }
//         },
//         (_, error) => reject(error)
//       );
//     });
//   });
// };





// tambahlokasitoko2-sqlite
// Fungsi untuk membuat tabel lokasi_toko
const createTables = () => {
  db.transaction(tx => {
      tx.executeSql(
          `CREATE TABLE IF NOT EXISTS lokasi_toko (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              customer_id TEXT,
              customer_name TEXT,
              owner_name TEXT,
              no_contact TEXT,
              address TEXT,
              latitude REAL,
              longitude REAL,
              photo TEXT,
              city_id TEXT,
              district_id TEXT,
              project_id TEXT
          );`,
          [],
          () => console.log("Tabel lokasi_toko berhasil dibuat"),
          error => console.error("Error membuat tabel lokasi_toko:", error)
      );
  });
};
// Pastikan ini menggunakan **export default**
export default createTables;


// Fungsi untuk menyimpan lokasi ke SQLite
export const insertlokasi = (data, callback) => {
  db.transaction(tx => {
      tx.executeSql(
          `INSERT INTO lokasi_toko 
          (customer_id, customer_name, owner_name, no_contact, address, latitude, longitude, photo, city_id, district_id, project_id) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
              data.customer_id,
              data.customer_name,
              data.owner_name,
              data.no_contact,
              data.address,
              data.latitude,
              data.longitude,
              data.photo,
              data.city_id,
              data.district_id,
              data.project_id
          ],
          (_, results) => callback(true, results),
          error => callback(false, error)
      );
  });
};

// Fungsi untuk mengambil semua lokasi dari SQLite
export const getAllLocations = (callback) => {
  db.transaction(tx => {
      tx.executeSql(
          `SELECT * FROM lokasi_toko`,
          [],
          (_, results) => callback(results.rows.raw()), // Mengembalikan array data
          error => callback(null, error)
      );
  });
};

// Fungsi untuk mengambil lokasi berdasarkan project_id
export const getLocationsByProjectId = (projectId, callback) => {
  db.transaction(tx => {
      tx.executeSql(
          `SELECT * FROM lokasi_toko WHERE project_id = ?`,
          [projectId],
          (_, results) => callback(results.rows.raw()),
          error => callback(null, error)
      );
  });
};

// Fungsi untuk menghapus semua data lokasi
export const deleteAllLocations = (callback) => {
  db.transaction(tx => {
      tx.executeSql(
          `DELETE FROM lokasi_toko`,
          [],
          (_, results) => callback(true, results),
          error => callback(false, error)
      );
  });
};



// // Fungsi untuk mengambil check-in terakhir
// export const getLatestCheckin = () => {
//   return new Promise((resolve, reject) => {
//     db.transaction(tx => {
//       tx.executeSql(
//         'SELECT * FROM checkin ORDER BY checkin_time DESC LIMIT 1;',
//         [],
//         (_, results) => {
//           if (results.rows.length > 0) {
//             resolve(results.rows.item(0)); // Ambil check-in terbaru
//           } else {
//             resolve(null); // Tidak ada check-in
//           }
//         },
//         error => reject(error)
//       );
//     });
//   });
// };



export const getNipFromDB = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT employee_id FROM user LIMIT 1',
        [],
        (tx, results) => {
          if (results.rows.length > 0) {
            const nip = results.rows.item(0).employee_id;
            resolve(nip);
          } else {
            reject('Data tidak ditemukan di SQLite');
          }
        },
        error => {
          reject(error.message);
        }
      );
    });
  });
};


export const getLastCheckinDistance = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT distance_in FROM checkin ORDER BY datetimephone_in DESC LIMIT 1`,
        [],
        (_, results) => {
          if (results.rows.length > 0) {
            const distance = results.rows.item(0).distance_in;
            resolve(distance);
          } else {
            resolve(null); // Tidak ada data check-in
          }
        },
        (_, error) => {
          console.log('Gagal ambil distance_in:', error);
          reject(error);
        }
      );
    });
  });
};

export const getLastCheckinDistanceee = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT distance_out FROM checkin ORDER BY datetimephone_out DESC LIMIT 1`,
        [],
        (_, results) => {
          if (results.rows.length > 0) {
            const distance = results.rows.item(0).distance_out;
            resolve(distance);
          } else {
            resolve(null); // Tidak ada data check-in
          }
        },
        (_, error) => {
          console.log('Gagal ambil distance_out:', error);
          reject(error);
        }
      );
    });
  });
};

export const getLastCheckoutDistanceee = () => {
  return new Promise((resolve, reject) => {
    const db = openDatabase({ name: 'lokasi_toko.db', location: 'default' });
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT distance_out FROM checkin ORDER BY id DESC LIMIT 1',
        [],
        (_, results) => {
          if (results.rows.length > 0) {
            resolve(results.rows.item(0).distance_out);
          } else {
            resolve(null);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  });
};

export const getLastCheckinDataa = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT c.photo_out, c.datetimephone_out, c.distance_out, l.customer_name
         FROM checkin c
         LEFT JOIN lokasi_toko l ON c.customer_id = l.customer_id
         WHERE c.datetimephone_out IS NOT NULL
         ORDER BY c.id DESC LIMIT 1`,
        [],
        (tx, results) => {
          if (results.rows.length > 0) {
            resolve(results.rows.item(0));
          } else {
            resolve(null);
          }
        },
        error => {
          console.log('SQL error:', error);
          reject(error);
        }
      );
    });
  });
};

// export const getLastCheckinDistancee = () => {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         `SELECT distance_out FROM checkin ORDER BY datetimephone_out DESC LIMIT 1`,
//         [],
//         (_, results) => {
//           console.log("✅ Results dari query:", results);
//           if (results.rows.length > 0) {
//             const distance = results.rows.item(0).distance_out;
//             console.log("✅ Distance yang diambil:", distance);
//             resolve(distance);
//           } else {
//             console.log("❌ Tidak ada data check-out");
//              resolve(null); // Tidak ada data check-in
//           }
//         },
//         (_, error) => {
//           console.log('Gagal ambil distance_in:', error);
//           reject(error);
//         }
//       );
//     });
//   });
// };


// Fungsi untuk ambil data check-out terakhir
const getLastCheckoutData = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT latitude_out, longitude_out, distance_out, datetimephone_out, photo_out 
         FROM checkin 
         WHERE datetimephone_out IS NOT NULL 
         ORDER BY id DESC 
         LIMIT 1`,
        [],
        (txObj, resultSet) => {
          if (resultSet.rows.length > 0) {
            resolve(resultSet.rows.item(0));
          } else {
            resolve(null);
          }
        },
        (txObj, error) => {
          console.log('Error getting last checkout:', error);
          reject(error);
        }
      );
    });
  });
};






// 🔹 Fungsi untuk update status check-in agar tidak muncul lagi setelah checkout
const updateCheckinStatus = (customer_id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `UPDATE checkin_data SET is_checked_out = 1 WHERE customer_id = ?`, // Set status checked-out
        [customer_id],
        (_, result) => resolve(result),
        (_, error) => reject(error)
      );
    });
  });
};

// 🔹 Fungsi untuk mendapatkan data check-in yang masih aktif (belum checkout)
const getActiveCheckinData = (callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      'SELECT * FROM checkin_data WHERE is_checked_out = 0', // Hanya check-in yang belum checkout
      [],
      (_, { rows }) => callback(rows._array),
      (_, error) => console.error(error)
    );
  });
};

export { updateCheckinStatus, getActiveCheckinData };
