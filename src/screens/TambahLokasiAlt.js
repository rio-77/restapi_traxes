/* eslint-disable no-shadow */
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Image } from 'react-native';
import axios from 'axios';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const TambahLokasi = () => {
  const [customerName, setCustomerName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [contact, setContact] = useState('');
  const [photo, setPhoto] = useState(null);

  // State untuk data dari API
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  // Fungsi untuk mengambil foto menggunakan kamera
  const takePhoto = () => {
    launchCamera({ mediaType: 'photo', cameraType: 'back' }, (response) => {
      if (response.didCancel) {
        console.log('User canceled photo picker');
      } else if (response.errorCode) {
        console.error('Error: ', response.errorMessage);
      } else {
        setPhoto(response.assets[0].uri);  // Set photo URI from the response
      }
    });
  };

  // Fungsi untuk memilih foto dari galeri
  const chooseFromGallery = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User canceled photo picker');
      } else if (response.errorCode) {
        console.error('Error: ', response.errorMessage);
      } else {
        setPhoto(response.assets[0].uri);  // Set photo URI from the response
      }
    });
  };

  // Fungsi untuk mengirim data ke server
  const submitData = async () => {
    try {
      const response = await axios.post('https://api.traxes.id/index.php/transaksi/pushnoo', {
        customer_id: '1709705347192',
        customer_name: customerName,
        owner_name: ownerName,
        no_contact: contact,
        address: address,  // Alamat otomatis dari server
        village_id: '12',
        district_id: '3205260',
        city_id: '3205',
        latitude: latitude,  // Koordinat otomatis
        longitude: longitude,  // Koordinat otomatis
        photo: photo,  // Foto dalam format URI
        createdby: '10522001',
      });

      if (response.data.status === 1) {
        console.log('Data successfully submitted:', response.data.message);
      } else {
        console.error('Error in submission:', response.data.message);
      }
    } catch (error) {
      console.error('Error during POST request:', error);
    }
  };

  // Mengambil data alamat dan lokasi dari API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('https://api.traxes.id/index.php/transaksi/pushNoo');
        const { address, city, district, latitude, longitude } = response.data;
        setAddress(address);
        setCity(city);
        setDistrict(district);
        setLatitude(latitude);
        setLongitude(longitude);
      } catch (error) {
        console.error('Error fetching location data:', error);
      }
    };

    fetchData();
  }, []);  // Use effect untuk memanggil API saat komponen pertama kali dimuat

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Tambah Lokasi</Text>

      <TextInput
        style={styles.input}
        placeholder="Nama Toko"
        value={customerName}
        onChangeText={setCustomerName}
      />

      <TextInput
        style={styles.input}
        placeholder="Nama Pemilik"
        value={ownerName}
        onChangeText={setOwnerName}
      />

      <TextInput
        style={styles.input}
        placeholder="No. Kontak"
        value={contact}
        onChangeText={setContact}
      />

      <Button title="Ambil Foto" onPress={takePhoto} />
      <Button title="Pilih Foto dari Galeri" onPress={chooseFromGallery} />

      {photo && (
        <Image source={{ uri: photo }} style={styles.image} />
      )}

      {/* Display data automatically fetched from API */}
      <View style={styles.resultContainer}>
        <Text style={styles.resultText}>Alamat: {address || 'Loading...'}</Text>
        <Text style={styles.resultText}>Kecamatan: {district || 'Loading...'}</Text>
        <Text style={styles.resultText}>Kota: {city || 'Loading...'}</Text>
      </View>

      <Button title="Submit" onPress={submitData} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,  // Ensures content is scrollable when screen size is small
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingLeft: 10,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
    alignSelf: 'center',
    borderRadius: 10,  // Add radius to make the image rounded
  },
  resultContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#eaeaea',
    borderRadius: 5,
  },
  resultText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default TambahLokasi;
