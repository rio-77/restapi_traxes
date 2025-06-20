import React, { useState, useEffect } from 'react';
import { View,  TextInput,Text, Alert, StyleSheet, ScrollView, TouchableOpacity, Image, BackHandler } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { launchCamera } from 'react-native-image-picker';
import { openDatabase } from 'react-native-sqlite-storage';
import { calculateDistance } from '../../src/utils/utils';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import { getusersprofile } from '../../helper/login';
import { saveCheckinToLocalDB, initCheckinTable } from '../../helper/sqliteservice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import { useFocusEffect  } from '@react-navigation/native';
import { useCallback } from 'react';



const db = openDatabase({ name: 'lokasi_toko.db', location: 'default' });

const DetailCheckOutBelow = ({  }) => {
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
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
   const [keterangan, setKeterangan] = useState('');
    const [isLoading, setIsLoading] = useState(true); // Menandakan sedang menghitung jarak
  

  const navigation = useNavigation();
  const route = useRoute();
  const { customer_id, project_id } = route.params || {};
    const [toko, setToko] = useState(null);



    useFocusEffect(
        useCallback(() => {
          if (!customer_id || !project_id) {
            Alert.alert("Kesalahan", "customer_id atau project_id tidak tersedia!");
            return;
          }
    
          db.transaction((tx) => {
            tx.executeSql(
              'SELECT customer_name, address, photo, customer_id FROM lokasi_toko WHERE customer_id = ?',
              [customer_id],
              (tx, results) => {
                if (results.rows.length > 0) {
                  setToko(results.rows.item(0));
                  console.log("Data toko ditemukan:", results.rows.item(0));
                } else {
                  console.log("Data toko tidak ditemukan di SQLite.");
                  Alert.alert("Kesalahan", "Data toko tidak ditemukan di database lokal.");
                }
              },
              (error) => {
                console.error("Error fetching toko data:", error);
                Alert.alert("Kesalahan", "Gagal mengambil data toko.");
              }
            );
          });
        }, [customer_id, project_id])
      );
    


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
      navigation.navigate('DashboardToko2', {
        customer_id: customer_id, 
        project_id: project_id
      }); 
      return true; // Cegah aplikasi tertutup
    };
        
          const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
        
          return () => backHandler.remove(); // Hapus event listener saat komponen unmount

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

  const handleCapturePhoto = () => {
    launchCamera({ mediaType: 'photo', quality: 0.5, includeBase64: true }, (response) => {
      if (!response.didCancel && response.assets.length > 0) {
        setPhoto(response.assets[0].base64);
      }
    });
  };

  useEffect(() => {
    initCheckinTable();
  }, []);
  


  // const handleCheckout = async () => {
  //   if (!employeeData || !photo) {
  //     Alert.alert('Peringatan!', 'Harap masukkan foto sebelum check-out.');
  //     return;
  //   }
  
  //   // ✅ Tambahkan Dialog Konfirmasi
  //   Alert.alert(
  //     'Konfirmasi',
  //     'Apakah Anda yakin ingin check-out sekarang?',
  //     [
  //       {
  //         text: 'Batal',
  //         style: 'cancel',
  //       },
  //       {
  //         text: 'Ya, Check-out',
  //         onPress: async () => {
  //           try {
  //             // 1️⃣ Ambil Radius Project dari API
  //             const radiusResponse = await axios.post(
  //               'https://api.traxes.id/index.php/download/projectradius',
  //               { project_id }
  //             );
  //             const { status, project_radius } = radiusResponse.data;
  
  //             if (status === 0) {
  //               Alert.alert('Gagal', 'Check-out tidak diperbolehkan');
  //               return;
  //             }
  
  //             // 2️⃣ Hitung Jarak
  //             const distance = calculateDistance(latitude, longitude, tokoLatitude, tokoLongitude);
  
  //             if (status === 1 && distance > project_radius) {
  //               Alert.alert('Gagal', `Jarak lebih dari ${project_radius} meter, check-out tidak diperbolehkan`);
  //               return;
  //             }
  
  //             // 3️⃣ Data Check-out yang Akan Disimpan
  //             const requestData = {
  //               employee_id: employeeData.employee_id,
  //               customer_id,
  //               date_cio: new Date().toISOString().split('T')[0],
  //               datetimephone_out: new Date().toISOString(),
  //               latitude_out: latitude,
  //               longitude_out: longitude,
  //               radius_out: project_radius,
  //               distance_out: distance,
  //               status_toko: status,
  //               createdon_out: new Date().toISOString(),
  //               foto_out: photo,
  //             };
  
  //             // 4️⃣ Kirim Data Check-out ke API
  //             const response = await axios.post(
  //               'https://api.traxes.id/index.php/transaksi/pushCheckOut',
  //               requestData
  //             );
  
  //             if (response.data.status === 1) {
  //               // 5️⃣ UPDATE SQLite Agar Data Check-in Jadi Tidak Aktif
  //               db.transaction((tx) => {
  //                 tx.executeSql(
  //                   `UPDATE checkin SET 
  //                     datetimephone_out = ?, 
  //                     latitude_out = ?, 
  //                     longitude_out = ?, 
  //                     radius_out = ?, 
  //                     distance_out = ?, 
  //                     status_toko = ?, 
  //                     foto_out = ? 
  //                   WHERE datetimephone_out IS NULL`,
  //                   [
  //                     requestData.datetimephone_out,
  //                     requestData.latitude_out,
  //                     requestData.longitude_out,  
  //                     requestData.radius_out,
  //                     requestData.distance_out,
  //                     requestData.status_toko,
  //                     requestData.foto_out,
  //                   ],
  //                   (_, results) => {
  //                     console.log("✅ SQLite Updated:", results);

  //                   },
  //                   (error) => console.error("❌ Error updating SQLite:", error)
  //                 );
  //               });
  
  //               // 6️⃣ Simpan customer_id & project_id agar tidak hilang setelah navigasi
  //               await AsyncStorage.setItem('customer_id', customer_id);
  //               await AsyncStorage.setItem('project_id', project_id);
  
  //               Alert.alert('Sukses', 'Check-out berhasil');
  
  //               // // 7️⃣ Navigasi ke Home Agar Tampilan Refresh
  //               // navigation.navigate('Home');

  //               // 7️⃣ Navigasi ke Screen DetailCheckOutBelow
  //                 navigation.navigate('DetailCo', {
  //                   customer_id: customer_id,
  //                   project_id: project_id
  //                 });

  
  //             } else {
  //               Alert.alert('Error', 'Check-out gagal');
  //             }
  //           } catch (error) {
  //             console.error('Error performing check-out:', error);
  //             Alert.alert('Error', 'Gagal melakukan check-out');
  //           }
  //         },
  //       },
  //     ],
  //     { cancelable: false }
  //   );
  // };


  const handleCheckout = async () => {
    if (!employeeData || !photo) {
      Alert.alert('Peringatan!', 'Harap masukkan foto sebelum check-out.');
      return;
    }
  
    Alert.alert(
      'Konfirmasi',
      'Apakah Anda yakin ingin check-out sekarang?',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Ya, Check-out',
          onPress: async () => {
            try {
              const radiusResponse = await axios.post(
                'https://api.traxes.id/index.php/download/projectradius',
                { project_id }
              );
              const { status, project_radius } = radiusResponse.data;
  
              if (status === 0) {
                Alert.alert('Gagal', 'Check-out tidak diperbolehkan');
                return;
              }
  
              const distance = calculateDistance(latitude, longitude, tokoLatitude, tokoLongitude);
  
              if (status === 1 && distance > project_radius) {
                Alert.alert('Gagal', `Jarak lebih dari ${project_radius} meter, check-out tidak diperbolehkan`);
                return;
              }
  
              const requestData = {
                employee_id: employeeData.employee_id,
                customer_id,
                date_cio: new Date().toISOString().split('T')[0],
                datetimephone_out: new Date().toISOString(),
                latitude_out: latitude,
                longitude_out: longitude,
                radius_out: project_radius,
                distance_out: distance,
                status_toko: status,
                createdon_out: new Date().toISOString(),
                foto_out: photo,
              };
  
              const response = await axios.post('https://api.traxes.id/index.php/transaksi/pushCheckOut', requestData);
  
              if (response.data.status === 1) {
                // Update SQLite
                db.transaction((tx) => {
                  tx.executeSql(
                    // `UPDATE checkin SET 
                    //   datetimephone_out = ?, 
                    //   latitude_out = ?, 
                    //   longitude_out = ?, 
           
                    //   distance_out = ?, 
                    //   status_toko = ?, 
                    //   foto_out = ?,
                    //   createdon_out = ?,
                    //   date_cio = ?
                    // WHERE datetimephone_out IS NULL AND customer_id = ?`,
                    `UPDATE checkin SET
                    datetimephone_out = ?,
                    latitude_out = ?,
                    longitude_out = ?,
                    radius_out = ?,
                    distance_out = ?,
                    status_toko = ?,
                    foto_out = ?,
                    createdon_out = ?,
                    date_cio = ?
                  WHERE datetimephone_out IS NULL AND customer_id = ?`,
                    [
                      // requestData.datetimephone_out,
                      // requestData.latitude_out,
                      // requestData.longitude_out,
          
                      // requestData.distance_out,
                      // requestData.status_toko,
                      // requestData.foto_out,
                      // requestData.createdon_out,
                      // requestData.date_cio,
                      // customer_id,
                      requestData.datetimephone_out,
                      requestData.latitude_out,
                      requestData.longitude_out,
                      requestData.radius_out,
                      requestData.distance_out,
                      requestData.status_toko,
                      requestData.foto_out,
                      requestData.createdon_out,
                      requestData.date_cio,
                      requestData.customer_id
                    ],
                    (_, results) => {
                      console.log("✅ SQLite Updated:", results);
                      console.log("🔁 Rows affected:", results.rowsAffected);
                    },
                    (error) => console.error("❌ Error updating SQLite:", error)
                  );
                });
  
                await saveCheckinToLocalDB(requestData);
  
                // Ambil info tambahan dari SQLite
                db.transaction(tx => {
                  tx.executeSql(
                    'SELECT * FROM lokasi_toko WHERE project_id = ?',
                    [project_id],
                    (tx, results) => {
                      if (results.rows.length > 0) {
                        const toko = results.rows.item(0);
  
                        navigation.navigate('DetailCo', {
                          // Mengirimkan data secara langsung
                          employee_id: requestData.employee_id,
                          customer_id: requestData.customer_id,
                          date_cio: requestData.date_cio,
                          datetimephone_out: requestData.datetimephone_out,
                          latitude_out: requestData.latitude_out,
                          longitude_out: requestData.longitude_out,
                          radius_out: requestData.radius_out,
                          distance_out: requestData.distance_out,
                          status_toko: requestData.status_toko,
                          foto_out: requestData.foto_out,
                          createdon_out: requestData.createdon_out,
                          customer_name: toko.customer_name,
                          address: toko.address,
                          owner_name: toko.owner_name,
                          project_id: project_id, // tetap kirim project_id
                        });
                      }
                    },
                    (error) => {
                      console.log("❌ Error ambil info toko:", error);
                      navigation.navigate('DetailCo', {
                        // Mengirimkan data secara langsung meski info toko tidak ditemukan
                        employee_id: requestData.employee_id,
                        customer_id: requestData.customer_id,
                        date_cio: requestData.date_cio,
                        datetimephone_out: requestData.datetimephone_out,
                        latitude_out: requestData.latitude_out,
                        longitude_out: requestData.longitude_out,
                        radius_out: requestData.radius_out,
                        distance_out: requestData.distance_out,
                        status_toko: requestData.status_toko,
                        foto_out: requestData.foto_out,
                        createdon_out: requestData.createdon_out,
                        project_id: project_id,
                      });
                    }
                  );
                });
              } else {
                Alert.alert('Gagal', 'Check-out gagal, coba lagi');
              }
            } catch (error) {
              console.error('Error during check-out process:', error);
              Alert.alert('Error', 'Terjadi kesalahan saat check-out');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };


   return (
      <View style={styles.container}>
         <LinearGradient colors={['#204766', '#631D63']} style={styles.header}>
                  <TouchableOpacity 
                      onPress={() => navigation.navigate('DashboardToko2', { 
                        customer_id: customer_id, 
                        project_id: project_id 
                      })}
                    >         
                  {/* <Image source={require('../../assets/icc_back.png')} style={styles.icBack} /> */}
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Check Out</Text>
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


                              {/* {jarak !== null && <Text style={styles.info}>  {jarak.toFixed(2)} Meter </Text>} */}
  
                              <View style={styles.cardContainer}>
                              <LinearGradient colors={['#631D63', '#204766']} style={styles.cardtextt}>
                                  <Text style={styles.cardText}>Keterangan</Text>
                              </LinearGradient>
                              </View>
  
                               <TextInput placeholder="Tulis disini.."   onChangeText={setKeterangan}   value={keterangan}   placeholderTextColor="#ccc" style={styles.input} />
            
        {isCheckinAllowed && (
          <LinearGradient colors={['#204766', '#631D63']} style={styles.buttonGradient}>
          <TouchableOpacity style={styles.button} onPress={handleCheckout}>
            <Text style={styles.buttonText}>Check Out</Text>
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

export default DetailCheckOutBelow;
