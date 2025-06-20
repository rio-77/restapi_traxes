import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, BackHandler, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import { launchCamera } from 'react-native-image-picker';
import { useFocusEffect } from '@react-navigation/native';
import SQLite from 'react-native-sqlite-storage';
import LinearGradient from 'react-native-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import { getusersprofile } from '../../helper/login'; // Sesuaikan dengan path layanan SQLite
import createTables from '../../helper/sqliteservice'; // Import createTables

const db = SQLite.openDatabase({ name: 'lokasi_toko.db', location: 'default' });

const tambahlokasitoko2 = () => {
    const navigation = useNavigation();
    const [photo, setPhoto] = useState(null);
    const [customerName, setCustomerName] = useState('');
    const [address, setAddress] = useState('');
    const [city_id, setCity] = useState('');
    const [district_id, setDistrict] = useState('');
    const [contact, setContact] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [customerId, setCustomerId] = useState(null);
    const [locationType, setLocationType] = useState('Jenis Lokasi/Toko');
    const [projectId, setProjectId] = useState('');
    const [employeeId, setEmployeeId] = useState('');


    useEffect(() => {
    // Ambil data user dari SQLite
    getusersprofile()
      .then((user) => {
        setEmployeeId(user.employee_id); // Ambil employee_id
        setProjectId(user.project_id);   // Ambil project_id
      })
      .catch((error) => {
        console.error('Gagal mengambil data user:', error);
      });
  }, []);

//   useEffect(() => {
//     db.transaction(tx => {
//         tx.executeSql(
//             `CREATE TABLE IF NOT EXISTS lokasi_toko (
//                 id INTEGER PRIMARY KEY AUTOINCREMENT,
//                 customer_id TEXT,
//                 customer_name TEXT,
//                 owner_name TEXT,
//                 no_contact TEXT,
//                 address TEXT,
//                 latitude REAL,
//                 longitude REAL,
//                 photo TEXT,
//                 city_id TEXT,
//                 district_id TEXT,
//                 project_id TEXT
//             );`,
//             [],
//             () => console.log("Tabel lokasi_toko berhasil dibuat"),
//             error => console.error("Error membuat tabel lokasi_toko:", error)
//         );
//     });
// }, []);

useEffect(() => {
  createTables(); // Buat tabel saat komponen dipasang
}, []);


  
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('CustomerListNewBelow');
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);  
      };
    }, [navigation])
  );

  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setLatitude(latitude);
        setLongitude(longitude);
        fetchAddressFromCoords(latitude, longitude);
      },
      error => Alert.alert('Error', error.message),
      { enableHighAccuracy: true, timeout: 150000, maximumAge: 100000 }
    );
  }, []);

  const fetchAddressFromCoords = async (lat, lon) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
      const data = await response.json();
      console.log('Data dari Reverse Geocoding:', data); // Debugging

      if (data) {
        setAddress(data.display_name || '');
        setCity(
          data.address.city || 
          data.address.town || 
          data.address.municipality || 
          data.address.state_district || 
          ''
        );
        // setCity(data.address.city || data.address.town || '');
        setDistrict(data.address.suburb || data.address.village || '');
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  const takePhoto = () => {
    launchCamera({ mediaType: 'photo', quality: 0.5, includeBase64: true }, (response) => {
      if (response.didCancel) {
        return;
      }
      if (response.assets && response.assets.length > 0) {
        setPhoto(response.assets[0].base64);
      }
    });
  };

//   const saveLocation = async () => {
//     const requestData = {
//         customer_id: '',
//         project_id: projectId,  // Pastikan project_id sudah diambil
//         customer_name: customerName,
//         owner_name: ownerName,
//         no_contact: contact,
//         address: address,
//         village_id: '',
//         district_id: district_id,
//         city_id: city_id,
//         latitude: latitude,
//         longitude: longitude,
//         photo: photo,
//         createdby: employeeId,  // Pastikan employeeId sudah diambil
//     };

//     try {
//         const response = await fetch('https://api.traxes.id/index.php/transaksi/tambahtoko', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(requestData),
//         });
//         const jsonResponse = await response.json();

//         if (jsonResponse.status === 1) {
//             const newCustomerId = jsonResponse.data; // Ambil customer_id dari API
        
//             db.transaction(tx => {
//                 tx.executeSql(
//                     `INSERT INTO lokasi_toko 
//                     (customer_id, customer_name, owner_name, no_contact, address, latitude, longitude, photo, city_id, district_id, project_id) 
//                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//                     [newCustomerId, customerName, ownerName, contact, address, latitude, longitude, photo, city_id, district_id, projectId],
//                     () => {
//                         Alert.alert('Sukses', 'Lokasi berhasil disimpan!', [
//                             { 
//                                 text: 'OK', 
//                                 onPress: () => navigation.navigate('checkinfix', { 
//                                     customer_id: newCustomerId, // Kirim customer_id ke screen check-in
//                                     project_id: projectId,
//                                     customer_name: customerName,
                                    
//                                 }) 
//                             }
//                         ]);
//                     },
//                     error => console.error('SQLite Error:', error)
//                 );
//             });
//         } else {
//             Alert.alert('Gagal', jsonResponse.message);
//         }
//     } catch (error) {
//         console.error('API Error:', error);
//         Alert.alert('Error', 'Gagal menghubungi server.');
//     }
// };


 // Fungsi untuk menampilkan dialog konfirmasi sebelum menyimpan lokasi
 const confirmSaveLocation = () => {
  Alert.alert(
      'Konfirmasi',
      'Apakah Anda ingin menambahkan toko?',
      [
          { text: 'Batal', style: 'cancel' },
          { text: 'Ya', onPress: () => saveLocation() },
      ]
  );
};


const saveLocation = async () => {
  // Validasi input sebelum menyimpan
  if (!photo) {
    Alert.alert('Info', 'Foto lokasi/toko masih kosong.');
    return;
}
if (!customerName.trim()) {
    Alert.alert('Info', 'Nama lokasi/toko belum diisi.');
    return;
}


  const requestData = {
      customer_id: '',
      project_id: projectId, 
      customer_name: customerName,
       owner_name: ownerName || '',  // Tidak wajib, default ke string kosong
      no_contact: contact || '',  // Tidak wajib, default ke string kosong
      address: address,
      village_id: '',
      district_id: district_id,
      city_id: city_id,
      latitude: latitude,
      longitude: longitude,
      photo: photo,
      createdby: employeeId, 
  };

  try {
      const response = await fetch('https://api.traxes.id/index.php/transaksi/tambahtoko', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData),
      });
      const jsonResponse = await response.json();
      console.log('Response JSON:', jsonResponse); // Tambahkan ini

      if (jsonResponse.status === 1) {
        console.log('Customer ID dari API:', jsonResponse.data); // Tambahkan ini
          const newCustomerId = jsonResponse.data.customer_id;  

          db.transaction(tx => {
              tx.executeSql(
                  `INSERT INTO lokasi_toko 
                  (customer_id, customer_name, owner_name, no_contact, address, latitude, longitude, photo, city_id, district_id, project_id) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                  [newCustomerId, customerName, ownerName, contact, address, latitude, longitude, photo, city_id, district_id, projectId],
                  () => {
                      Alert.alert('Sukses', 'Lokasi berhasil disimpan!', [
                          { 
                              text: 'OK', 
                              onPress: () => navigation.navigate('checkinfix', { 
                                  customer_id: newCustomerId,
                                  project_id: projectId,
                                  customer_name: customerName,
                              }) 
                          }
                      ]);
                  },
                  error => console.error('SQLite Error:', error)
              );
          });
      } else {
          Alert.alert('Info', jsonResponse.message);
      }
  } catch (error) {
      console.error('API Error:', error);
      Alert.alert('Error', 'Gagal menghubungi server.');
  }
};


  return (
    <View style={styles.container}>
      <LinearGradient colors={['#204766', '#631D63']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('CustomerListNewBelow')}>
          <Image source={require('../../assets/icc_back.png')} style={styles.icBack} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tambah Lokasi/Toko</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={takePhoto} style={styles.card}>
          {photo ? (
            <Image source={{ uri: `data:image/jpeg;base64,${photo}` }} style={styles.photo} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Image source={require('../../assetss/iccamera.png')} style={styles.cameraIcon} />
              <Text style={styles.cardText}>Ambil Foto Lokasi/Toko</Text>
            </View>
          )}
        </TouchableOpacity>

          <View style={styles.textlandscape}>
        {/* Keterangan tambahan */}
          <Text style={{ color: 'navy', fontSize: 12, textAlign: 'center', marginTop: 0 }}>
              Pastikan posisi foto miring/landscape
          </Text>
        </View>

        <TextInput placeholder="Nama Lokasi/Toko" placeholderTextColor="#ccc" value={customerName} onChangeText={setCustomerName} style={styles.input} />
        <TextInput
            placeholder="Alamat Lengkap"
            placeholderTextColor="#ccc"
            value={address}
            style={styles.inputLarge}
            editable={false}
            multiline={true}
            numberOfLines={3}
    />
        <TextInput placeholder="Nama Kota/Kabupaten" placeholderTextColor="#ccc" value={city_id} style={styles.input} editable={false} />
        <TextInput placeholder="Nama Kecamatan" placeholderTextColor="#ccc" value={district_id} style={styles.input} editable={false} />
        <TextInput placeholder="Nomor Kontak/HP" placeholderTextColor="#ccc" keyboardType="phone-pad" value={contact} onChangeText={setContact} style={styles.input} />
        <TextInput placeholder="Nama Pemilik Lokasi/Toko" placeholderTextColor="#ccc" value={ownerName} onChangeText={setOwnerName} style={styles.input} />
        <View style={styles.pickerContainer}>
          <Picker selectedValue={locationType} onValueChange={(itemValue) => setLocationType(itemValue)} style={styles.picker}>
            <Picker.Item label="Jenis Lokasi/Toko" value="Jenis Lokasi/Toko" />
            <Picker.Item label="Office" value="Office" />
            <Picker.Item label="Hypermarket" value="Hypermarket" />
            <Picker.Item label="Supermarket" value="Supermarket" />
            <Picker.Item label="Minimarket" value="Minimarket" />
            <Picker.Item label="Grosir" value="Grosir" />
            <Picker.Item label="Gudang" value="Gudang" />
            <Picker.Item label="Pasar" value="Pasar" />
            <Picker.Item label="Rumah" value="Rumah" />
            <Picker.Item label="Warung" value="Warung" />
            <Picker.Item label="Warehouse" value="Warehouse" />
          </Picker>
        </View>
  
        <TouchableOpacity onPress={confirmSaveLocation} style={{ borderRadius: 10, overflow: 'hidden' }}>
            <LinearGradient colors={['#204766', '#631D63']} style={styles.button}>
                <Text style={{ color: '#fff', fontSize: 16, textAlign: 'center' }}>Tambah Lokasi</Text>
            </LinearGradient>
        </TouchableOpacity>

        
      </ScrollView>
    </View>
  );
};

const styles = {
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  scrollContainer: { padding: 20, paddingBottom: 50 },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 10,
    paddingHorizontal: 15,
    color: '#000',
    marginBottom: 10,
    backgroundColor: '#fff',
    marginTop: 10,
  },
  inputLarge: { // Ukuran lebih besar untuk alamat lengkap
    height: 90, 
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: '#000',
    marginBottom: 10,
    backgroundColor: '#fff',
    textAlignVertical: 'top', // Agar teks dimulai dari atas
  },
  button: {
    backgroundColor: '#1E90FF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  header: { height: '24px', padding: 20, flexDirection: 'row', alignItems: 'center' },
  icBack: { width: '20', height: '20', marginTop: 20 },
  headerTitle: { fontSize: 20, color: 'white', marginLeft: 10, marginTop: 20 },
  card: {
    backgroundColor: '#eee',
    borderRadius: 10,
    marginBottom: 20,
    height: 150,
    width: '100%',
    overflow: 'hidden',
  },
  cardText: { color: '#555', fontSize: 16, marginTop: 10 },
  photo: { width: '100%', height: '100%', resizeMode: 'cover' },
  photoPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  cameraIcon: { width: 45, height: 35 },
  pickerContainer: { borderWidth: 1, borderColor: '#555', borderRadius: 10, backgroundColor: '#fff', marginBottom: 10 },
  picker: { height: 50, color: '#000' },
};

export default tambahlokasitoko2;