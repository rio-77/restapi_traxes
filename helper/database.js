import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'locations.db', location: 'default' },
  () => console.log('Database opened'),
  (err) => console.error('Database error:', err)
);

export const createTable = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS locations (
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
      );`
    );
  });
};

export const insertLocation = (data) => {
  db.transaction((tx) => {
    tx.executeSql(
      `INSERT INTO locations 
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
      (_, result) => console.log('Data inserted:', result),
      (error) => console.error('Insert error:', error)
    );
  });
};

export default db;

