import { BackHandler, Image, StyleSheet, View, Text, StatusBar, TouchableOpacity, Animated, Dimensions, Alert } from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import React, { useRef, useEffect, useState } from 'react';
import { getusersprofile } from '../../helper/login';
import AbsensiIcon from "../component/icon/absensi";
import LemburIcon from "../component/icon/lembur";
import TambahLokasiIcon from "../component/icon/tambahlokasi";
import ProfileIcon from "../component/icon/profile";
import RiwayatCioIcon from "../component/icon/riwayatcio";
import RiwayatSellOutIcon from "../component/icon/riwayatsellout";
import VerifikasiMbdIcon from "../component/icon/verifikasimbd";
import PengaturanIcon from "../component/icon/pengaturan";
import CheckinBtn from "../component/icon/checkinbtn"
import DownloadBtn from "../component/icon/downloadbtn"
// tinggilayar
const { height } = Dimensions.get('window');
const HomeScreenAlt = ({route, navigation }) => {
  const [userData, setUserData] = useState(null); // Menyimpan data pengguna
  const [loading, setLoading] = useState(true);  // Status loading untuk menunggu data
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
             <LinearGradient
                colors={['#204766', '#631D63']} // Start and end colors
                style={homeStyles.gradient} 
             >
            </LinearGradient>
            {/* head */}
            <View style={homeStyles.head} >
                <LinearGradient
                    colors={['#204766', '#631D63']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={homeStyles.gradient_header}
                >
                <Image style={homeStyles.imageprofile}/>
                {/* text-profile */}
                <View style={homeStyles.setttextprofile}>
                <Text style={homeStyles.textnama}>  {userData.fullname} </Text>
                <Text style={homeStyles.textnip}> {userData.employee_id} </Text>
                <Text style={homeStyles.textjabatan}> {userData.type_id} </Text>
                <Text style={homeStyles.textloginTime}>
                    {userData?.login_time ? new Date(userData.login_time).toLocaleString() : 'Tidak ada tgl Login!'}
                </Text>
                </View>
                </LinearGradient>
            </View>
            <TouchableOpacity style={homeStyles.CheckinBtn} onPress={() => navigation.navigate('CustomerListNewBelow')}>
                  <CheckinBtn />
            </TouchableOpacity>
            <View style={homeStyles.containerrowcounter}>
    <LinearGradient
        colors={['#FFDF60', '#FFDF60']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={homeStyles.boxCounter1}
    >
        <View style={homeStyles.textContainer}>
            <Text style={homeStyles.texttotalvisit}>Total Visit</Text>
            <Text style={homeStyles.textangkatotalvisit}>10</Text>
        </View>
    </LinearGradient>

    <LinearGradient
        colors={['#FFDF60', '#FFDF60']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={homeStyles.boxCounter2}
    >
        <View style={homeStyles.textContainer}>
            <Text style={homeStyles.textpenjualanhariini}>Penjualan Hari ini:</Text>
            <Text style={homeStyles.textrppenjualanhariini}>(Rp.)</Text>
            {/* <Text style={homeStyles.tetexttotalvisittrow}>(Rp.)</Text> */}
            <Text style={homeStyles.texthargapenjualanhariini}>1.500.000</Text>
        </View>
    </LinearGradient>

    <LinearGradient
        colors={['#FFDF60', '#FFDF60']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={homeStyles.boxCounter3}
    >
        <View style={homeStyles.textContainer}>
            <Text style={homeStyles.textpenjualanbulanini}>Penjualan Bulan ini:</Text>
            <Text style={homeStyles.textrppenjualanbulanini}>(Rp.)</Text>
            {/* <Text style={homeStyles.tetexttotalvisittrow}>(Rp.)</Text> */}
            <Text style={homeStyles.texthargapenjualanbulanini}>1.500.000</Text>
        </View>
    </LinearGradient>
</View>
            <TouchableOpacity style={homeStyles.DownloadBtn} onPress={() => navigation.navigate('DownloadNew')}>
                  <DownloadBtn />
            </TouchableOpacity>
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
            <View style={homeStyles.rowiconthree}>
              <TouchableOpacity style={homeStyles.icverifikasimbd}>
                <VerifikasiMbdIcon />
              </TouchableOpacity>
              <TouchableOpacity style={homeStyles.icpengaturan}>
                <PengaturanIcon />
              </TouchableOpacity>
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
        marginLeft: '7%',
        marginTop: '5%',
    },
    head: {
        marginTop: '0%',
    },
    setttextprofile: {
        marginLeft: '31%',
        marginTop: '-20.5%',
    },
    textnama: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
    },
      textnip: {
        fontSize: 16,
        fontWeight: 'normal',
        marginLeft: '3%',
        color: '#ffffff',
    },
    textjabatan: {
        fontSize: 16,
        fontWeight: 'normal',
        marginLeft: '3%',
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
        borderRadius: 0,
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
        marginTop: 5,
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 13,
      },
      rowicontwo: {
        marginTop: '-4%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 13,
      },
      rowiconthree: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft: 30,
        margintop: '-0%',
      },
      icdisplay: {
        marginTop: '-40%',
      },
      icriwayatcico: {
        marginTop: '0%',
      },
      icverifikasimbd: {
        marginTop: '-2.5%',
      },
      CheckinBtn: {
        alignSelf: 'center',
        marginTop: '-38%',
      },
      DownloadBtn: {
        alignSelf: 'center',
        marginTop: '2%',
      },
      icriwayatsellout: {
        marginTop: '-2%',
      },
      icpengaturan: {
        paddingLeft: 40,
        marginTop: '-2.5%',
      },
      iclembur: {
        marginTop: '-40%',
      },
      icizin: {
        marginTop: '-40%',
      },
      iccheckin: {
        marginTop: '-35%',
      },
      ictambahlokasi: {
        marginTop: '-35%',
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
});
export default HomeScreenAlt;