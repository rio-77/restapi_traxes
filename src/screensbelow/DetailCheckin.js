import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet, ScrollView, TouchableOpacity, Image, BackHandler } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { launchCamera } from 'react-native-image-picker';
import { openDatabase } from 'react-native-sqlite-storage';
import { calculateDistance } from '../../src/utils/utils';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import { getusersprofile } from '../../helper/login';
import { saveCheckinToLocalDB, initCheckinTable } from '../../helper/sqliteservice';

const db = openDatabase({ name: 'lokasi_toko.db', location: 'default' });

const DetailCheckinBelow = ({ route }) => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [tokoLatitude, setTokoLatitude] = useState(null);
  const [tokoLongitude, setTokoLongitude] = useState(null);
  const [tokoAddress, setTokoAddress] = useState(null);
  const [jarak, setJarak] = useState(null);
  const [projectRadius, setProjectRadius] = useState(null);
  const [isCheckinAllowed, setIsCheckinAllowed] = useState(null);
  const [employeeData, setEmployeeData] = useState(null);
  const [photo, setPhoto] = useState(null);

  const navigation = useNavigation();
  const { customer_id, project_id } = route.params || {};

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const userProfile = await getusersprofile();
        if (userProfile) {
          setEmployeeData(userProfile);
        } else {
          Alert.alert('Error', 'Employee data not found');
        }
      } catch (error) {
        console.error('Error fetching employee data:', error);
        Alert.alert('Error', 'Failed to retrieve employee data');
      }
    };

    fetchEmployeeData();

    Geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      (error) => Alert.alert('Error', 'Failed to get location'),
      { enableHighAccuracy: true }
    );

    if (customer_id) {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT latitude, longitude, address FROM lokasi_toko WHERE customer_id = ?',
          [customer_id],
          (tx, results) => {
            if (results.rows.length > 0) {
              const toko = results.rows.item(0);
              setTokoLatitude(toko.latitude);
              setTokoLongitude(toko.longitude);
              setTokoAddress(toko.address);
            } else {
              Alert.alert('Error', 'Store data not found');
            }
          }
        );
      });
    }


     // Tangani tombol back bawaan HP
      const backAction = () => {
        navigation.navigate('tambahlokasitoko2'); // Navigasi ke Home
        return true; // Cegah aplikasi tertutup
      };
    
      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    
      return () => backHandler.remove(); // Hapus event listener saat komponen unmount



  }, [customer_id]);

  useEffect(() => {
    const getProjectRadius = async () => {
      try {
        const response = await axios.post('https://api.traxes.id/index.php/download/projectradius', { project_id });
        setProjectRadius(parseInt(response.data.data[0].project_radius));
      } catch (error) {
        console.error('Error fetching radius:', error);
        Alert.alert('Error', 'Failed to get project radius');
      }
    };

    if (project_id) {
      getProjectRadius();
    }
  }, [project_id]);

  useEffect(() => {
    if (latitude && longitude && tokoLatitude && tokoLongitude && projectRadius !== null) {
      const distance = calculateDistance(latitude, longitude, tokoLatitude, tokoLongitude);
      setJarak(distance);
      setIsCheckinAllowed(distance <= projectRadius);
    }
  }, [latitude, longitude, tokoLatitude, tokoLongitude, projectRadius]);

  const handleCapturePhoto = () => {
    launchCamera({ mediaType: 'photo', quality: 0.5, includeBase64: true }, (response) => {
      if (!response.didCancel && response.assets.length > 0) {
        setPhoto(response.assets[0].base64);
      }
    });
  };

  useEffect(() => {
    initCheckinTable(); // Pastikan tabel check-in dibuat saat komponen dimuat
  }, []);
  

  const handleCheckin = async () => {
    if (!employeeData || !photo) {
      Alert.alert('Peringatan nih !', 'Masukan foto teman-teman yaa..');
      return;
    }
  
    try {
      const distance = calculateDistance(latitude, longitude, tokoLatitude, tokoLongitude);
  
      const requestData = {
        employee_id: employeeData.employee_id,
        customer_id,
        jabatan_id: employeeData.jabatan_id,
        date_cio: new Date().toISOString().split('T')[0],
        status_emp: employeeData.status_emp,
        datetimephone_in: new Date().toISOString(),
        project_id,
        latitude_in: latitude,
        longitude_in: longitude,
        radius_in: distance,
        distance_in: distance,
        foto_in: photo,
        keterangan: employeeData.keterangan,
        apk: employeeData.apk,
        update_toko: employeeData.update_toko,
      };
  
      // Kirim check-in ke API
      const response = await axios.post('https://api.traxes.id/index.php/v2/customer/pushCheckIn', requestData);
  
      if (response.data.status === 1) {
        // Simpan check-in ke database lokal SQLite
        saveCheckinToLocalDB(requestData);
      
        Alert.alert('Success', 'Check-in berhasil disimpan');
        navigation.navigate('DashboardToko', { customer_id, project_id }); // Pindah ke DetailToko
      } else {
        Alert.alert('Error', 'Check-in gagal');
      }
    } catch (error) {
      console.error('Error performing check-in:', error);
      Alert.alert('Error', 'Gagal melakukan check-in');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
       <LinearGradient colors={['#204766', '#631D63']} style={styles.header}>
              <TouchableOpacity onPress={() => navigation.navigate('CustomerListNewBelow')}>
                <Image source={require('../../assets/icc_back.png')} style={styles.icBack} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Checkin</Text>
            </LinearGradient>
      <View style={styles.card}>
        <Text style={styles.title}>Detail Check-In</Text>
        <Text style={styles.info}>Alamat Toko: {tokoAddress}</Text>
        {jarak !== null && <Text style={styles.info}>Jarak: {jarak.toFixed(2)} meter</Text>}
      </View>

      <View style={styles.photoFrame}>
      {photo && <Image source={{ uri: `data:image/jpeg;base64,${photo}` }} style={styles.preview} />}
      </View>

      <LinearGradient colors={['#204766', '#631D63']} style={styles.buttonGradientAmbilFoto}>
      <TouchableOpacity style={styles.button} onPress={handleCapturePhoto}>
        <Text style={styles.buttonText}>Ambil Foto</Text>
      </TouchableOpacity>
      </LinearGradient>
      

      {isCheckinAllowed && (
        <LinearGradient colors={['#204766', '#631D63']} style={styles.buttonGradient}>
        <TouchableOpacity style={styles.button} onPress={handleCheckin}>
          <Text style={styles.buttonText}>Check In</Text>
        </TouchableOpacity>
        </LinearGradient>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  buttonGradientAmbilFoto: { borderRadius: 5, marginBottom: 7, marginTop: 15, marginLeft: 10, marginRight: 10},
  buttonGradient: { borderRadius: 5, marginBottom: 7, marginLeft: 10, marginRight: 10 },
  button: { padding: 15, alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  photoFrame: { 
    marginTop: 20, 
    alignSelf: 'center', 
    borderWidth: 5, 
    borderColor: '#ddd', 
    borderRadius: 15, 
    overflow: 'hidden', 
    shadowColor: '#000', 
    shadowOpacity: 0.2, 
    shadowRadius: 8, 
    elevation: 5 
  },
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  header: { height: 100, padding: 20, flexDirection: 'row', alignItems: 'center' },
  icBack: { width: 24, height: 24, marginTop: 10 },
  headerTitle: { fontSize: 20, color: 'white', marginLeft: 10, marginTop: 10 },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 10 },
  title: { fontSize: 18, fontWeight: 'bold' },
  info: { fontSize: 16 },
  preview: { width: 225, height:225, borderRadius: 0 },
  buttonText: { color: 'white', textAlign: 'center', fontSize: 16, style:'bold'}
});

export default DetailCheckinBelow;
