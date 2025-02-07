import React, {useState,useEffect  } from 'react';
import { View, StyleSheet, Dimensions, Image, Text, TouchableOpacity,layar, FlatList, ActivityIndicator,Button, Alert, dimensions} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import { launchCamera, requestCameraPermissionsAsync, launchCameraAsync} from 'react-native-image-picker';
import { ImagePicker } from 'react-native-image-picker';

// Mendapatkan tinggi layar perangkat
const { height } = Dimensions.get('window');

//primary
const SubmitCheckin = ({ route }) => {

//nav wajib di atas
const navigation = useNavigation();

const [profile, setProfile] = useState({
  name: 'Rio pratama', // Nama profil, ganti dengan data dari server jika perlu
  nip: '21309963', // NIP, ganti dengan data dari server jika perlu
});
const [storeDetails, setStoreDetails] = useState({
  custommer: 'CUSTOMMER',
  storeName: 'PT Siprama Cakrawala HO',
  storeAddress: 'Jl. Andara Raya No.20, Pd. Labu, Kec. Cilandak, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta',
});

const [photo, setPhoto] = useState(null); // Menyimpan file foto
  const [employeeId, setEmployeeId] = useState('6789');
  const [customerId, setCustomerId] = useState('1704289694937');
  const [jabatanId, setJabatanId] = useState('121');
  const [dateCio, setDateCio] = useState('2024-06-07');
  const [statusEmp, setStatusEmp] = useState('1');
  const [projectId, setProjectId] = useState('22');
  const [latitudeIn, setLatitudeIn] = useState('1234567');
  const [longitudeIn, setLongitudeIn] = useState('2345678');
  const [radiusIn, setRadiusIn] = useState(1.24);
  const [distanceIn, setDistanceIn] = useState(1.24);
  const [keterangan, setKeterangan] = useState('Keterangan');
  const [apkVersion, setApkVersion] = useState('1');
  const [updateToko, setUpdateToko] = useState('1');

  // Fungsi untuk membuka kamera dan mengambil gambar
  const takePhoto = async () => {
    try {
      const result = await launchCamera({
        mediaType: "photo",
        includeBase64: true, // Jika API memerlukan base64
        quality: 0.8, // Kualitas gambar (0-1)
      });

      if (!result.didCancel && result.assets && result.assets.length > 0) {
        const photoData = result.assets[0];
        setPhoto(photoData); // Simpan foto di state
      } else {
        Alert.alert("Info", "Gambar tidak diambil.");
      }
    } catch (error) {
      console.error("Take Photo Error:", error);
      Alert.alert("Error", "Gagal membuka kamera.");
    }
  };

  // Fungsi untuk mengirim data ke API
  const submitCheckIn = async () => {
    if (!photo) {
      Alert.alert("Error", "Foto belum diambil.");
      return;
    }

    // Membuat objek data berdasarkan state
    const postData = {
      employee_id: employeeId,
      customer_id: customerId,
      jabatan_id: jabatanId,
      date_cio: dateCio,
      status_emp: statusEmp,
      datetimephone_in: new Date().toISOString(),
      project_id: projectId,
      latitude_in: latitudeIn,
      longitude_in: longitudeIn,
      radius_in: radiusIn,
      distance_in: distanceIn,
      foto_in: "", // Foto akan ditambahkan dalam FormData
      keterangan: keterangan,
      apk: apkVersion,
      update_toko: updateToko,
    };

    try {
      const formBody = new FormData();
      for (const key in postData) {
        formBody.append(key, String(postData[key])); // Menambahkan data lainnya
      }

      // Menambahkan file foto
      formBody.append("foto_in", {
        uri: photo.uri,
        name: "photo.jpg", // Nama file
        type: photo.type, // Tipe file (image/jpeg, dll.)
      });

      const response = await fetch("https://api.traxes.id/index.php/v2/customer/pushCheckIn", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formBody,
      });

      const result = await response.json();
      console.log("API Response:", result);

      if (result.status === 1) {
        Alert.alert("Success", result.message || "Check-in berhasil.");
      } else {
        Alert.alert("Error", result.message || "Check-in gagal.");
      }
    } catch (error) {
      console.error("Submit Error:", error);
      Alert.alert("Error", "Gagal mengirim data ke server.");
    }
  };


  return (
    <View style={homeStyles.container}>
        {/* header atas */}
        <View style={homeStyles.headerprofile}>
           <LinearGradient
            colors={['#204766', '#631D63']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={homeStyles.gradient_header} >
              <TouchableOpacity onPress={() => navigation.navigate('Home ')}>
                <Image source={require('../../assets/icc_back.png')} style={homeStyles.ic_back}  />
              </TouchableOpacity>
                <Text style={homeStyles.text_ordersellout}> Submit Checkin </Text>
          </LinearGradient>
        </View>

        <View style={homeStyles.headerprofilee}>
            <LinearGradient
                  colors={['#204766', '#631D63']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={homeStyles.gradient_headerr}
            >
                <Text style={homeStyles.text_nama}>  {profile.name} </Text>
                <Text style={homeStyles.text_nik}>  {profile.nip} </Text>
                <Image source={require('../../assets/rectangle_profile.png')} style={homeStyles.image_profile_header} />
            </LinearGradient>
        </View>

        <View style={homeStyles.headertoko}>
            <LinearGradient
                  colors={['#dcdcdc', '#91a3b0']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={homeStyles.gradient_headerr_toko}
            >
                <Text style={homeStyles.text_custommer}>  {storeDetails.custommer} </Text>
                <Text style={homeStyles.text_address}>  {storeDetails.storeName} </Text>
                <Text style={homeStyles.text_addresss}>  {storeDetails.storeAddress} </Text>
            </LinearGradient>
        </View>

        <View style={homeStyles.imageContainer}>
        {photo ? (
          <Image source={{ uri: photo.uri }} style={homeStyles.photo} />
        ) : (
          <TouchableOpacity onPress={takePhoto} style={homeStyles.cameraIconContainer}>
          <Image
              source={require("../../assets/camera.png")} // Path ke gambar ikon kamera
              style={homeStyles.icon}
            />
            </TouchableOpacity>
        )}
      </View>
      {/* <Button title="Ambil Foto" onPress={takePhoto} style={homeStyles.btncamera} /> */}
      {/* <Button title="Submit Check-In" onPress={submitCheckIn} /> */}

      <TouchableOpacity onPress={submitCheckIn} style={homeStyles.button}>
        <Text style={homeStyles.buttonText}>Submit Check-In</Text>
      </TouchableOpacity>

    </View>
  );
};

const homeStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white'},
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
      gradient_header: {
      width: '100%',
      height: 50,
      borderRadius: 0,
    },
    gradient_headerr: {
      width: '100%',
      height: 80,
      borderRadius: 5,
    },
    gradient_headerr_toko: {
      width: '100%',
      height: '45%',
      borderRadius: 8,
    },
    ic_back: {
      width: 20,
      height: 20,
      marginTop: 15,
      marginLeft: 15,
    },
    text_ordersellout: {
      height: 25,
      color: 'white',
      marginTop: -19,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 50,
    },
    headerprofilee: {
      marginTop: 15,
      marginLeft: 15,
      marginRight: 15,
    },
    headertoko: {
      marginTop: 15,
      marginLeft: 15,
      marginRight: 15,
    },
    text_nama: {
      marginLeft: 70,
      marginTop: 15,
      fontSize: 16,
      color: 'white',
      textAlign: 'left',
      style: 'bold',
    },
    text_custommer: {
      marginLeft: 10,
      marginTop: 5,
      fontSize: 16,
      color: 'cyan',
      textAlign: 'left',
      style: 'bold',
    },
    text_address: {
      marginLeft: 10,
      marginTop: 5,
      fontSize: 14,
      color: 'black',
      textAlign: 'left',
      style: 'bold',
    },
    text_addresss: {
      marginLeft: 15,
      marginTop: 2,
      fontSize: 14,
      color: 'black',
      textAlign: 'left',
      style: 'bold',
    },
    text_nik: {
      marginLeft: 70,
      marginTop: 0,
      fontSize: 16,
      color: 'white',
      textAlign: 'left',
      style: 'normal',
    },
    image_profile_header: {
      width: 50,
      height: 50,
      marginTop: -42,
      marginLeft: 10,
    },
    ic_camera: {
      width: 120,
      height: 120,
      marginTop: 0,
      marginLeft: 120,
    },
    viewlayoutcamera: {
      // marginTop: layar.width > 400 ? 0 : 100, 
      marginTop: -135,
    },
    button: {
      backgroundColor: '#5dc3e5', // Warna tombol
      padding: 10, // Padding dalam tombol
      borderRadius: 5, // Kelengkungan sudut tombol
      alignItems: 'center', // Pusatkan teks
      justifyContent: 'center', // Pusatkan secara vertikal
      marginLeft: 50,
      marginRight: 50,
      marginTop: 15,
    },
    text: {
      color: '#fff', // Warna teks
      fontSize: 16, // Ukuran teks
      fontWeight: 'bold', // Ketebalan teks
    },
    buttonsubmit: {
      backgroundColor: '#4CAF50', // Warna tombol
      padding: 15, // Padding dalam tombol
      borderRadius: 5, // Kelengkungan sudut tombol
      alignItems: 'center', // Pusatkan teks
      justifyContent: 'center', // Pusatkan secara vertikal
      marginLeft: 15,
      marginRight: 15,
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
  photoPreview: {
    width: 200,
    height: 200,
    marginVertical: 20,
    alignSelf: 'center',
  },

  imageContainer: {
    width: '40%',
    height: '20%',
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 10,
    marginTop: -120,
    marginLeft: '30%',
  },
  image: {
    width: '50%',
    height: '50%',
  },
  icon: {
    width: '50%',
    height: '50%',
    marginLeft: '0',
    marginTop: '25%',
  },
  instructions: {
    marginTop: 5,
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  photo: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  btncamera: {
    width: 50,
    height: 50,
  },
  cameraIconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },

});

export default SubmitCheckin;
