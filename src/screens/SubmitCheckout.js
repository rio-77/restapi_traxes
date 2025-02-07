import React, {useState,useEffect  } from 'react';
import { View, StyleSheet, Dimensions, Image, Text, TouchableOpacity, Alert} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
// Mendapatkan tinggi layar perangkat
const { height } = Dimensions.get('window');
const SubmitCheckout = ({ route }) => {
//nav wajib di atas
const navigation = useNavigation();
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
                <Text style={homeStyles.text_ordersellout}> Submit Checkout </Text>
          </LinearGradient>
        </View>

        <View style={homeStyles.headerprofilee}>
            <LinearGradient
                  colors={['#204766', '#631D63']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={homeStyles.gradient_headerr}
            >
              {/* Konten yang akan ditempatkan di atas gradient */}
                <Text style={homeStyles.text_nama}>Fullname:  </Text>
                <Text style={homeStyles.text_nik}>Employee ID:  </Text>
                <Image source={require('../../assets/rectangle_profile.png')} style={homeStyles.image_profile_header} />
            </LinearGradient>
        </View>

        <View style={homeStyles.viewlayoutcamera}>
                <Image source={require('../../assets/camera.png')} style={homeStyles.ic_camera} />
        </View>

        <TouchableOpacity style={homeStyles.button}>
            <Text style={homeStyles.text}>Upload</Text>
        </TouchableOpacity>

        {/* submit */}
                    <View style={homeStyles.viewBtn}>
                      <TouchableOpacity style={homeStyles.btn}>
                        <Text style={homeStyles.txtBtn}>Submit</Text>
                      </TouchableOpacity>
                    </View>

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
    text_nama: {
      marginLeft: 70,
      marginTop: 15,
      fontSize: 16,
      color: 'white',
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
      marginTop: 100,
    },
    button: {
      backgroundColor: '#5dc3e5', // Warna tombol
      padding: 10, // Padding dalam tombol
      borderRadius: 5, // Kelengkungan sudut tombol
      alignItems: 'center', // Pusatkan teks
      justifyContent: 'center', // Pusatkan secara vertikal
      marginLeft: 50,
      marginRight: 50,
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

});

export default SubmitCheckout;
