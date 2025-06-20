import { BackHandler, Image, StyleSheet, View, Text, StatusBar, TouchableOpacity, Animated, Dimensions, Alert } from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import React, { useRef, useEffect, useState, useFocusEffect, useCallback  } from 'react';
import { getusersprofile } from '../../helper/login';
import { getLokasiTokoByProjectId } from '../../helper/sqliteservice';
// import { getLokasiToko } from '../../services/sqliteService'; // Import fungsi SQLite
import AbsensiIcon from "../component/icon/ic_sellin";
import LemburIcon from "../component/icon/ic_sellout";
import TambahLokasiIcon from "../component/icon/ic_display";
import ProfileIcon from "../component/icon/ic_displaymbd";
import RiwayatCioIcon from "../component/icon/ic_promokompetitor";
import RiwayatSellOutIcon from "../component/icon/ic_struk";
import PianogramIcon from "../component/icon/ic_pianograma";
import PricetagIcon from "../component/icon/ic_pricetag";
import SurveyIcon from "../component/icon/ic_survey";
import CheckinBtn from "../component/icon/checkoutbtn"
import DownloadBtn from "../component/icon/downloadbtn"
import { openDatabase } from 'react-native-sqlite-storage';
import { useRoute } from '@react-navigation/native';

const db = openDatabase({ name: 'lokasi_toko.db', location: 'default' });
// tinggilayar
const { height } = Dimensions.get('window');
const DashboardToko = ({navigation }) => {
  const [userData, setUserData] = useState(null); // Menyimpan data pengguna
  const [loading, setLoading] = useState(true);  // Status loading untuk menunggu data
  const [tokoData, setTokoData] = useState(null); // State untuk data toko
  const [customer, setCustomer] = useState(null);


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

  useEffect(() => {
      console.log("Route Params:", route.params);

      if (!customer_id || !project_id) {
          Alert.alert("Kesalahan", "customer_id atau project_id tidak tersedia!");
          return;
      }

      console.log("Mencari toko dengan customer_id:", customer_id);

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
  }, [customer_id, project_id]);


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
  // Jika data belum siap (loading)
  if (loading) {
    return; // Bisa menggunakan spinner loading di sini jika diinginkan
  }

    return (
        <View style={homeStyles.container} >
            {/* start */}
             <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
             {/* <LinearGradient
                colors={['#ffffff', '#ffffff']} // Start and end colors
                style={homeStyles.gradient} 
             >
            </LinearGradient> */}

            <LinearGradient colors={['#204766', '#631D63']} style={homeStyles.header}>
                            <TouchableOpacity onPress={() => navigation.navigate('CustomerListNewBelow')}>
                            </TouchableOpacity>
                            <Text style={homeStyles.headerTitle}>Dashboard Toko</Text>
                          </LinearGradient>

            {/* head */}
            <View style={homeStyles.head} >
                <LinearGradient
                    colors={['#631D63', '#204766', '#631D63']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={homeStyles.gradient_header}
                >
                <Image style={homeStyles.imageprofile} />
                {/* text-profile */}
                <View style={homeStyles.setttextprofile}>
                <Text style={homeStyles.textnama}>  {toko?.customer_name} </Text>
                <Text style={homeStyles.textnip}> {toko?.address} </Text>
                <Text style={homeStyles.textjabatan}> {toko?.customer_id} </Text>
                <Text style={homeStyles.textloginTime}>
                    {/* {userData?.login_time ? new Date(userData.login_time).toLocaleString() : 'Tidak ada tgl Login!'} */}
                </Text>
                </View>
                </LinearGradient>
            </View>
            

            {/* <TouchableOpacity style={homeStyles.DownloadBtn} onPress={() => navigation.navigate('DownloadNew')}>
                  <DownloadBtn />
            </TouchableOpacity> */}
{/* row one */}
              <View style={homeStyles.rowiconone}>
                <TouchableOpacity style={homeStyles.icriwayatcico}>
                  <AbsensiIcon />
                </TouchableOpacity>
                <TouchableOpacity style={homeStyles.icriwayatsellout}>
                  <LemburIcon />
                </TouchableOpacity>
                <TouchableOpacity style={homeStyles.icverifikasimbd}>
                  <TambahLokasiIcon />
                </TouchableOpacity>
              </View>
 {/* row two */}
              <View style={homeStyles.rowicontwo}>
                <TouchableOpacity style={homeStyles.icriwayatcico}>
                  <ProfileIcon />
                </TouchableOpacity>
                <TouchableOpacity style={homeStyles.icriwayatsellout}>
                  <RiwayatCioIcon />
                </TouchableOpacity>
                <TouchableOpacity style={homeStyles.icverifikasimbd}>
                  <RiwayatSellOutIcon />
                </TouchableOpacity>
              </View>
{/* row three */}
<View style={homeStyles.rowicontwo}>
                <TouchableOpacity style={homeStyles.icriwayatcico}>
                  <PianogramIcon />
                </TouchableOpacity>
                <TouchableOpacity style={homeStyles.icriwayatsellout}>
                  <PricetagIcon />
                </TouchableOpacity>
                <TouchableOpacity style={homeStyles.icverifikasimbd}>
                  <SurveyIcon />
                </TouchableOpacity>
              </View>
            {/* <View style={homeStyles.rowiconthree}>
              <TouchableOpacity style={homeStyles.icverifikasimbd}>
                <VerifikasiMbdIcon />
              </TouchableOpacity>
              <TouchableOpacity style={homeStyles.icpengaturan}>
                <PengaturanIcon />
              </TouchableOpacity>
            </View> */}
            <View style={homeStyles.floatingButtonContainer}>
              <Animated.View style={[homeStyles.floatingButton, { transform: [{ translateY }] }]}>
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
{/* end */}
        </View>
    );
};

const homeStyles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white' },
      imageprofile: {
        width: 75,
        height: 75,
        borderRadius: 100,
        backgroundColor: '#ffffff',
        marginLeft: '3%',
        marginTop: '5%',
    },
    head: {
      marginTop: 10,
      marginHorizontal: 15, 
    },
    setttextprofile: {
        marginLeft: '25.5%',
        marginTop: '-22.5%',
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
    textloginTime: {
      fontSize: 10,
      marginTop: 25,
      fontWeight: 'normal',
      marginLeft: '60%',
      color: '#FFE500',
    },
    textemployee: {
        fontSize: 17,
        fontWeight: 'normal',
        marginLeft: '1%',
        color: '#ffffff',
    },
    gradient: {
     height: 25,
    },
    gradient_header: {
        width: '100%',
        height: '45%',
        borderRadius: 20,
      },
      rectangledownload: {
        width: '80%',
        height: 60,
        marginLeft: '10%',
        backgroundColor: '#D6F1FF',
        borderRadius: 25,
        marginTop: '-39%',
      },
      buttoncheckin: {
        marginTop: '-50%',
      },
      row2: {
        flexDirection: "row",
        marginBottom: 15,
      },
      row3: {
        flexDirection: "row",
        marginBottom: 15,
        marginTop: 0,
      },
      imagedownload: {
        width: '18%',
        height: 40,
        marginTop: '3%',
        marginLeft: '7%',
      },
      textdownload: {
        fontWeight: 'bold',
        fontSize: 20,
        marginTop: '6%',
        marginLeft: '5%',
      },
      containerrowcounter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 5,
        marginTop: 7,
      },
      oval: {
        marginTop: '7%',
        width: 88,
        height: 88,
        borderRadius:50,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 0,
      },
      textkunjungan: {
        color: '#204766',
        textAlign: 'center',
        marginTop: 27,
      },
      textsellout: {
        color: '#204766',
        textAlign: 'center',
        marginTop: 27,
      },
      texttotalselling: {
        color: '#204766',
        textAlign: 'center',
        marginTop: 27,
      },
      textrow: {
        color: '#204766',
        textAlign: 'center',
        fontFamily: 'Poppins',
        fontWeight: 'bold',
      },
      textangkatotalvisit: {
        color: '#274366',
        textAlign: 'center',
        fontFamily: 'Poppins',
        fontWeight: 'bold',
        fontSize: 14,
        margintop: 10,
      },
      texttotalvisit: {
        color: '#274366',
        textAlign: 'center',
        fontFamily: 'Poppins',
        fontWeight: 'normal',
        fontSize: 12,
        margintop: '0%',
      },
      textpenjualanhariini: {
        color: '#274366',
        textAlign: 'center',
        fontFamily: 'Poppins',
        fontWeight: 'normal',
        fontSize: 12,
      },
      textrppenjualanhariini: {
        color: '#274366',
        textAlign: 'center',
        fontFamily: 'Poppins',
        fontWeight: 'normal',
        fontSize: 12,
        margintop: 0,
      },
      texthargapenjualanhariini: {
        color: '#274366',
        textAlign: 'center',
        fontFamily: 'Poppins',
        fontWeight: 'bold',
        fontSize: 14,
        margintop: 0,
      },
      textpenjualanbulanini: {
        color: '#274366',
        textAlign: 'center',
        fontFamily: 'Poppins',
        fontWeight: 'normal',
        fontSize: 12,
      },
      textrppenjualanbulanini: {
        color: '#274366',
        textAlign: 'center',
        fontFamily: 'Poppins',
        fontWeight: 'normal',
        fontSize: 12,
        margintop: 0,
      },
      texthargapenjualanbulanini: {
        color: '#274366',
        textAlign: 'center',
        fontFamily: 'Poppins',
        fontWeight: 'bold',
        fontSize: 14,
        margintop: 0,
      },
      rowiconone: {
        marginTop: '-40%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 13,
      },
      rowicontwo: {
        marginTop: '-5%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 13,
      },
      rowiconthree: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft: 30,
        margintop: '0%',
      },
      icdisplay: {
        marginTop: '-40%',
      },
      icriwayatcico: {
        marginTop: '0%',
      },
      icverifikasimbd: {
        marginTop: '0%',
      },
      CheckinBtn: {
        alignSelf: 'center',
        marginTop: '0%',
      },
      DownloadBtn: {
        alignSelf: 'center',
        marginTop: '0%',
      },
      icriwayatsellout: {
        marginTop: '0%',
      },
      icpengaturan: {
        paddingLeft: 40,
        marginTop: '0%',
      },
      iclembur: {
        marginTop: '-40%',
      },
      icizin: {
        marginTop: '0%',
      },
      iccheckin: {
        marginTop: '0%',
      },
      ictambahlokasi: {
        marginTop: '0%',
      },
      rectangleDownloadBelow: {
        width: '90%',
        height: 55,
        marginHorizontal: '5%',
        backgroundColor: '#ffffff',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '-150%',
      },
      buttonDownloadBelow: {
        backgroundColor: '#8AFFD5',
        width: '85%',
        height: '100%',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '-85%',
      },
      textDownloadBelow: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 18,
      },
    boxCounter1: {
        width: '20%',
        height: 70,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        marginLeft: '12',
    },
    boxCounter2: {
      width: '35%',
      height: 70,
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
  },
  boxCounter3: {
    width: '35%',
    height: 70,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginRight: 15,
},
    textContainer: {
    },
    textContainer2: {
      alignItems: 'center',
      margintop: 5,
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 5, 
    alignSelf: 'center', 
    
  },
  floatingButton: {
    backgroundColor: 'transparent', 
    borderRadius: 50,
    elevation: 0, 
    transform: [{ scale: 0.10 }], // Perkecil ukuran tombol dengan skala
    
  },
  header: { height: '24px', padding: 20, flexDirection: 'row', alignItems: 'center' },
  icBack: { width: '20', height: '20', marginTop: 20 },
  headerTitle: { fontSize: 20, color: 'white', marginLeft: 10, marginTop: 20 },
});
export default DashboardToko;