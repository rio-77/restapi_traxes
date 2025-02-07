import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import { insertCheckinData } from '../../helper/checkin'; // Helper untuk menyimpan data ke SQLite
import { openDatabase } from 'react-native-sqlite-storage';

// Membuka koneksi SQLite
const db = openDatabase({ name: 'checkin_data.db', location: 'default' });

const DetailCheckinBelow = () => {
  const [fotoToko, setFotoToko] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [distance, setDistance] = useState(0);
  const [keterangan, setKeterangan] = useState('');
  const [loading, setLoading] = useState(false);

  const employee_id = "21530826"; // ID karyawan
  const jabatan_id = "5"; // ID jabatan
  const project_id = "30"; // ID project

  // Mengambil data lokasi saat komponen dimuat
  useEffect(() => {
    getCurrentLocation();
  }, []);

  // Fungsi untuk mendapatkan lokasi terkini
  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        setLatitude(lat);
        setLongitude(lon);

        // Tunggu hingga state diperbarui, lalu hitung jarak
        setTimeout(() => calculateDistance(lat, lon), 100);
      },
      (error) => {
        console.error('Error mendapatkan lokasi:', error);
        Alert.alert('Error', 'Gagal mendapatkan lokasi Anda. Mohon aktifkan GPS.');
      },
      { enableHighAccuracy: true, timeout: 1000000, maximumAge: 1000 }
    );
  };

  // Menghitung jarak menggunakan rumus Haversine
  const calculateDistance = (lat1, lon1) => {
    if (latitude === null || longitude === null) return;

    const R = 6371; // Radius bumi dalam km
    const lat1Rad = toRadians(lat1);
    const lon1Rad = toRadians(lon1);
    const lat2Rad = toRadians(latitude);
    const lon2Rad = toRadians(longitude);

    const dLat = lat2Rad - lat1Rad;
    const dLon = lon2Rad - lon1Rad;

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1Rad) * Math.cos(lat2Rad) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c * 1000; // Jarak dalam meter

    setDistance(distance);
  };

  // Fungsi untuk konversi derajat ke radian
  const toRadians = (deg) => deg * (Math.PI / 180);

  // Fungsi untuk mengambil foto toko
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
      console.error('Error mengambil foto:', error);
      Alert.alert('Error', 'Gagal mengambil foto.');
    }
  };

  // Fungsi untuk mengirim request check-in ke API dan menyimpan data ke SQLite
  const handleCheckin = async () => {
    if (!fotoToko) {
      Alert.alert('Error', 'Harap ambil foto toko!');
      return;
    }

    // Memastikan jarak tidak lebih dari 500 meter
    if (distance > 500) {
      Alert.alert('Error', 'Gagal check-in, jarak lebih dari 500 meter.');
      return;
    }

    const requestBody = {
      employee_id,
      customer_id: "",
      jabatan_id,
      date_cio: new Date().toISOString().slice(0, 10),
      status_emp: "1",
      datetimephone_in: new Date().toISOString().slice(0, 19).replace('T', ' '),
      project_id,
      latitude_in: latitude,
      longitude_in: longitude,
      radius_in: 1.24,
      distance_in: distance,
      foto_in: fotoToko,
      keterangan,
      apk: "1",
      update_toko: "1"
    };

    try {
      setLoading(true);

      // Mengirim request ke API
      const response = await axios.post('https://api.traxes.id/index.php/v2/customer/pushCheckIn', requestBody);
      if (response.data.status === 1) {
        Alert.alert('Berhasil', response.data.message || 'Check-in berhasil!');

        // Menyimpan data check-in ke SQLite setelah berhasil
        insertCheckinData(requestBody);

        // Reset state setelah check-in berhasil
        setFotoToko('');
        setLatitude(null);
        setLongitude(null);
        setDistance(0);
        setKeterangan('');
      } else {
        Alert.alert('Gagal', response.data.message || 'Gagal melakukan check-in.');
      }
    } catch (error) {
      console.error('Error saat mengirim data ke server:', error);
      Alert.alert('Error', `Terjadi kesalahan: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#204766', '#631D63']} style={styles.header}>
        <Text style={styles.headerTitle}>Check-In</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.fotoContainer}>
          <TouchableOpacity onPress={handleAmbilFoto} style={styles.fotoButton}>
            {fotoToko ? (
              <Image source={{ uri: fotoToko }} style={styles.fotoPreview} />
            ) : (
              <Text style={styles.fotoPlaceholder}>📷 Ambil Foto Checkin</Text>
            )}
          </TouchableOpacity>
        </View>

        {latitude !== null && longitude !== null && (
          <LinearGradient colors={['#ffffff', '#dfe9f3']} style={styles.card}>
            <Text style={styles.cardText}>Latitude: {latitude}</Text>
            <Text style={styles.cardText}>Longitude: {longitude}</Text>
            <Text style={styles.cardText}>Jarak: {distance.toFixed(2)} meter</Text>
          </LinearGradient>
        )}

        <LinearGradient colors={['#204766', '#631D63']} style={styles.gradientButton}>
          <TouchableOpacity style={styles.button} onPress={handleCheckin} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Check-In</Text>
            )}
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  fotoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  fotoButton: {
    width: 200,
    height: 200,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#204766',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  fotoPlaceholder: {
    fontSize: 16,
    color: '#204766',
    textAlign: 'center',
  },
  fotoPreview: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  card: {
    width: '90%',
    padding: 15,
    borderRadius: 10,
    elevation: 5,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 15,
  },
  cardText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  gradientButton: {
    width: '90%',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  button: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});


export default DetailCheckinBelow;
