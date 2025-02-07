import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import AppTabs from './src/tabs/NavTabs';
import Display from './src/screens/Display';
import DownloadData from './src/screens/DownloadData';
import Lembur from './src/screens/Lembur';
import OrderSellOut from './src/screens/OrderSellOut';
import StockSellin from './src/screens/StockSellin';
import IzinAtauOffDay from './src/screens/IzinAtauOffDay';
import Checkin from './src/screens/Checkin';
import LoginScreenALt from './src/screens_alt/LoginScreen';
import TambahLokasi from './src/screens/tambahlokasi';
import TambahLokasiAlt from './src/screens/TambahLokasiAlt';
import LoginTest from './src/screens_alt/LoginTest';
import VisitScreen from './src/screens/VisitScreen';
import RiwayatAbsen from './src/screens/RiwayatAbsen';
import SubmitCheckin from './src/screens/SubmitCheckin';
import SubmitCheckout from './src/screens/SubmitCheckout';
import Testtt from './src/screens_alt/testtt';
import LocalApi from './src/screens_alt/LocalApi';
import HomeScreenAlt from './src/navtabscreens/HomeScreenAlt';
// import { SafeAreaView } from 'react-native';
// import CreateData from './src/apifunction/api';
import ListToko from './src/screensbelow/ListToko';
import CheckinBelow from './src/screensbelow/Checkin';
import ListTokoBelow from './src/screensbelow/ListToko';
import TambahLokasiBelow from './src/screensbelow/TambahLokasi';
import DashboardTokoBelow from './src/screensbelow/DashboardToko';
import LoginScreenBelow from './src/screensbelow/Login';
import TestListToko from './src/screens_alt/testlisttoko';
import CustomerListBelow from './src/screensbelow/CustomerList';
import TambahLokasiTestBelow from './src/screensbelow/TambahLokasiTest';
import SplashScreen from './src/screenss/splashscreen';
import navtab from './src/navigationtab/navtab';
import Home from './src/screenss/home';
import Login from './src/screenss/login';
import Splash from './src/screens/SplashScreen';
import NavTab from './src/navigationtab/navtab';
import DownloadBelow from './src/screensbelow/Download';
import CustomerListNewBelow from './src/screensbelow/CustomerListNew';
import SearchTabBelow from './src/screensbelow/SearchTab';
import TokoTabBelow from './src/screensbelow/TokoTab';
import CallplanTabBelow from './src/screensbelow/CallplanTab';
import ListTokoScreen from './src/screensbelow/ListTokoScreen';
import DownloadNew from './src/screensbelow/DownloadNew';
import DetailCheckinBelow from './src/screensbelow/DetailCheckin';
import TambahLocationBelow from './src/screensbelow/TambahLocation';
import SplashScreenPage from './src/screenpage/SplashScreenPage';
import LoginScreenPage from './src/screenpage/LoginScreenPage';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* <Stack.Screen name="SplashScreenPage" component={SplashScreenPage} />
      <Stack.Screen name="LoginScreenPage" component={LoginScreenPage} /> */}

        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Login" component={Login} />

        <Stack.Screen name="Home" component={AppTabs} options={{ headerShown: false }}/>

        <Stack.Screen name="Display" component={Display} />
        <Stack.Screen name="DownloadData" component={DownloadData} />
        <Stack.Screen name="Lembur" component={Lembur} />
        <Stack.Screen name="OrderSellOut" component={OrderSellOut} />
        <Stack.Screen name="StockSellin" component={StockSellin} />
        <Stack.Screen name="IzinAtauOffDay" component={IzinAtauOffDay} />
        <Stack.Screen name="Checkin" component={Checkin} />
        <Stack.Screen name="LoginScreenAlt" component={LoginScreenALt} />
        <Stack.Screen name="TambahLokasi" component={TambahLokasi} />
        <Stack.Screen name="TambahLokasiAlt" component={TambahLokasiAlt} />
        <Stack.Screen name="LoginTest" component={LoginTest} />
        <Stack.Screen name="VisitScreen" component={VisitScreen} />
        <Stack.Screen name="RiwayatAbsen" component={RiwayatAbsen} />
        {/* <Stack.Screen name="test" component={test} /> */}
        <Stack.Screen name="SubmitCheckin" component={SubmitCheckin} />
        <Stack.Screen name="SubmitCheckout" component={SubmitCheckout} />
        <Stack.Screen name="Testtt" component={Testtt} />
        <Stack.Screen name="LocalApi" component={LocalApi} />
        <Stack.Screen name="HomeScreenAlt" component={HomeScreenAlt} />

        {/* screens-below */}
        <Stack.Screen  name="ListTokoBelow" component={ListTokoBelow} />
        <Stack.Screen name="TambahLokasiBelow" component={TambahLokasiBelow} />
        <Stack.Screen name="DashboardTokoBelow" component={DashboardTokoBelow} />
        <Stack.Screen name="LoginScreenBelow" component={LoginScreenBelow} />
        <Stack.Screen name="CustomerListBelow" component={CustomerListBelow} />
        <Stack.Screen name="CustomerListNewBelow" component={CustomerListNewBelow} />
        <Stack.Screen name="CheckinBelow" component={CheckinBelow}/>
        <Stack.Screen name="DownloadBelow" component={DownloadBelow}/>
        <Stack.Screen name="DownloadNew" component={DownloadNew} />

        <Stack.Screen name="SearchTabBelow" component={SearchTabBelow} options={{ title: 'Search' }}/>
        <Stack.Screen name="TokoTabBelow" component={TokoTabBelow}/>
        <Stack.Screen name="CallplanTabBelow" component={CallplanTabBelow}/>
        {/* MMKV */}
        {/* <Stack.Screen name="LoginEmployee" component={LoginEmployee} /> */}


        {/* testtt */}
        <Stack.Screen name="TestListToko" component={TestListToko} />
        <Stack.Screen name="TambahLokasiTestBelow" component={TambahLokasiTestBelow} />
        <Stack.Screen name="ListTokoScreen" component={ListTokoScreen} />
        <Stack.Screen name="DetailCheckinBelow" component={DetailCheckinBelow} options={{ title: 'Detail Check-in' }}/>

{/* API */}
        {/* <SafeAreaView>
            <CreateData />
        </SafeAreaView> */}

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

