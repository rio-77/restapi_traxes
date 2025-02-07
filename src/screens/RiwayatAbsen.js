/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Image, Text, TextInput, Alert, ActivityIndicator,FlatList } from 'react-native';
import { } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { TouchableOpacity } from 'react-native';
// eslint-disable-next-line no-unused-vars
const { height } = Dimensions.get('window');
const RiwayatAbsen = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    // filterdata\
    const [filteredData, setFilteredData] = useState([]); // Data setelah di-filter
    const [searchQuery, setSearchQuery] = useState(''); // Query pencarian

     // Fungsi untuk mengambil data dari API
  const fetchRiwayatAbsensi = async () => {
    setLoading(true);

    const requestData = {
      empid: '21309963',
      area: 'null',
      area2: 'null',
      area3: 'null',
      latitude: 'null',
      longitude: 'null',
    };

    try {
      const response = await fetch('https://api.traxes.id/index.php/user/customerbyid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const json = await response.json();
      if (json.status === 1) {
        setData(json.data);
        setFilteredData(json.data); // Inisialisasi filteredData
      } else {
        Alert.alert('Gagal', json.message || 'Data tidak ditemukan');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Gagal mengambil data');
    } finally {
      setLoading(false);
    }
  };

  // Mengambil data saat komponen dimuat
  useEffect(() => {
    fetchRiwayatAbsensi();
  }, []);

  // Fungsi untuk menangani input pencarian
  const handleSearch = (text) => {
    setSearchQuery(text);

    // Filter data berdasarkan customer_name atau address
    const filtered = data.filter((item) =>
      item.customer_name.toLowerCase().includes(text.toLowerCase()) ||
      item.address.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filtered);
  };

  // Komponen untuk menampilkan setiap item dalam daftar
  const renderItem = ({ item }) => (
    <View style={homeStyles.card}>
    <Text style={homeStyles.title}>{item.customer_id}</Text>
      <Text style={homeStyles.title}>{item.customer_name}</Text>
      <Text style={homeStyles.text}>{item.address}</Text>
      {/* <Text style={homeStyles.text}>Kecamatan: {item.dist_name}</Text>
      <Text style={homeStyles.text}>Kota: {item.city_name}</Text>
      <Text style={homeStyles.text}>Latitude: {item.latitude}</Text>
      <Text style={homeStyles.text}>Longitude: {item.longitude}</Text> */}
    </View>
  );

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
                <Text style={homeStyles.text_ordersellout}> Riwayat Absen </Text>
            </LinearGradient>
            </View>
          </View>

{/* component-search */}
          <View style={{flexDirection: 'row',alignItems: 'center',backgroundColor: '#F2F2F2',
                            borderRadius: 5,paddingHorizontal: 25,paddingVertical: 5, marginLeft: 0,
                            marginRight: 0, margintop: 0 }}>
                <Image
                    source={require('../../assets/ic_search.png')}
                    style={{ width: 20, height: 20, marginRight: 10 }}
                />
                <TextInput
                    style={homeStyles.searchInput}
                    placeholder="Cari berdasarkan nama atau alamat.."
                    value={searchQuery}
                    onChangeText={handleSearch}
                />
            </View>

            <View style={homeStyles.container}>
              <TouchableOpacity onPress={() => navigation.navigate('SubmitCheckin')}>
                {loading ? (
                <ActivityIndicator size="large" color="#007BFF" />
            ) : (
                <FlatList
          data={filteredData}
          keyExtractor={(item) => item.customer_id}
          renderItem={renderItem}
          ListEmptyComponent={() => (
            <Text style={homeStyles.noDataText}>Tidak ada data ditemukan</Text>
          )}
        />
      )};
      </TouchableOpacity>
    </View>
          {/* body */}
          {/* logout */}
                      {/* <View style={homeStyles.viewBtn}>
                        <TouchableOpacity style={homeStyles.btn}>
                          <Text style={homeStyles.txtBtn}> Tambah Display </Text>
                        </TouchableOpacity>
                      </View> */}
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

searchInput: {
    height: 40,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 5,
    backgroundColor: '#FFFFFF',
  },
header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#007BFF',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 5,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
    margintop: 10,
    marginLeft: 15,
    marginRight: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  textt: {
    fontSize: 14,
    color: '#555',
  },
});
export default RiwayatAbsen;
