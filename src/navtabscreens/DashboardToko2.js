import { BackHandler, Image, StyleSheet, View, Text, StatusBar, TouchableOpacity, Animated, Dimensions, Alert, ScrollView, useWindowDimensions, Modal  } from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import React, { useRef, useEffect, useState  } from 'react';
import { getusersprofile } from '../../helper/login';
import { useFocusEffect  } from '@react-navigation/native';
import { useCallback } from 'react';
import { getLokasiTokoByProjectId } from '../../helper/sqliteservice';
// import { getLokasiToko } from '../../services/sqliteService'; // Import fungsi SQLite
import AbsensiIcon from "../component/icon/iconsellintoko";
  import LemburIcon from "../component/icon/iconsellouttoko";
  import TambahLokasiIcon from "../component/icon/icondisplaytoko";
  import ProfileIcon from "../component/icon/icondisplaymbdtoko";
  import RiwayatCioIcon from "../component/icon/iconpromokompetitortoko";
  import RiwayatSellOutIcon from "../component/icon/iconstrucktoko";
import Planogram from "../component/icon/iconplanogramtoko";
import PriceTag from "../component/icon/iconpricetagtoko";
import Survey from "../component/icon/iconsurveytoko";
import CheckinBtn from "../component/icon/checkoutbtn"
import DownloadBtn from "../component/icon/downloadbtn"
import { openDatabase } from 'react-native-sqlite-storage';
import { useRoute } from '@react-navigation/native';

