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
// import Checkin from './src/screens/Checkin';
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
import DetailCheckOutBelow from './src/screensbelow/DetailCheckout';
import TambahLocationBelow from './src/screensbelow/TambahLocation';
import SplashScreenPage from './src/screenpage/SplashScreenPage';
import DashboardToko from './src/navtabscreens/DashboardToko';
import DashboardToko2 from './src/navtabscreens/DashboardToko2';
import DetailCheckinCardBelow from './src/screensbelow/DetailCheckinCard';
import DetailToko from './src/navtabscreens/DetailToko';
import dashboardutama from './src/screenfix/dashboardutama';
import tambahlokasitoko from './src/screenfix/tambahlokasitoko';
import downloaddataoffline from './src/screenfix/downloaddataoffline';
import downloaddataoffline2 from './src/screenfix/downloaddataoffline2';
import tambahlokasitoko2 from './src/screenfix/tambahlokasitoko2';
import CheckinFix from './src/screenfix/checkinfix';
import DashboardCheckin from './src/screenfix/dashboardcheckin';
import DetailCheckin from './src/screenfix/detailcheckin';
import RiwayatCio from './src/screenfix/riwayatcio';
import DetailCio from './src/screenfix/detailcio';
import DetailCo from './src/screenfix/detailcheckout';
import RiwayatCio_DetailCi from './src/screenfix/riwayatcio_detailci';

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
        {/* <Stack.Screen name="Checkin" component={Checkin} /> */}
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
        <Stack.Screen name="DetailCheckinCardBelow" component={DetailCheckinCardBelow} options={{ title: 'Check-in' }}/>

        <Stack.Screen name="DashboardToko" component={DashboardToko} />
        <Stack.Screen name="DashboardToko2" component={DashboardToko2} />
        <Stack.Screen name="DetailToko" component={DetailToko} />
        <Stack.Screen name="DetailCheckOutBelow" component={DetailCheckOutBelow} />


        {/* screen fix */}
        <Stack.Screen name="dashboardutama" component={dashboardutama} />
        <Stack.Screen name="tambahlokasitoko" component={tambahlokasitoko} />
        <Stack.Screen name="downloaddataoffline" component={downloaddataoffline} />
        <Stack.Screen name="downloaddataoffline2" component={downloaddataoffline2} />
        <Stack.Screen name="tambahlokasitoko2" component={tambahlokasitoko2} />
        <Stack.Screen name="checkinfix" component={CheckinFix} />
        <Stack.Screen name="DashboardCheckin" component={DashboardCheckin} />
        <Stack.Screen name="DetailCheckin" component={DetailCheckin} />
        <Stack.Screen name="RiwayatCio" component={RiwayatCio} />
        <Stack.Screen name="DetailCio" component={DetailCio} />
        <Stack.Screen name="DetailCo" component={DetailCo} />
        <Stack.Screen name="RiwayatCio_DetailCi" component={RiwayatCio_DetailCi} />

{/* API */}
        {/* <SafeAreaView>
            <CreateData />
        </SafeAreaView> */}

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

