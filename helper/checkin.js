import SQLite from 'react-native-sqlite-storage';

// Membuka atau membuat database
const db = SQLite.openDatabase(
  {
    name: 'checkinDatabase.db',
    location: 'default',
  },
  () => {
    console.log('Database berhasil dibuka');
  },
  (error) => {
    console.error('Error membuka database:', error);
  }
);

// Membuat tabel check-in jika belum ada
const createTable = () => {
  db.transaction(
    (tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS checkins (
          id INTEGER PRIMARY KEY AUTOINCREMENT, 
          employee_id TEXT NOT NULL, 
          foto_in TEXT, 
          latitude_in TEXT, 
          longitude_in TEXT, 
          distance_in REAL, 
          date_in TEXT, 
          time_in TEXT
        )`,
        [],
        () => {
          console.log('Tabel checkins berhasil dibuat');
        },
        (error) => {
          console.error('Error membuat tabel:', error);
        }
      );
    },
    (error) => {
      console.error('Transaction error saat membuat tabel:', error);
    }
  );
};

// Menyimpan data check-in
const insertCheckinData = ({
  employee_id,
  foto_in,
  latitude_in,
  longitude_in,
  distance_in,
  date_in,
  time_in,
}) => {
  db.transaction(
    (tx) => {
      tx.executeSql(
        `INSERT INTO checkins 
        (employee_id, foto_in, latitude_in, longitude_in, distance_in, date_in, time_in) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [employee_id, foto_in, latitude_in, longitude_in, distance_in, date_in, time_in],
        () => {
          console.log('Data check-in berhasil disimpan');
        },
        (error) => {
          console.error('Error menyimpan data check-in:', error);
        }
      );
    },
    (error) => {
      console.error('Transaction error saat menyimpan data:', error);
    }
  );
};

// Mendapatkan semua data check-in
const getAllCheckins = (callback) => {
  db.transaction(
    (tx) => {
      tx.executeSql(
        'SELECT * FROM checkins',
        [],
        (tx, results) => {
          const checkins = [];
          for (let i = 0; i < results.rows.length; i++) {
            checkins.push(results.rows.item(i));
          }
          callback(checkins);
        },
        (error) => {
          console.error('Error mendapatkan data check-in:', error);
        }
      );
    },
    (error) => {
      console.error('Transaction error saat mendapatkan data:', error);
    }
  );
};

// Menghapus semua data check-in
const deleteAllCheckins = () => {
  db.transaction(
    (tx) => {
      tx.executeSql(
        'DELETE FROM checkins',
        [],
        () => {
          console.log('Semua data check-in berhasil dihapus');
        },
        (error) => {
          console.error('Error menghapus data check-in:', error);
        }
      );
    },
    (error) => {
      console.error('Transaction error saat menghapus data:', error);
    }
  );
};

// Menggunakan createTable saat pertama kali membuka aplikasi
createTable();

export { insertCheckinData, getAllCheckins, deleteAllCheckins };
