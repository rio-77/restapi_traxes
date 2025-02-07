import React, { useState } from 'react';
import {View,Text,TextInput,TouchableOpacity,StyleSheet,Alert,StatusBar} from 'react-native';
import axios from 'axios';
import MMKVStorage from 'react-native-mmkv-storage';
import DeviceInfo from 'react-native-device-info';
import { format } from 'date-fns';
import { useNavigation } from '@react-navigation/native';

const storage = new MMKVStorage.Loader().initialize();

const LoginScreenAlt = () => {
  const [nik, setNik] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const handleLogin = async () => {
    if (!nik) {
      Alert.alert('Validation Error', 'Please enter your NIP.');
      return;
    }

    setLoading(true);

    const deviceID = await DeviceInfo.getUniqueId();
    const logindt = format(new Date(), 'dd-MM-yyyy');
    const apkVersion = await DeviceInfo.getVersion();

    const data = {
      nik,
      deviceID,
      logindt,
      apk_version: apkVersion,
    };

    try {
      const response = await axios.post('https://api.traxes.id/index.php/user/login', data, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 200 || response.status === 201) {
        const { status, message, data: responseData } = response.data;

        if (status === 1) {
          // Save data in MMKV
          storage.setString('employee_id', responseData.employee_id);
          storage.setString('fullname', responseData.fullname);
          storage.setString('server_env', responseData.server_env);
          storage.setString('type_id', responseData.type_id);
          storage.setString('project_id', responseData.project_id);
          storage.setString('company_id', responseData.company_id);
          storage.setString('area_id', responseData.area_id);

          // Navigate to Dashboard
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
        } else {
          Alert.alert('Login Failed', message);
        }
      } else {
        Alert.alert('Error', `Failed with status code: ${response.status}`);
      }
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'An error occurred. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter NIP"
        placeholderTextColor="#aaa"
        keyboardType="number-pad"
        maxLength={8}
        value={nik}
        onChangeText={setNik}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Log in'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreenAlt;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#1C4966',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 20,
    color: '#1C4966',
  },
  button: {
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C4966',
  },
});
