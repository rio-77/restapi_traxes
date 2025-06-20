import React, { useState, useEffect } from 'react';
import { View, Image, Text, StyleSheet, Dimensions, TouchableOpacity, BackHandler } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { LinearGradient } from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import SearchTab from '../../src/screensbelow/SearchTab';
import TokoTab from '../../src/screensbelow/TokoTab';
import CallplanTab from '../../src/screensbelow/CallplanTab';
import changeNavigationBarColor from 'react-native-navigation-bar-color';

const CustomerListNewBelow = () => {
  const navigation = useNavigation();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'search', title: 'Toko' },
    { key: 'callplan', title: 'Callplan' },
  ]);

  const renderScene = SceneMap({  
    search: SearchTab,
    callplan: CallplanTab,
  });

  useEffect(() => {
    // Set warna Navigation Bar
    changeNavigationBarColor('#ffffff', true); 

    // Tangani tombol back bawaan HP
    const backAction = () => {
      navigation.navigate('Home'); // Navigasi ke Home
      return true; // Cegah aplikasi tertutup
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove(); // Hapus event listener saat komponen unmount
  }, []);

  return (
    <View style={styles.container}>
      {/* Header dengan Gradient */}
      <LinearGradient colors={['#204766', '#631D63']} style={styles.header}>
              <TouchableOpacity onPress={() => navigation.navigate('dashboardutama')}>
                <Image source={require('../../assets/icc_back.png')} style={styles.icBack} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>List Lokasi/Toko</Text>
            </LinearGradient>

      {/* Tab View */}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get('window').width }}
        renderTabBar={(props) => (
          <LinearGradient colors={['#631D63', '#631D63']} style={styles.gradientTabBar}>
            <TabBar
              {...props}
              style={styles.tabBar}
              indicatorStyle={styles.indicator}
              labelStyle={styles.tabLabel}
              activeColor="white"
              inactiveColor="rgba(255, 255, 255, 0.5)"
            />
          </LinearGradient>
        )}
      />

      {/* Tombol Tambah Lokasi */}
      <View style={styles.viewBtn}>
        <TouchableOpacity style={{ width: '100%' }} onPress={() => navigation.navigate('tambahlokasitoko2')}>
          <LinearGradient colors={['#204766', '#631D63']} style={styles.btn}>
            <Text style={styles.txtBtn}>Tambah Lokasi / Toko</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styling
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: { height: '24px', padding: 20, flexDirection: 'row', alignItems: 'center' },
  icBack: { width: '20', height: '20', marginTop: 20 },
  headerTitle: { fontSize: 20, color: 'white', marginLeft: 10, marginTop: 20 },
  gradientTabBar: {
    borderRadius: 0,
  },
  tabBar: {
    backgroundColor: 'transparent',
    elevation: 0,
  },
  indicator: {
    backgroundColor: 'white',
    height: 3,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  viewBtn: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 15,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    width: '100%',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtBtn: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CustomerListNewBelow;
