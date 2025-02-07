/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../navtabscreens/HomeScreen';
import ResumeScreen from '../navtabscreens/ResumeScreen';
import ProfileScreen from '../navtabscreens/ProfileScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import LocalApi from '../screens_alt/LocalApi';
import HomeScreenAlt from '../navtabscreens/HomeScreenAlt';
import Home from '../screenss/home';

const Tab = createBottomTabNavigator();

const NavTab = () => {

  return (
    <Tab.Navigator
      // screenOptions={({ route }) => ({
      //     tabBarIcon: ({ focused }) => {
      //       let iconName;

      //       if (route.name === 'Home') {
      //         iconName = focused
      //           ? require('.../../assets/logo.png') // Ikon aktif
      //           : require('../../assets/logo.png'); // Ikon tidak aktif
      //       } else if (route.name === 'Profile') {
      //         iconName = focused
      //           ? require('../../assets/logo.png') // Ikon aktif
      //           : require('../../assets/logo.png'); // Ikon tidak aktif
      //       }

      //       // Tampilkan gambar sebagai ikon
      //       return <Image source={iconName} style={styles.icon} />;
      //     },
      //     tabBarActiveTintColor: 'blue',
      //     tabBarInactiveTintColor: 'gray',
      //   })}
      >

      <Tab.Screen name="Home" component={Home} options={{ tabBarIcon: ({ focused, color, size }) => (<Icon name="document-text" size={size} color={color} />),
            headerShown: false,  // Menghilangkan header
          }} />
          {/* <Tab.Screen name="HomeScreenAlt" component={HomeScreenAlt} options={{ tabBarIcon: ({ focused, color, size }) => (<Icon name="document-text" size={size} color={color} />),
            headerShown: false,  // Menghilangkan header
          }} /> */}
      <Tab.Screen name="Resume" component={ResumeScreen} options={{ tabBarIcon: ({ focused, color, size }) => (<Icon name="document-text" size={size} color={color} />),
            headerShown: false,  // Menghilangkan header
          }} />
          {/* <Tab.Screen name="LocalApi" component={LocalApi} options={{ tabBarIcon: ({ focused, color, size }) => (<Icon name="document-text" size={size} color={color} />),
            headerShown: false,  // Menghilangkan header
          }} /> */}
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: ({ focused, color, size }) => (<Icon name="document-text" size={size} color={color} />),
            headerShown: false,  // Menghilangkan header
          }} />
      {/* Tambahkan tab lain jika diperlukan */}
    </Tab.Navigator>
  );
};

// Gaya untuk ikon
// const styles = StyleSheet.create({
//   icon: {
//     width: 24,
//     height: 24,
//   },
// });

export default NavTab;
