import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import Geolocation from '@react-native-community/geolocation';
import { insertLokasi, createTable, getAllTokoData, getLastCustomerId } from '../../helper/sqliteservice';
import { insertProjectToSQLite, getProjectIdFromSQLite } from '../../helper/sqliteservice';
import { getusersprofile } from '../../helper/login';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const TambahLokasiTestBelow = () => {
  const navigation = useNavigation();
  const [form, setForm] = useState({
    customer_name: '',
    owner_name: '',
    no_contact: '',
    address: '',
    village_id: '',
    district_id: '',
    city_id: '',
  });
  const [fotoToko, setFotoToko] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [loading, setLoading] = useState(false);
  const [alamatLengkap, setAlamatLengkap] = useState('');

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        await createTable();
      } catch (error) {
        console.error('Error creating table:', error);
      }
    };

    initializeDatabase();

    const fetchUserProfile = async () => {
      try {
        const profile = await getusersprofile();
        setUserProfile(profile);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    fetchUserProfile();

    const fetchAndStoreProjectId = async () => {
      try {
        const profile = await getusersprofile();
        const { project_id } = profile;
        console.log('Project ID dari login:', project_id);

        // Simpan project_id ke SQLite
        await insertProjectToSQLite(project_id);
        console.log('Project ID disimpan ke SQLite');

        // Ambil project_id dari SQLite untuk verifikasi
        const savedProjectId = await getProjectIdFromSQLite();
        console.log('Project ID dari SQLite:', savedProjectId);
      } catch (error) {
        console.error('Error fetching or saving project ID:', error);
      }
    };

    fetchAndStoreProjectId();

    getCurrentLocation();
  }, []);

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

  const handleTambahLokasi = async () => {
    if (!form.customer_name || !form.owner_name || !form.no_contact || !fotoToko) {
      Alert.alert('Peringatan Nih !', 'Harap isi semua kolom yang wajib dan ambil foto!');
      return;
    }
  
    if (!userProfile) {
      Alert.alert('Error', 'Profil pengguna tidak ditemukan!');
      return;
    }
  
    const { employee_id: createdby, project_id: project_id } = userProfile;
    const requestBody = {
      project_id,
      customer_name: form.customer_name,
      owner_name: form.owner_name,
      no_contact: form.no_contact,
      address: form.address,
      village_id: form.village_id,
      district_id: form.district_id,
      city_id: form.city_id,
      latitude,
      longitude,
      photo: fotoToko,
      createdby,
      address: alamatLengkap,
    };
  
    try {
      setLoading(true);
      console.log('Mengirim Permintaan:', requestBody);
      const response = await axios.post(
        'https://api.traxes.id/index.php/transaksi/tambahtoko',
        requestBody,
        {
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.data.status === 1) {
        const customerId = response.data.data; // Ambil customer_id dari respons API
        Alert.alert(
          'Berhasil',
          response.data.message +
            '\nLokasi Toko berhasil ditambahkan..' +
            '\nCustomer ID: ' +
            customerId
        );
  
        // Simpan ke SQLite
        insertLokasi({
          customer_id: customerId,
          customer_name: form.customer_name,
          owner_name: form.owner_name,
          no_contact: form.no_contact,
          address: form.address,
          village_id: form.village_id,
          district_id: form.district_id,
          city_id: form.city_id,
          photo: fotoToko,
          address: alamatLengkap,
          latitude,
          longitude,
        });
  
        console.log('Latitude:', latitude);
        console.log('Longitude:', longitude);
        getAllTokoData(); // Cek hasil setelah insert
  
        // Bersihkan form input
        setForm({
          customer_name: '',
          owner_name: '',
          no_contact: '',
          address: '',
          village_id: '',
          district_id: '',
          city_id: '',
        });
        setFotoToko('');
        setLatitude('');
        setLongitude('');
        setAlamatLengkap('');
  
        // Navigasi ke DetailCheckinBelow dengan customer_id dan project_id
        navigation.navigate('DetailCheckinBelow', {
          customer_id: customerId,
          project_id: userProfile.project_id,
        });
  
      } else {
        Alert.alert(
          'Gagal',
          response.data.message || 'Gagal menambahkan lokasi.'
        );
      }
    } catch (error) {
      console.error(
        'Error saat mengirim data ke server:',
        error.response ? error.response.data : error.message
      );
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
        getReverseGeocoding(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.error('Error mendapatkan lokasi:', error);
        Alert.alert('Error', 'Gagal mendapatkan lokasi Anda. Mohon aktifkan GPS.');
      },
      { enableHighAccuracy: true, timeout: 300000, maximumAge: 300000 }
    );
  };

  const getReverseGeocoding = async (lat, lon) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );
      const address = response.data.display_name;
      setAlamatLengkap(address || 'Alamat tidak ditemukan');
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      Alert.alert('Error', 'Gagal mendapatkan alamat lengkap.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#204766', '#631D63']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('CustomerListNewBelow')}>
          <Image source={require('../../assets/icc_back.png')} style={styles.icBack} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tambah Lokasi Toko</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
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

        {latitude && longitude && (
          <View style={styles.card}>
            <Text style={styles.cardText}>Latitude: {latitude}</Text>
            <Text style={styles.cardText}>Longitude: {longitude}</Text>
            <Text style={styles.cardTextAddres}>Alamat: {alamatLengkap}</Text>
          </View>
        )}

        <TouchableOpacity style={styles.gradientButton} onPress={handleTambahLokasi} disabled={loading}>
          <LinearGradient
            colors={['#204766', '#631D63']}
            style={styles.gradientButtonContent}
          >
            <Text style={styles.gradientButtonText}>
              {loading ? <ActivityIndicator color="#fff" /> : 'Tambah Lokasi'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  header: { height: 100, padding: 20, flexDirection: 'row', alignItems: 'center' },
  icBack: { width: 24, height: 24, marginTop: 10 },
  headerTitle: { fontSize: 20, color: 'white', marginLeft: 10, marginTop: 10 },
  content: { padding: 20 },
  fotoContainer: { alignItems: 'center', marginBottom: 20 },
  fotoButton: { height: 150, width: 150, borderRadius: 75, borderWidth: 2, borderColor: '#204766', justifyContent: 'center', alignItems: 'center' },
  fotoPreview: { height: '100%', width: '100%', borderRadius: 75 },
  fotoPlaceholder: { textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ddd', marginBottom: 15, padding: 10, borderRadius: 5 },
  card: { borderWidth: 1, borderColor: '#ddd', padding: 15, borderRadius: 10, marginBottom: 15, backgroundColor: '#fff' },
  cardText: { fontSize: 14, color: '#204766' },
  cardTextAddres: { fontSize: 14, color: '#204766', marginTop: 5 },
  gradientButton: { borderRadius: 5, overflow: 'hidden', marginTop: 10 },
  gradientButtonContent: { padding: 15, alignItems: 'center' },
  gradientButtonText: { color: '#fff', fontWeight: 'bold' },
});

export default TambahLokasiTestBelow;
