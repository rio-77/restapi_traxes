import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import Geolocation from '@react-native-community/geolocation';
import { insertCheckinData } from '../../helper/checkin';
import { getusersprofile } from '../../helper/login';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const CheckinBelow = () => {
  const navigation = useNavigation();
  const [fotoToko, setFotoToko] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [loading, setLoading] = useState(false);
  const [distance, setDistance] = useState(0);
  const [date, setDate] = useState('');  // State for date
  const [time, setTime] = useState('');  // State for time

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await getusersprofile();
        setUserProfile(profile);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    fetchUserProfile();
    getCurrentLocation();
  }, );

  const handleBackPress = () => {
    navigation.goBack();
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
      console.error('Error mengambil foto:', error);
      Alert.alert('Error', 'Gagal mengambil foto.');
    }
  };

  const handleTambahCheckin = async () => {
    if (!fotoToko) {
      Alert.alert('Error', 'Harap ambil foto toko!');
      return;
    }

    if (!userProfile) {
      Alert.alert('Error', 'Profil pengguna tidak ditemukan!');
      return;
    }

    const { id: employee_id } = userProfile;

    if (distance > 500) {
      Alert.alert('Error', 'Gagal check-in, jarak lebih dari 500 meter.');
      return;
    }

    const requestBody = {
      employee_id,
      foto_in: fotoToko,
      latitude_in: latitude,
      longitude_in: longitude,
      distance_in: distance,
      date_in: date,  // Add date to the request
      time_in: time,  // Add time to the request
    };

    try {
      setLoading(true);

      const response = await axios.post('https://api.traxes.id/index.php/v2/customer/pushCheckIn', requestBody);

      if (response.data.status === 1) {
        Alert.alert('Berhasil', response.data.message || 'Check-in berhasil!');
        insertCheckinData({
          employee_id,
          foto_in: fotoToko,
          latitude_in: latitude,
          longitude_in: longitude,
          distance_in: distance,
          date_in: date,
          time_in: time,
        });

        setFotoToko('');
        setLatitude('');
        setLongitude('');
        setDistance(0);
        setDate('');  // Reset date
        setTime('');  // Reset time

        navigation.navigate('CustomerListBelow');
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

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toString());
        setLongitude(position.coords.longitude.toString());
        calculateDistance(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.error('Error mendapatkan lokasi:', error);
        Alert.alert('Error', 'Gagal mendapatkan lokasi Anda. Mohon aktifkan GPS.');
      },
      { enableHighAccuracy: true, timeout: 10000000, maximumAge: 100000 }
    );
  };

  const calculateDistance = (lat1, lon1) => {
    if (!latitude || !longitude) {
      console.log('Lokasi belum tersedia');
      return;
    }

    const storeLatitude = parseFloat(lat1);
    const storeLongitude = parseFloat(lon1);
    const userLatitude = parseFloat(latitude);
    const userLongitude = parseFloat(longitude);

    const distance = getDistance(storeLatitude, storeLongitude, userLatitude, userLongitude);
    setDistance(distance);

    const currentDate = new Date();
    setDate(currentDate.toLocaleDateString());
    setTime(currentDate.toLocaleTimeString());
  };

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of Earth in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance * 1000; // Convert to meters
  };

  const toRadians = (deg) => deg * (Math.PI / 180);

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#204766', '#631D63']} style={styles.header}>
        <TouchableOpacity onPress={handleBackPress}>
          <Image source={require('../../assets/icc_back.png')} style={styles.icBack} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkin</Text>
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

        {latitude && longitude && (
          <LinearGradient colors={['#ffffff', '#dfe9f3']} style={styles.card}>
            <Text style={styles.cardText}>Latitude: {latitude}</Text>
            <Text style={styles.cardText}>Longitude: {longitude}</Text>
            <Text style={styles.cardText}>Jarak: {distance.toFixed(2)} meter</Text>
            <Text style={styles.cardText}>Tanggal: {date}</Text> {/* Display date */}
            <Text style={styles.cardText}>Waktu: {time}</Text> {/* Display time */}
          </LinearGradient>
        )}

        <LinearGradient colors={['#204766', '#631D63']} style={styles.gradientButton}>
          <TouchableOpacity style={styles.button} onPress={handleTambahCheckin} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Checkin</Text>
            )}
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  header: {
    width: '100%',
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 25,
  },
  icBack: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  content: { paddingHorizontal: 20, paddingBottom: 20 },
  fotoContainer: { alignItems: 'center', marginTop: 15, marginBottom: 20 },
  fotoButton: { height: 150, width: 150, borderRadius: 75, borderWidth: 2, borderColor: '#204766', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9f9f9' },
  fotoPreview: { height: '100%', width: '100%', borderRadius: 75 },
  fotoPlaceholder: { textAlign: 'center' },
  card: { padding: 10, marginVertical: 5, borderRadius: 8 },
  cardText: { fontSize: 14 },
  gradientButton: { marginTop: 15, borderRadius: 5 },
  button: { alignItems: 'center', justifyContent: 'center', paddingVertical: 15 },
  buttonText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
});

export default CheckinBelow;

