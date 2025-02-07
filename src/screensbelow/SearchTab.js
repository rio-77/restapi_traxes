import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import { fetchFilteredDataWithLimit } from '../../helper/sqliteservice'; // Pastikan path benar
const SearchTabBelow = () => {
    const [filteredData, setFilteredData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    // Load 25 data toko terbaru saat pertama kali membuka screen
    useEffect(() => {
        setIsLoading(true);
        fetchFilteredDataWithLimit('', 25, (rows) => {
            console.log('Data toko pertama kali:', rows);
            setFilteredData(rows);
            setIsLoading(false);
        });
    }, []);
    // Fungsi untuk menangani pencarian
    const handleSearch = (query) => {
        setSearchQuery(query);
        setIsLoading(true);
        fetchFilteredDataWithLimit(query, 25, (rows) => {
            console.log('Data hasil pencarian:', rows);
            setFilteredData(rows);
            setIsLoading(false);
        });
    };
    // Render setiap item toko
    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.card}>
            <View style={styles.cardContent}>
                <Image
                    source={item.photo ? { uri: item.photo } : require('../../assets/traxes-icon.png')}
                    style={styles.image}
                    resizeMode="cover"
                />
                <View style={styles.content}>
                    <Text style={styles.namaToko}>Nama Toko: {item.customer_name}</Text>
                    {/* Tampilkan Latitude dan Longitude */}
                    <Text style={styles.coordinate}>Latitude: {item.latitude}</Text>
                    <Text style={styles.coordinate}>Longitude: {item.longitude}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchInput}
                placeholder="Ketik nama toko.."
                value={searchQuery}
                onChangeText={handleSearch}
            />
            {isLoading ? (
                <View style={styles.centeredContainer}>
                    <Text style={styles.noDataText}>Sedang mencari..</Text>
                </View>
            ) : filteredData.length === 0 ? (
                <View style={styles.centeredContainer}>
                    <Text style={styles.noDataText}>
                        {searchQuery ? 'Toko tidak ditemukan!' : 'Toko kosong, silahkan cari toko!'}
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
// Gaya tampilan
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white' },
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
        flexDirection: 'row',
        alignItems: 'center',
    },
    textContent: {
        flex: 1,
        marginLeft: 10,
    },
    text: {
        fontSize: 14,
        color: '#333',
        marginBottom: 5,
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 10,
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
    namaToko: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#274366',
    },
    content: {
      padding: 12,
      backgroundColor: '#f7f7f7',
    },
    coordinate: {
      fontSize: 14,
      color: '#333',
      marginVertical: 2,
    },
});
export default SearchTabBelow;


