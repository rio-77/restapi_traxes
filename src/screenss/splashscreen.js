import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, StatusBar, ActivityIndicator, Dimensions, Text } from 'react-native';
import { getusersprofile } from '../../dboffline/db_traxes'; // Pastikan path sesuai
// start //
// Ambil dimensi layar
const { width, height } = Dimensions.get('window');
const SplashScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true); // Menangani status loading
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        // Ambil data pengguna dari SQLite atau sumber lainnya
        const userData = await getusersprofile();
        // Tunggu selama 5 detik sebelum navigasi
        setTimeout(() => {
          if (userData) {
            // Jika ada data user, arahkan ke halaman Home
            navigation.replace('Home', { user: userData });
          } else {
            // Jika tidak ada data user, arahkan ke halaman Login
            navigation.replace('Login');
          }
        }, 3500); // Durasi splash screen 5000 ms (5 detik)
      } catch (error) {
        console.error('Error checking login status:', error);
        // Jika terjadi error, tetap tunggu 5 detik sebelum ke halaman login
        setTimeout(() => {
          navigation.replace('Login');
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
      {loading ? (
        <ActivityIndicator size="large" color="#204766" style={styles.loader} />
      ) : null} {/* Tampilkan loader hanya saat loading */}
      {/* Pastikan tidak ada teks yang tidak dibungkus oleh komponen <Text> */}
      <Text style={styles.footerText}>  </Text> {/* Contoh menambahkan teks yang benar */}
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
  footerText: {
    marginTop: height * 0.05, // Jarak antara ActivityIndicator dan teks
    fontSize: 16,
    color: '#204766', // Warna teks
  }
});
export default SplashScreen;


