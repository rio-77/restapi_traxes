import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

export const db = SQLite.openDatabase(
  {
    name: 'lokasi_toko.db',
    location: 'default',
  },
  () => {
    console.log('✅ Database opened');
  },
  error => {
    console.log('❌ Error opening database:', error);
  }
);
