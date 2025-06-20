import { 
    BackHandler, Image, StyleSheet, View, Text, StatusBar, 
    TouchableOpacity, Animated, Dimensions, Alert, ScrollView, Platform, Modal 
  } from "react-native";
  import LinearGradient from 'react-native-linear-gradient';
  import React, { useRef, useEffect, useState } from 'react';
  import { getusersprofile } from '../../helper/login';
  import changeNavigationBarColor from 'react-native-navigation-bar-color';
  import AbsensiIcon from "../component/icon/iconabsensi";
  import LemburIcon from "../component/icon/icontambahlokasi";
  import TambahLokasiIcon from "../component/icon/iconovertime";
  import ProfileIcon from "../component/icon/iconriwayatcio";
  import RiwayatCioIcon from "../component/icon/iconriwayatsellout";
  import RiwayatSellOutIcon from "../component/icon/iconverifikasimbd";
  import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
  import SQLite from "react-native-sqlite-storage";
  import { useNavigation } from "@react-navigation/native";
  import BtnCheckin from "../component/icon/btncheckin";
  import BtnDownload from "../component/icon/btndownload";
  import { useIsFocused } from "@react-navigation/native"; // Cek saat kembali ke dashboard



  const db = SQLite.openDatabase(
    { name: "lokasi_toko.db", location: "default" },
    () => console.log("Database opened"),
    (error) => console.error(error)
  );
  
  const { width, height } = Dimensions.get('window');
  
  const DashboardUtama = ({ route }) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const translateY = useRef(new Animated.Value(0)).current;
    const [projectId, setProjectId] = useState(null);

    const [isDialogVisible, setIsDialogVisible] = useState(false);

    const [checkinData, setCheckinData] = useState(null);
    const isFocused = useIsFocused();
    const navigation = useNavigation();
  
    useEffect(() => {
      if (isFocused) {
        console.log("Dashboard aktif, ambil ulang data check-in...");
        getLatestCheckin();
      }
    }, [isFocused]);


    // const getLatestCheckin = () => {
    //   db.transaction((tx) => {
    //     tx.executeSql(
    //       `SELECT * FROM checkin 
    //        WHERE datetimephone_out IS NULL 
    //        ORDER BY datetimephone_in DESC 
    //        LIMIT 1`,
    //       [],
    //       (_, results) => {
    //         if (results.rows.length > 0) {
    //           console.log("Latest Active Check-in Data:", results.rows.item(0));
    //           setCheckinData(results.rows.item(0));
    //         } else {
    //           console.log("No Active Check-in Found");
    //           setCheckinData(null); // Pastikan ini dipanggil agar card tidak muncul
    //         }
    //       },
    //       (error) => console.error("Error fetching latest check-in:", error)
    //     );
    //   });
    // }


    const getLatestCheckin = () => {
      db.transaction((tx) => {
        tx.executeSql(
          `SELECT * FROM checkin WHERE datetimephone_out IS NULL ORDER BY datetimephone_in DESC LIMIT 1`, 
          [],
          (_, results) => {
            if (results.rows.length > 0) {
              const latestCheckin = results.rows.item(0);
              setCheckinData(latestCheckin);  // Simpan data check-in ke state
              setIsCheckedIn(true);  // Ubah status check-in menjadi aktif
            } else {
              setCheckinData(null);  // Kosongkan data check-in
              setIsCheckedIn(false);  // Ubah status check-in menjadi tidak aktif
            }
          },
          (error) => console.error("❌ Error fetching latest check-in:", error)
        );
      });
    };


   // Ambil project_id dari database SQLite
   const getProjectIdFromDB = () => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT project_id FROM lokasi_toko LIMIT 1`,
        [],
        (_, results) => {
          if (results.rows.length > 0) {
            setProjectId(results.rows.item(0).project_id);
          } else {
            setProjectId(null);
          }
        },
        (error) => console.error("Error fetching project_id:", error)
      );
    });
  };


   // Navigasi ke halaman check-in
  const goToCheckin = () => {
    navigation.navigate("CheckinFix");
  }

  
    const [lockedIcons, setLockedIcons] = useState({
      absensi: false,
      lembur: false,
      tambahLokasi: false,
      profile: false,
      riwayatCio: false,
      riwayatSellOut: false
    });

    const toggleLock = (key) => {
      setLockedIcons((prev) => ({
        ...prev,
        [key]: !prev[key] // Toggle status terkunci
      }));
    };
  
  
    useEffect(() => {
      changeNavigationBarColor('#204766', true);
  
      const backAction = () => {
        Alert.alert(
          "Apps Traxes",
          "Ingin keluar dari aplikasi Traxes?",
          [
            { text: "Tidak", onPress: () => null, style: "cancel" },
            { text: "Keluar", onPress: () => BackHandler.exitApp() }
          ]
        );
        return true;
      };
  
      const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
      return () => backHandler.remove();
    }, []);
  
    useEffect(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(translateY, { toValue: -8, duration: 1000, useNativeDriver: true }),
          Animated.timing(translateY, { toValue: 0, duration: 500, useNativeDriver: true }),
        ])
      ).start();
    }, [translateY]);
  
    useEffect(() => {
      const fetchUserProfile = async () => {
        try {
          const data = await getusersprofile();
          setUserData(data || null);
        } catch (error) {
          console.error("Error, users profile..", error);
        } finally {
          setLoading(false);
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

  
    if (loading) return null; // Bisa diganti dengan spinner/loading indicator


    return (
      <View style={styles.container}>
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
        {/* <LinearGradient colors={['#000000', '#000000']} style={styles.gradient} /> */}

        <LinearGradient colors={['#204766', '#631D63']} style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('CustomerListNewBelow')}>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Menu Utama</Text>
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
        <Text style={styles.textNama}>{userData?.fullname}</Text>
        <Text style={styles.textNip}>{userData?.employee_id}</Text>
        <Text style={styles.textJabatan}>{userData?.type_id}</Text>
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

{checkinData ? (
  // Jika sudah check-in, tampilkan card detail check-in dengan navigasi ke DashboardToko
  // <TouchableOpacity 
  //   style={styles.card}
  //   onPress={() => navigation.navigate('DashboardToko2', { 
  //     customer_id: checkinData.customer_id, 
  //     project_id: checkinData.project_id 
  //   })}
  // >
  //   <Text style={styles.title}>Detail Check-in</Text>
  //   <Text>ID: {checkinData.customer_id}</Text>
  //   <Text>Jarak: {checkinData.distance_in} meter</Text>
  //   {checkinData.foto_in ? (
  //     <Image source={{ uri: checkinData.foto_in }} style={styles.image} />
  //   ) : null}
  // </TouchableOpacity>

  <LinearGradient
  colors={['#631D63', '#204766', '#631D63']} // Warna gradient (dari oranye ke merah)
  style={styles.cardGradient}
>
  <TouchableOpacity 
    style={styles.card} 
    onPress={() => navigation.navigate('DashboardToko2', { 
      customer_id: checkinData.customer_id, 
      project_id: checkinData.project_id 
    })}
  >
    <Text style={styles.title}>Detail Check-in</Text>
    <Text style={styles.title2}>ID: {checkinData.customer_id}</Text>
    <Text style={styles.title2}>Jarak: {checkinData.distance_in} meter</Text>
    {checkinData.foto_in ? (
      <Image source={{ uri: checkinData.foto_in }} style={styles.image} />
    ) : null}
  </TouchableOpacity>
</LinearGradient>

) : (
  // Jika belum check-in, tampilkan tombol check-in
  <TouchableOpacity style={styles.btncheckin} onPress={() => navigation.navigate('CustomerListNewBelow')}>
    <BtnCheckin />
    {/* <Image source={require('../../assets/btncheckin.png')} style={styles.btncheckin} /> */}
  </TouchableOpacity>
)}


            <TouchableOpacity style={styles.sideImage}
              onPress={() => navigation.navigate('downloaddataoffline2', { project_id: projectId })}
            >
              <BtnDownload />
              {/* <Image source={require('../../assets/btndownload.png')} style={styles.sideImage} /> */}
            </TouchableOpacity>

          </View>
  
           {/* Baris Icon */}
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
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('RiwayatCio')}>
            <ProfileIcon />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={showMaintenanceDialog}>
            <RiwayatCioIcon />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={showMaintenanceDialog}>
            <RiwayatSellOutIcon />
        </TouchableOpacity>
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
      marginTop: 10,
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
        height: 72,
        marginRight: 25,
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

  cardGradient: {
    width: '70%',
    borderRadius: 10,
    elevation: 3,
    alignItems: 'center',
    marginLeft: 17,
    height: 70, // Tinggi card lebih besar agar gambar cukup
    padding: 1, // Untuk efek border gradient
  },
  card: {
    flex: 1,
    width: '100%',
    backgroundColor: 'transparent', // Agar warna tidak menimpa gradient
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  title2: {
    fontSize: 14,
    fontWeight: 'normal',
    color: 'white',
  },
  image: {
    width: 0,
    height: 0,
    borderRadius: 10,
    marginTop: 5,
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { width: '80%', backgroundColor: 'white', borderRadius: 10, padding: 20, alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#204766' },
  modalMessage: { fontSize: 16, marginBottom: 20, textAlign: 'center', color: '#333' },
  modalButtonsRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  modalButton: { flex: 1, padding: 10, marginHorizontal: 5, borderRadius: 5, backgroundColor: '#204766', alignItems: 'center' },
  modalButtonText: { color: 'white', fontWeight: 'bold' }
  });
  
  export default DashboardUtama;
  