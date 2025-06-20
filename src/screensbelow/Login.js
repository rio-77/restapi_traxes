import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, Image, StatusBar, TouchableOpacity, ActivityIndicator, Modal, useColorScheme } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { db, createTable, saveUserData } from '../../helper/login';
import { initCheckinTable } from '../../helper/sqliteservice';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import changeNavigationBarColor from 'react-native-navigation-bar-color'; // Tambahkan ini
const LoginScreenBelow = ({ navigation }) => {
  const isDarkMode = useColorScheme() === 'dark'; // Deteksi mode gelap
  const [nik, setNik] = useState('');
  const [deviceID, setDeviceID] = useState('');
  const [loading, setLoading] = useState(false);
  const [nikError, setNikError] = useState('');
  const [showErrorCard, setShowErrorCard] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loggedInNik, setLoggedInNik] = useState('');
  useEffect(() => {
     // Set Navigation Bar Color
     changeNavigationBarColor('#ffffff', true); // Warna biru tua dan ikon terang
  
    const initializeApp = async () => {
      try {
        const id = await DeviceInfo.getUniqueId();
        setDeviceID(id);
        createTable();
        initCheckinTable();
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
                const user = results.rows.item(0);
                navigation.navigate('Home', { user });
              }
            },
            (error) => console.error('Error fetching user profile from DB:', error)
          );
        });
      } catch (error) {
        console.error('Error saat inisialisasi aplikasi:', error);
      }
    };
    initializeApp();
  }, []);
  const handleLogin = async () => {
    if (!nik.trim()) {
      Alert.alert('Peringatan nih!', 'NIP tidak boleh kosong yaa teman-teman😊');
      return;
    }
    setLoading(true);
    setNikError('');
    setShowErrorCard(false);
    const postData = { 
      nik, 
      deviceID, 
      logindt: moment().format('DD-MM-YYYY'), 
      apk_version: '0.0.1' 
    };
    const timeout = 3000000;
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
        setLoggedInNik(result.data.employee_id);  // Menyimpan NIK yang berhasil login
        // Menampilkan modal sebagai pengganti Alert
        setModalVisible(true);
        // Navigasi otomatis setelah beberapa detik dan hilangkan modal
        setTimeout(() => {
          setModalVisible(false); // Menutup modal setelah 2 detik
          
          db.transaction((tx) => {
            tx.executeSql(
              'SELECT * FROM user LIMIT 1;',
              [],
              (_, results) => {
                if (results.rows.length > 0) {
                  const user = results.rows.item(0);
                  navigation.navigate('Home', { user });
                }
              },
              (error) => console.error('Error fetching user profile from DB:', error)
            );
          });
        }, 1500); // Tunggu 2 detik sebelum navigasi
      } else {

        var x = result.message;
        // setNikError(`NIP ${nik} tidak terdaftar`);
        setNikError(x);
        setShowErrorCard(true);
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        Alert.alert('Error', 'Waktu koneksi habis. Mohon periksa koneksi Anda dan coba lagi.');
      } else if (error.message.includes('Network request failed')) {
        Alert.alert('Peringatan nih !', 'Koneksi internet terputus. Pastikan Anda memiliki koneksi internet yang aktif.');
      } else {
        Alert.alert('Error', 'Terjadi kesalahan saat login (API).');
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#ffffff' }]}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <Image source={require('../../assets/traxes-icon.png')} style={styles.logo} />

      <TextInput
  style={[styles.input, { 
    borderColor: isDarkMode ? '#BB86FC' : '#1C4966', 
    color: '#000000', // Warna teks saat diketik tetap hitam
    backgroundColor: isDarkMode ? '#333333' : '#ffffff'
  }]}
  placeholder="(NIP) harus diisi ya, teman-teman .."
  placeholderTextColor="#A9A9A9" // Warna placeholder abu-abu
  keyboardType="numeric"
  value={nik}
  onChangeText={(text) => {
    if (text.length <= 8) { 
      setNik(text);
    }
  }}
  maxLength={8}
  textAlign="center"
/>
      

      {showErrorCard && (
        <View style={[styles.errorCard, { backgroundColor: isDarkMode ? '#E94545' : '#A53535' }]}>
          <Text style={styles.deviceIdText}>ID Handphone: {deviceID}</Text>
          <Text style={styles.errorText}>{nikError}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.buttonContainer} onPress={handleLogin} disabled={loading}>
        <LinearGradient
          colors={isDarkMode ? ['#444444', '#222222'] : ['#204766', '#631D63']}
          style={styles.gradientButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Masuk</Text>}
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: isDarkMode ? '#BBBBBB' : '#1C4966' }]}>
          © 2025 Traxes. All Rights Reserved.
        </Text>
        <Text style={[styles.footerText, { color: isDarkMode ? '#BBBBBB' : '#1C4966' }]}>
          APK Version: 0.0.1
        </Text>
      </View>

      <Modal transparent={true} animationType="fade" visible={modalVisible}>
        <View style={styles.modalBackground}>
          <View style={[styles.modalContainer, { backgroundColor: isDarkMode ? '#222222' : '#fff' }]}>
            <Text style={[styles.modalText, { color: isDarkMode ? '#BB86FC' : '#204766' }]}>
              NIP {loggedInNik} berhasil login😊
            </Text>
          </View>
        </View>
      </Modal>
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
    width: 175,
    height: 175,
    marginBottom: 25,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#1C4966',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    textAlign: 'center', // Teks di tengah
    color: 'black', // Warna teks hitam
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

  errorCard: {
    width: '100%', // Sama dengan tombol Masuk
    padding: 15, // Memberikan ruang agar teks tidak terlalu mepet
    backgroundColor: '#631D63',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    marginTop: 5,
  },
  errorText: {
    color: 'white',
    fontSize: 14,
    marginTop: 0,
  },
  deviceIdText: {
    color: 'white',
    fontSize: 14,
    style: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#1C4966',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 250,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  modalText: {
    fontSize: 18,
    color: '#204766',
    fontWeight: 'bold',
  },
});
export default LoginScreenBelow;

