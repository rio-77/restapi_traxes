import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';

// Import Screens
import HomeScreenAlt from '../../src/navtabscreens/HomeScreenAlt';
import ResumeScreen from '../../src/navtabscreens/ResumeScreen';
import ProfileScreen from '../../src/navtabscreens/ProfileScreen';

const Tab = createBottomTabNavigator();

const AppTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, size }) => {
          let iconSource;
          if (route.name === 'Home') {
            iconSource = require('../../assetss/ic_home.png');
          } else if (route.name === 'Resume') {
            iconSource = require('../../assetss/ic_resume.png');
          } else if (route.name === 'Profile') {
            iconSource = require('../../assetss/ic_profile.png');
          }

          return (
            <Image
              source={iconSource}
              style={{ width: size, height: size, resizeMode: 'contain' }}
            />
          );
        },
        tabBarActiveTintColor: '#204766',
        tabBarInactiveTintColor: 'black',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreenAlt} />
      <Tab.Screen name="Resume" component={ResumeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default AppTabs;
