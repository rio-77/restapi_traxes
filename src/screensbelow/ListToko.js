/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import {View, StyleSheet, Dimensions, Image, Text, TextInput, Alert, ActivityIndicator, FlatList, TouchableOpacity, Animated, Modal, Button } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
// import { launchImageLibrary } from 'react-native-image-picker';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker'; // Import launchCamera
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome for camera icon
import SQLite from 'react-native-sqlite-storage';
import { Card } from 'react-native-paper';  // Komponen Card dari react-native-paper untuk CardView
import MapView, { Marker } from 'react-native-maps';  // Untuk peta dengan Marker

const { height } = Dimensions.get('window');

const ListTokoBelow = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false); // State to control modal visibility
  const [slideAnim] = useState(new Animated.Value(0)); // Animated value for modal slide effect
  const [photo, setPhoto] = useState(null); // State to store the selected photo

  const fetchRiwayatAbsensi = async () => {
    setLoading(true);

    const requestData = {
      empid: '21530826',
      area: 'null',
      area2: 'null',
      area3: 'null',
      latitude: 'null',
      longitude: 'null',
    };

    try {
      const response = await fetch('https://api.traxes.id/index.php/user/customerbyid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const json = await response.json();
      if (json.status === 1) {
        setData(json.data);
        setFilteredData(json.data);
      } else {
        Alert.alert('Gagal', json.message || 'Data tidak ditemukan');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Gagal mengambil data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiwayatAbsensi();
  }, []);

  const handleSearch = (text) => {
    setSearchQuery(text);

    const filtered = data.filter((item) =>
      item.customer_name.toLowerCase().includes(text.toLowerCase()) ||
      item.address.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const renderItem = ({ item }) => (
    // <View style={styles.card}>
    //   <Text style={styles.title}>{item.customer_id}</Text>
    //   <Text style={styles.title}>{item.customer_name}</Text>
    //   <Text style={styles.text}>{item.address}</Text>
    // </View>

      <TouchableOpacity
        onPress={() => navigation.navigate('CheckinBelow', { customerId: item.customer_id })}
        style={styles.card}
      >
        <Text style={styles.title}>{item.customer_id}</Text>
        <Text style={styles.title}>{item.customer_name}</Text>
        <Text style={styles.text}>{item.address}</Text>
    </TouchableOpacity>
    );


  const openModal = () => {
    setModalVisible(true);
    Animated.spring(slideAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };


  // Function to open camera and capture a photo
  const takePhoto = () => {
    launchCamera(
      {
        mediaType: 'photo',
        quality: 1,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User canceled camera');
        } else if (response.errorCode) {
          console.log('Camera Error: ', response.errorMessage);
        } else {
          setPhoto(response.assets[0].uri); // Set the captured image URI
        }
      }
    );
  };


//  location 
// Membuka koneksi ke database SQLite
const db = SQLite.openDatabase(
  { name: 'locations.db', location: 'default' },
  () => { console.log('Database opened'); },
  (err) => { console.log('Error opening database: ', err); }
);

// State untuk form input
const [customerName, setCustomerName] = useState('');
const [ownerName, setOwnerName] = useState('');
const [contactNumber, setContactNumber] = useState('');
const [isModalVisible, setIsModalVisible] = useState(false);


  // Fungsi untuk menangani pengiriman data ke API
  const submitLocation = async () => {
    const requestData = {
      customer_id: '1709705347192', // Static ID, bisa diganti jika perlu
      customer_name: customerName,
      owner_name: ownerName,
      no_contact: contactNumber,
      address: 'Jl. Andara Raya No.20, Kecamatan Cinere, Pangkalan Jati Baru', // Static address, bisa diganti
      village_id: '12', // Static ID, bisa diganti
      district_id: '3205260', // Static ID, bisa diganti
      city_id: '3205', // Static ID, bisa diganti
      latitude: '-6.448810520095429', // Static latitude, bisa diganti
      longitude: '106.94111058465963', // Static longitude, bisa diganti
      photo: '', // Static photo, bisa diganti jika diperlukan
      createdby: '10522001', // Static creator ID
    };

    try {
      const response = await fetch('https://api.traxes.id/index.php/transaksi/pushNoo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const responseData = await response.json();

      if (responseData.status === 1) {
        console.log('Success:', responseData.message);

        // Menyimpan data ke database SQLite setelah sukses
        saveToDatabase(requestData);

        setIsModalVisible(false); // Menutup modal setelah sukses
      } else {
        console.error('Error:', responseData.message);
      }
    } catch (error) {
      console.error('Request failed:', error);
    }
  };

  // Fungsi untuk menyimpan data ke SQLite
  const saveToDatabase = (locationData) => {
    db.transaction(txn => {
      txn.executeSql(
        'CREATE TABLE IF NOT EXISTS locations (id INTEGER PRIMARY KEY AUTOINCREMENT, customer_id TEXT, customer_name TEXT, owner_name TEXT, no_contact TEXT, address TEXT, village_id TEXT, district_id TEXT, city_id TEXT, latitude TEXT, longitude TEXT, photo TEXT, createdby TEXT)',
        [],
        () => {
          console.log('Table created successfully');
        },
        (error) => {
          console.error('Error creating table:', error);
        }
      );

      txn.executeSql(
        'INSERT INTO locations (customer_id, customer_name, owner_name, no_contact, address, village_id, district_id, city_id, latitude, longitude, photo, createdby) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          locationData.customer_id,
          locationData.customer_name,
          locationData.owner_name,
          locationData.no_contact,
          locationData.address,
          locationData.village_id,
          locationData.district_id,
          locationData.city_id,
          locationData.latitude,
          locationData.longitude,
          locationData.photo,
          locationData.createdby,
        ],
        () => {
          console.log('Location data saved to database');
        },
        (error) => {
          console.error('Error inserting data:', error);
        }
      );
    });
  };


  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#204766', '#631D63']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Image source={require('../../assets/icc_back.png')} style={styles.icBack} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>List Toko</Text>
      </LinearGradient>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Image source={require('../../assets/ic_search.png')} style={styles.icSearch} />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari berdasarkan nama atau alamat.."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#007BFF" />
        ) : (
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.customer_id}
            renderItem={renderItem}
            ListEmptyComponent={() => (
              <Text style={styles.noDataText}>Tidak ada data ditemukan</Text>
            )}
          />
        )}
      </View>
        <View style={styles.viewBtn}>
            <TouchableOpacity style={{ width: '100%' }} onPress={() => navigation.navigate('TambahLokasiBelow')}>
                <LinearGradient
                    colors={['#204766', '#631D63']}
                    style={styles.btn}>
                    <Text style={styles.txtBtn}>Tambah Lokasi</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>

          {/* Modal for "Tambah Lokasi" */}
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackground}>
          <Animated.View
            style={[
              styles.modalContent,
              {
                transform: [
                  {
                    translateY: slideAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [height, 0], // Moves from bottom to top
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Tambah Lokasi</Text>
              <TouchableOpacity onPress={closeModal}>
                <Text style={styles.modalClose}>X</Text>
              </TouchableOpacity>
            </View>

             {/* Photo Picker */}
             <View style={styles.photoPicker}>
              {/* Button to pick image from gallery */}
              {/* <TouchableOpacity onPress={pickImage} style={styles.pickImageBtn}>
                <Text style={styles.pickImageText}>Pilih Foto</Text>
              </TouchableOpacity> */}

              {/* Button to capture photo using camera */}
              <TouchableOpacity onPress={takePhoto} style={styles.takePhotoBtn}>
                {/* Display camera icon when the button is clicked */}
                {photo ? (
                  <Image source={{ uri: photo }} style={styles.selectedImage} />
                ) : (
                  <Icon name="camera" size={30} color="#007BFF" />
                )}
              </TouchableOpacity>
            </View>

            {/* Input Nama Toko */}
              <TextInput
                style={styles.inputField}
                placeholder="Masukkan Nama Toko"
                value={customerName}
                onChangeText={setCustomerName}
              />
              {/* Input Nama Toko */}
              <TextInput
                style={styles.inputField}
                placeholder="Masukkan Nama Prmilik"
                value={ownerName}
                onChangeText={setOwnerName}
              />
              {/* Input Nama Toko */}
              <TextInput
                style={styles.inputField}
                placeholder="Nomor Kontak Pemilik"
                value={contactNumber}
                onChangeText={setContactNumber}
              />

                    {/* Tombol untuk submit data */}
                  <Button title="Submit" onPress={submitLocation} />

                  {/* Tombol untuk menutup modal */}
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setIsModalVisible(false)}
                  >
                    {/* <Text style={styles.closeButtonText}>Tutup</Text> */}
                  </TouchableOpacity>


            {/* <Text style={styles.modalText}>Formulir Tambah Lokasi</Text> */}
          </Animated.View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white' },
    header: {
      width: '100%',
      height: 100, // Tinggi header ditingkatkan agar ada ruang vertikal lebih banyak
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 15,
      paddingTop: 25, // Menambahkan padding atas untuk memindahkan konten ke bawah
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
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F2F2F2',
      borderRadius: 5,
      margin: 15,
      paddingHorizontal: 15,
      paddingVertical: 5,
    },
    icSearch: {
      width: 20,
      height: 20,
      marginRight: 10,
    },
    searchInput: {
      flex: 1,
      height: 40,
      backgroundColor: 'white',
      borderRadius: 5,
      paddingHorizontal: 10,
    },
    content: { flex: 1, padding: 10 },
    card: {
      backgroundColor: 'white',
      padding: 15,
      borderRadius: 10,
      marginBottom: 10,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
    },
    title: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    text: { fontSize: 14, color: '#555', marginTop: 5 },
    noDataText: { textAlign: 'center', color: '#888', marginTop: 20 },
    viewBtn: {
        position: 'absolute',
        bottom: 0,
        height: window.height * 0.1,
        width: '100%',
        paddingTop: 15,
        paddingLeft:15,
        paddingRight:15,
        paddingBottom: 15,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
      },
      btn: {
        width: '100%',
        borderRadius: 10,
        padding: 15,
        backgroundColor: '#5dc3e5',
        alignItems: 'center',
        justifyContent: 'center',
      },
      txtBtn: {
        textAlign: 'center',
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
      },

    // Modal Styles
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '100%',
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalClose: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    marginTop: 10,
  },

   // Styles for Photo Picker
  photoPicker: {
    marginVertical: 20,
    alignItems: 'center',
  },
  pickImageBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    marginBottom: 10,
  },
  pickImageText: {
    color: 'white',
    fontSize: 16,
  },
  takePhotoBtn: {
    paddingVertical: 20,
    paddingHorizontal: 40,
    backgroundColor: '#1C4966',
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedImage: {
    width: 100,
    height: 100,
    borderRadius: 15,
  },

  inputField: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  saveButton: {
    backgroundColor: '#5dc3e5',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },

  cardView: {
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'white',
    elevation: 2,
  },
  addressText: {
    fontSize: 16,
    color: '#333',
  },
  map: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },

  });

export default ListTokoBelow;


