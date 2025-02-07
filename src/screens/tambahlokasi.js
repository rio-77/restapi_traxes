/* eslint-disable no-unused-vars */
import React, { useState, useEffect  } from 'react';
import {View,Text,TextInput,TouchableOpacity,Image,Alert,StyleSheet,ScrollView} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import { fetchCustomerAreaData, submitLocationData } from '../apifunction/tambahlokasi_api';

const TambahLokasi = () => {
//     const [empid, setEmpid] = useState('');

//   useEffect(() => {
//     // Fetch empid from MMKV storage
//     const fetchEmpId = async () => {
//       try {
//         // eslint-disable-next-line no-undef
//         const storedEmpId = storage.getString('empid');
//         if (storedEmpId) {
//           setEmpid(storedEmpId);
//         } else {
//           Alert.alert('Error', 'Employee ID not found. Please log in again.');
//         }
//       } catch (error) {
//         Alert.alert('Error', 'Failed to retrieve Employee ID.');
//       }
//     };

//     fetchEmpId();
//   }, []);

//   const handleSubmit = async () => {
//     if (!empid) {
//       Alert.alert('Error', 'Employee ID is missing.');
//       return;
//     }

//     const params = {
//       empid, // Dynamically set empid
//       area: null,
//       area2: null,
//       area3: null,
//       latitude: null,
//       longitude: null,
//     };

//     try {
//       const response = await submitLocationData(params);
//       Alert.alert('Success', response.message);
//     } catch (error) {
//       Alert.alert('Error', error.message || 'Failed to submit data.');
//     }
//   };

  const [photo, setPhoto] = useState(null);
  const [storeName, setStoreName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [type, setType] = useState(null);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownItems, setDropdownItems] = useState([
    { label: 'Warung', value: 'warung' },
    { label: 'Toko', value: 'toko' },
    { label: 'Lainnya', value: 'lainnya' },
  ]);

  const handleCapturePhoto = async () => {
    const result = await launchCamera({ mediaType: 'photo', quality: 0.5 });
    if (!result.didCancel) {
      setPhoto(result.assets[0]);
    }
  };

  const handleSelectPhoto = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.5 });
    if (!result.didCancel) {
      setPhoto(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    if (!storeName || !ownerName || !contactNumber || !address || !city || !district || !type) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    const params = {
      empid: '21309963', // Replace with dynamic employee ID if needed
      area: null,
      area2: null,
      area3: null,
      latitude: null,
      longitude: null,
    };

    try {
      const response = await submitLocationData(params);
      Alert.alert('Success', response.message);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to submit data.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Tambah Lokasi</Text>

      {/* Photo Section */}
      <View style={styles.photoSection}>
        {photo ? (
          <Image source={{ uri: photo.uri }} style={styles.photo} />
        ) : (
          <Text style={styles.photoPlaceholder}>No photo selected</Text>
        )}
        <View style={styles.photoButtons}>
          <TouchableOpacity style={styles.button} onPress={handleCapturePhoto}>
            <Text style={styles.buttonText}>Capture Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleSelectPhoto}>
            <Text style={styles.buttonText}>Select from Gallery</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Store Information */}
      <TextInput
        style={styles.input}
        placeholder="Nama Toko"
        placeholderTextColor="#aaa"
        value={storeName}
        onChangeText={setStoreName}
      />
      <TextInput
        style={styles.input}
        placeholder="Nama Pemilik"
        placeholderTextColor="#aaa"
        value={ownerName}
        onChangeText={setOwnerName}
      />
      <TextInput
        style={styles.input}
        placeholder="Nomor Kontak Pemilik"
        placeholderTextColor="#aaa"
        value={contactNumber}
        keyboardType="phone-pad"
        onChangeText={setContactNumber}
      />

      {/* Address Information */}
      <TextInput
        style={styles.input}
        placeholder="Alamat Toko"
        placeholderTextColor="#aaa"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="Nama Kota"
        placeholderTextColor="#aaa"
        value={city}
        onChangeText={setCity}
      />
      <TextInput
        style={styles.input}
        placeholder="Nama Kecamatan"
        placeholderTextColor="#aaa"
        value={district}
        onChangeText={setDistrict}
      />

      {/* Dropdown */}
      <DropDownPicker
        open={dropdownOpen}
        value={type}
        items={dropdownItems}
        setOpen={setDropdownOpen}
        setValue={setType}
        setItems={setDropdownItems}
        placeholder="Pilih Jenis"
        style={styles.dropdown}
      />

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Tambah Lokasi</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default TambahLokasi;

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#FFF' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  photoSection: { alignItems: 'center', marginBottom: 20 },
  photo: { width: 150, height: 150, borderRadius: 10, marginBottom: 10 },
  photoPlaceholder: { fontSize: 16, color: '#888', marginBottom: 10 },
  photoButtons: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  button: { flex: 1, marginHorizontal: 5, backgroundColor: '#1C4966', padding: 10, borderRadius: 5 },
  buttonText: { color: '#FFF', textAlign: 'center' },
  input: { height: 50, borderColor: '#ccc', borderWidth: 1, borderRadius: 5, paddingHorizontal: 10, marginBottom: 15 },
  dropdown: { marginBottom: 15 },
  submitButton: { backgroundColor: '#1C4966', padding: 15, borderRadius: 5 },
  submitButtonText: { color: '#FFF', fontWeight: 'bold', textAlign: 'center' },
});
