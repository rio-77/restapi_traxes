/* eslint-disable react/no-unstable-nested-components */

/* eslint-disable no-unused-vars */
import React, {useState, useEffect} from 'react';
import { View, StyleSheet, Dimensions, Image, Text, Alert, ActivityIndicator} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { TouchableOpacity, FlatList } from 'react-native';

// Mendapatkan tinggi layar perangkat
const { height } = Dimensions.get('window');
const HomeScreen = ({ navigation }) => {

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
          style={homeStyles.gradient_header}
          >
          {/* Konten yang akan ditempatkan di atas gradient */}
          <Text style={homeStyles.text_nama}>Fullname:  </Text>
          <Text style={homeStyles.text_nik}>Employee ID:  </Text>
          <Image source={require('../../assets/rectangle_profile.png')} style={homeStyles.image_profile_header} />
          {/* <Image source={require('../../assets/rectangle_profile.svg')} /> */}
          <Image source={require('../../assets/rectangle_kotak_header.png')} style={homeStyles.rectangle_profile_header_1} />
        </LinearGradient>

        </View>
      </View>
      {/* body */}
      {/* row counter */}
      <View style={homeStyles.containerrowcounter}>
      <LinearGradient
          colors={['#EAF8FF', '#75D0FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={homeStyles.oval}
      >
      <View style={homeStyles.textkunjungan}>
        <Text style={homeStyles.textrow}>Kunjungan</Text>
        <Text style={homeStyles.textrow}>0</Text>
      </View>
      </LinearGradient>
      <LinearGradient
          colors={['#EAF8FF', '#75D0FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={homeStyles.oval}
      >
      <View style={homeStyles.textsellout}>
        <Text style={homeStyles.textrow}>Sell-Out</Text>
        <Text style={homeStyles.textrow}>0</Text>
      </View>
      </LinearGradient>
      <LinearGradient
          colors={['#EAF8FF', '#75D0FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={homeStyles.oval}
      >
      <View style={homeStyles.texttotalselling}>
        <Text style={homeStyles.textrow}>Total Selling</Text>
        <Text style={homeStyles.textrow}>0</Text>
      </View>
      </LinearGradient>
      </View>

      <View style={homeStyles.container}>
      {/* Baris 1 */}
      <View style={homeStyles.row}>
      <TouchableOpacity onPress={() => navigation.navigate('OrderSellOut')}>
        <Image source={require('../../assets/icon_order_sellout.png')}/>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('StockSellin')}>
        <Image source={require('../../assets/icon_stock_sellin.png')}  />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('DownloadData')}>
        <Image source={require('../../assets/icon_download_data.png')} />
      </TouchableOpacity>
      </View>

      {/* Baris 2 */}
      <View style={homeStyles.row1}>
      <TouchableOpacity onPress={() => navigation.navigate('Display')}>
        <Image source={require('../../assets/icon_display.png')} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Lembur')}>
        <Image source={require('../../assets/icon_lembur.png')} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('IzinAtauOffDay')}>
        <Image source={require('../../assets/icon_izin_offday.png')} />
      </TouchableOpacity>
      </View>
{/* view bawah */}
      <View style={homeStyles.imagebawah}>
      <View style={homeStyles.row1}>
        <TouchableOpacity onPress={() => navigation.navigate('Checkin')}>
        <Image source={require('../../assets/ic_checkin_075.png')} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('TambahLokasiAlt')}>
        <Image source={require('../../assets/ic_tambahlokasi_075.png')} />
        </TouchableOpacity>
      </View>
      </View>

    </View>

    </View>
  );
};
// style
const homeStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  text: { fontSize: 20, fontWeight: 'bold' },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient_header: {
    width: '100%',
    height: 75,
    borderRadius: 0,
  },
  image_profile_header: {
    width: 50,
    height: 50,
    marginTop: -42,
    marginLeft: 10,
  },
  rectangle_profile_header_1: {
    width: 15,
    height: 15,
    marginTop: -37,
    // justifyContent: 'flex-end', // Gambar akan berada di ujung kanan
    marginLeft: 335,
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
  oval: {
    marginTop: 160,
    width: 100,
    height: 100,
    borderRadius:50, // Sesuaikan nilai untuk mengatur tingkat kebulatan
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 0,
  },
  textkunjungan: {
    color: '#204766',
    textAlign: 'center',
    marginTop: 35,
  },
  textsellout: {
    color: '#204766',
    textAlign: 'center',
    marginTop: 35,
  },
  texttotalselling: {
    color: '#204766',
    textAlign: 'center',
    marginTop: 35,
  },
  textrow: {
    color: '#204766',
    textAlign: 'center',
    fontFamily: 'Poppins',
  },
  roww: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 185,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
  },
  row1: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  row2: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 0,
    marginTop: 0,
  },
  containerrowcounter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 0,
    flex: 1,
  },
  containerrowiconproduk1: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
    flex: 1,
    height: 50,
  },
  row_produk_1: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    marginTop: 0,
  },
  image_icon_1: {
    width: 95,
    height: 78,
  },
  profileContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    alignItems: 'center',
  },
  textt: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
  imagebawah: {
    backgroundColor: '#D6F1FF',
    height: '50%',
    marginTop: 35,
    marginLeft: 50,
    marginRight: 50,
    borderRadius: 50,
  },
});

export default HomeScreen;






