import React, {useState,useEffect, useRef  } from 'react';
import { useNavigation } from '@react-navigation/native';
import { db } from '../../dboffline/db_traxes';
import { Image, StyleSheet, View, Text, StatusBar, TouchableOpacity, Animated, Dimensions, Alert } from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import { getusersprofile } from '../../helper/login';
// Mendapatkan tinggi layar perangkat
const { height } = Dimensions.get('window');
const ProfileScreen = ({ route }) => {
//nav wajib di atas
const navigation = useNavigation();
const [userData, setUserData] = useState(null); // Menyimpan data pengguna
  const [loading, setLoading] = useState(true);  // Status loading untuk menunggu data
   // Animasi untuk gambar (opsional)
    const translateY = useRef(new Animated.Value(0)).current;
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
              console.log("Tidak ada Users pengguna ditemukan!");
            }
          } catch (error) {
            console.error("Error fetching user profile:", error);
          } finally {
            setLoading(false); // Data berhasil diambil, hentikan loading
          }
        };
        fetchUserProfile();
      }, []);
      // Jika data belum siap (loading)
      if (loading) {
        return ; // Bisa menggunakan spinner loading di sini jika diinginkan
      }
  const handleLogout = () => {
    db.transaction((tx) => {
      tx.executeSql('DELETE FROM user;', [], () => {
        console.log('User logged out');
        navigation.replace('LoginScreenBelow');
      });
    });
  };
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
            <View style={homeStyles.viewBtn}>
                              <TouchableOpacity style={{ width: '100%' }}onPress={handleLogout}>
                                  <LinearGradient
                                      colors={['#204766', '#631D63']}
                                      style={homeStyles.btn}>
                                      <Text style={homeStyles.txtBtn}>Keluar Aplikasi</Text>
                                  </LinearGradient>
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
  viewBtn: {
    position: 'absolute',
    bottom: 0,
    height: window.height * 0.1,
    width: '100%',
    paddingTop: 15,
    paddingLeft:15,
    paddingRight:15,
    paddingBottom: 15,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    width: '100%',
    borderRadius: 10,
    padding: 15,
    backgroundColor: '#204766',
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtBtn: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
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
      justifyContent: 'space-around',
      marginTop: -9,
      flex: 1,
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
    rowiconone: {
      marginTop: 0,
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 13,
    },
    rowicontwo: {
      marginTop: 0,
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 13,
    },
    icdisplay: {
      marginTop: '-40%',
    },
    icriwayatcico: {
      marginTop: '-25%',
    },
    icriwayatsellout: {
      marginTop: '-27%',
    },
    icverifikasimbd: {
      marginTop: '-25%',
    },
    icpengaturan: {
      marginTop: '-25%',
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
});
export default ProfileScreen;


