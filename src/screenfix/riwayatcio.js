import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  ActivityIndicator, 
  Alert, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  BackHandler, 
  Modal 
} from 'react-native';
import axios from 'axios';
import { db, createTable, getUserDataa } from '../../helper/login';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment'; // pastikan sudah diinstall: npm i moment

const RiwayatCio = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tanggalFilter, setTanggalFilter] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  // State untuk menyimpan data user login
  const [userData, setUserData] = useState(null);
  // State untuk mengatur modal dialog kustom
  const [isModalVisible, setModalVisible] = useState(false);
  // State untuk menyimpan item yang dipilih
  const [selectedItem, setSelectedItem] = useState(null);

  // Fungsi untuk menampilkan DatePicker
  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const handleConfirm = (date) => {
    setTanggalFilter(date);
    hideDatePicker();
  };

  // Mengatur back button pada Android
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('Home');
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );

  // Mendapatkan NIP (employee_id) dari SQLite
  const getNipFromDB = () => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT employee_id FROM user LIMIT 1',
          [],
          (txObj, results) => {
            if (results.rows.length > 0) {
              const nip = results.rows.item(0).employee_id;
              console.log('✅ NIP ditemukan di SQLite:', nip);
              resolve(nip);
            } else {
              console.log('❌ Tidak ada user di SQLite');
              reject('User tidak ditemukan di database lokal');
            }
          },
          (error) => {
            console.log('❌ Query error:', error);
            reject(error);
          }
        );
      });
    });
  };

  // Mengambil data user login dari SQLite menggunakan fungsi getUserDataa
  const fetchUserData = () => {
    getUserDataa((user) => {
      if (user) {
        setUserData(user);
        console.log('✅ Data user:', user);
      } else {
        console.log('❌ Data user tidak ditemukan.');
      }
    });
  };

  // Mengambil data riwayat absensi dari API dan simpan ke state
  const fetchData = async () => {
    try {
      const nip = await getNipFromDB();
      const response = await axios.post('https://api.traxes.id/index.php/download/historycio', { nip });
      console.log('📥 Response:', response.data);
      if (response.data.status === 1) {
        setData(response.data.data);
        setFilteredData(response.data.data);
      } else {
        Alert.alert('Gagal', response.data.message || 'Data tidak ditemukan.');
      }
    } catch (error) {
      console.error('❌ Gagal mengambil data:', error);
      Alert.alert('Error', 'Terjadi kesalahan saat mengambil data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    createTable();
    fetchUserData();
    fetchData();
  }, []);

  // Filter data berdasarkan tanggal (jika diterapkan)
  const filteredList = tanggalFilter 
    ? data.filter(item => item.date_cio === moment(tanggalFilter).format('YYYY-MM-DD'))
    : data;

  // Fungsi untuk meng-handle pencarian (jika ingin digunakan)
  const handleSearch = (text) => {
    const filtered = data.filter((item) =>
      item.customer_name && item.customer_name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filtered);
  };

  // Fungsi untuk menghitung jam kerja
  const getJamKerja = (item) => {
    if (item.datetimephone_in && item.datetimephone_out) {
      const masuk = new Date(item.datetimephone_in);
      const keluar = new Date(item.datetimephone_out);
      const diffMs = keluar - masuk;
      const diffMinutes = Math.floor(diffMs / 60000);
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      return `${hours}j ${minutes}m`;
    }
    return '-';
  };

  // Fungsi ketika card ditekan: simpan item terpilih dan tampilkan modal dialog
  const handleCardPress = (item) => {
    console.log('Customer Id:', item.customer_id);
    // Jika project_id tidak ada pada item, gunakan dari userData
    const projectId = item.project_id ? item.project_id : (userData ? userData.project_id : null);
    if (!projectId) {
      Alert.alert('Error', 'Project ID tidak tersedia.');
      return;
    }
    // Set item terpilih untuk dikirim ke detail screen
    setSelectedItem({ ...item, project_id: projectId });
    setModalVisible(true);
  };

  // Fungsi untuk menutup modal dialog
  const closeModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  // Fungsi untuk menangani navigasi ke detail check-in
  const handleDetailCheckin = () => {
    closeModal();
    navigation.navigate('RiwayatCio_DetailCi', {
      customer_id: selectedItem.customer_id,
      project_id: selectedItem.project_id,
    });
  };

  // (Opsional) Fungsi untuk menangani navigasi ke detail check-out
  const handleDetailCheckout = () => {
    closeModal();
    navigation.navigate('DetailCheckout', {
      customer_id: selectedItem.customer_id,
      project_id: selectedItem.project_id,
    });
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => handleCardPress(item)}>
        <View style={styles.card}>
          {/* Header Card */}
          <View style={styles.cardHeader}>
            <Text style={styles.title}>{item.customer_name}</Text>
            <Text style={styles.dateText}>{item.date_cio}</Text>
          </View>
          {/* Baris Tabel */}
          <View style={styles.tableRow}>
            <View style={styles.tableCell}>
              <Text style={styles.jam}>
                {item.datetimephone_in ? item.datetimephone_in.split(' ')[1] : '-'}
              </Text>
              <Text style={styles.label}>Check-in</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.jam}>
                {item.datetimephone_out ? item.datetimephone_out.split(' ')[1] : '-'}
              </Text>
              <Text style={styles.label}>Check-out</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.jam}>{getJamKerja(item)}</Text>
              <Text style={styles.label}>Jam Kerja</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="black" />
        <Text>Memuat data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#204766', '#631D63']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Image source={require('../../assets/icc_back.png')} style={styles.icBack} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Riwayat Absensi</Text>
      </LinearGradient>

      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Cari Tanggal:</Text>
        <TouchableOpacity style={styles.datePickerButton} onPress={showDatePicker}>
          <Icon name="calendar" size={20} color="#333" style={{ marginRight: 8 }} />
          <Text style={styles.datePickerText}>
            {tanggalFilter ? moment(tanggalFilter).format('YYYY-MM-DD') : 'Pilih Tanggal'}
          </Text>
        </TouchableOpacity>
      </View>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />

      {filteredData.length === 0 ? (
        <Text style={styles.noData}>Tidak ada data.</Text>
      ) : (
        <FlatList
          data={
            tanggalFilter 
              ? data.filter(item => item.date_cio === moment(tanggalFilter).format('YYYY-MM-DD'))
              : data
          }
          keyExtractor={(item, index) => item.secid.toString() + index}
          renderItem={renderItem}
        />
      )}

      {/* Modal Dialog Kustom */}
      <Modal visible={isModalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.dialog}>
            <Text style={styles.dialogTitle}>Pilih Aksi</Text>
            <View style={styles.dialogButtonsContainer}>
              <TouchableOpacity style={styles.dialogButton} onPress={handleDetailCheckin}>
                <Text style={styles.dialogButtonText}>Lihat Detail Check-in</Text>
              </TouchableOpacity>
              {/* Jika ingin menambah opsi Detail Check-out, hapus komentar di bawah */}
              {/*
              <TouchableOpacity style={styles.dialogButton} onPress={handleDetailCheckout}>
                <Text style={styles.dialogButtonText}>Lihat Detail Check-out</Text>
              </TouchableOpacity>
              */}
            </View>
            <TouchableOpacity style={styles.dialogCancel} onPress={closeModal}>
              <Text style={styles.dialogCancelText}>Batal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default RiwayatCio;

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
  icBack: { width: 24, height: 24 },
  headerTitle: { fontSize: 20, color: 'white', fontWeight: 'bold', marginLeft: 10 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginTop: 10,
    marginBottom: 10,
  },
  filterLabel: { fontSize: 14, color: '#555', marginRight: 10 },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  datePickerText: { fontSize: 14, color: '#333' },
  noData: { textAlign: 'center', marginTop: 20, color: 'gray' },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginHorizontal: 15,
    marginTop: 5,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  cardHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 10, 
    flexWrap: 'wrap'
  },
  title: { fontWeight: 'bold', fontSize: 16, color: '#333', flex: 1 },
  dateText: { fontSize: 14, color: '#888', textAlign: 'right', flexShrink: 1 },
  tableRow: { 
    flexDirection: 'row', 
    borderTopWidth: 1, 
    borderBottomWidth: 1, 
    borderColor: '#ccc', 
    paddingVertical: 10, 
    justifyContent: 'space-between' 
  },
  tableCell: { 
    flex: 1, 
    alignItems: 'center', 
    borderRightWidth: 1, 
    borderColor: '#ccc', 
    paddingHorizontal: 5 
  },
  jam: { fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#333' },
  label: { fontSize: 13, color: '#666' },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#204766',
  },
  dialogButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  dialogButton: {
    flex: 1,
    backgroundColor: '#204766',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  dialogButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  dialogCancel: {
    marginTop: 15,
    padding: 10,
    width: '100%',
  },
  dialogCancelText: {
    textAlign: 'center',
    color: '#631D63',
    fontWeight: 'bold',
  },
});
