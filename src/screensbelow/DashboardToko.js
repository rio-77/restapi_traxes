import { Image, StyleSheet, View, Text, StatusBar, TouchableOpacity, Animated, Dimensions, Alert } from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import React, { useRef, useEffect, useState } from 'react';
import axios from "axios";
import { getUserProfile } from '../../helper/SQLite'; // Pastikan path-nya sesuai dengan struktur project Anda
import { getUserDataProfile } from '../../helper/SQLite';
// import { getUserProfile } from '../../helper/SQLite';


// tinggilayar
const { height } = Dimensions.get('window');

const DashboardTokoBelow = ({route, navigation }) => {
    // animation
    const translateY = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(translateY, {
              toValue: -8, // Gerakan naik sejauh 50px
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(translateY, {
              toValue: 0, // Kembali ke posisi awal
              duration: 500,
              useNativeDriver: true,
            }),
          ])
        ).start();
      }, [translateY]);



      // const [userProfile, setUserProfile] = useState(null);

      // useEffect(() => {
      //   getUserDataProfile((data) => {
      //     if (data) {
      //       setUserProfile(data); // Set data yang didapat dari SQLite
      //     } else {
      //       console.log('No user data found');
      //     }
      //   });
      // }, []);
      // if (!userProfile) {
      //   return <Text>Loading..</Text>;
      // }

      const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    // Mendapatkan data profil berdasarkan employee_id (NIK) yang disimpan di SQLite
    const employeeId = '21530826'; // Ganti dengan employee_id yang sesuai
    getUserProfile(employeeId, (profile) => {
      if (profile) {
        setUserProfile(profile);
      } else {
        console.log('No profile data found');
      }
    });
  }, []);
  // Menampilkan data profil
  if (!userProfile) {
    return <Text> </Text>;
  }


    return (
        <View style={homeStyles.container} >

{/* <Text style={homeStyles.info}>Full Name: {userProfile.fullname}</Text>
      <Text style={homeStyles.info}>Type ID: {userProfile.type_id}</Text>
      <Text style={homeStyles.info}>Employee ID: {userProfile.employee_id}</Text> */}


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
                <Text style={homeStyles.textnama}>  {userProfile.fullname} </Text>
                <Text style={homeStyles.textnip}> {userProfile.employee_id} </Text>
                <Text style={homeStyles.textjabatan}> {userProfile.type_id} </Text>
                </View>
                </LinearGradient>
            </View>





{/* end */}
        </View>
    );
};

const homeStyles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white' },
    imageprofile: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#ffffff',
        marginLeft: '10%',
        marginTop: '10%',
    },
    head: {
        marginTop: '0%',
    },
    setttextprofile: {
        marginLeft: '40%',
        marginTop: '-24%',
    },
    textnama: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    textnip: {
        fontSize: 17,
        fontWeight: 'normal',
        marginLeft: '3%',
        color: '#ffffff',
    },
    textjabatan: {
        fontSize: 17,
        fontWeight: 'normal',
        marginLeft: '3%',
        color: '#ffffff',
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
        height: '50%',
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
        flexDirection: "row", // Align items horizontally
        // alignItems: "center",
        marginBottom: 15,
      },
      row3: {
        flexDirection: "row", // Align items horizontally
        // alignItems: "center",
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
        borderRadius:50, // Sesuaikan nilai untuk mengatur tingkat kebulatan
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
        flexDirection: 'row', // Mengatur arah menjadi horizontal
        justifyContent: 'space-around', // Mengatur jarak antar elemen
        padding: 13,
      },
      rowicontwo: {
        marginTop: 0,
        flexDirection: 'row', // Mengatur arah menjadi horizontal
        justifyContent: 'space-around', // Mengatur jarak antar elemen
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
        backgroundColor: '#ffffff', // Warna background rectangle
        borderRadius: 15, // Sesuaikan kebulatan sudut
        justifyContent: 'center', // Mengatur konten agar berada di tengah secara vertikal
        alignItems: 'center', // Mengatur konten agar berada di tengah secara horizontal
        marginTop: '-150%',
      },
      buttonDownloadBelow: {
        backgroundColor: '#8AFFD5', // Warna tombol
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

export default DashboardTokoBelow;