const db = openDatabase({ name: 'lokasi_toko.db', location: 'default' });
// tinggilayar
const { height, width } = Dimensions.get('window');
const DashboardToko2 = ({navigation }) => {
  const [userData, setUserData] = useState(null); // Menyimpan data pengguna
  const [loading, setLoading] = useState(true);  // Status loading untuk menunggu data
  const [tokoData, setTokoData] = useState(null); // State untuk data toko
  const [customer, setCustomer] = useState(null);

  const [isDialogVisible, setIsDialogVisible] = useState(false);

  // const fetchCustomerData = async () => {
  //   try {
  //     // Ambil data customer dari SQLite
  //     const data = await getCustomerFromSQLite();
  //     if (data) {
  //       setCustomer(data);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching customer data:", error);
  //   }
  // };

  // useFocusEffect(
  //   useCallback(() => {
  //     fetchCustomerData();
  //   }, [])
  // );


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

//   useEffect(() => {
//       console.log("Route Params:", route.params);

//       if (!customer_id || !project_id) {
//           Alert.alert("Kesalahan", "customer_id atau project_id tidak tersedia!");
//           return;
//       }

//       console.log("Mencari toko dengan customer_id:", customer_id);

//       db.transaction((tx) => {
//           tx.executeSql(
//               'SELECT customer_name, address, photo, customer_id FROM lokasi_toko WHERE customer_id = ?',
//               [customer_id],
//               (tx, results) => {
//                   if (results.rows.length > 0) {
//                       setToko(results.rows.item(0));
//                       console.log("Data toko ditemukan:", results.rows.item(0));
//                   } else {
//                       console.log("Data toko tidak ditemukan di SQLite.");
//                       Alert.alert("Kesalahan", "Data toko tidak ditemukan di database lokal.");
//                   }
//               },
//               (error) => {
//                   console.error("Error fetching toko data:", error);
//                   Alert.alert("Kesalahan", "Gagal mengambil data toko.");
//               }
//           );
//       });
//   }, [customer_id, project_id]);



// useFocusEffect(
//   useCallback(() => {
//     // Cek ulang data setelah kembali dari checkout
//     console.log("Screen Dashboard aktif kembali");
//     console.log("Customer ID:", toko?.customer_id);
//     console.log("Project ID:", project_id);

//     if (!toko?.customer_id || !project_id) {
//       console.log("customer_id atau project_id tidak tersedia!");
//     }
//   }, [toko, project_id])
// );


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
        } else {
          console.log("Tidak ada Users yang ditemukan!");
        }
      } catch (error) {
        console.error("Error, users profile..", error);
      } finally {
        setLoading(false); // Data berhasil diambil, hentikan loading
      }
    };
    fetchUserProfile();
  }, []);


    // Fungsi untuk menampilkan dialog maintenance (contoh dialog untuk maintenance)
    const showMaintenanceDialog = () => {
      setIsDialogVisible(true);
    };

    const hideMaintenanceDialog = () => {
      setIsDialogVisible(false);
    };


  // Jika data belum siap (loading)
  if (loading) {
    return; // Bisa menggunakan spinner loading di sini jika diinginkan
  }

   
  
  return (
       <View style={styles.container}>
         <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
         {/* <LinearGradient colors={['#000000', '#000000']} style={styles.gradient} /> */}
 
         <LinearGradient colors={['#204766', '#631D63']} style={styles.header}>
                 <TouchableOpacity onPress={() => navigation.navigate('CustomerListNewBelow')}>
                 </TouchableOpacity>
                 <Text style={styles.headerTitle}>Dashboard Toko</Text>
               </LinearGradient>
 
         <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
           {/* Header */}
           <View style={styles.head}>
   <LinearGradient colors={['#631D63', '#204766', '#631D63']} style={styles.gradient_header}>
     <View style={styles.profileContainer}> 
       {/* Foto Profil */}
       <Image 
         style={styles.imageProfile} 
         source={userData?.profile_picture ? { uri: userData.profile_picture } : require('../../assetss/ic_profile.png')}
       />
       {/* Informasi Profil */}
       <View style={styles.profileText}>
          <Text style={styles.textnama}>  {toko?.customer_name} </Text>
                        <Text style={styles.textnip}> {toko?.address} </Text>
                        <Text style={styles.textjabatan}> {toko?.customer_id} </Text>
       </View>
     </View>
   </LinearGradient>
 </View>
 
 
 
 {/* 
 <View style={styles.container}>
       {checkinData ? (
         <View style={styles.card}>
           <Text style={styles.title}>Detail Check-in</Text>
           <Text>Nama Customer: {checkinData.customer_id}</Text>
           <Text>Latitude: {checkinData.latitude_in}</Text>
           <Text>Longitude: {checkinData.longitude_in}</Text>
           <Text>Jarak: {checkinData.distance_in} meter</Text>
           {checkinData.foto_in ? (
             <Image source={{ uri: checkinData.foto_in }} style={styles.image} />
           ) : null}
         </View>
       ) : (
         <View style={styles.card}>
           <Text style={styles.title}>Belum Check-in</Text>
           <Text>Silakan lakukan check-in terlebih dahulu.</Text>
         </View>
       )}
     </View> */}
 
 
 
 
 
           {/* Tombol Check-in dan Download */}
           <View style={styles.imageRow}>
             {/* <TouchableOpacity onPress={() => navigation.navigate('CustomerListNewBelow')}>
               <Image source={require('../../assets/btncheckin.png')} style={styles.btncheckin} />
             </TouchableOpacity> */}
 
 {/* {checkinData ? (
   // Jika sudah check-in, tampilkan card detail check-in dengan navigasi ke DashboardToko
   <TouchableOpacity 
     style={styles.card}
     onPress={() => navigation.navigate('DashboardToko2', { 
       customer_id: checkinData.customer_id, 
       project_id: checkinData.project_id 
     })}
   >
     <Text style={styles.title}>Detail Check-in</Text>
     <Text>ID: {checkinData.customer_id}</Text>
     <Text>Jarak: {checkinData.distance_in} meter</Text>
     {checkinData.foto_in ? (
       <Image source={{ uri: checkinData.foto_in }} style={styles.image} />
     ) : null}
   </TouchableOpacity>
 ) : ( */}
   {/* // Jika belum check-in, tampilkan tombol check-in
   <TouchableOpacity onPress={() => navigation.navigate('CustomerListNewBelow')}>
     <Image source={require('../../assets/btncheckin.png')} style={styles.btncheckin} />
   </TouchableOpacity>
 )}
  */}
 
             {/* <TouchableOpacity 
               onPress={() => navigation.navigate('downloaddataoffline2', { project_id: projectId })}
             >
               <Image source={require('../../assets/btndownload.png')} style={styles.sideImage} />
             </TouchableOpacity> */}
 
           </View>
   
           {/* Icon Rows */}
           <View style={styles.rowIcons}>
         <TouchableOpacity style={styles.iconButton} onPress={showMaintenanceDialog}>
             <AbsensiIcon />
         </TouchableOpacity>
 
         <TouchableOpacity style={styles.iconButton} onPress={showMaintenanceDialog}>
             <LemburIcon />
         </TouchableOpacity>
 
         <TouchableOpacity style={styles.iconButton} onPress={showMaintenanceDialog}>
             <TambahLokasiIcon />
         </TouchableOpacity>
       </View>
 
 
           <View style={styles.rowIcons}>
         <TouchableOpacity style={styles.iconButton} onPress={showMaintenanceDialog}>
             <ProfileIcon />
         </TouchableOpacity>
 
         <TouchableOpacity style={styles.iconButton} onPress={showMaintenanceDialog}>
             <RiwayatCioIcon />
         </TouchableOpacity>
 
         <TouchableOpacity style={styles.iconButton} onPress={showMaintenanceDialog}>
             <RiwayatSellOutIcon />
         </TouchableOpacity>
       </View>


       

       <View style={styles.rowIcons}>
         <TouchableOpacity style={styles.iconButton} onPress={showMaintenanceDialog}>
             <Planogram />
         </TouchableOpacity>
 
         <TouchableOpacity style={styles.iconButton} onPress={showMaintenanceDialog}>
             <PriceTag />
         </TouchableOpacity>
 
         <TouchableOpacity style={styles.iconButton} onPress={showMaintenanceDialog}>
             <Survey />
         </TouchableOpacity>
       </View>



       <View style={styles.floatingButtonContainer}>
              <Animated.View style={[styles.floatingButton, { transform: [{ translateY }] }]}>
                {/* <TouchableOpacity onPress={() => navigation.navigate('DetailCheckOutBelow', { 
              customer_id: toko.customer_id, 
              project_id: project_id 
            })}>
                  <CheckinBtn />
                </TouchableOpacity> */}
                <TouchableOpacity 
  onPress={() => {
    if (toko?.customer_id && project_id) {
      Alert.alert(
        'Konfirmasi Check-Out',
        'Apa Anda yakin untuk check-out?',
        [
          {
            text: 'Batal',
            style: 'cancel',
          },
          {
            text: 'Ya',
            onPress: () => navigation.navigate('DetailCheckOutBelow', { 
              customer_id: toko.customer_id, 
              project_id: project_id  
            }),
          },
        ]
      );
    } else {
      console.log("customer_id atau project_id tidak tersedia!");
    }
  }}
>
  <CheckinBtn />
</TouchableOpacity>
              </Animated.View>
            </View>
 
 
         </ScrollView>


             {/* Modal Dialog untuk Maintenance */}
                <Modal
                  visible={isDialogVisible}
                  transparent={true}
                  animationType="fade"
                  onRequestClose={hideMaintenanceDialog}
                >
                  <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                      <Text style={styles.modalTitle}>Maintenance</Text>
                      <Text style={styles.modalMessage}> </Text>
                      <View style={styles.modalButtonsRow}>
                        {/* <TouchableOpacity
                          style={[styles.modalButton, styles.leftButton]}
                          onPress={() => {
                            hideMaintenanceDialog();
                            navigation.navigate('DetailCheckin', {
                              // Ambil customer_id dari checkinData atau dari userData jika diperlukan
                              customer_id: checkinData ? checkinData.customer_id : userData.employee_id,
                              project_id: checkinData ? (checkinData.project_id || projectId) : projectId,
                            });
                          }}
                        >
                          <Text style={styles.modalButtonText}>Detail Check-in</Text>
                        </TouchableOpacity> */}
                        <TouchableOpacity
                          style={[styles.modalButton, styles.rightButton]}
                          onPress={hideMaintenanceDialog}
                        >
                          <Text style={styles.modalButtonText}>Batal</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </Modal>



       </View>
     );
   };
   
   const styles = StyleSheet.create({
     container: { flex: 1, backgroundColor: 'white' },
     
     head: {
         marginTop: 10,
         marginHorizontal: 15, 
       },
     
       gradient_header: {
         width: '100%',
         height: height * 0.18, // Tinggi header responsif
         borderRadius: 15,
         justifyContent: 'center', // Posisikan konten di tengah secara vertikal
         paddingHorizontal: 15,
       },
     
       profileContainer: {
         flexDirection: 'row', // Susun gambar & teks dalam satu baris
         alignItems: 'center', // Pastikan sejajar secara vertikal
         paddingHorizontal: 15, // Tambahkan padding agar rapi
       },
     
       imageProfile: {
         width: width * 0.18, // Ukuran gambar responsif
         height: width * 0.18,
         borderRadius: width * 0.09, // Agar berbentuk lingkaran
         backgroundColor: '#ffffff',
         resizeMode: 'cover', 
         marginRight: 15, // Jarak antara gambar dan teks
       },
     
       profileText: {
         flex: 1, // Agar teks memenuhi sisa ruang di sebelah kanan
         flexDirection: 'column', // Pastikan teks tersusun vertikal
       },
     
       textNama: {
         fontSize: width * 0.045,
         fontWeight: 'bold',
         color: '#ffffff',
       },
     
       textNip: {
         fontSize: width * 0.04,
         fontWeight: 'normal',
         color: '#ffffff',
       },
     
       textJabatan: {
         fontSize: width * 0.04,
         fontWeight: 'normal',
         color: '#ffffff',
       },
 
     gradient: { height: 25 },
   
     rowIcons: {
       flexDirection: "row",
       justifyContent: "space-around",
       marginVertical: 10,
       marginTop: 0,
       marginRight: 15,
       marginLeft: 15,
     },
     iconButton: {
       padding: width * 0.02,
       borderRadius: 10,
       backgroundColor: '#f8f8f8'
     },
   
     imageRow: {
         flexDirection: 'row',
         justifyContent: 'space-between', // Agar tombol berada di kanan dan kiri
         alignItems: 'center',
         width: '100%', // Sesuai dengan header
         paddingHorizontal: '0%', // Memberikan padding agar tidak menempel ke tepi
         marginTop: 15,
       },
       
       btncheckin: {
         width:240, // Diperbesar
         height: 75, // Sesuai proporsi
         resizeMode: 'contain',
         marginLeft: 15,
       },
       
       sideImage: {
         width: 65, // Sama dengan btncheckin agar proporsional
         height: 65,
         marginRight: 15,
         resizeMode: 'contain',
       },
       lockIcon: {
         width: 50, 
         height: 50, 
         resizeMode: 'contain'
       },
       header: { height: '24px', padding: 20, flexDirection: 'row', alignItems: 'center' },
       icBack: { width: '20', height: '20', marginTop: 20 },
       headerTitle: { fontSize: 20, color: 'white', marginLeft: 10, marginTop: 20 },
     
       card: {
         width: '70%',
         padding: 10,
         backgroundColor: 'white',
         borderRadius: 10,
         elevation: 3,
         alignItems: 'center',
         marginLeft: 17,
         height:70,
         // width:240, // Diperbesar
         // height: 75, // Sesuai proporsi
         // resizeMode: 'contain',
         // marginLeft: 15,
       },
       title: {
         fontSize: 12,
         fontWeight: 'bold',
         marginBottom: 0,
       },
       image: {
         width: 100,
         height: 100,
         marginTop: 10,
         borderRadius: 10,
       },
       textnama: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
        marginLeft: '2%',
    },
    textnip: {
      fontSize: 12,
      fontWeight: 'normal',
      marginLeft: '4%',
      marginRight: '4%',
      marginTop: 10, // Tambahkan margin atas
      color: '#ffffff',
  },
    textjabatan: {
        fontSize: 12,
        fontWeight: 'normal',
        marginLeft: '3%',
        marginTop: 3, // Tambahkan margin atas
        color: '#ffffff',
    },
    floatingButtonContainer: {
        position: "absolute",
        bottom: 20, // Atur sesuai kebutuhan
        left: 0,
        right: 0,
        alignItems: "center", // Tengahkan horizontal
        justifyContent: "center", // Tengahkan vertikal jika diperlukan
      },
      floatingButton: {
        width: 150, // Sesuaikan ukuran tombol
        height: 50,
        alignItems: "center",
        justifyContent: "center",
      },
      modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
      modalContainer: { width: '80%', backgroundColor: 'white', borderRadius: 10, padding: 20, alignItems: 'center' },
      modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#204766' },
      modalMessage: { fontSize: 16, marginBottom: 20, textAlign: 'center', color: '#333' },
      modalButtonsRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
      modalButton: { flex: 1, padding: 10, marginHorizontal: 5, borderRadius: 5, backgroundColor: '#204766', alignItems: 'center' },
      modalButtonText: { color: 'white', fontWeight: 'bold' }
       });
   
   export default DashboardToko2;
   