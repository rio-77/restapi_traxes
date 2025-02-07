
import React from 'react';
import { View, StyleSheet, Dimensions, Image, Text} from 'react-native';
import { } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { TouchableOpacity } from 'react-native';

// eslint-disable-next-line no-unused-vars
const { height } = Dimensions.get('window');
const VisitScreen = ({ navigation }) => {

return (
    // containner
        <View style={homeStyles.container}>
          {/* header */}
          < View style={homeStyles.header_atas}>
            <View style={homeStyles.header_atas_fix}>
              <LinearGradient
              colors={['#204766', '#631D63']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={homeStyles.gradient_header} >
                <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                <Image source={require('../../assets/icc_back.png')} style={homeStyles.ic_back}  />
                </TouchableOpacity>
                <Text style={homeStyles.text_ordersellout}> Visit  </Text>
            </LinearGradient>
            {/* <Text style={homeStyles.text_ordersellout}>Order Sell-Out  </Text> */}
            </View>
          </View>
          {/* body */}
          <View style={homeStyles.view_isipenjualan}>
          <TouchableOpacity onPress={() => navigation.navigate('RiwayatAbsen')}>
          <Image source={require('../../assets/ic_checkin.jpg')} style={homeStyles.ic_checkin} />
          </TouchableOpacity>
          <Text style={homeStyles.text_isipenjualan}> Check In </Text>
          </View>
          <View style={homeStyles.view_tidakadapenjualan}>
          <TouchableOpacity onPress={() => navigation.navigate('SubmitCheckout')}>
          <Image source={require('../../assets/ic_checkout.jpg')} style={homeStyles.ic_checkin} />
          </TouchableOpacity>
          <Text style={homeStyles.text_isipenjualan}> Check Out </Text>
          </View>

        </View>
  );
};
// style
const homeStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  text: { fontSize: 20, fontWeight: 'bold' },
  gradient_header: {
    width: '100%',
    height: 50,
    borderRadius: 0,
  },
  ic_back: {
    width: 20,
    height: 20,
    marginTop: 15,
    marginLeft: 15,
  },
  ic_penjualan: {
    marginTop: 0,
  },
  ic_checkin: {
    marginTop: 0,
    width: 40,
    height: 40,
  },
  ic_tidakadapenjualan: {
    marginTop: 0,
    height: 40,
  },
  text_ordersellout: {
    height: 25,
    color: 'white',
    marginTop: -19,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 50,
  },
  text_isipenjualan: {
    height: 25,
    color: 'black',
    marginTop: 5,
  },
  view_isipenjualan: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 125,
    height: '17%',                 // Tinggi rectangle
    backgroundColor: '#ffffff',  // Warna latar belakang
    borderRadius: 10,            // Membulatkan semua sudut
    // Shadow untuk Android
    elevation: 10,
    // Shadow untuk iOS
    shadowColor: '#000',          // Warna bayangan
    shadowOffset: { width: 0, height: 4 }, // Posisi bayangan
    shadowOpacity: 0.3,           // Transparansi bayangan
    shadowRadius: 5,
  },
  view_tidakadapenjualan: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 15,
    height: '17%',                 // Tinggi rectangle
    backgroundColor: '#ffffff',  // Warna latar belakang
    borderRadius: 10,            // Membulatkan semua sudut
    // Shadow untuk Android
    elevation: 10,
    // Shadow untuk iOS
    shadowColor: '#000',          // Warna bayangan
    shadowOffset: { width: 0, height: 4 }, // Posisi bayangan
    shadowOpacity: 0.3,           // Transparansi bayangan
    shadowRadius: 5,
  },

});

export default VisitScreen;
