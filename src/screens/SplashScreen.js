import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, StatusBar, ActivityIndicator, Dimensions, Text } from 'react-native';
import { getusersprofile, checkSavedUserData } from '../../helper/login'; // Pastikan path sesuai
import { createTable, createTableToko, createCustomerTable } from '../../helper/login';

import changeNavigationBarColor from 'react-native-navigation-bar-color'; // Tambahkan ini
  
// Pastikan tabel dibuat sebelum digunakan
createTable();
// createTableToko();
// createCustomerTable();
const { width, height } = Dimensions.get('window'); // Ambil dimensi layar
const Splash = ({ navigation }) => {
  // const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Menangani status loading
  useEffect(() => {
      // Set Navigation Bar Color
      changeNavigationBarColor('#ffffff', true); // Warna biru tua dan ikon terang

    const checkLoginStatus = async () => {
      try {
        console.log('Check users login status..');
        // Ambil data pengguna dari SQLite atau sumber lainnya
        const userData = await getusersprofile();
        console.log('Users db local sqlite', userData); // Log data pengguna yang diambil
        // Tunggu selama 3,5 detik sebelum navigasi
        setTimeout(() => {
          if (userData) {
            // Jika ada data user, arahkan ke halaman Home
            console.log('Users found navigation Home!');
            navigation.replace('Home', { user: userData });
          } else {
            // Jika tidak ada data user, arahkan ke halaman Login
            console.log('Tidak ada users Login!');
            navigation.replace('LoginScreenBelow');
          }
        }, 1500); // Durasi splash screen 3500 ms (3,5 detik)
      } catch (error) {
        // console.error('Error checking login status:', error);
        // Jika terjadi error, tetap tunggu 3,5 detik sebelum ke halaman login
        setTimeout(() => {
          navigation.replace('LoginScreenBelow');
        }, 1500);
      } finally {
        setLoading(false); // Setelah proses selesai, matikan loading
      }
    };
    // Jalankan fungsi untuk mengecek status login
    checkLoginStatus();
    // Bersihkan timeout jika komponen dibongkar lebih awal
    return () => clearTimeout();
  }, [navigation]);
  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <Image
        source={require('../../assets/traxes-icon.png')} // Ganti dengan path logo Anda
        style={styles.logo}
      />
          {loading ? (
            <ActivityIndicator size="large" color="#204766" style={styles.loader} />
          ) : null}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  logo: {
    width: width * 0.6,
    height: width * 0.6,
    marginBottom: height * 0.05,
  },
  loader: {
    marginTop: height * 0.04,
  },
});
export default Splash;




