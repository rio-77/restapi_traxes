import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

// Import Screens
import HomeScreenAlt from '../../src/navtabscreens/HomeScreenAlt';
import ResumeScreen from '../../src/navtabscreens/ResumeScreen';
import ProfileScreen from '../../src/navtabscreens/ProfileScreen';
import dashboardutama from '../screenfix/dashboardutama';

const Tab = createBottomTabNavigator();

const AppTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, size }) => {
          let iconSource;
          if (route.name === 'Home') {
            iconSource = require('../../assetss/iconberandaaaa.png');
          } else if (route.name === 'Resume') {
            iconSource = require('../../assetss/iconresumeeee.png');
          } else if (route.name === 'Profile') {
            iconSource = require('../../assetss/iconprofileeee.png');
          }

          return (
            <Image
              source={iconSource}
              style={{
                width: size,
                height: size,
                resizeMode: 'contain',
                tintColor: focused ? 'white' : '#ccc', // Warna ikon aktif & non-aktif
              }}
            />
          );
        },
        tabBarShowLabel: false,
        headerShown: false,
        tabBarBackground: () => (
          <LinearGradient
            colors={['#631D63', '#204766']} // Warna gradient biru gelap
            style={styles.tabBarGradient}
          />
        ),
        tabBarStyle: { position: 'absolute', height: 50, backgroundColor: 'transparent' }, // Background dihapus agar gradasi bisa terlihat
      })}
    >
      <Tab.Screen name="Home" component={dashboardutama} />
      <Tab.Screen name="Resume" component={ResumeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    borderTopLeftRadius: 0, // Radius melengkung ke atas
    borderTopRightRadius: 0,
    overflow: 'hidden',
  },
});

export default AppTabs;
