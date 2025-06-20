import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, Alert, StyleSheet, ScrollView, TouchableOpacity, Image, BackHandler } from 'react-native';
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

const CheckinFix = ({ route }) => {
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
  const [currentDateTime, setCurrentDateTime] = useState(new Date()); // Tambahkan state untuk waktu check-in
  const [keterangan, setKeterangan] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Menandakan sedang menghitung jarak
  const [isDisabled, setIsDisabled] = useState(true); // Tombol default dalam keadaan disabled

  const navigation = useNavigation();
  const { customer_id, project_id } = route.params || {};
  const [toko, setToko] = useState(null);
        useEffect(() => {
            if (customer_id) {
              db.transaction((tx) => {
                tx.executeSql(
                  'SELECT customer_name, address, photo, customer_id FROM lokasi_toko WHERE customer_id = ?',
                  [customer_id],
                  (tx, results) => {
                    if (results.rows.length > 0) {
                      setToko(results.rows.item(0));
                    } else {
                      Alert.alert('Error', 'Data toko tidak ditemukan');
                    }
                  },
                  (error) => {
                    console.error('Error fetching toko data:', error);
                    Alert.alert('Error', 'Gagal mengambil data toko');
                  }
                );
              });
            }
          }, [customer_id]);

          useEffect(() => {
            const updateClock = () => {
              const now = new Date();
              const time = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\./g, ':');
              const date = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
        
              setCurrentTime(time);
              setCurrentDate(date);
            };
        
            updateClock();
            const interval = setInterval(updateClock, 1000);
        
            return () => clearInterval(interval);
          }, []);
        

//   useEffect(() => {
//     // Update waktu setiap detik
//     const timer = setInterval(() => {
//       setCurrentDateTime(new Date());
//     }, 1000);

//     return () => clearInterval(timer); // Hapus interval saat komponen unmount
//   }, []);

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
        console.log("User Location:", position.coords.latitude, position.coords.longitude);
      },
      (error) => console.log("Error fetching user location:", error),
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
              console.log("Store Location:", toko.latitude, toko.longitude);
            } else {
              Alert.alert('Error', 'Store data not found');
            }
          }
        );
      });
    }
     // Tangani tombol back bawaan HP
      const backAction = () => {
        navigation.navigate('CustomerListNewBelow'); // Navigasi ke Home
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
           setIsLoading(false); // Set loading ke false setelah perhitungan 
           console.log("Calculated Distance:", distance);
    }
  }, [latitude, longitude, tokoLatitude, tokoLongitude, projectRadius]);

  // useEffect(() => {
  //   if (latitude && longitude && tokoLatitude && tokoLongitude && projectRadius !== null) {
  //     const distance = calculateDistance(latitude, longitude, tokoLatitude, tokoLongitude);
  //     setJarak(distance);
  //     setIsCheckinAllowed(distance <= projectRadius);
  //     setIsLoading(false); // Set loading ke false setelah perhitungan selesai
  //   }
  // }, [latitude, longitude, tokoLatitude, tokoLongitude, projectRadius]);


  
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
  
    Alert.alert(
      "Konfirmasi Check-in",
      "Apakah Anda yakin ingin check-in sekarang?",
      [
        {
          text: "Batal",
          style: "cancel"
        },
        {
          text: "Check-in Sekarang",
          onPress: async () => {
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
                keterangan: keterangan,
                apk: employeeData.apk,
                update_toko: employeeData.update_toko,
              };
  
              // Kirim check-in ke API
              const response = await axios.post('https://api.traxes.id/index.php/v2/cio/pushCheckIn', requestData);
  
              if (response.data.status === 1) {
                // Simpan check-in ke database lokal SQLite
                saveCheckinToLocalDB(requestData);
                Alert.alert("Info", "Check-in berhasil disimpan");
  
                // Navigasi ke DashboardToko dengan callback refresh
                navigation.navigate("DetailCheckin", {
                  customer_id,
                  project_id,
                  onCheckinSuccess: () => getLatestCheckin(), // Panggil fungsi refresh di DashboardToko
                });
              } else {
                Alert.alert("Peringatan", "Check-in gagal");
              }
            } catch (error) {
              console.error("Error performing check-in:", error);
              Alert.alert("Peringatan", "Gagal melakukan check-in");
            }
          }
        }
      ]
    );
  };
  

