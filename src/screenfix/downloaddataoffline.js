import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity, Image, BackHandler } from 'react-native';
import ProgressBar from 'react-native-progress/Bar';
import LinearGradient from 'react-native-linear-gradient';
import { Card } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { createTable, saveDataToSQLite, getTotalRows } from '../../helper/sqliteservice';
import changeNavigationBarColor from 'react-native-navigation-bar-color';

const DownloadDataOffline = () => {
  const navigation = useNavigation();
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);

  useEffect(() => {
    changeNavigationBarColor('#ffffff', true);
    fetchTotalRows();
  }, []);

  // Handle tombol back bawaan HP
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('Home');
        return true; // Mencegah aplikasi keluar
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );

  const fetchTotalRows = async () => {
    const rows = await getTotalRows();
    setTotalRows(rows);
  };

  const downloadData = async () => {
    setLoading(true);
    setProgress(0);
    try {
      createTable();
      const response = await fetch('https://api.traxes.id/index.php/download/customerlist');
      const json = await response.json();
      if (json.status === 1 && json.data) {
        let progressValue = 0;
        const interval = setInterval(() => {
          progressValue += 0.01;
          setProgress(progressValue);
          if (progressValue >= 1) clearInterval(interval);
        }, 50);
        await saveDataToSQLite(json.data, async () => {
          clearInterval(interval);
          setProgress(1);
          setLoading(false);
          await fetchTotalRows();
          Alert.alert('Berhasil', 'Toko berhasil didownload.', [{ text: 'OK' }]);
        }, (error) => {
          clearInterval(interval);
          setLoading(false);
          Alert.alert('Gagal', 'Gagal menyimpan data ke database.');
        });
      } else {
        setLoading(false);
        Alert.alert('Peringatan', 'Data tidak valid dari API.');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', `Gagal mengunduh data: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      {/* Gradient Header */}
      <LinearGradient colors={['#204766', '#631D63']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Image source={require('../../assets/icc_back.png')} style={styles.icBack} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Download Data Offline</Text>
      </LinearGradient>

      {/* Card Container */}
      <View style={styles.cardWrapper}>
        <Card style={styles.card}>
          <View style={styles.cardContent}>
            <View>
              <Text style={styles.cardTitle}>Download Lokasi/Toko</Text>
              <Text style={styles.cardSubtitle}>Total row: {totalRows}</Text>
            </View>

            {/* Button / Progress Bar di pojok kanan */}
            <TouchableOpacity onPress={downloadData} disabled={loading} style={styles.buttonContainer}>
              {loading ? (
                <ProgressBar progress={progress} width={60} color="#2ECC71" />
              ) : (
                <LinearGradient
                  colors={['#2ECC71', '#27AE60']}
                  style={styles.downloadButton}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.downloadButtonText}>Download</Text>
                </LinearGradient>
              )}
            </TouchableOpacity>
          </View>
        </Card>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },

  header: {
    width: '100%',
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 25,
  },
  icBack: { width: 24, height: 24 },
  headerTitle: { fontSize: 20, color: 'white', fontWeight: 'bold', marginLeft: 10 },

  cardWrapper: {
    marginTop: 20, // Meletakkan card di bawah header
    paddingHorizontal: 15, // Agar tidak terlalu mepet sisi layar
  },
  card: {
    padding: 20,
    borderRadius: 10,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold' },
  cardSubtitle: { fontSize: 16, color: '#666' },

  buttonContainer: { alignItems: 'center' },
  downloadButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  downloadButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});

export default DownloadDataOffline;
