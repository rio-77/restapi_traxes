import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, Image, StatusBar, TouchableOpacity, ActivityIndicator } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { db, createTable, saveUserData, insertCustomers } from '../../helper/login';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';

const Login = ({ navigation }) => {
  const [nik, setNik] = useState('');
  const [deviceID, setDeviceID] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const id = await DeviceInfo.getUniqueId();
        setDeviceID(id);

        createTable();

        if (!db) {
          console.error('Database SQLite belum terinisialisasi');
          return;
        }

        db.transaction((tx) => {
          tx.executeSql(
            'SELECT * FROM user LIMIT 1;',
            [],
            (_, results) => {
              if (results.rows.length > 0) {
                navigation.navigate('Home', { user: results.rows.item(0) });
              } else {
                console.log('No profile data found');
              }
            },
            (error) => console.error('Error fetching user profile:', error)
          );
        });
      } catch (error) {
        console.error('Error saat inisialisasi aplikasi:', error);
      }
    };

    initializeApp();
  }, );

  const handleLogin = async () => {
    if (!nik.trim()) {
      Alert.alert('Error', 'NIP tidak boleh kosong!');
      return;
    }

    setLoading(true);

    const postData = { 
      nik, 
      deviceID, 
      logindt: moment().format('DD-MM-YYYY'), 
      apk_version: '0.0.1' 
    };

    const timeout = 30000;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch('https://api.traxes.id/index.php/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status >= 500) {
          Alert.alert('Error', 'Server API tidak tersedia, mohon coba lagi nanti.');
        } else {
          Alert.alert('Error', 'Terjadi masalah pada server. Silakan periksa kembali.');
        }
        return;
      }

      const result = await response.json();

      if (result.status === 1) {
        const userData = {
          ...result.data,
          nik: result.data.employee_id,
        };

        saveUserData(userData);


        // Tambahkan request untuk customerlist
      const customerResponse = await fetch('http://172.16.100.153/apitraxes/index.php/download/customerlist');
      const customerResult = await customerResponse.json();

      if (customerResult.status === 1) {
        const customers = customerResult.data;

        // Simpan customerlist ke SQLite
        insertCustomers(customers);

        db.transaction((tx) => {
          tx.executeSql(
            'SELECT * FROM user LIMIT 1;',
            [],
            (_, results) => {
              if (results.rows.length > 0) {
                navigation.navigate('Home', { user: results.rows.item(0) });
              }
            },
            (error) => console.error('Error fetching user profile:', error)
          );
        });
      } else {
        Alert.alert('Error', 'Gagal mengambil data pelanggan');
      }
    } else {
      Alert.alert('Error', result.message || 'Login gagal');
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      Alert.alert('Error', 'Waktu koneksi habis. Mohon periksa koneksi Anda dan coba lagi.');
    } else if (error.message.includes('Network request failed')) {
      Alert.alert('Error', 'Koneksi internet terputus. Pastikan Anda memiliki koneksi internet yang aktif.');
    } else {
      Alert.alert('Error', 'Terjadi kesalahan saat login (API).');
    }
  } finally {
    setLoading(false);
  }
};


  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <Image source={require('../../assets/traxes-icon.png')} style={styles.logo} />
      <TextInput
        style={styles.input}
        placeholder="Masukkan NIP Anda..."
        keyboardType="numeric"
        value={nik}
        onChangeText={setNik}
      />
      <TouchableOpacity style={styles.buttonContainer} onPress={handleLogin} disabled={loading}>
        <LinearGradient
          colors={['#204766', '#631D63']}
          style={styles.gradientButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Masuk</Text>}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

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
    marginBottom: 20,
    fontSize: 16,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  gradientButton: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});

export default Login;
