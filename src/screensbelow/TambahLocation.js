import React, { useState, useEffect } from 'react';
import {View,Text,TextInput,StyleSheet,TouchableOpacity,ActivityIndicator,Alert} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios'; // Untuk melakukan permintaan API

const TambahLocationBelow = ({ navigation }) => {
  const [storeName, setStoreName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    requestLocation();
  }, []);

  const requestLocation = async () => {
    setLoadingLocation(true);
    Geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setLoadingLocation(false);
      },
      (error) => {
        Alert.alert('Error', 'Gagal mendapatkan lokasi perangkat.');
        console.error(error);
        setLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );
  };

  const handleSubmit = async () => {
    if (!storeName || !ownerName || !contact || !address || !latitude || !longitude) {
      Alert.alert('Error', 'Semua kolom wajib diisi.');
      return;
    }

    const payload = {
      customer_id: '', // Optional jika tidak diperlukan, kosongkan
      customer_name: storeName,
      owner_name: ownerName,
      no_contact: contact,
      address: address,
      village_id: '', // Ganti sesuai ID desa
      district_id: '', // Ganti sesuai ID kecamatan
      city_id: '', // Ganti sesuai ID kota
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      photo: '', // Jika ada foto, bisa ditambahkan
      createdby: 'USER_ID', // Ganti sesuai ID pengguna
    };

    setLoadingSubmit(true);

    try {
      const response = await axios.post('https://api.traxes.id/index.php/transaksi/pushNoo', payload);

      if (response.data.status === 1) {
        Alert.alert('Sukses', response.data.message);
        navigation.goBack();
      } else {
        Alert.alert('Gagal', response.data.message || 'Terjadi kesalahan saat menyimpan data.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Gagal terhubung ke server.');
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Gradient Header */}
      <LinearGradient colors={['#631D63', '#204766']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>{'<-'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tambah Toko</Text>
      </LinearGradient>

      {/* Input Fields */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nama Toko"
          value={storeName}
          onChangeText={setStoreName}
        />
        <TextInput
          style={styles.input}
          placeholder="Nama Pemilik"
          value={ownerName}
          onChangeText={setOwnerName}
        />
        <TextInput
          style={styles.input}
          placeholder="Kontak Telepon"
          value={contact}
          onChangeText={setContact}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Alamat Toko"
          value={address}
          onChangeText={setAddress}
        />

        {/* Displaying Latitude and Longitude */}
        {loadingLocation ? (
          <ActivityIndicator size="large" color="#204766" />
        ) : (
          <View style={styles.locationDetails}>
            <Text style={styles.locationText}>
              Latitude: {latitude ? latitude.toFixed(6) : 'Memuat...'}
            </Text>
            <Text style={styles.locationText}>
              Longitude: {longitude ? longitude.toFixed(6) : 'Memuat...'}
            </Text>
          </View>
        )}

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={loadingSubmit}
        >
          <LinearGradient
            colors={['#631D63', '#204766']}
            style={styles.gradientButton}
          >
            {loadingSubmit ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.submitText}>Simpan</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
  },
  backButton: {
    position: 'absolute',
    left: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: {
    fontSize: 20,
    color: 'white',
  },
  headerTitle: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  form: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 50,
    borderColor: '#204766',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  locationDetails: {
    marginVertical: 15,
  },
  locationText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 5,
  },
  submitButton: {
    marginTop: 20,
    borderRadius: 10,
  },
  gradientButton: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  submitText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TambahLocationBelow;
