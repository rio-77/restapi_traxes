import React, { useState, useEffect } from 'react';
import { View,Image, Text, ActivityIndicator, Alert, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import { LinearGradient } from 'react-native-linear-gradient'; // Import for gradient
import { useNavigation } from '@react-navigation/native'; // Import for navigation

// Open SQLite database
const db = SQLite.openDatabase(
  { name: 'userDB', location: 'default' },
  () => { console.log('Database opened'); },
  (err) => { console.log('Error opening database: ', err); }
);

// Function to get employee_id from the local database
const getEmployeeIdFromDatabase = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT employee_id FROM user WHERE id = 1', // Replace with actual query to get employee_id
        [],
        (tx, results) => {
          if (results.rows.length > 0) {
            resolve(results.rows.item(0).employee_id);
          } else {
            reject('Employee not found');
          }
        },
        (error) => reject(error)
      );
    });
  });
};

// Function to fetch customer data from the API
const fetchCustomerData = async (employeeId) => {
  const requestData = {
    empid: employeeId,
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
      return json.data; // Return the data if successful
    } else {
      throw new Error(json.message || 'Data not found');
    }
  } catch (error) {
    console.error('Error fetching customer data:', error);
    throw error;
  }
};

const TestListToko = () => {
  const navigation = useNavigation(); // Hook to handle navigation
  const [loading, setLoading] = useState(true);
  const [customerData, setCustomerData] = useState(null);
  const [filteredData, setFilteredData] = useState(null); // Holds filtered data based on search
  const [searchQuery, setSearchQuery] = useState(''); // Holds search input

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get employee_id from the local database
        const employeeId = await getEmployeeIdFromDatabase();

        // Fetch customer data using the employee_id
        const data = await fetchCustomerData(employeeId);

        // Update state with the fetched customer data
        setCustomerData(data);
        setFilteredData(data); // Initialize filtered data to be the same as customerData initially
      } catch (error) {
        Alert.alert('Error', 'Error Customer Data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to handle search input and filter the customer data
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredData(customerData); // If search is empty, display all data
    } else {
      const filtered = customerData.filter(customer =>
        customer.customer_name.toLowerCase().includes(query.toLowerCase()) ||
        customer.address.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }
  if (!customerData) {
    return <Text>No customer data available</Text>;
  }

   const renderItem = ({ item }) => (
      // <View style={styles.card}>
      //   <Text style={styles.title}>{item.customer_id}</Text>
      //   <Text style={styles.title}>{item.customer_name}</Text>
      //   <Text style={styles.text}>{item.address}</Text>
      // </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('CheckinBelow', { customerId: item.customer_id })}
          style={styles.card}
        >
          <Text style={styles.title}>{item.customer_name}</Text>
          <Text style={styles.title}>{item.customer_id}</Text>
          <Text style={styles.text}>{item.address}</Text>
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
                placeholder="Cari berdasarkan nama atau alamat.."
                value={searchQuery}
                onChangeText={handleSearch}
              />
            </View>

      {/* Content */}
            <View style={styles.content}>
              {loading ? (
                <ActivityIndicator size="large" color="#007BFF" />
              ) : (
                <FlatList
                  data={filteredData}
                  keyExtractor={(item) => item.customer_id}
                  renderItem={renderItem}
                  ListEmptyComponent={() => (
                    <Text style={styles.noDataText}>Tidak ada data ditemukan</Text>
                  )}
                />
              )}
            </View>

    </View>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white' },
  header: {
    width: '100%',
    height: 100, // Tinggi header ditingkatkan agar ada ruang vertikal lebih banyak
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 25, // Menambahkan padding atas untuk memindahkan konten ke bawah
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
  content: { flex: 1, padding: 10 },
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
  backButton: {
    position: 'absolute', // Position back button to the left
    left: 15,
    top: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 20,
  },
  backText: {
    fontSize: 18,
    color: '#4c669f',
  },
  headerText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 0, // Provide space between back button and title
  },
//   searchInput: {
//     height: 40,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 5,
//     paddingLeft: 10,
//     marginBottom: 20,
//     marginTop: 15, // Adjust to avoid overlapping with the header
//   },
  customerItem: {
    backgroundColor: '#ffffff',
    marginBottom: 15,
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 7,
  },
  text: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8', // Optional, for background color
  },
});

export default TestListToko;
