import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, Image, StatusBar, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { db, createTable, saveUserData } from '../../helper/login';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
const LoginScreenBelow = ({ navigation }) => {
  const [nik, setNik] = useState('');
  const [deviceID, setDeviceID] = useState('');
  const [loading, setLoading] = useState(false);
  const [nikError, setNikError] = useState('');
  const [showErrorCard, setShowErrorCard] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loggedInNik, setLoggedInNik] = useState('');
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
        }, 5000); // Tunggu 2 detik sebelum navigasi
      } else {
        setNikError(`NIP ${nik} tidak terdaftar`);
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
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <Image source={require('../../assets/traxes-icon.png')} style={styles.logo} />
      <TextInput
        style={styles.input}
        placeholder=" (NIP) harus diisi ya, teman-teman .."
        keyboardType="numeric"
        value={nik}
        onChangeText={setNik}
      />
      {showErrorCard && (
        <View style={styles.errorCard}>
          <Text style={styles.deviceIdText}>DeviceId: {deviceID}</Text>
          <Text style={styles.errorText}>{nikError}</Text>
        </View>
      )}
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
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 Traxes. All Rights Reserved.</Text>
        <Text style={styles.footerText}>APK Version: 0.0.1</Text>
      </View>
      {/* Modal dialog untuk sukses login */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => {}}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>NIP {loggedInNik} berhasil login😊</Text> {/* Menampilkan NIK yang berhasil login */}
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
  input: {
    width: '100%',
    height: 50,
    borderColor: '#1C4966',
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
  errorCard: {
    marginBottom: 15,
    marginTop: 5,
    padding: 10,
    backgroundColor: '#631D63',
    borderRadius: 8,
    width: '85%',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
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

