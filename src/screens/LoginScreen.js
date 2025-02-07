import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Image, StatusBar } from 'react-native';
import DeviceInfo from 'react-native-device-info'; // Library untuk mendapatkan device ID
import { createTable, saveUserData, getUserData } from '../../helper/SQLite'; // Import helper SQLite

const LoginScreen = ({ navigation }) => {
  const [nik, setNik] = useState(''); // State untuk NIK
  const [deviceID, setDeviceID] = useState(''); // State untuk deviceID
  const [loading, setLoading] = useState(false); // State loading

  // Mengambil deviceID dan membuat tabel SQLite saat aplikasi pertama kali dibuka
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const id = await DeviceInfo.getUniqueId(); // Ambil device ID
        setDeviceID(id); // Set device ID ke state
        createTable(); // Buat tabel SQLite jika belum ada
      } catch (error) {
        console.error('Error initializing app:', error);
      }
    };
    initializeApp();
  }, []);

  const handleLogin = async () => {
    if (nik.trim() === '') {
      Alert.alert('Error', 'NIP tidak boleh kosong !');
      return;
    }

    setLoading(true); // Set loading menjadi true saat login dilakukan

    const postData = {
      // 21530826 NIP
      nik,
      // deviceID, // Kirim device ID yang didapat dari DeviceInfo
      deviceID: '7da89e560b9cd297', //dio 308d3ed71f0701c2
      logindt: new Date().toISOString(), // Tanggal login (ISO format)
      apk_version: '1.0.0', // Versi aplikasi
    };

    try {
      const response = await fetch('https://api.traxes.id/index.php/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      const result = await response.json();
      console.log('API Response:', result);

      if (result.status === 1) {
        // Login berhasil, simpan data pengguna ke SQLite
        saveUserData(result.data);
        navigation.navigate('Home', { user: result.data });
      } else {
        Alert.alert('Error', result.message || 'Login gagal');
      }
    } catch (error) {
      console.error('Login Error:', error);
      Alert.alert('Error', 'Terjadi kesalahan saat login');
    } finally {
      setLoading(false); // Set loading menjadi false setelah proses selesai
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      {/* Gambar Logo */}
      <Image source={require('../../assets/traxes-icon.png')} style={styles.logo} />
      {/* Input NIK */}
      <TextInput
        style={styles.input}
        placeholder="Masukan NIK Anda.."
        keyboardType="numeric"
        value={nik}
        onChangeText={setNik}
      />
      {/* Tombol Masuk */}
      <View style={styles.buttonContainer}>
        <Button
          title={loading ? 'Mencoba Login Nih..' : 'Masuk'}
          onPress={handleLogin}
          color="#000000"
          disabled={loading}
        />
      </View>
    </View>
  );
};

// CSS untuk styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 50,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#000000',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  buttonContainer: {
    width: '98%',
    borderRadius: 5,
    overflow: 'hidden',
  },
});

export default LoginScreen;
