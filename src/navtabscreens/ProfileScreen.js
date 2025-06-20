import React, {useState,useEffect, useRef  } from 'react';
import { useNavigation } from '@react-navigation/native';
import { db } from '../../dboffline/db_traxes';
import { Image, StyleSheet, View, Text, StatusBar, TouchableOpacity, Animated, Dimensions, Alert, ScrollView } from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import { getusersprofile } from '../../helper/login';
import Modal from 'react-native-modal';

// Mendapatkan tinggi layar perangkat
const { height, width } = Dimensions.get('window');
const ProfileScreen = ({ route }) => {

  // popoupdaribawah
  const [isModalVisible, setModalVisible] = useState(false);
  const handlePrivacyPolicy = () => {
    setModalVisible(true);
  };

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


      const confirmLogout = () => {
        Alert.alert(
          "Konfirmasi Logout",
          "Apakah Anda yakin ingin keluar?",
          [
            {
              text: "Batal",
              style: "cancel"
            },
            {
              text: "Logout",
              onPress: handleLogout
            }
          ],
          { cancelable: false }
        );
      };
      



  const handleLogout = () => {
    db.transaction((tx) => {
      tx.executeSql('DELETE FROM user;', [], () => {
        console.log('User logged out');
        navigation.replace('LoginScreenBelow');
      });
    });
  };

//   const handlePrivacyPolicy = () => {
//     navigation.navigate('PrivacyPolicyScreen');
// };

  return (
      <View style={homeStyles.container} >
                {/* start */}
                 <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
                 {/* <LinearGradient
                    colors={['#000000', '#000000']} // Start and end colors
                    style={homeStyles.gradient} 
                 >
                </LinearGradient> */}

                <LinearGradient colors={['#204766', '#631D63']} style={homeStyles.header}>
                                <TouchableOpacity onPress={() => navigation.navigate('CustomerListNewBelow')}>
                                </TouchableOpacity>
                                <Text style={homeStyles.headerTitle}>Menu Profile</Text>
                              </LinearGradient>


                 {/* Header */}
                          <View style={homeStyles.head}>
                  <LinearGradient colors={['#631D63', '#204766', '#631D63']} style={homeStyles.gradient_header}>
                    <View style={homeStyles.profileContainer}> 
                      {/* Foto Profil */}
                      <Image 
                        style={homeStyles.imageProfile} 
                        source={userData?.profile_picture ? { uri: userData.profile_picture } : require('../../assetss/ic_profile.png')}
                      />
                      {/* Informasi Profil */}
                      <View style={homeStyles.profileText}>
                        <Text style={homeStyles.textNama}>{userData?.fullname}</Text>
                        {/* <Text style={homeStyles.textNip}>{userData?.employee_id}</Text>
                        <Text style={homeStyles.textJabatan}>{userData?.type_id}</Text> */}
                      </View>
                    </View>
                  </LinearGradient>
                </View>


 <ScrollView contentContainerStyle={homeStyles.scrollContainer}>
                {/* Tambahan untuk menampilkan NIP */}
<View style={homeStyles.nipContainer1}>
  <Text style={homeStyles.nipLabel}>Nomor Induk Pegawai</Text>
  <Text style={homeStyles.nipValue}>{userData?.employee_id}</Text>
</View>

                {/* Tambahan untuk menampilkan Jabatan */}
                <View style={homeStyles.nipContainer2}>
  <Text style={homeStyles.nipLabel}>Posisi/Jabatan</Text>
  <Text style={homeStyles.nipValue}>{userData?.type_id}</Text>
</View>

{/* Tambahan untuk menampilkan Penempatan */}
<View style={homeStyles.nipContainer3}>
  <Text style={homeStyles.nipLabel}>Penempatan/Cover</Text>
  <Text style={homeStyles.nipValue}> - </Text>
</View>

{/* Tambahan untuk menampilkan Tgl Lahir  */}
<View style={homeStyles.nipContainer4}>
  <Text style={homeStyles.nipLabel}>Tanggal Lahir</Text>
  <Text style={homeStyles.nipValue}> - </Text>
</View>

{/* Tambahan untuk menampilkan Tgl Lahir  */}
<View style={homeStyles.nipContainer5}>
  <Text style={homeStyles.nipLabel}>Project</Text>
  <Text style={homeStyles.nipValue}>{userData?.project_id}</Text>
</View>

 {/* Privacy Policy Card */}
 <View style={homeStyles.viewBtn1}>
 <TouchableOpacity style={{ width: '100%' }}onPress={handlePrivacyPolicy}>
                                  <LinearGradient
                                      colors={['#C4E0F7', '#C4E0F7']}
                                      style={homeStyles.btn1}>
                                     <Text style={homeStyles.privacyText}>Informasi Kebijakan Privasi</Text>
                                     <Text style={homeStyles.privacyLink}>Klik disini untuk membaca kebijakan privasi</Text>
                                  </LinearGradient>
                              </TouchableOpacity>   

                                {/* Modal */}
      <Modal 
        isVisible={isModalVisible} 
        onBackdropPress={() => setModalVisible(false)} 
        style={homeStyles.modal}>
        <View style={homeStyles.modalContent}>
          <Text style={homeStyles.modalTitle}>Apps Traxes V-2</Text>

          <ScrollView style={{ maxHeight: 300 }}> 
          <Text style={homeStyles.modalTitle2}>Privacy Policy</Text>
      <Text style={homeStyles.modalText}>
        PT Siprama Cakrawala built the Cakrawala Mobile app as a Free app. 
        This SERVICE is provided by PT Siprama Cakrawala at no cost and is intended for use as is.
        
        This page is used to inform visitors regarding our policies with the collection, 
        use, and disclosure of Personal Information if anyone decided to use our Service.
        
        If you choose to use our Service, then you agree to the collection and use of 
        information in relation to this policy. The Personal Information that we collect 
        is used for providing and improving the Service. We will not use or share your 
        information with anyone except as described in this Privacy Policy.
        
        The terms used in this Privacy Policy have the same meanings as in our Terms and 
        Conditions, which are accessible at Cakrawala Mobile unless otherwise defined in 
        this Privacy Policy.
      </Text>

      <Text style={homeStyles.modalTitle2}>Information Collection and Use</Text>                   
      <Text style={homeStyles.modalText}>
      For a better experience, while using our Service, we may require you to provide us with certain personally identifiable information, including but not limited to Cakrawala Mobile HRIS. The information that we request will be retained by us and used as described in this privacy policy.

      The app does use third-party services that may collect information used to identify you.

      Link to the privacy policy of third-party service providers used by the app
      </Text>


      <Text style={homeStyles.modalTitle2}>Log Data</Text>                   
      <Text style={homeStyles.modalText}>
      We want to inform you that whenever you use our Service, in a case of an error in the app we collect data and information (through third-party products) on your phone called Log Data. This Log Data may include information such as your device Internet Protocol (�IP�) address, device name, operating system version, the configuration of the app when utilizing our Service, the time and date of your use of the Service, and other statistics.
      </Text>


      <Text style={homeStyles.modalTitle2}>Cookies</Text>                   
      <Text style={homeStyles.modalText}>
      Cookies are files with a small amount of data that are commonly used as anonymous unique identifiers. These are sent to your browser from the websites that you visit and are stored on your device's internal memory.

      This Service does not use these �cookies� explicitly. However, the app may use third-party code and libraries that use �cookies� to collect information and improve their services. You have the option to either accept or refuse these cookies and know when a cookie is being sent to your device. If you choose to refuse our cookies, you may not be able to use some portions of this Service.
      </Text>

      <Text style={homeStyles.modalTitle2}>Service Providers</Text>                   
      <Text style={homeStyles.modalText}>
      We may employ third-party companies and individuals due to the following reasons:

      To facilitate our Service;
      To provide the Service on our behalf;
      To perform Service-related services; or
      To assist us in analyzing how our Service is used.
      We want to inform users of this Service that these third parties have access to their Personal Information. The reason is to perform the tasks assigned to them on our behalf. However, they are obligated not to disclose or use the information for any other purpose.
      </Text>


      <Text style={homeStyles.modalTitle2}>Security</Text>                   
      <Text style={homeStyles.modalText}>
      We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.
      </Text>

      <Text style={homeStyles.modalTitle2}>Links to Other Sites</Text>                   
      <Text style={homeStyles.modalText}>
      This Service may contain links to other sites. If you click on a third-party link, you will be directed to that site. Note that these external sites are not operated by us. Therefore, we strongly advise you to review the Privacy Policy of these websites. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
      </Text>

      <Text style={homeStyles.modalTitle2}>Children�s Privacy</Text>                   
      <Text style={homeStyles.modalText}>
      These Services do not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13 years of age. In the case we discover that a child under 13 has provided us with personal information, we immediately delete this from our servers. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us so that we will be able to do the necessary actions.
      </Text>

      <Text style={homeStyles.modalTitle2}>Changes to This Privacy Policy</Text>                   
      <Text style={homeStyles.modalText}>
      We may update our Privacy Policy from time to time. Thus, you are advised to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page.

      This policy is effective as of 2022-08-01
      </Text>

      <Text style={homeStyles.modalTitle2}>Contact Us</Text>                   
      <Text style={homeStyles.modalText}>
      If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at itcare@spcakrawala.com.

      This privacy policy page was created at privacypolicytemplate.net and modified/generated by App Privacy Policy Generator
      </Text>




    </ScrollView>
          
          {/* <Text style={homeStyles.modalText}>Ini adalah isi kebijakan privasi...</Text> */}
          {/* <TouchableOpacity onPress={() => setModalVisible(false)} style={homeStyles.closeButton}>
            <Text style={homeStyles.closeButtonText}>Tutup</Text>
          </TouchableOpacity> */}
        </View>
      </Modal>
                {/* <Text style={homeStyles.privacyText}>Informasi Kebijakan Privasi</Text>
                <TouchableOpacity onPress={handlePrivacyPolicy}>
                    <Text style={homeStyles.privacyLink}>Klik di sini untuk membaca kebijakan privasi</Text>
                </TouchableOpacity> */}
            </View>

</ScrollView>
 
            <View style={homeStyles.viewBtn}>
                              <TouchableOpacity style={{ width: '100%' }}onPress={confirmLogout}>
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

  privacyCard: {
    backgroundColor: '#000000', padding: 20, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center', marginHorizontal: 15, marginBottom: 20
},
privacyText: { color: 'black', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
privacyLink: { color: '#0048D4', fontSize: 14, textDecorationLine: 'underline', marginTop: 5 },


  imageprofile: {
    width: 75,
    height: 75,
    borderRadius: 100,
    backgroundColor: '#ffffff',
    marginLeft: '7%',
    marginTop: '5%',
},
head: {
  marginTop: 10,
  marginHorizontal: 15, 
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
    paddingBottom: 70,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewBtn1: {
    position: '',
    bottom: 0,
    height: window.height * 0.1,
    width: '100%',
    paddingTop: 15,
    paddingLeft:15,
    paddingRight:15,
    paddingBottom: 0,
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

btn1: {
  width: '100%',
  borderRadius: 10,
  padding: 15,
  backgroundColor: '#204766',
  alignItems: 'center',
  justifyContent: 'center',
},
txtBtn1: {
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
    height: height * 0.18, // Tinggi header responsif
    borderRadius: 15,
    justifyContent: 'center', // Posisikan konten di tengah secara vertikal
    paddingHorizontal: 15,
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

    nipContainer1: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      paddingHorizontal: 20,
      paddingVertical: 15,
      backgroundColor: '#fff',
    },
    nipContainer2: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      paddingHorizontal: 20,
      paddingVertical: 15,
      backgroundColor: '#fff',
    },
    nipContainer3: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      paddingHorizontal: 20,
      paddingVertical: 15,
      backgroundColor: '#fff',
    },
    nipContainer4: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      paddingHorizontal: 20,
      paddingVertical: 15,
      backgroundColor: '#fff',
    },
    nipContainer5: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      paddingHorizontal: 20,
      paddingVertical: 15,
      backgroundColor: '#fff',
    },
    nipLabel: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
    },
    nipValue: {
      fontSize: 16,
      color: '#555',
    },
    scrollContainer: {
      flexGrow: 1,
      paddingBottom: 80, // Agar tidak tertutup tombol logout
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

  btn1: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  privacyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  privacyLink: {
    fontSize: 14,
    color: '#007BFF',
    textDecorationLine: 'underline',
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalTitle2: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
export default ProfileScreen;


