import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { getusersprofile } from '../../helper/login'; // Fungsi untuk mengambil user profile dari SQLite
const CallplanTabBelow = () => {
  const [callPlanData, setCallPlanData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employeeId, setEmployeeId] = useState('');
  // Ambil data user profile dari DB lokal untuk mendapatkan employee_id
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userProfile = await getusersprofile();
        setEmployeeId(userProfile.employee_id); // Ambil employee_id dari profil pengguna yang tersimpan
      } catch (err) {
        console.error('Error getting user profile:', err);
      }
    };
    fetchUserProfile();
  }, []);
  // Ambil data call plan berdasarkan employee_id dan tanggal hari ini
  useEffect(() => {
    const fetchCallPlanData = async () => {
      if (!employeeId) return;
      const todayDate = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
      try {
        const response = await axios.post('https://api.traxes.id/index.php/download/callPlanList', {
          employee_id: employeeId,
          date_callplan: todayDate,
        });

        if (response.data.status === 1) {
          setCallPlanData(response.data.data); // Menyimpan data call plan ke state
        } else {
          setError('Daftar Kunjungan Kosong');
        }
      } catch (err) {
        setError('Daftar Kunjungan Kosong !');
        console.error('Error fetching call plan data:' , err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCallPlanData();
  }, [employeeId]);
  // Menampilkan data call plan menggunakan FlatList
  const renderItem = ({ item, index }) => (
    <View style={styles.card} key={`${item.customer_id}-${index}`}>
      <Text style={styles.customerName}>{item.customer_name}</Text>
      <Text>{item.address}</Text>
      <Text>{item.no_contact}</Text>
    </View>
  );
  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : error ? (
        // Menampilkan error di tengah layar
        <View style={styles.centeredView}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={callPlanData}
          keyExtractor={(item, index) => `${item.customer_id}-${index}`}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={styles.emptyText}>Tidak ada data Callplan Anda!</Text>}
        />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    marginBottom: 10,
    padding: 15,
    marginHorizontal: 10,
    borderRadius: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  customerName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: '#353966',
    textAlign: 'center',
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
});
export default CallplanTabBelow;


