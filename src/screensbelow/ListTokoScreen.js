import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { fetchAllData } from '../../helper/sqliteservice';

const ListTokoScreen = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchAllData((rows) => setData(rows));
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.text}>ID: {item.customer_id}</Text>
      <Text style={styles.text}>Nama: {item.customer_name}</Text>
      <Text style={styles.text}>Longitude: {item.longitude}</Text>
      <Text style={styles.text}>Latitude: {item.latitude}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>List Toko</Text>

      {data.length === 0 ? (
        <Text style={styles.noDataText}>Tidak ada data tersedia.</Text>
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 15 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#204766',
  },
  card: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  text: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  noDataText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ListTokoScreen;
