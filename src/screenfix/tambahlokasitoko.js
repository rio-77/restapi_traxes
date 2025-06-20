import React, { useState, useEffect  } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, BackHandler  } from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import Geolocation from '@react-native-community/geolocation';
import { insertLokasi, createTable, getAllTokoData, getLastCustomerId } from '../../helper/sqliteservice';
import { insertProjectToSQLite, getProjectIdFromSQLite } from '../../helper/sqliteservice';
import { getusersprofile } from '../../helper/login';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
// import { WebView } from 'react-native-webview';

const tambahlokasitoko = ({}) => {
// const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}&hl=es;z=14&output=embed`;
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


    // Tangani tombol back bawaan HP
  const backAction = () => {
    navigation.navigate('CustomerListNewBelow'); // Navigasi ke Home
    return true; // Cegah aplikasi tertutup
  };

  const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

  return () => backHandler.remove(); // Hapus event listener saat komponen unmount

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
  
      const address = response.data.address;
  
      setAlamatLengkap(response.data.display_name || 'Alamat tidak ditemukan');
      setForm({
        ...form,
        city_id: address.city || address.town || address.village || '',
        district_id: address.county || address.state_district || address.region || '',
        village_id: address.suburb || address.village || '',
      });
  
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

        <View style={styles.cardContainer}>
        <LinearGradient colors={['#631D63', '#204766']} style={styles.card}>
            <Text style={styles.cardText}>Informasi Toko</Text>
        </LinearGradient>
        </View>


        <View style={styles.cardinput}>
  {/* NAMA TOKO */}
  <View style={styles.row}>
    <Text style={styles.label}>Nama Toko</Text>
    <TextInput 
      style={styles.input} 
      placeholder="ketik disini" 
      placeholderTextColor="#888"
      value={form.customer_name}
          onChangeText={(text) => setForm({ ...form, customer_name: text })}
    //   value={namaToko} 
    //   onChangeText={setNamaToko} 
    />
  </View>

  <View style={styles.row}>
  <Text style={styles.label}>Nama Pemilik</Text>
  <TextInput
    style={styles.input}
    placeholder="ketik disini"
    value={form.owner_name}  // Pastikan ini state untuk nama owner
    onChangeText={(text) => setForm({ ...form, owner_name: text })}
  />
</View>


<View style={styles.row}>
  <Text style={styles.label}>No Kontak</Text>
  <TextInput
    style={styles.input}
    placeholder="ketik disini"
    value={form.no_contact}  // Pastikan ini state untuk nama kontak
    onChangeText={(text) => setForm({ ...form, no_contact: text })}
  />
</View>

  {/* ALAMAT (Tidak Bisa Diinput) */}
  <View style={styles.row}>
    <Text style={styles.label}>Alamat</Text>
    <TextInput 
      style={[styles.input, styles.disabledInput]} 
      value={alamatLengkap}
      onChangeText={setAlamatLengkap}
      placeholder="alamat" 
      placeholderTextColor="#888"
    //   value={alamat} 
      editable={false} // Tidak bisa diisi manual
    />
  </View>

  <View style={styles.row}>
    <Text style={styles.label}> </Text>
    <TextInput 
      style={[styles.input, styles.disabledInput]} 
      value={form.city_id}
      placeholder="kota" 
      placeholderTextColor="#888"
    //   value={alamat} 
      editable={false} // Tidak bisa diisi manual
    />
  </View>

  <View style={styles.row}>
    <Text style={styles.label}> </Text>
    <TextInput 
      style={[styles.input, styles.disabledInput]} 
      value={form.district_id}
      placeholder="kecamatan" 
      placeholderTextColor="#888"
    //   value={alamat} 
      editable={false} // Tidak bisa diisi manual
    />
  </View>

  <View style={styles.row}>
    <Text style={styles.label}> </Text>
    <TextInput 
      style={[styles.input, styles.disabledInput]} 
      value={form.village_id}
      placeholder="kelurahan / desa" 
      placeholderTextColor="#888"
    //   value={alamat} 
      editable={false} // Tidak bisa diisi manual
    />
  </View>
</View>

        <View style={styles.fotoContainer}>
          <TouchableOpacity onPress={handleAmbilFoto} style={styles.fotoButton}>
            {fotoToko ? (
              <Image source={{ uri: fotoToko }} style={styles.fotoPreview} />
            ) : (
              <Text style={styles.fotoPlaceholder}>📷 Ambil Foto Toko</Text>
            )}
          </TouchableOpacity>
        </View>


        <TouchableOpacity style={styles.gradientButton} onPress={handleTambahLokasi} disabled={loading}>
          <LinearGradient
            colors={['#007FDA', '#71C4FF']}
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
  fotoContainer: { alignItems: 'center', marginBottom: 0 },
  fotoButton: { height: 95, width: 150, borderRadius: 10, borderWidth: 2, borderColor: '#204766', justifyContent: 'center', alignItems: 'center', marginTop: 15},
  fotoPreview: { height: '100%', width: '100%', borderRadius: 10 },
  fotoPlaceholder: { textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ddd', marginBottom: 15, padding: 10, borderRadius: 5 },
  card: { borderWidth: 1, borderColor: '#ddd', padding: 15, borderRadius: 10, marginBottom: 15, backgroundColor: '#fff' },
  cardText: { fontSize: 14, color: '#204766' },
  cardTextAddres: { fontSize: 14, color: '#204766', marginTop: 5 },
  gradientButton: { borderRadius: 5, overflow: 'hidden', marginTop: 10 },
  gradientButtonContent: { padding: 15, alignItems: 'center' },
  gradientButtonText: { color: '#fff', fontWeight: 'bold' },

  cardContainer: {
    marginTop: 7, // Atur jarak dari elemen sebelumnya
  },
  
  card: {
    width: '50%', // Lebar card
    paddingVertical: 5, // Padding atas bawah
    borderRadius: 15, // Sudut melengkung
    alignItems: 'center', // Pusatkan teks
  },
  cardText: {
    fontSize: 14, 
    fontWeight: 'bold',
    color: 'white', // Warna teks putih
  },


cardinput: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    margin: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5, // Untuk shadow di Android
    marginTop: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15, // Memberi jarak antar input
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    flex: 1, // Supaya label sejajar dengan input
  },
  input: {
    flex: 2, // Supaya input sejajar dengan label
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    marginLeft: 10, // Jarak antara label dan input
  },
  disabledInput: {
    backgroundColor: '#e0e0e0', // Warna abu-abu untuk input non-editable
    color: '#666',
  },

});

export default tambahlokasitoko;
