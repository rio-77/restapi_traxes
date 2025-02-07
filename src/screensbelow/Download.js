import React, { useState, useEffect } from 'react';
import {View,Image,Text,Alert,StyleSheet,FlatList,TouchableOpacity,Modal,ActivityIndicator,Button} from 'react-native';
import ProgressBar from 'react-native-progress/Bar';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
// import { createTable, saveDataToSQLite, fetchAllData } from '../../helper/listtoko';
import { createTable, saveDataToSQLite } from '../../helper/sqliteservice';


const DownloadBelow = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showDownloadButton, setShowDownloadButton] = useState(true);
  const [showModal, setShowModal] = useState(false);

//   new
  const [loading, setLoading] = useState(false);


//   const renderItem = ({ item }) => (
//     <TouchableOpacity
//       onPress={() => navigation.navigate('CheckinBelow', { customerId: item.customer_id })}
//       style={styles.card}
//     >
//       <Text style={styles.text}>ID: {item.customer_id}</Text>
//       <Text style={styles.text}>Nama: {item.customer_name || 'Tidak ditulis nama'}</Text>
//       <Text style={styles.text}>Longitude: {item.longitude}</Text>
//       <Text style={styles.text}>Latitude: {item.latitude}</Text>
//     </TouchableOpacity>
//   );


const downloadData = async () => {
    setLoading(true);

    try {
      // Buat tabel jika belum ada
      createTable();

      // Ambil data dari API
      const response = await fetch('http://172.16.100.243/apitraxes/index.php/download/customerlist');
      const json = await response.json();

      if (json.status === 1 && json.data) {
        // Simpan data ke SQLite
        saveDataToSQLite(
          json.data,
          () => {
            setLoading(false);
            Alert.alert('Sukses', 'Data berhasil diunduh dan disimpan.');
            // navigation.navigate('ListTokoScreen'); // Navigasi ke layar List Toko
          },
          (error) => {
            setLoading(false);
            Alert.alert('Error', 'Gagal menyimpan data ke database.');
          }
        );
      } else {
        setLoading(false);
        Alert.alert('Error', 'Data tidak valid dari API.');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', `Gagal mengunduh data: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      {/* Gradient Header */}
      {/* <LinearGradient colors={['#204766', '#631D63']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Image source={require('../../assets/icc_back.png')} style={styles.icBack} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Download Toko</Text>
      </LinearGradient> */}

      {/* Button Download */}
      {/* {showDownloadButton && (
        <View style={styles.centeredView}>
          <TouchableOpacity onPress={downloadData} disabled={loading}>
            <LinearGradient
              colors={['#204766', '#631D63']}
              style={styles.gradientButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.gradientButtonText}>
                {loading ? 'Downloading...' : 'Download Data'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )} */}

      {/* Progress Bar */}
      {/* {loading && (
        <View style={styles.progressContainer}>
          <ProgressBar progress={progress} width={200} color="#204766" />
          <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
        </View>
      )} */}

      {/* List of Data */}
      {/* <FlatList
        data={data}
        keyExtractor={(item) => item.customer_id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      /> */}

      {/* Popup Modal */}
      {/* <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Data berhasil diunduh!</Text>
            <Text style={styles.modalText}>
              Anda dapat melanjutkan ke halaman Home untuk menggunakan data.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setShowModal(false);
                navigation.navigate('Home');
              }}
            >
              <Text style={styles.modalButtonText}>Ke Halaman Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal> */}



<Text style={styles.header}>Unduh Data Pelanggan</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#204766" />
      ) : (
        <Button title="Download Data" onPress={downloadData} color="#204766" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: 'white' },
//   header: {
//     width: '100%',
//     height: 100,
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 15,
//     paddingTop: 25,
//   },

  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: '#204766' },

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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  progressText: {
    marginTop: 5,
    fontSize: 16,
    color: '#333',
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
  text: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  listContainer: {
    padding: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#204766',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DownloadBelow;
