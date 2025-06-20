import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Alert, ScrollView } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
import LinearGradient from 'react-native-linear-gradient';

const db = openDatabase({ name: 'lokasi_toko.db', location: 'default' });

const DetailToko = ({ route }) => {
  const { customer_id, project_id } = route.params || {};
  const [toko, setToko] = useState(null);

  useEffect(() => {
    if (customer_id) {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT customer_name, address FROM lokasi_toko WHERE customer_id = ?',
          [customer_id],
          (tx, results) => {
            if (results.rows.length > 0) {
              setToko(results.rows.item(0));
            } else {
              Alert.alert('Error', 'Data toko tidak ditemukan');
            }
          },
          (error) => {
            console.error('Error fetching toko data:', error);
            Alert.alert('Error', 'Gagal mengambil data toko');
          }
        );
      });
    }
  }, [customer_id]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <LinearGradient colors={['#204766', '#631D63']} style={styles.header}>
        <Text style={styles.headerTitle}>Detail Toko</Text>
      </LinearGradient>

      <View style={styles.card}>
        <Text style={styles.title}>{toko?.customer_name || 'Nama Toko'}</Text>
        <Text style={styles.info}>{toko?.address || 'Alamat tidak tersedia'}</Text>
      </View>

      <View style={styles.photoFrame}>
        {toko?.foto ? (
          <Image source={{ uri: `data:image/jpeg;base64,${toko.foto}` }} style={styles.preview} />
        ) : (
          <Text style={styles.noImageText}>Tidak ada foto toko</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9', alignItems: 'center', padding: 20 },
  header: { width: '100%', padding: 20, alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 20, color: 'white', fontWeight: 'bold' },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '100%', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  info: { fontSize: 16, textAlign: 'center' },
  photoFrame: {
    marginTop: 20,
    width: 250,
    height: 250,
    borderWidth: 5,
    borderColor: '#ddd',
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  preview: { width: '100%', height: '100%' },
  noImageText: { fontSize: 16, color: 'gray' },
});

export default DetailToko;
