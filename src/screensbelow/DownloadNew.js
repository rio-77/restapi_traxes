import React, { useEffect, useState } from 'react';
import { View, Image, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import ProgressBar from 'react-native-progress/Bar';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { createTable, saveDataToSQLite } from '../../helper/sqliteservice';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
const DownloadNew = () => {
  const navigation = useNavigation();
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
      // Set Navigation Bar Color
      changeNavigationBarColor('#ffffff', true); // Warna biru tua dan ikon terang
  })


  const downloadData = async () => {
    setLoading(true);
    setProgress(0); // Reset progress
    try {
      createTable(); // Buat tabel jika belum ada
      const response = await fetch('https://api.traxes.id/index.php/download/customerlist');
      const json = await response.json();
      if (json.status === 1 && json.data) {
        let progressValue = 0;
        const interval = setInterval(() => {
          progressValue += 0.01; // Tambah progress
          setProgress(progressValue);

          if (progressValue >= 1) {
            clearInterval(interval);
          }
        }, 50); // Update progress setiap 50ms
        await saveDataToSQLite(json.data, () => {
          clearInterval(interval); // Hentikan progress bar setelah selesai
          setProgress(1);
          setLoading(false);
          Alert.alert(
            'Berhasil',
            'Toko berhasil didownload..',
            [
              { text: 'OK', onPress: () => navigation.navigate('DownloadNew') }
            ]
          );
        }, (error) => {
          clearInterval(interval);
          setLoading(false);
          Alert.alert('Peringatan nih!', 'Gagal menyimpan data ke database.');
        });
      } else {
        setLoading(false);
        Alert.alert('Peringatan nih!', 'Data tidak valid dari API.');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Peringatan nih!', `Gagal mengunduh data: ${error.message}`);
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
      {/* Button Download */}
      <View style={styles.centeredView}>
        <TouchableOpacity onPress={downloadData} disabled={loading}>
          <LinearGradient
            colors={['#204766', '#631D63']}
            style={styles.gradientButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.gradientButtonText}>
              {loading ? `Sedang mengunduh..${Math.round(progress * 100)}%` : 'yukk download Toko'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      {/* Progress Bar */}
      {loading && (
        <View style={styles.progressContainer}>
          <ProgressBar progress={progress} width={200} color="#204766" />
          <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
        </View>
      )}
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
  centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  gradientButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  progressContainer: { alignItems: 'center', marginVertical: 10 },
  progressText: { marginTop: 5, fontSize: 16, color: '#333' },
});
export default DownloadNew;


