import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchFilteredDataWithLimit } from '../../helper/sqliteservice';

const BASE_URL = 'https://api.traxes.id/'; // 🔹 Ganti dengan URL server kamu

const SearchTabBelow = () => {
    const [filteredData, setFilteredData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        setIsLoading(true);
        fetchFilteredDataWithLimit('', 25, (rows) => {
            console.log('Data toko pertama kali:', rows);
            setFilteredData(rows);
            setIsLoading(false);
        });
    }, []);

    const handleSearch = (query) => {
        setSearchQuery(query);
        setIsLoading(true);
        fetchFilteredDataWithLimit(query, 25, (rows) => {
            console.log('Data hasil pencarian:', rows);
            setFilteredData(rows);
            setIsLoading(false);
        });
    };

    const handleNavigateToDetail = (item) => {
        navigation.navigate('DetailCheckinCardBelow', {
            customer_id: item.customer_id,
            project_id: item.project_id,
            customer_name: item.customer_name,
            latitude: item.latitude,
            longitude: item.longitude,
            photo: item.photo,
        });
    };

    const renderItem = ({ item }) => {
        const photoUri = item.photo ? `${BASE_URL}${item.photo}` : null;

        return (
            <TouchableOpacity style={styles.card} onPress={() => handleNavigateToDetail(item)}>
                <View style={styles.cardContent}>
                    <Image
                        source={photoUri ? { uri: photoUri } : require('../../assets/traxes-icon.png')}
                        style={styles.image}
                        resizeMode="cover"
                    />
                    <View style={styles.textContent}>
                        <Text style={styles.namaToko} numberOfLines={2} ellipsizeMode="tail">
                            {item.customer_name}
                        </Text>
                        <Text style={styles.coordinate}>{item.address || 'Tidak tersedia'}</Text>
                        {/* <Text style={styles.coordinate}>{item.longitude || 'Tidak tersedia'}</Text> */}
                        {/* <Text style={styles.address}>{item.address || 'Alamat tidak tersedia'}</Text> */}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchInput}
                placeholder="Ketik nama lokasi / toko.."
                value={searchQuery}
                onChangeText={handleSearch}
            />
            <FlatList
                data={filteredData}
                renderItem={renderItem}
                keyExtractor={(item, index) => item?.customer_id?.toString() || index.toString()}
                ListEmptyComponent={() => (
                    <View style={styles.centeredContainer}>
                        <Text style={styles.noDataText}>
                            {isLoading ? 'Belum ada lokasi / toko' : searchQuery ? 'Toko tidak ditemukan!' : 'Toko kosong, silahkan cari toko!'}
                        </Text>
                    </View>
                )}
                contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 85 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, // Fix masalah layout biar FlatList gak terdorong ke bawah
        backgroundColor: 'white',
    },
    searchInput: {
        height: 50,
        borderColor: '#631D63',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginHorizontal: 15,
        marginBottom: 5, // Dikurangi supaya lebih dekat ke daftar
        fontSize: 16,
        color: '#333',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginVertical: 7,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
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
    namaToko: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#274366',
        lineHeight: 20,
        flexShrink: 1,
        textAlign: 'left',
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
        flexGrow: 1, // Fix layout biar tetap rapi kalau list kosong
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 15,
    },
    coordinate: {
        fontSize: 14,
        color: '#333',
        marginVertical: 2,
    },
});

export default SearchTabBelow;