//   const handleCheckin = async () => {
//     if (!employeeData || !photo) {
//       Alert.alert('Peringatan nih !', 'Masukan foto teman-teman yaa..');
//       return;
//     }

    
//     try {
//       const distance = calculateDistance(latitude, longitude, tokoLatitude, tokoLongitude);
  
//       const requestData = {
//         employee_id: employeeData.employee_id,
//         customer_id,
//         jabatan_id: employeeData.jabatan_id,
//         date_cio: new Date().toISOString().split('T')[0],
//         status_emp: employeeData.status_emp,
//         datetimephone_in: new Date().toISOString(),
//         project_id,
//         latitude_in: latitude,
//         longitude_in: longitude,
//         radius_in: distance,
//         distance_in: distance,
//         foto_in: photo,
//         keterangan: keterangan, 
//         apk: employeeData.apk,
//         update_toko: employeeData.update_toko,
//       };
  
//       // Kirim check-in ke API
//       const response = await axios.post('https://api.traxes.id/index.php/v2/customer/pushCheckIn', requestData);
  
//       if (response.data.status === 1) {
//         // Simpan check-in ke database lokal SQLite
//         saveCheckinToLocalDB(requestData);
//         Alert.alert("Info", "Check-in berhasil disimpan");

//       // Navigasi ke DashboardToko dengan callback refresh
//       navigation.navigate("DashboardToko", {
//         customer_id,
//         project_id,
//         onCheckinSuccess: () => getLatestCheckin(), // Panggil fungsi refresh di DashboardToko
//       });
//     } else {
//       Alert.alert("Peringatan", "Check-in gagal");
//     }
//   } catch (error) {
//     console.error("Error performing check-in:", error);
//     Alert.alert("Peringatan", "Gagal melakukan check-in");
//   }
// };


  return (
    <View style={styles.container}>
       <LinearGradient colors={['#204766', '#631D63']} style={styles.header}>
              <TouchableOpacity onPress={() => navigation.navigate('CustomerListNewBelow')}>
                <Image source={require('../../assets/icc_back.png')} style={styles.icBack} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Checkin</Text>
            </LinearGradient>

               <ScrollView contentContainerStyle={styles.scrollContainer}>
            <TouchableOpacity onPress={handleCapturePhoto} style={styles.card}>
                      {photo ? (
                        <Image source={{ uri: `data:image/jpeg;base64,${photo}` }} style={styles.photo} />
                      ) : (
                        <View style={styles.photoPlaceholder}>
                          <Image source={require('../../assetss/iccamera1.png')} style={styles.cameraIcon} />
                          <Text style={styles.cardTextttt}>Klik untuk ambil foto</Text>
                        </View>
                      )}
                    </TouchableOpacity>

                    {/* Tampilkan Waktu Check-in */}
                    {/* <View style={styles.timeContainer}>
                        <Text style={styles.timeText}>
                        {currentDateTime.toLocaleDateString()} | {currentDateTime.toLocaleTimeString()}
                        </Text>
                    </View> */}


                        {/* WAKTU */}
                    <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>
                            {currentTime}
                        </Text>
                        <Text style={{ fontSize: 16, color: '#666', textAlign: 'center' }}>
                            {currentDate}
                    </Text>

                    <View style={styles.cardContainer}>
                            <LinearGradient colors={['#631D63', '#204766']} style={styles.cardtextt}>
                                <Text style={styles.cardText}>Lokasi/Toko</Text>
                            </LinearGradient>
                            </View>

                            <Text style={styles.infonamatoko}>  {toko?.customer_name} </Text>
                            <Text style={styles.info}>  {toko?.address} </Text>

                            {/* address dari GEO LOCATION */}
                            {/* <Text style={styles.info}>  {tokoAddress}</Text> */}
                    
                            <View style={styles.cardContainer}>
                            <LinearGradient colors={['#631D63', '#204766']} style={styles.cardtextt}>
                                <Text style={styles.cardText}>Jarak</Text>
                            </LinearGradient>
                            </View>

                            <Text style={styles.info}>   {jarak !== null ? `${jarak.toFixed(2)} Meter` : 'Sedang menghitung...'} </Text>

{/* 
                            {jarak !== null && <Text style={styles.info}>  {jarak.toFixed(2)} Meter </Text>} */}

                            <View style={styles.cardContainer}>
                            <LinearGradient colors={['#631D63', '#204766']} style={styles.cardtextt}>
                                <Text style={styles.cardText}>Keterangan</Text>
                            </LinearGradient>
                            </View>

                             <TextInput placeholder="Tulis disini.."   onChangeText={setKeterangan}   value={keterangan}   placeholderTextColor="#ccc" style={styles.input} />
          
      {isCheckinAllowed && (
        <LinearGradient colors={['#204766', '#631D63']} style={styles.buttonGradient}>
        <TouchableOpacity style={styles.button} onPress={handleCheckin}>
          <Text style={styles.buttonText}>Check In</Text>
        </TouchableOpacity>
        </LinearGradient>
      )}
    </ScrollView>
        </View>
  );
};

