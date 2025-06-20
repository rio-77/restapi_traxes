import React, { useState, useEffect,useRef } from 'react';
import { View, TextInput, Text, Alert, StyleSheet, Animated, ScrollView, TouchableOpacity, Image, BackHandler, Dimensions } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { launchCamera } from 'react-native-image-picker';
import { openDatabase } from 'react-native-sqlite-storage';
import { calculateDistance } from '../../src/utils/utils';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import { getusersprofile } from '../../helper/login';
import { saveCheckinToLocalDB, initCheckinTable } from '../../helper/sqliteservice';
import { useRoute } from '@react-navigation/native';
import { useFocusEffect  } from '@react-navigation/native';
import { useCallback } from 'react';
import { getLastCheckoutDistanceee } from '../../helper/sqliteservice'; // ganti path sesuai struktur project kamu


const db = openDatabase({ name: 'lokasi_toko.db', location: 'default' });
// tinggilayar
const { height, width } = Dimensions.get('window');
const DetailCo = ({navigation }) => {
  const [userData, setUserData] = useState(null); // Menyimpan data pengguna
  const [loading, setLoading] = useState(true);  // Status loading untuk menunggu data
  const [tokoData, setTokoData] = useState(null); // State untuk data toko
  const [customer, setCustomer] = useState(null);
  const [jarakCheckin, setJarakCheckin] = useState(null);
  const [keterangan, setKeterangan] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [waktu, setWaktu] = useState('');
  const [foto, setFoto] = useState('');



  useEffect(() => {
    getLastCheckoutDistanceee()
      .then((distance) => {
        if (distance !== null) {
          setJarakCheckin(parseFloat(distance));
        }
      })
      .catch((err) => console.error('Error ambil distance_out:', err));
  }, []);

  useEffect(() => {
    getCheckoutData();
  }, []);

  const getCheckoutData = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM checkin ORDER BY id DESC LIMIT 1',
        [],
        (_, results) => {
          if (results.rows.length > 0) {
            const data = results.rows.item(0);
  
            setKeterangan(data.keterangan_out || '-');
            setFoto(data.foto_out || '');
  
            if (data.datetimephone_out) {
              const dateObj = new Date(data.datetimephone_out);
              const tanggalFormatted = dateObj.toLocaleDateString();
              const waktuFormatted = dateObj.toLocaleTimeString();
  
              setTanggal(tanggalFormatted);
              setWaktu(waktuFormatted);
            } else {
              setTanggal('-');
              setWaktu('-');
            }
          }
        },
        (error) => {
          console.log('Gagal mengambil data checkout:', error);
        }
      );
    });
  };

  // get data toko
  const route = useRoute();
  const { customer_id, project_id } = route.params || {}; // Pastikan params tidak undefined

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



  // Animasi untuk gambar (opsional)
  const translateY = useRef(new Animated.Value(0)).current;
   // useEffect untuk menangani tombol Back di Android
   useEffect(() => {
    const backAction = () => {
      Alert.alert(
        "Apps Traxes",
        "Ingin keluar dari aplikasi Traxes?",
        [
          {
            text: "Tidak",
            onPress: () => null,  // Tidak keluar jika Cancel ditekan
            style: "Tidak"
          },
          { text: "Keluar", onPress: () => BackHandler.exitApp() }  // Keluar dari aplikasi jika YES ditekan
        ]
      );
      return true; // Mencegah aksi back default
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress", 
      backAction
    );
    // Membersihkan event listener saat komponen unmount
    return () => backHandler.remove();
  }, []);  // Empty dependency array agar hanya dipanggil sekali saat mount
  useEffect(() => {
    Animated.loop(
      Animated.sequence([ 
        Animated.timing(translateY, {
          toValue: -8, 
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0, 
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [translateY]);

  // Ambil data pengguna saat komponen dimuat
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const data = await getusersprofile();
        if (data) {
          setUserData(data);
        }
      } catch (error) {
        console.error("Error, users profile..", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  // Jika data belum siap (loading)
  if (loading) {
    return; // Bisa menggunakan spinner loading di sini jika diinginkan
  }

  


  return (
    <View style={styles.container}>
       <LinearGradient colors={['#204766', '#631D63']} style={styles.header}>
              <TouchableOpacity onPress={() => navigation.navigate('CustomerListNewBelow')}>
                {/* <Image source={require('../../assets/icc_back.png')} style={styles.icBack} /> */}
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Berhasil Checkout</Text>
            </LinearGradient>

               <ScrollView contentContainerStyle={styles.scrollContainer}>
            {/* <TouchableOpacity style={styles.card}>
                      <View style={styles.container}>
                {foto ? (
                  <Image
                    source={{ uri: foto }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                ) : (
                  <Text style={styles.noImage}>Foto belum tersedia</Text>
                )}
                <View style={styles.overlay}>
                  <Text style={styles.successText}> Berhasil Check-out✅ </Text>
                </View>
                </View>
             </TouchableOpacity> */}

                  
{loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <>
          {/* TAMPILKAN DATA USER LOGIN */}
          <View style={styles.cardContainer}>
            <Text style={styles.karyawan}>Karyawan</Text>
            <Text style={styles.textKaryawan}>{userData?.fullname}</Text>
            <Text style={styles.textKaryawan}>{userData?.employee_id}</Text>
            <Text style={styles.textKaryawan}>{userData?.type_id}</Text>
            <Text style={styles.textKaryawan}>{userData?.project_id}</Text>
          </View>
          {/* TAMPILKAN DATA USER LOGIN */}
          <View style={styles.cardContainer11}>
            <Text style={styles.karyawan}>Lokasi/toko</Text>
            <Text style={styles.textKaryawan}>{toko?.customer_name}</Text>
            <Text style={styles.textKaryawan}>{toko?.address}</Text>
          </View>
          <View style={styles.cardContainer111}>
            <Text style={styles.karyawan}>Jarak dan Waktu</Text>
                    {/* {jarakCheckin !== null ? (
                <Text style={styles.textKaryawan}>
                  {jarakCheckin.toFixed(2)} Meter
                </Text>
              ) : (
                <Text style={styles.loading}>Memuat jarak check-in..</Text>
              )} */}
               <Text style={styles.textKaryawan}>{tanggal}   {waktu}</Text>
          </View>

          <View style={styles.cardContainer1111}>
            <Text style={styles.karyawan}>Keterangan</Text>
            <Text style={styles.textKaryawan}>{keterangan}</Text>
          </View>

          <LinearGradient colors={['#204766', '#631D63']} style={styles.buttonGradient}>

          <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Home')}
                >
                <Text style={styles.buttonText}>Ke Menu Utama</Text>
            </TouchableOpacity>             

        {/* <TouchableOpacity
    style={styles.button}
    onPress={() => navigation.navigate('DashboardToko2', { customer_id, project_id })}
  >
    <Text style={styles.buttonText}>Ke Menu Utama</Text>
  </TouchableOpacity> */}
        </LinearGradient>


          {/* TOMBOL + LOKASI TOKO */}
          {/* <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('AddLocation', {
              employee_id: userData?.employee_id,
              jabatan: userData?.type_id,
              project_id: userData?.project_id,
            })}
          >
            <Text style={styles.buttonText}>+ Lokasi Toko</Text>
          </TouchableOpacity> */}
        </>
      )}    
                    
   
    </ScrollView>
        </View>
  );
};

const styles = StyleSheet.create({
  buttonGradientAmbilFoto: { borderRadius: 5, marginBottom: 7, marginTop: 15, marginLeft: 10, marginRight: 10},
  buttonGradient: { borderRadius: 5, marginBottom: 0, marginLeft: 20, marginRight: 20, marginTop: 10 },
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

  // card: {
  //   backgroundColor: '#eee',
  //   borderRadius: 0,
  //   marginBottom: 20,
  //   height: 150,
  //   width: '100%',
  //   overflow: 'hidden',
  // },

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
    marginTop: 0, // Atur jarak dari elemen sebelumnya
    paddingLeft: 15,
  },
  cardContainer11: {
    marginTop: 15, // Atur jarak dari elemen sebelumnya
    paddingLeft: 15,
  },
  cardContainer111: {
    marginTop: 15, // Atur jarak dari elemen sebelumnya
    paddingLeft: 15,
  },
  cardContainer1111: {
    marginTop: 15, // Atur jarak dari elemen sebelumnya
    paddingLeft: 15,
  },



  cardContainer1: {
    marginTop: 0, // Atur jarak dari elemen sebelumnya
    paddingLeft: 15,
  },
  cardContainer2: {
    marginTop: 15, // Atur jarak dari elemen sebelumnya
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
  info: {
    fontSize: 14,
    color: '#333',
    marginHorizontal: 15,
    marginVertical: 4,
  },
  cardText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 15,
    marginTop: 10,
  },
  textKaryawan: {
    marginLeft: 5,   // Jarak dari kiri
    marginRight: 5,  // Jarak dari kanan
    marginBottom: -8, // Jarak dari bawah
    padding: 5,      // Padding untuk memberi jarak di dalam teks
    fontSize: 14,    // Ukuran font (opsional)
    fontWeight: 'normal', // Gaya font (opsional)
  },

  karyawan: {
    marginLeft: 5,   // Jarak dari kiri
    marginRight: 5,  // Jarak dari kanan
    marginBottom: 0, // Jarak dari bawah
    padding: 5,      // Padding untuk memberi jarak di dalam teks
    fontSize: 16,    // Ukuran font (opsional)
    fontWeight: 'bold', // Gaya font (opsional)
  },



  container: {
    flex: 1,
    padding: 0,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 130,
    borderRadius: 10,
    marginBottom: 16,
  },
  noImage: {
    textAlign: 'center',
    color: '#888',
    marginBottom: 0,
  },
  card: {
    backgroundColor: '#f1f1f1',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  value: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  overlay: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  successText: {
    color: 'green',
    fontWeight: 'bold',
    fontSize: 16,
  },

});

export default DetailCo;
