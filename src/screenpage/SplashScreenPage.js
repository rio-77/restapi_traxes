import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, StatusBar, ActivityIndicator, Dimensions, Text } from 'react-native';
// testing //
import { getusersprofile, checkSavedUserData } from '../../helper/login'; // Pastikan path sesuai
import { createTable, createTableToko, createCustomerTable } from '../../helper/login';
// Pastikan tabel dibuat sebelum digunakan
// createTable();
// createTableToko();
// createCustomerTable();
const { width, height } = Dimensions.get('window'); // Ambil dimensi layar
const SplashScreenPage = ({ navigation }) => {
  // const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Menangani status loading
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        console.log('Checking login status...');

        // Ambil data pengguna dari SQLite atau sumber lainnya
        const userData = await getusersprofile();

        console.log('User data from SQLite:', userData); // Log data pengguna yang diambil

        // Tunggu selama 3,5 detik sebelum navigasi
        setTimeout(() => {
          if (userData) {
            // Jika ada data user, arahkan ke halaman Home
            console.log('User found, navigating to Home');
            navigation.replace('Home', { user: userData });
          } else {
            // Jika tidak ada data user, arahkan ke halaman Login
            console.log('No user found, navigating to Login');
            navigation.replace('LoginScreenBelow');
          }
        }, 3500); // Durasi splash screen 3500 ms (3,5 detik)
      } catch (error) {
        // console.error('Error checking login status:', error);

        // Jika terjadi error, tetap tunggu 3,5 detik sebelum ke halaman login
        setTimeout(() => {
          navigation.replace('LoginScreenBelow');
        }, 3500);
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
      {/* <ActivityIndicator size="large" color="#204766" style={styles.loader} /> */}


{/* test users data */}
      {/* {user ? (
        <Text>User Name: {user.fullname}</Text>
      ) : (
        <Text>No user data found</Text>
      )} */}

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
    width: width * 0.4, // Responsif berdasarkan lebar layar (40% dari lebar layar)
    height: width * 0.4, // Sama dengan lebar agar logo tetap proporsional
    marginBottom: height * 0.05, // Jarak responsif berdasarkan tinggi layar
  },
  loader: {
    marginTop: height * 0.04, // Jarak antara logo dan ActivityIndicator
  },
});

export default SplashScreenPage;