const styles = StyleSheet.create({
  buttonGradientAmbilFoto: { borderRadius: 5, marginBottom: 7, marginTop: 15, marginLeft: 10, marginRight: 10},
  buttonGradient: { borderRadius: 5, marginBottom: 0, marginLeft: 15, marginRight: 15 },
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
  header: { height: '24px', padding: 20, flexDirection: 'row', alignItems: 'center' },
  icBack: { width: '20', height: '20', marginTop: 20 },
  headerTitle: { fontSize: 20, color: 'white', marginLeft: 10, marginTop: 20 },
//   card: { backgroundColor: '#fff', padding: 15, borderRadius: 10 },
  title: { fontSize: 18, fontWeight: 'bold' },
  info: { fontSize: 15, paddingLeft: 27 },
  infonamatoko: { fontSize: 20, paddingLeft: 15, fontWeight: 'bold', },
  preview: { width: 225, height:225, borderRadius: 0 },
  buttonText: { color: 'white', textAlign: 'center', fontSize: 16, style:'bold'},
  card: {
    backgroundColor: '#eee',
    borderRadius: 0,
    marginBottom: 20,
    height: 180,
    width: '100%',
    overflow: 'hidden',
  },
  cardTextttt: { color: 'black', fontSize: 14, marginTop: 10 },
  cardText: { color: '#555', fontSize: 14, marginTop: 10 },
  photo: { width: '100%', height: '100%', resizeMode: 'cover' },
  photoPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  cameraIcon: { width: 45, height: 35 },
  timeContainer: { alignItems: 'center', marginTop: 10 },
  timeText: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  cardText: {
    fontSize: 14, 
    fontWeight: 'bold',
    color: 'white', // Warna teks putih
  },
  cardContainer: {
    marginTop: 10, // Atur jarak dari elemen sebelumnya
    paddingLeft: 15,
  },
  cardtextt: {
    width: '30%', // Lebar card
    paddingVertical: 5, // Padding atas bawah
    borderRadius: 10, // Sudut melengkung
    alignItems: 'center', // Pusatkan teks
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 10,
    paddingHorizontal: 15,
    color: '#000',
    marginBottom: 30,
    backgroundColor: '#fff',
    marginTop:10,
    marginRight: 15,
    marginLeft: 15,
  },

});

export default CheckinFix;
