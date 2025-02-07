import { openDatabase } from 'react-native-sqlite-storage';

const db = openDatabase({ name: 'CustomerDB.db', location: 'default' });

export const createCustomerTable = () => {
  db.transaction((tx) => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS customers (id INTEGER PRIMARY KEY AUTOINCREMENT, customer_id TEXT, customer_name TEXT, address TEXT, latitude TEXT, longitude TEXT, village_id TEXT, vil_name TEXT, district_id TEXT, dist_name TEXT, city_id TEXT, city_name TEXT, dista TEXT);'
    );
  });
};

export const insertCustomerData = (customers) => {
  customers.forEach((customer) => {
    const {
      customer_id,
      customer_name,
      address,
      latitude,
      longitude,
      village_id,
      vil_name,
      district_id,
      dist_name,
      city_id,
      city_name,
      dista
    } = customer;

    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO customers (customer_id, customer_name, address, latitude, longitude, village_id, vil_name, district_id, dist_name, city_id, city_name, dista) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
        [
          customer_id,
          customer_name,
          address,
          latitude,
          longitude,
          village_id,
          vil_name,
          district_id,
          dist_name,
          city_id,
          city_name,
          dista
        ],
        (tx, results) => {
          console.log('Customer inserted successfully:', results);
        },
        (error) => {
          console.error('Error inserting customer:', error);
        }
      );
    });
  });
};

export const fetchCustomers = (callback) => {
  db.transaction((tx) => {
    tx.executeSql('SELECT * FROM customers;', [], (tx, results) => {
      let customers = [];
      for (let i = 0; i < results.rows.length; i++) {
        customers.push(results.rows.item(i));
      }
      callback(customers);
    });
  });
};
