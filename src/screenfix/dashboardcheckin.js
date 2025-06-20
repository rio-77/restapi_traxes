import { 
    BackHandler, Image, StyleSheet, View, Text, StatusBar, 
    TouchableOpacity, Animated, Dimensions, Alert, ScrollView, Platform
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
  
  const { width, height } = Dimensions.get('window');
  
  const DashboardCheckin = ({ route, navigation }) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const translateY = useRef(new Animated.Value(0)).current;
    const [projectId, setProjectId] = useState(null);

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
  
          {/* Tombol Check-in dan Download */}
          <View style={styles.imageRow}>
            <TouchableOpacity onPress={() => navigation.navigate('CustomerListNewBelow')}>
              <Image source={require('../../assets/btncheckin.png')} style={styles.btncheckin} />
            </TouchableOpacity>

            <TouchableOpacity 
  onPress={() => navigation.navigate('downloaddataoffline2', { project_id: projectId })}
>
  <Image source={require('../../assets/btndownload.png')} style={styles.sideImage} />
</TouchableOpacity>
          </View>
  
          {/* Icon Rows */}
          <View style={styles.rowIcons}>
        <TouchableOpacity style={styles.iconButton}>
            <AbsensiIcon />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}>
            <LemburIcon />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}>
            <TambahLokasiIcon />
        </TouchableOpacity>
      </View>





          <View style={styles.rowIcons}>
        <TouchableOpacity style={styles.iconButton}>
            <ProfileIcon />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}>
            <RiwayatCioIcon />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}>
            <RiwayatSellOutIcon />
        </TouchableOpacity>
      </View>


        </ScrollView>
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
  });
  
  export default DashboardCheckin;
  