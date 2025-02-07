/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, ActivityIndicator, FlatList, Alert } from 'react-native';

const test = () => {
  const [empid, setEmpid] = useState(''); // Input user
  const [data, setData] = useState([]); // Data dari API
  const [loading, setLoading] = useState(false); // Status loading

  const fetchData = async () => {
    if (!empid.trim()) {
      Alert.alert('Error', 'Employee ID is required!');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('https://api.traxes.id/index.php/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          empid: empid, // Kirim empid sebagai parameter JSON
        }),
      });

      const json = await response.json(); // Respons JSON
      console.log('Response JSON:', json);

      if (json.status === 1) {
        setData(json.data); // Simpan data di state
      } else {
        Alert.alert('Error', json.message || 'Failed to fetch data');
        setData([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Something went wrong!');
    } finally {
      setLoading(false); // Hentikan indikator loading
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter Employee ID:</Text>
      <TextInput
        style={styles.input}
        value={empid}
        onChangeText={setEmpid}
        placeholder="Enter Employee ID"
        keyboardType="numeric"
      />
      <Button title="Fetch Data" onPress={fetchData} />

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      {data && data.fullname ? (
        <View style={styles.resultContainer}>
          <Text style={styles.resultLabel}>Fullname:</Text>
          <Text style={styles.resultValue}>{data.fullname}</Text>
          <Text style={styles.resultLabel}>Type ID:</Text>
          <Text style={styles.resultValue}>{data.type_id}</Text>
        </View>
      ) : !loading && (
        <Text style={styles.noDataText}>No data available. Please fetch the data.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  resultContainer: {
    marginTop: 20,
  },
  resultLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultValue: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  noDataText: {
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
});

export default test;
