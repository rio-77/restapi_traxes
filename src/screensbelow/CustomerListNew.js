import React, { useState, useEffect } from 'react';
import { View, Image, Text, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { LinearGradient } from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import SearchTab from '../../src/screensbelow/SearchTab';
import TokoTab from '../../src/screensbelow/TokoTab';
import CallplanTab from '../../src/screensbelow/CallplanTab';
const CustomerListNewBelow = () => {
  const navigation = useNavigation();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'search', title: 'Toko' },
    { key: 'toko', title: 'Project' },
    { key: 'callplan', title: 'Callplan' },
  ]);
  const renderScene = SceneMap({
    search: SearchTab,
    toko: TokoTab,
    callplan: CallplanTab,
  });
  return (
    <View style={styles.container}>
      {/* Gradient Header */}
      <LinearGradient colors={['#204766', '#631D63']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Image source={require('../../assets/icc_back.png')} style={styles.icBack} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>List Toko</Text>
      </LinearGradient>
      {/* Tab View */}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get('window').width }}
        renderTabBar={(props) => (
          <LinearGradient
            colors={['#631D63', '#631D63']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientTabBar}>
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
       <View style={styles.viewBtn}>
                <TouchableOpacity style={{ width: '100%' }} onPress={() => navigation.navigate('TambahLokasiTestBelow')}>
                    <LinearGradient
                        colors={['#204766', '#631D63']}
                        style={styles.btn}>
                            <Text style={styles.txtBtn}>+ Lokasi Toko</Text>
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
  gradientTabBar: {
    borderRadius: 0,
  },
  tabBar: {
    backgroundColor: 'transparent', // Ensure TabBar background is transparent
    elevation: 0, // Remove shadow on TabBar
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
});

export default CustomerListNewBelow;
