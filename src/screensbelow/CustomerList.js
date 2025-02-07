import React, { useState, useEffect } from 'react';
import {View,Image,Text,Alert,StyleSheet,TextInput,FlatList,TouchableOpacity} from 'react-native';
import ProgressBar from 'react-native-progress/Bar'; // Import ProgressBar
import { LinearGradient } from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native'; // Import for navigation

const CustomerListBelow = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0); // State to track progress

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setProgress(0); // Reset progress to 0 at the beginning

      try {
        // Simulate incremental loading (for demonstration)
        let progressInterval = setInterval(() => {
          setProgress(prev => {
            if (prev >= 0.9) {
              clearInterval(progressInterval); // Stop progress when it reaches 100%
            }
            return prev + 0.05; // Increment progress by 5% (0.05)
          });
        }, 100); // Update progress every 100ms

        const response = await fetch(
          'http://172.16.100.243/apitraxes/index.php/download/customerlist'
        );
        const json = await response.json();

        if (json.status === 1) {
          setData(json.data);
        } else {
          Alert.alert('Error', json.message);
        }

        setProgress(1); // Set progress to 100% when the data is fully loaded
      } catch (error) {
        Alert.alert('Error', `Failed to fetch data: ${error.message}`);
        setProgress(0); // Reset progress in case of error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = data.filter(
    (item) =>
      (item.customer_name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
    onPress={() => navigation.navigate('CheckinBelow', { customerId: item.customer_id })}
    style={styles.card}>
      <Text style={styles.text}>ID: {item.customer_id}</Text>
      <Text style={styles.text}>Nama: {item.customer_name || 'Tidak ditulis nama'}</Text>
      <Text style={styles.text}>Longitude: {item.longitude}</Text>
      <Text style={styles.text}>Latitude: {item.latitude}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Gradient Header */}
      <LinearGradient colors={['#204766', '#631D63']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Image source={require('../../assets/icc_back.png')} style={styles.icBack} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>List Toko</Text>
      </LinearGradient>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Image source={require('../../assets/ic_search.png')} style={styles.icSearch} />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari berdasarkan nama atau alamat..."
          value={searchQuery}
          onChangeText={setSearchQuery} // Update searchQuery saat user mengetik
        />
      </View>

      {/* Show Progress Bar while loading */}
      {loading && (
        <View style={styles.progressContainer}>
          <ProgressBar progress={progress} width={null} height={10} />
          <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
        </View>
      )}

      {/* Data List */}
      {!loading && (
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={(item) => item.customer_id}
          contentContainerStyle={{ padding: 15 }}
        />
      )}

      <View style={styles.viewBtn}>
                  <TouchableOpacity style={{ width: '100%' }} onPress={() => navigation.navigate('TambahLokasiTestBelow')}>
                      <LinearGradient
                          colors={['#204766', '#631D63']}
                          style={styles.btn}>
                          <Text style={styles.txtBtn}>Tambah Lokasi</Text>
                      </LinearGradient>
                  </TouchableOpacity>
              </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: {
    width: '100%',
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 25,
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
    backgroundColor: '#5dc3e5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtBtn: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  icBack: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    borderRadius: 5,
    margin: 15,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  icSearch: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  text: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  progressContainer: {
    padding: 0,
    alignItems: 'center',
  },
  progressText: {
    marginTop: 5,
    fontSize: 16,
    color: '#333',
  },
});

export default CustomerListBelow;
