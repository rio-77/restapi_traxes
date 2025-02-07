import React, { useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Image 
} from 'react-native';
import { fetchFilteredDataWithLimit } from '../../helper/sqliteservice'; // Ganti dengan lokasi file SQLite helper Anda
import { useNavigation } from '@react-navigation/native';

const TokoTabBelow = () => {
  const navigation = useNavigation();
  const [filteredData, setFilteredData] = useState([]); // Data hasil pencarian
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false); // State untuk indikator loading

  // Fungsi pencarian
  const handleSearch = (query) => {
    setSearchQuery(query);
    setIsLoading(true); // Mulai loading
    if (query.trim() === '') {
      setFilteredData([]);
      setIsLoading(false); // Selesai loading
    } else {
      // Ambil data dari SQLite dan filter manual dengan limit 10
      fetchFilteredDataWithLimit(query, 10, (rows) => {
        console.log('Data hasil pencarian toko:', rows); // Debug log
        setFilteredData(rows); // Tampilkan data dengan batasan 10
        setIsLoading(false); // Selesai loading
      });
    }
  };

  // Fungsi saat card di-klik
  const handleCardPress = (item) => {
    navigation.navigate('DetailCheckinBelow', {
      customer_id: item.customer_id,
      customer_name: item.customer_name,
      latitude: item.latitude,
      longitude: item.longitude,
    });
  };

  // Render setiap item (card)
  const renderItem = ({ item }) => {
    // Jika item.photo ada, gunakan gambar dari URL, jika tidak gunakan logo Traxes
    const imageSource = item.photo 
      ? { uri: item.photo } 
      : require('../../assets/traxes-icon.png');

    return (
      <TouchableOpacity style={styles.card} onPress={() => handleCardPress(item)}>
        <View style={styles.cardContent}>
          {/* Gambar di sebelah kiri */}
          <Image
            source={imageSource}
            style={styles.image}
            resizeMode="cover"
          />
          {/* Teks di sebelah kanan */}
          <View style={styles.textContent}>
            <Text style={styles.namaToko}>Nama Toko: {item.customer_name}</Text>
            <Text style={styles.coordinate}>Latitude: {item.latitude}</Text>
            <Text style={styles.coordinate}>Longitude: {item.longitude}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Ketik nama project..."
        value={searchQuery}
        onChangeText={handleSearch}
      />
      {isLoading ? (
        <View style={styles.centeredContainer}>
          <Text style={styles.noDataText}>Mencari project...</Text>
        </View>
      ) : filteredData.length === 0 ? (
        <View style={styles.centeredContainer}>
          <Text style={styles.noDataText}>
            {searchQuery ? 'Project tidak ditemukan!' : 'Project kosong, silahkan cari project!'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={(item) => item.customer_id.toString()}
          contentContainerStyle={styles.flatListContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  searchInput: {
    height: 50,
    borderColor: '#631D63',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    margin: 15,
    fontSize: 16,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 10,
    overflow: 'hidden',
    // Shadow untuk iOS
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    // Elevation untuk Android
    elevation: 4,
  },
  cardContent: {
    flexDirection: 'row', // Elemen ditampilkan secara horizontal
    alignItems: 'center',
    padding: 10,
  },
  textContent: {
    flex: 1,
    marginLeft: 10, // Jarak antara gambar dan teks
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  namaToko: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#274366',
  },
  coordinate: {
    fontSize: 14,
    color: '#333',
    marginVertical: 2,
  },
  noDataText: {
    fontSize: 16,
    color: '#353966',
    textAlign: 'center',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatListContent: {
    padding: 15,
  },
});

export default TokoTabBelow;
