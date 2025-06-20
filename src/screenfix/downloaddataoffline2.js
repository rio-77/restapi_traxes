import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity, Image, BackHandler } from 'react-native';
import ProgressBar from 'react-native-progress/Bar';
import LinearGradient from 'react-native-linear-gradient';
import { Card } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { createTable, saveDataToSQLite, getTotalRows } from '../../helper/sqliteservice';
import { getUserLoginData } from '../../helper/login';
import changeNavigationBarColor from 'react-native-navigation-bar-color';

const API_URL = 'https://api.traxes.id/index.php/v2/customer/customerlist_project';

const DownloadDataOffline2 = () => {
  const navigation = useNavigation();
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [projectId, setProjectId] = useState(null);

  useEffect(() => {
    changeNavigationBarColor('#ffffff', true);
    fetchProjectId();
    fetchTotalRows();
  }, []);

  useEffect(() => {
    console.log('Project ID:', projectId);
  }, [projectId]);

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

  const fetchProjectId = async () => {
    try {
      const userData = await getUserLoginData();
      if (userData && userData.project_id) {
        setProjectId(userData.project_id);
      } else {
        Alert.alert('Error', 'Project ID tidak ditemukan. Silakan login ulang.');
      }
    } catch (error) {
      console.error('Error fetching project_id:', error);
      Alert.alert('Error', 'Gagal mengambil data login dari SQLite.');
    }
  };

  const fetchTotalRows = async () => {
    const rows = await getTotalRows();
    setTotalRows(rows);
  };

  const downloadData = async () => {
    if (!projectId) {
      Alert.alert('Error', 'Project ID tidak tersedia. Coba login ulang.');
      return;
    }

    setLoading(true);
    setProgress(0);

    try {
      createTable();
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: projectId }),
      });

      const json = await response.json();
      console.log('Response API:', json);

      if (json.status === 1 && json.data) {
        let progressValue = 0;
        const interval = setInterval(() => {
          progressValue += 0.01;
          setProgress(progressValue);
          if (progressValue >= 1) clearInterval(interval);
        }, 50);

        // Proses data agar tidak null
        const processedData = json.data.map((customer) => ({
        //   customer_id: customer.customer_id,
        //   customer_name: customer.customer_name,
        //   owner_name: customer.owner_name,
        //   no_contact: customer.no_contact,
        //   address: customer.address,
        //   latitude: customer.latitude,
        //   longitude: customer.longitude,
        //   photo: customer.photo,
        //   city_id: customer.city_id,
        //   district_id: customer.district_id,
        //   project_id: projectId,
        customer_id: customer.customer_id || 'Tidak tersedia',
        customer_name: customer.customer_name?.trim() || 'Tidak ditulis nama',
        owner_name: customer.owner_name?.trim() || 'Tidak tersedia',
        no_contact: customer.no_contact?.trim() || 'Tidak tersedia',
        address: customer.address?.trim() || 'Alamat tidak tersedia',
        latitude: customer.latitude ? parseFloat(customer.latitude) : 0,
        longitude: customer.longitude ? parseFloat(customer.longitude) : 0,
        photo: customer.photo?.trim() || '',
        city_id: customer.city_id ? customer.city_id.toString() : '0',
        district_id: customer.district_id ? customer.district_id.toString() : '0',
        village_id: customer.village_id ? customer.village_id.toString() : '0',
        project_id: projectId || '0',
        }));

        await saveDataToSQLite(
          processedData,
          projectId,
          async () => {
            clearInterval(interval);
            setProgress(1);
            setLoading(false);
            await fetchTotalRows();
            Alert.alert('Berhasil', 'Data toko berhasil didownload.', [{ text: 'OK' }]);
          },
          (error) => {
            clearInterval(interval);
            setLoading(false);
            console.error('Error SQLite:', error);
            Alert.alert('Gagal', 'Gagal menyimpan data ke database.');
          }
        );
      } else {
        setLoading(false);
        Alert.alert('Peringatan', 'Data tidak valid dari API.');
      }
    } catch (error) {
      setLoading(false);
      console.error('Error Fetch:', error);
      Alert.alert('Error', `Gagal mengunduh data: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#204766', '#631D63']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Image source={require('../../assets/icc_back.png')} style={styles.icBack} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Download Data Offline</Text>
      </LinearGradient>

      <View style={styles.cardWrapper}>
        <Card style={styles.card}>
          <View style={styles.cardContent}>
            <View>
              <Text style={styles.cardTitle}>Download Lokasi/Toko</Text>
              <Text style={styles.cardSubtitle}>Total Toko: {totalRows}</Text>
              {/* <Text style={styles.projectIdText}>Project ID: {projectId || 'Memuat...'}</Text> */}
            </View>

            <TouchableOpacity onPress={downloadData} disabled={loading} style={styles.buttonContainer}>
              {loading ? (
                <ProgressBar progress={progress} width={60} color="#2ECC71" />
              ) : (
                <LinearGradient
                  colors={['#2ECC71', '#27AE60']}
                  style={styles.downloadButton}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.downloadButtonText}>Download</Text>
                </LinearGradient>
              )}
            </TouchableOpacity>
          </View>
        </Card>
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
  icBack: { width: 24, height: 24 },
  headerTitle: { fontSize: 20, color: 'white', fontWeight: 'bold', marginLeft: 10 },

  cardWrapper: { marginTop: 20, paddingHorizontal: 15 },
  card: { padding: 20, borderRadius: 10, elevation: 3 },
  cardContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 18, fontWeight: 'bold' },
  cardSubtitle: { fontSize: 16, color: '#666' },
  projectIdText: { fontSize: 14, color: 'red', marginTop: 5 },

  buttonContainer: { alignItems: 'center' },
  downloadButton: { paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8 },
  downloadButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});

export default DownloadDataOffline2;
