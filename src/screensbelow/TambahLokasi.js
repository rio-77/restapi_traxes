import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, ScrollView, TouchableOpacity, Linking, Image } from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import { createTable, saveCustomerToDB } from '../../helper/database_toko'; // Helper SQLite
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid } from 'react-native';

const TambahLokasiBelow = () => {
  const [form, setForm] = useState({
    customer_name: '',
    owner_name: '',
    no_contact: '',
  });
  const [fotoToko, setFotoToko] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    createTable(); // Membuat tabel SQLite
    requestLocationPermission(); // Meminta izin lokasi ketika komponen dimuat
  },);

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Izin Lokasi',
          message: 'Kami membutuhkan akses lokasi Anda untuk menampilkan lokasi toko.',
          buttonPositive: 'OK',
        }
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Izin lokasi diberikan');
        getLocation(); // Memanggil fungsi untuk mendapatkan lokasi
      } else {
        Alert.alert(
          'Izin Ditolak',
          'Izin lokasi diperlukan untuk mendapatkan lokasi Anda. Harap aktifkan lokasi di pengaturan perangkat.',
          [
            { text: 'Batal', onPress: () => console.log('Izin lokasi dibatalkan') },
            { text: 'Buka Pengaturan', onPress: () => Linking.openSettings() }, // Tombol untuk buka pengaturan
          ]
        );
      }
    } catch (err) {
      console.warn('Kesalahan saat meminta izin lokasi:', err);
    }
  };

  const getLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLatitude(latitude);
        setLongitude(longitude);
        console.log('Latitude:', latitude, 'Longitude:', longitude);
      },
      (error) => {
        console.log('Kesalahan Geolocation:', error);
        Alert.alert('Error', 'Gagal mendapatkan lokasi! Periksa apakah GPS aktif.');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const handleTambahLokasi = async () => {
    if (!form.customer_name || !form.owner_name || !form.no_contact || !fotoToko) {
      Alert.alert('Error', 'Harap isi semua kolom dan ambil foto!');
      return;
    }

    if (!latitude || !longitude) {
      Alert.alert('Error', 'Lokasi tidak ditemukan! Pastikan GPS aktif dan coba lagi.');
      getLocation(); // Panggil ulang untuk memastikan lokasi
      return;
    }

    const requestBody = {
      customer_id: '17363196561055',
      customer_name: form.customer_name,
      owner_name: form.owner_name,
      no_contact: form.no_contact,
      latitude,
      longitude,
      photo: fotoToko,
      createdby: '10522001',
    };

    try {
      const response = await axios.post('https://api.traxes.id/index.php/transaksi/pushNoo', requestBody);
      if (response.status === 200 && response.data.status === 1) {
        Alert.alert('Berhasil', response.data.message || 'Lokasi berhasil ditambahkan!');
        saveCustomerToDB(requestBody); // Simpan ke SQLite lokal
        setForm({ customer_name: '', owner_name: '', no_contact: '' });
        setFotoToko(null);
        navigation.navigate('CustomerListBelow');
      } else {
        Alert.alert('Gagal', 'Gagal menambahkan lokasi ke server.');
      }
    } catch (error) {
      console.error('Error saat mengirim data ke server:', error);
      Alert.alert('Error', `Terjadi kesalahan: ${error.message}`);
    }
  };

  const handleAmbilFoto = async () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      includeBase64: true,
    };
    try {
      const result = await launchCamera(options);
      if (result.assets && result.assets[0].base64) {
        setFotoToko(`data:image/jpeg;base64,${result.assets[0].base64}`);
      } else {
        Alert.alert('Info', 'Foto tidak diambil.');
      }
    } catch (error) {
      console.error('Error saat mengambil foto:', error);
      Alert.alert('Error', 'Terjadi kesalahan saat mengambil foto.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.fotoContainer}>
        <TouchableOpacity onPress={handleAmbilFoto} style={styles.fotoButton}>
          {fotoToko ? (
            <Image source={{ uri: fotoToko }} style={styles.fotoPreview} />
          ) : (
            <Text style={styles.fotoPlaceholder}>📷 Ambil Foto Toko</Text>
          )}
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Nama Toko"
        value={form.customer_name}
        onChangeText={(text) => setForm({ ...form, customer_name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Nama Pemilik"
        value={form.owner_name}
        onChangeText={(text) => setForm({ ...form, owner_name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Nomor Kontak"
        keyboardType="phone-pad"
        value={form.no_contact}
        onChangeText={(text) => setForm({ ...form, no_contact: text })}
      />
      <LinearGradient colors={['#204766', '#631D63']} style={styles.gradientButton}>
        <TouchableOpacity style={styles.button} onPress={handleTambahLokasi}>
          <Text style={styles.buttonText}>Tambah Toko</Text>
        </TouchableOpacity>
      </LinearGradient>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  fotoContainer: {
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 30,
  },
  fotoButton: {
    height: 150,
    width: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: '#204766',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  fotoPreview: {
    height: '100%',
    width: '100%',
    borderRadius: 75,
  },
  fotoPlaceholder: {
    color: '#aaa',
    textAlign: 'center',
  },
  gradientButton: {
    borderRadius: 8,
    marginTop: 20,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TambahLokasiBelow;
