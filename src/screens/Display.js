import React from 'react';
import { View, StyleSheet, Dimensions, Image, Text} from 'react-native';
import { } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { TouchableOpacity } from 'react-native';
// eslint-disable-next-line no-unused-vars
const { height } = Dimensions.get('window');
const Display = ({ navigation }) => {
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
                <TouchableOpacity onPress={() => navigation.navigate('Home ')}>
                <Image source={require('../../assets/icc_back.png')} style={homeStyles.ic_back}  />
                </TouchableOpacity>
                <Text style={homeStyles.text_ordersellout}> Display  </Text>
            </LinearGradient>
            </View>
          </View>
          {/* body */}
          {/* logout */}
                      <View style={homeStyles.viewBtn}>
                        <TouchableOpacity style={homeStyles.btn}>
                          <Text style={homeStyles.txtBtn}> Tambah Display </Text>
                        </TouchableOpacity>
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
    borderRadius: 7,
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
export default Display;
