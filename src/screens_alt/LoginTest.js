import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import DeviceInfo from 'react-native-device-info'; // Import react-native-device-info
import { createTable, saveUserData, getUserData } from '../../helper/SQLite'; // Import SQLite Helper

const LoginForm = () => {
  const [nik, setNik] = useState(""); // NIK input dari pengguna
  const [deviceID, setDeviceID] = useState(""); // Device ID 7e549ec976cc3728
  const [apkVersion] = useState("1.0.0"); // APK Version (set manually)
  const [logindt, setLoginDt] = useState(""); // Login datex
  const [localData, setLocalData] = useState([]); // Data lokal dari SQLite

  useEffect(() => {
    // Buat tabel SQLite saat pertama kali aplikasi dibuka
    createTable();

    // Ambil Device ID dan tanggal login
    const fetchInitialData = async () => {
      const id = await DeviceInfo.getUniqueId();
      setDeviceID(id);

      // Set tanggal login
      const currentDate = new Date();
      const formattedDate = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;
      setLoginDt(formattedDate);
    };

    fetchInitialData();
  }, []);

  const handleLogin = async () => {
    if (!nik) {
      Alert.alert("Error", "Please enter your NIK");
      return;
    }

    try {
      const requestData = {
        nik,
        deviceID,
        apk_version: apkVersion,
        logindt,
      };

      const response = await fetch("https://api.traxes.id/index.php/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const responseData = await response.json();

      if (responseData.status === 1) {
        saveUserData(responseData.data); // Simpan data ke SQLite
        Alert.alert("Login Successful", `Welcome ${responseData.data.fullname}`);
      } else {
        Alert.alert("Login Failed", responseData.message || "An error occurred");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Unable to process login");
    }
  };

  const handleFetchLocalData = () => {
    getUserData((data) => {
      setLocalData(data); // Update state dengan data lokal dari SQLite
    });
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Login Form</Text>

      <TextInput
        placeholder="Enter NIK"
        value={nik}
        onChangeText={setNik}
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 10,
          paddingHorizontal: 8,
        }}
      />

      <Button title="Login" onPress={handleLogin} />

      <Button title="Fetch Local Data" onPress={handleFetchLocalData} style={{ marginTop: 10 }} />

      {localData.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontWeight: "bold" }}>Stored Users:</Text>
          {localData.map((user, index) => (
            <Text key={index}>
              {user.fullname} (ID: {user.employee_id})
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

export default LoginForm;
